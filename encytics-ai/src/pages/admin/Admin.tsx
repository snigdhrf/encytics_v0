import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../lib/authContext";
import { useCaseStudies } from "../../lib/caseStudiesStore";
import * as store from "../../lib/caseStudiesStore";
import type { CaseStudy, CaseStudyStatus } from "../../lib/types";
import Seo from "../../components/Seo";
import CaseStudyForm from "./CaseStudyForm";

const statusStyle: Record<CaseStudyStatus, string> = {
  draft: "text-muted bg-surface-2 border-stroke",
  pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  published: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
};

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(email, password);
    if (!res.ok) setError(res.error ?? "Login failed.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-6">
      <Seo title="Admin" path="/admin" />
      <form onSubmit={submit} className="w-full max-w-sm bg-surface border border-stroke rounded-2xl p-8">
        <Link to="/" className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg accent-gradient flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L15 4.5V11.5L8 15L1 11.5V4.5L8 1Z" stroke="black" strokeWidth="1.5" fill="none" />
              <circle cx="8" cy="8" r="2.5" fill="black" />
            </svg>
          </div>
          <span className="font-display font-bold text-text-primary">
            encytics<span className="accent-gradient-text">.ai</span>
          </span>
        </Link>

        <h1 className="font-display font-bold text-2xl text-text-primary mb-1">Content Studio</h1>
        <p className="font-body text-sm text-muted mb-6">Sign in to manage case studies.</p>

        {error && (
          <div className="font-body text-sm text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-xl px-4 py-2.5 mb-4">
            {error}
          </div>
        )}

        <label className="font-mono text-xs text-muted tracking-wider block mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-surface-2 border border-stroke rounded-xl px-4 py-2.5 font-body text-sm text-text-primary mb-4 focus:outline-none focus:border-accent/40"
          placeholder="you@encytics.ai"
        />
        <label className="font-mono text-xs text-muted tracking-wider block mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-surface-2 border border-stroke rounded-xl px-4 py-2.5 font-body text-sm text-text-primary mb-6 focus:outline-none focus:border-accent/40"
          placeholder="••••••••"
        />
        <button type="submit" className="relative w-full rounded-xl py-3 font-body font-semibold text-bg overflow-hidden">
          <span className="absolute inset-0 accent-gradient" />
          <span className="relative z-10">Sign in</span>
        </button>

        <div className="mt-6 pt-6 border-t border-stroke text-center">
          <p className="font-mono text-[10px] text-muted/50 leading-relaxed">
            Demo accounts (replace before launch):<br />
            admin@encytics.ai / admin123<br />
            editor@encytics.ai / editor123
          </p>
        </div>
      </form>
    </div>
  );
}

function Dashboard() {
  const { user, isAdmin, logout } = useAuth();
  const { cases, loading, error } = useCaseStudies();
  const [editing, setEditing] = useState<CaseStudy | null>(null);
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  const showForm = creating || editing;

  // Wraps a store mutation with per-row busy state and surfaced errors.
  const run = async (id: string, fn: () => Promise<unknown>) => {
    setBusyId(id);
    setActionError("");
    try {
      await fn();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Action failed. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <Seo title="Admin" path="/admin" />

      {/* Top bar */}
      <header className="border-b border-stroke">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg accent-gradient flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" stroke="black" strokeWidth="1.5" fill="none" />
                <circle cx="7" cy="7" r="2" fill="black" />
              </svg>
            </div>
            <span className="font-display font-bold text-text-primary text-sm">Content Studio</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-muted">
              {user?.name} ·{" "}
              <span className={isAdmin ? "text-emerald-400" : "text-amber-400"}>{user?.role}</span>
            </span>
            <button onClick={logout} className="font-body text-sm text-muted hover:text-text-primary transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-10">
        {showForm ? (
          <CaseStudyForm
            existing={editing ?? undefined}
            onDone={() => {
              setEditing(null);
              setCreating(false);
            }}
          />
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-display font-bold text-2xl text-text-primary">Case studies</h1>
                <p className="font-body text-sm text-muted mt-1">
                  {isAdmin
                    ? "Review submissions and publish them to the live site."
                    : "Create case studies — an admin reviews and publishes them."}
                </p>
              </div>
              <button
                onClick={() => setCreating(true)}
                className="relative rounded-full py-2.5 px-5 font-body font-semibold text-bg overflow-hidden shrink-0"
              >
                <span className="absolute inset-0 accent-gradient" />
                <span className="relative z-10">+ New case study</span>
              </button>
            </div>

            {(error || actionError) && (
              <div className="font-body text-sm text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-xl px-4 py-2.5 mb-4">
                {error || actionError}
              </div>
            )}

            {loading && cases.length === 0 && (
              <p className="font-body text-sm text-muted">Loading case studies…</p>
            )}

            <div className="space-y-3">
              {cases.map((c) => (
                <div
                  key={c.id}
                  className="bg-surface border border-stroke rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className={`font-mono text-[10px] uppercase tracking-wider border px-2 py-0.5 rounded-full ${statusStyle[c.status]}`}>
                        {c.status}
                      </span>
                      <span className="font-mono text-xs text-muted/60">{c.industry} · {c.client}</span>
                      {c.featured && (
                        <span className="font-mono text-[10px] accent-gradient-text">★ featured</span>
                      )}
                    </div>
                    <div className="font-display font-semibold text-text-primary truncate">{c.title}</div>
                    <div className="font-mono text-[10px] text-muted/40 mt-1">
                      by {c.createdBy} · updated {new Date(c.updatedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setEditing(c)}
                      className="font-mono text-xs text-muted hover:text-text-primary border border-stroke hover:border-accent/30 rounded-full px-3 py-1.5 transition-colors"
                    >
                      Edit
                    </button>

                    {/* Publish workflow — admins only */}
                    {isAdmin && c.status !== "published" && (
                      <button
                        disabled={busyId === c.id}
                        onClick={() => void run(c.id, () => store.setStatus(c.id, "published", { isAdmin }))}
                        className="font-mono text-xs text-emerald-400 border border-emerald-400/30 hover:bg-emerald-400/10 rounded-full px-3 py-1.5 transition-colors disabled:opacity-50"
                      >
                        {busyId === c.id ? "…" : "Publish"}
                      </button>
                    )}
                    {isAdmin && c.status === "published" && (
                      <button
                        disabled={busyId === c.id}
                        onClick={() => void run(c.id, () => store.setStatus(c.id, "draft", { isAdmin }))}
                        className="font-mono text-xs text-muted hover:text-amber-400 border border-stroke hover:border-amber-400/30 rounded-full px-3 py-1.5 transition-colors disabled:opacity-50"
                      >
                        {busyId === c.id ? "…" : "Unpublish"}
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        disabled={busyId === c.id}
                        onClick={() => {
                          if (confirm(`Delete "${c.title}"? It will be removed from the site (the row stays recoverable in the database).`))
                            void run(c.id, () => store.remove(c.id, { isAdmin }));
                        }}
                        className="font-mono text-xs text-muted hover:text-rose-400 border border-stroke hover:border-rose-400/30 rounded-full px-3 py-1.5 transition-colors disabled:opacity-50"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Admin() {
  const { user } = useAuth();
  return user ? <Dashboard /> : <Login />;
}
