import { Link } from "react-router-dom";
import SubPageLayout from "../components/SubPageLayout";
import Seo from "../components/Seo";
import { useCaseStudies } from "../lib/caseStudiesStore";

export default function CaseStudiesPage() {
  const { published: cases, loading } = useCaseStudies();

  return (
    <SubPageLayout>
      <Seo
        title="Case Studies"
        description="Real outcomes from our data engineering, AI, and analytics engagements."
        path="/case-studies"
      />
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 py-20">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-accent/50" />
          <span className="font-mono text-xs text-muted tracking-[0.3em] uppercase">Our Work</span>
        </div>
        <h1 className="font-display font-bold text-4xl md:text-5xl text-text-primary leading-tight mb-12">
          Outcomes that <span className="accent-gradient-text">speak in numbers</span>
        </h1>

        {loading && cases.length === 0 ? (
          <p className="font-body text-muted">Loading case studies…</p>
        ) : cases.length === 0 ? (
          <p className="font-body text-muted">No case studies published yet — check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {cases.map((c) => (
              <Link
                key={c.id}
                to={`/case-studies/${c.slug}`}
                className="group relative bg-surface border border-stroke hover:border-accent/30 rounded-2xl p-7 transition-all duration-300"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-2 h-2 rounded-full accent-gradient" />
                  <span className="font-mono text-xs text-muted tracking-wider uppercase">{c.industry}</span>
                </div>
                <div className="font-mono text-xs text-muted/60 tracking-wider mb-2">{c.client}</div>
                <h2 className="font-display font-bold text-xl text-text-primary leading-tight mb-4 group-hover:accent-gradient-text transition-all">
                  {c.title}
                </h2>
                <div className="flex flex-wrap gap-6 mb-5">
                  {c.metrics.map((m) => (
                    <div key={m.label}>
                      <div className="font-display font-bold text-lg accent-gradient-text">{m.value}</div>
                      <div className="font-mono text-xs text-muted/60 tracking-wider mt-0.5">{m.label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {c.tags.map((t) => (
                    <span key={t} className="font-mono text-[10px] text-muted/70 bg-surface-2 border border-stroke px-2.5 py-1 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </SubPageLayout>
  );
}
