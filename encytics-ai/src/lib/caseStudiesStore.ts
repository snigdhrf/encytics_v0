// Case-studies data store — backed by Supabase Postgres.
//
// Reads flow through a small reactive cache (useSyncExternalStore) so every
// view stays in sync after any mutation. Writes go straight to the
// `case_studies` table (see supabase/migrations/0001_case_studies.sql);
// each successful mutation refreshes the cache.
//
// Workflow rules enforced here (and partially by database triggers):
//   * new content is born "draft" or "pending" — never "published"
//   * only admins flip publication status or delete
//   * a non-admin edit of a published study demotes it back to "pending"
//   * delete is a soft delete (deleted_at) — rows stay recoverable
//
// Until Supabase Auth replaces the demo login (next milestone), these role
// rules live in the app layer; the RLS policies in the migration are interim.

import { useEffect, useSyncExternalStore } from "react";
import { isSupabaseConfigured, supabase } from "./supabase";
import type { CaseMetric, CaseStudy, CaseStudyStatus } from "./types";

const TABLE = "case_studies";

const NOT_CONFIGURED =
  "The database is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example), then rebuild.";

// ---- Row mapping (DB snake_case ↔ domain camelCase) -------------------------

interface CaseStudyRow {
  id: string;
  slug: string;
  client: string;
  industry: string;
  title: string;
  summary: string;
  body: string;
  metrics: CaseMetric[];
  tags: string[];
  status: CaseStudyStatus;
  featured: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  deleted_at: string | null;
}

function fromRow(r: CaseStudyRow): CaseStudy {
  return {
    id: r.id,
    slug: r.slug,
    client: r.client,
    industry: r.industry,
    title: r.title,
    summary: r.summary,
    body: r.body,
    metrics: r.metrics ?? [],
    tags: r.tags ?? [],
    status: r.status,
    featured: r.featured,
    createdBy: r.created_by,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    publishedAt: r.published_at,
  };
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

// ---- Reactive state ---------------------------------------------------------

export interface CaseStudiesState {
  /** All non-deleted studies, newest first (admin views). */
  cases: CaseStudy[];
  /** Published studies only (public site). */
  published: CaseStudy[];
  loading: boolean;
  error: string;
}

let state: CaseStudiesState = {
  cases: [],
  published: [],
  loading: false,
  error: "",
};
let loadStarted = false;
const listeners = new Set<() => void>();

function setState(patch: Partial<Omit<CaseStudiesState, "published">>) {
  state = { ...state, ...patch };
  state.published = state.cases.filter((c) => c.status === "published");
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Re-fetch everything from the database into the reactive cache. */
export async function refresh(): Promise<void> {
  if (!isSupabaseConfigured) {
    setState({ loading: false, error: NOT_CONFIGURED, cases: [] });
    return;
  }
  setState({ loading: true, error: "" });
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });
  if (error) {
    setState({ loading: false, error: `Could not load case studies: ${error.message}` });
    return;
  }
  setState({ loading: false, cases: (data as CaseStudyRow[]).map(fromRow) });
}

function ensureLoaded() {
  if (!loadStarted) {
    loadStarted = true;
    void refresh();
  }
}

function assertConfigured() {
  if (!isSupabaseConfigured) throw new Error(NOT_CONFIGURED);
}

// ---- Reads ------------------------------------------------------------------

/**
 * Fetch a single study by slug, straight from the database (works on a cold
 * deep link before the cache has loaded). Returns null if absent or deleted.
 * Callers must still check `status === "published"` before public display.
 */
export async function getBySlug(slug: string): Promise<CaseStudy | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("slug", slug)
    .is("deleted_at", null)
    .maybeSingle();
  if (error || !data) return null;
  return fromRow(data as CaseStudyRow);
}

// ---- Mutations ----------------------------------------------------------------

export interface CaseStudyInput {
  client: string;
  industry: string;
  title: string;
  summary: string;
  body: string;
  metrics: { label: string; value: string }[];
  tags: string[];
  featured?: boolean;
}

// Slugs are derived from the title once, at creation, and never change on
// edit — published URLs stay stable. The DB's partial unique index is the
// backstop; this loop just picks a free suffix up front.
async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title) || `case-${Date.now().toString(36)}`;
  const { data, error } = await supabase
    .from(TABLE)
    .select("slug")
    .like("slug", `${base}%`);
  if (error) throw new Error(`Could not check the URL slug: ${error.message}`);
  const taken = new Set((data as { slug: string }[]).map((r) => r.slug));
  if (!taken.has(base)) return base;
  for (let i = 2; ; i++) {
    if (!taken.has(`${base}-${i}`)) return `${base}-${i}`;
  }
}

/**
 * Create a study as "draft" or "pending" — never directly "published"
 * (a DB trigger enforces the same rule against crafted requests).
 */
export async function create(
  input: CaseStudyInput,
  authorEmail: string,
  status: Extract<CaseStudyStatus, "draft" | "pending"> = "pending"
): Promise<CaseStudy> {
  assertConfigured();
  const slug = await uniqueSlug(input.title);
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      slug,
      client: input.client,
      industry: input.industry,
      title: input.title,
      summary: input.summary,
      body: input.body,
      metrics: input.metrics.filter((m) => m.label && m.value),
      tags: input.tags.filter(Boolean),
      status,
      featured: input.featured ?? false,
      created_by: authorEmail,
    })
    .select()
    .single();
  if (error) throw new Error(`Could not create the case study: ${error.message}`);
  await refresh();
  return fromRow(data as CaseStudyRow);
}

/**
 * Update content fields. Workflow rules:
 *  - only admins may change `featured` (an editor's save never silently
 *    un-features a study)
 *  - a non-admin edit of a published study demotes it to "pending" so it
 *    goes back through admin review before reaching the public again
 */
export async function update(
  id: string,
  input: CaseStudyInput,
  opts: { isAdmin: boolean }
): Promise<CaseStudy> {
  assertConfigured();
  const current = state.cases.find((c) => c.id === id);
  const patch: Record<string, unknown> = {
    client: input.client,
    industry: input.industry,
    title: input.title,
    summary: input.summary,
    body: input.body,
    metrics: input.metrics.filter((m) => m.label && m.value),
    tags: input.tags.filter(Boolean),
  };
  if (opts.isAdmin && input.featured !== undefined) {
    patch.featured = input.featured;
  }
  if (!opts.isAdmin && current?.status === "published") {
    patch.status = "pending";
  }
  const { data, error } = await supabase
    .from(TABLE)
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(`Could not save changes: ${error.message}`);
  await refresh();
  return fromRow(data as CaseStudyRow);
}

/** Publish / unpublish — admin only. published_at is stamped by a DB trigger. */
export async function setStatus(
  id: string,
  status: CaseStudyStatus,
  opts: { isAdmin: boolean }
): Promise<void> {
  assertConfigured();
  if (!opts.isAdmin) {
    throw new Error("Only admins can change publication status.");
  }
  const { error } = await supabase.from(TABLE).update({ status }).eq("id", id);
  if (error) throw new Error(`Could not change status: ${error.message}`);
  await refresh();
}

/**
 * Soft delete — admin only. Sets deleted_at; the row disappears from every
 * query but stays recoverable in the database (no client can hard-delete:
 * the table has no DELETE policy at all).
 */
export async function remove(id: string, opts: { isAdmin: boolean }): Promise<void> {
  assertConfigured();
  if (!opts.isAdmin) {
    throw new Error("Only admins can delete case studies.");
  }
  const { error } = await supabase
    .from(TABLE)
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(`Could not delete: ${error.message}`);
  await refresh();
}

// ---- React binding ------------------------------------------------------------

/** Reactive store state — triggers the initial load on first mount. */
export function useCaseStudies(): CaseStudiesState {
  useEffect(ensureLoaded, []);
  return useSyncExternalStore(subscribe, () => state, () => state);
}

/** Published studies only, for the public site. */
export function usePublishedCaseStudies(): CaseStudy[] {
  return useCaseStudies().published;
}
