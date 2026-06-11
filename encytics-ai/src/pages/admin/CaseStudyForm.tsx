import { useState } from "react";
import type { CaseStudy } from "../../lib/types";
import * as store from "../../lib/caseStudiesStore";
import { useAuth } from "../../lib/authContext";

interface Props {
  existing?: CaseStudy;
  onDone: () => void;
}

const inputCls =
  "w-full bg-surface-2 border border-stroke rounded-xl px-4 py-2.5 font-body text-sm text-text-primary placeholder:text-muted/40 focus:outline-none focus:border-accent/40 transition-colors";
const labelCls = "font-mono text-xs text-muted tracking-wider block mb-2";

export default function CaseStudyForm({ existing, onDone }: Props) {
  const { user, isAdmin } = useAuth();
  const [client, setClient] = useState(existing?.client ?? "");
  const [industry, setIndustry] = useState(existing?.industry ?? "");
  const [title, setTitle] = useState(existing?.title ?? "");
  const [summary, setSummary] = useState(existing?.summary ?? "");
  const [body, setBody] = useState(existing?.body ?? "");
  const [tags, setTags] = useState(existing?.tags.join(", ") ?? "");
  const [featured, setFeatured] = useState(existing?.featured ?? false);
  const [metrics, setMetrics] = useState(
    existing?.metrics.length
      ? existing.metrics
      : [{ label: "", value: "" }]
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const setMetric = (i: number, key: "label" | "value", v: string) => {
    setMetrics((m) => m.map((row, idx) => (idx === i ? { ...row, [key]: v } : row)));
  };
  const addMetric = () => setMetrics((m) => [...m, { label: "", value: "" }]);
  const removeMetric = (i: number) => setMetrics((m) => m.filter((_, idx) => idx !== i));

  // New studies are saved as "draft" (private) or "pending" (in review) —
  // publishing is a separate admin action on the dashboard.
  const save = async (status: "draft" | "pending" = "pending") => {
    if (!title.trim() || !client.trim() || !industry.trim()) {
      setError("Client, industry, and title are required.");
      return;
    }
    const input = {
      client: client.trim(),
      industry: industry.trim(),
      title: title.trim(),
      summary: summary.trim(),
      body: body.trim(),
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      metrics: metrics.filter((m) => m.label && m.value),
      featured,
    };

    setSaving(true);
    setError("");
    try {
      if (existing) {
        await store.update(existing.id, input, { isAdmin });
      } else {
        await store.create(input, user?.email ?? "unknown", status);
      }
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    void save("pending");
  };

  return (
    <form onSubmit={submit} className="bg-surface border border-stroke rounded-2xl p-7 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-xl text-text-primary">
          {existing ? "Edit case study" : "New case study"}
        </h3>
        {!isAdmin && (
          <span className="font-mono text-[10px] text-amber-400/80 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-full">
            {existing?.status === "published"
              ? "Saving sends this live study back to review"
              : "Saved as pending — an admin must publish"}
          </span>
        )}
      </div>

      {error && (
        <div className="font-body text-sm text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-xl px-4 py-2.5">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Client *</label>
          <input className={inputCls} value={client} onChange={(e) => setClient(e.target.value)} placeholder="Acme Corp" />
        </div>
        <div>
          <label className={labelCls}>Industry *</label>
          <input className={inputCls} value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Retail" />
        </div>
      </div>

      <div>
        <label className={labelCls}>Title *</label>
        <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Real-time recommendation engine reducing churn by 34%" />
      </div>

      <div>
        <label className={labelCls}>Summary (one line)</label>
        <input className={inputCls} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Short teaser shown on the listing card" />
      </div>

      <div>
        <label className={labelCls}>Body</label>
        <textarea className={`${inputCls} min-h-28 resize-y`} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Full write-up of the engagement, approach, and results." />
      </div>

      {/* Metrics */}
      <div>
        <label className={labelCls}>Metrics</label>
        <div className="space-y-2">
          {metrics.map((m, i) => (
            <div key={i} className="flex gap-2">
              <input className={inputCls} value={m.label} onChange={(e) => setMetric(i, "label", e.target.value)} placeholder="Label (e.g. Revenue lift)" />
              <input className={inputCls} value={m.value} onChange={(e) => setMetric(i, "value", e.target.value)} placeholder="Value (e.g. +$12M)" />
              <button
                type="button"
                onClick={() => removeMetric(i)}
                className="shrink-0 w-10 rounded-xl border border-stroke text-muted hover:text-rose-400 hover:border-rose-400/30 transition-colors"
                aria-label="Remove metric"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addMetric} className="mt-2 font-mono text-xs accent-gradient-text hover:opacity-80">
          + Add metric
        </button>
      </div>

      <div>
        <label className={labelCls}>Tags (comma-separated)</label>
        <input className={inputCls} value={tags} onChange={(e) => setTags(e.target.value)} placeholder="ML, Spark, Redis, Kafka" />
      </div>

      {isAdmin && (
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="accent-accent w-4 h-4" />
          <span className="font-body text-sm text-muted">Feature on homepage</span>
        </label>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="relative rounded-xl py-2.5 px-6 font-body font-semibold text-bg overflow-hidden disabled:opacity-70"
        >
          <span className="absolute inset-0 accent-gradient" />
          <span className="relative z-10">
            {saving ? "Saving…" : existing ? "Save changes" : "Submit for review"}
          </span>
        </button>
        {!existing && (
          <button
            type="button"
            disabled={saving}
            onClick={() => void save("draft")}
            className="font-body text-sm font-semibold text-muted hover:text-text-primary border border-stroke hover:border-accent/30 rounded-xl py-2.5 px-5 transition-colors disabled:opacity-70"
          >
            Save as draft
          </button>
        )}
        <button type="button" onClick={onDone} className="font-body text-sm text-muted hover:text-text-primary transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
