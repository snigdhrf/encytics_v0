import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import SubPageLayout from "../components/SubPageLayout";
import Seo from "../components/Seo";
import { getBySlug } from "../lib/caseStudiesStore";
import type { CaseStudy } from "../lib/types";

export default function CaseStudyDetail() {
  const { slug } = useParams();
  const [study, setStudy] = useState<CaseStudy | null>(null);
  const [loadedSlug, setLoadedSlug] = useState<string>();
  // Loading is derived (slug fetched yet?) rather than set inside the effect.
  const loading = Boolean(slug) && loadedSlug !== slug;

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    getBySlug(slug).then((s) => {
      if (!cancelled) {
        setStudy(s);
        setLoadedSlug(slug);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <SubPageLayout>
        <Seo title="Case study" path="/case-studies" />
        <div className="max-w-3xl mx-auto px-6 md:px-10 py-32 text-center">
          <p className="font-body text-muted">Loading case study…</p>
        </div>
      </SubPageLayout>
    );
  }

  // Only published studies are viewable publicly.
  if (!study || study.status !== "published") {
    return (
      <SubPageLayout>
        <Seo title="Case study not found" path="/case-studies" />
        <div className="max-w-3xl mx-auto px-6 md:px-10 py-32 text-center">
          <h1 className="font-display font-bold text-3xl text-text-primary mb-4">
            Case study not found
          </h1>
          <p className="font-body text-muted mb-8">
            This case study may have been moved or is not yet published.
          </p>
          <Link to="/case-studies" className="accent-gradient-text font-body font-semibold">
            ← All case studies
          </Link>
        </div>
      </SubPageLayout>
    );
  }

  return (
    <SubPageLayout>
      <Seo title={study.title} description={study.summary} path={`/case-studies/${study.slug}`} type="article" />
      <article className="max-w-3xl mx-auto px-6 md:px-10 py-20">
        <Link to="/case-studies" className="font-mono text-xs text-muted hover:text-text-primary transition-colors">
          ← All case studies
        </Link>

        <div className="flex items-center gap-3 mt-8 mb-4">
          <div className="w-2 h-2 rounded-full accent-gradient" />
          <span className="font-mono text-xs text-muted tracking-wider uppercase">{study.industry}</span>
          <span className="font-mono text-xs text-muted/50">·</span>
          <span className="font-mono text-xs text-muted/60">{study.client}</span>
        </div>

        <h1 className="font-display font-bold text-3xl md:text-4xl text-text-primary leading-tight mb-6">
          {study.title}
        </h1>
        <p className="font-body text-lg text-muted leading-relaxed mb-10">{study.summary}</p>

        {/* Metrics band */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 p-7 bg-surface border border-stroke rounded-2xl mb-10">
          {study.metrics.map((m) => (
            <div key={m.label}>
              <div className="font-display font-bold text-2xl accent-gradient-text">{m.value}</div>
              <div className="font-mono text-xs text-muted/60 tracking-wider mt-1">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="font-body text-muted leading-relaxed whitespace-pre-line mb-10">
          {study.body}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-12">
          {study.tags.map((t) => (
            <span key={t} className="font-mono text-[10px] text-muted/70 bg-surface-2 border border-stroke px-2.5 py-1 rounded-full">
              {t}
            </span>
          ))}
        </div>

        <div className="border-t border-stroke pt-8">
          <Link
            to="/#contact"
            className="relative inline-flex rounded-full text-base font-body font-semibold px-8 py-3.5 overflow-hidden"
          >
            <span className="absolute inset-0 accent-gradient" />
            <span className="relative z-10 text-bg">Start a project like this →</span>
          </Link>
        </div>
      </article>
    </SubPageLayout>
  );
}
