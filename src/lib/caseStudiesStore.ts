// Case-studies data store.
//
// For now this is backed by localStorage so the role-based content workflow
// works end-to-end with zero infrastructure. The public surface is a small,
// async-friendly service interface — to move to a real backend later, swap the
// bodies of the CRUD functions for fetch() calls and keep the signatures.

import { useSyncExternalStore } from "react";
import type { CaseStudy } from "./types";

const STORAGE_KEY = "encytics.caseStudies.v1";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export function makeId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// Seed data — the original placeholder case studies, already "published" so the
// site looks identical until a team member adds real ones.
const seed: CaseStudy[] = [
  {
    id: "seed-ecommerce",
    slug: "real-time-recommendation-engine",
    client: "Global E-Commerce Platform",
    industry: "Retail",
    title: "Real-time recommendation engine reducing churn by 34%",
    summary:
      "A streaming recommendation system serving sub-30ms personalized results at scale.",
    body: "We rebuilt the recommendation pipeline on Spark Structured Streaming with a Redis feature store, cutting churn by 34% and adding $12M in incremental revenue.",
    metrics: [
      { label: "Revenue lift", value: "+$12M" },
      { label: "Churn reduction", value: "-34%" },
      { label: "Latency", value: "<30ms" },
    ],
    tags: ["ML", "Spark", "Redis", "Kafka"],
    status: "published",
    featured: true,
    createdBy: "seed",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "seed-fintech",
    slug: "fraud-detection-model",
    client: "FinTech Unicorn",
    industry: "Finance",
    title: "Fraud detection model achieving 99.7% precision",
    summary: "A gradient-boosted fraud model with a real-time feature platform.",
    body: "An XGBoost model fronted by a Feast feature store and Airflow retraining loop, preventing $8.2M in fraud while cutting false positives by 91%.",
    metrics: [
      { label: "Fraud prevented", value: "$8.2M" },
      { label: "False positives", value: "-91%" },
    ],
    tags: ["XGBoost", "Feast", "Airflow"],
    status: "published",
    featured: false,
    createdBy: "seed",
    createdAt: "2024-01-02T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z",
  },
  {
    id: "seed-healthcare",
    slug: "patient-readmission-prediction",
    client: "Healthcare Provider Network",
    industry: "Healthcare",
    title: "Patient readmission prediction and population analytics",
    summary: "HIPAA-compliant analytics reducing readmissions and cost.",
    body: "A Snowflake-based population analytics layer with a readmission risk model, lowering readmissions by 28% and saving $3.4M annually.",
    metrics: [
      { label: "Readmissions", value: "-28%" },
      { label: "Cost savings", value: "$3.4M" },
    ],
    tags: ["Python", "Snowflake", "HIPAA"],
    status: "published",
    featured: false,
    createdBy: "seed",
    createdAt: "2024-01-03T00:00:00.000Z",
    updatedAt: "2024-01-03T00:00:00.000Z",
  },
  {
    id: "seed-supplychain",
    slug: "data-lakehouse-migration",
    client: "Supply Chain Enterprise",
    industry: "Logistics",
    title: "End-to-end data lakehouse migration and demand forecasting",
    summary: "A Databricks lakehouse migration with Prophet-based forecasting.",
    body: "We migrated a legacy warehouse to a Databricks Delta Lake lakehouse and shipped demand forecasting at 94% accuracy, cutting data cost by 60% and speeding queries 8×.",
    metrics: [
      { label: "Forecast accuracy", value: "94%" },
      { label: "Data cost", value: "-60%" },
      { label: "Query speed", value: "8× faster" },
    ],
    tags: ["Databricks", "dbt", "Delta Lake", "Prophet"],
    status: "published",
    featured: true,
    createdBy: "seed",
    createdAt: "2024-01-04T00:00:00.000Z",
    updatedAt: "2024-01-04T00:00:00.000Z",
  },
];

let cache: CaseStudy[] | null = null;
const listeners = new Set<() => void>();

// Memoized snapshots so useSyncExternalStore sees stable references between
// writes (returning a fresh array each render would loop forever).
let allSnapshot: CaseStudy[] | null = null;
let publishedSnapshot: CaseStudy[] | null = null;

function read(): CaseStudy[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      cache = JSON.parse(raw) as CaseStudy[];
      return cache;
    }
  } catch {
    /* corrupted or unavailable storage — fall through to seed */
  }
  cache = seed;
  persist();
  return cache;
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache ?? []));
  } catch {
    /* storage unavailable (private mode); keep in-memory cache */
  }
  allSnapshot = null;
  publishedSnapshot = null;
  listeners.forEach((l) => l());
}

function commit(next: CaseStudy[]) {
  cache = next;
  persist();
}

// ---- Public service API ----------------------------------------------------

export function getAll(): CaseStudy[] {
  if (!allSnapshot) {
    allSnapshot = [...read()].sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt)
    );
  }
  return allSnapshot;
}

export function getPublished(): CaseStudy[] {
  if (!publishedSnapshot) {
    publishedSnapshot = getAll().filter((c) => c.status === "published");
  }
  return publishedSnapshot;
}

export function getBySlug(slug: string): CaseStudy | undefined {
  return read().find((c) => c.slug === slug);
}

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

// Editors create content as "pending" — it does not appear publicly until an
// admin publishes it.
export function create(input: CaseStudyInput, authorEmail: string): CaseStudy {
  const now = new Date().toISOString();
  const item: CaseStudy = {
    id: makeId(),
    slug: slugify(input.title) || makeId(),
    client: input.client,
    industry: input.industry,
    title: input.title,
    summary: input.summary,
    body: input.body,
    metrics: input.metrics.filter((m) => m.label && m.value),
    tags: input.tags.filter(Boolean),
    status: "pending",
    featured: input.featured ?? false,
    createdBy: authorEmail,
    createdAt: now,
    updatedAt: now,
  };
  commit([item, ...read()]);
  return item;
}

export function update(id: string, patch: Partial<CaseStudy>): void {
  commit(
    read().map((c) =>
      c.id === id ? { ...c, ...patch, updatedAt: new Date().toISOString() } : c
    )
  );
}

export function remove(id: string): void {
  commit(read().filter((c) => c.id !== id));
}

export function setStatus(id: string, status: CaseStudy["status"]): void {
  update(id, { status });
}

// ---- React binding ----------------------------------------------------------

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Reactive snapshot of all case studies (admin views). */
export function useCaseStudies(): CaseStudy[] {
  return useSyncExternalStore(subscribe, getAll, getAll);
}

/** Reactive snapshot of only published case studies (public site). */
export function usePublishedCaseStudies(): CaseStudy[] {
  return useSyncExternalStore(subscribe, getPublished, getPublished);
}
