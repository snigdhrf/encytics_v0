import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { usePublishedCaseStudies } from "../lib/caseStudiesStore";
import type { CaseStudy } from "../lib/types";

// Bento layout pattern — cycles wide/narrow so any number of cards looks right.
const colPattern = ["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7"];

function MiniChart({ values }: { values: number[] }) {
  const max = Math.max(...values);
  return (
    <svg width="80" height="32" viewBox="0 0 80 32" fill="none" className="opacity-40">
      <polyline
        points={values.map((v, i) => `${(i / (values.length - 1)) * 80},${32 - (v / max) * 28}`).join(" ")}
        stroke="url(#cg)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="80" y2="0">
          <stop offset="0%" stopColor="hsl(195 100% 55%)" />
          <stop offset="100%" stopColor="hsl(260 80% 65%)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function CaseCard({ c, index }: { c: CaseStudy; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const col = colPattern[index % colPattern.length];
  const dark = col.includes("7");

  return (
    <motion.div
      ref={ref}
      className={`${col} group relative rounded-2xl border border-stroke overflow-hidden ${
        dark ? "bg-surface" : "bg-surface/50"
      }`}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -3 }}
    >
      {/* Gradient top border on hover */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="p-7">
        {/* Top row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full accent-gradient" />
            <span className="font-mono text-xs text-muted tracking-wider uppercase">{c.industry}</span>
          </div>
          <MiniChart values={[30, 45, 38, 60, 52, 78, 65, 90, 85, 95]} />
        </div>

        {/* Client */}
        <div className="font-mono text-xs text-muted/60 tracking-wider mb-2">{c.client}</div>

        {/* Title */}
        <h3 className="font-display font-bold text-xl md:text-2xl text-text-primary leading-tight mb-6 group-hover:accent-gradient-text transition-all duration-300">
          {c.title}
        </h3>

        {/* Metrics */}
        <div className="flex gap-6 mb-6">
          {c.metrics.map((m) => (
            <div key={m.label}>
              <div className="font-display font-bold text-xl accent-gradient-text">{m.value}</div>
              <div className="font-mono text-xs text-muted/60 tracking-wider mt-0.5">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Tags + CTA */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {c.tags.map((t) => (
              <span key={t} className="font-mono text-[10px] text-muted/70 bg-surface-2 border border-stroke px-2.5 py-1 rounded-full">
                {t}
              </span>
            ))}
          </div>
          <Link
            to={`/case-studies/${c.slug}`}
            className="font-mono text-xs text-muted group-hover:accent-gradient-text transition-all flex items-center gap-1.5 shrink-0"
          >
            Read more <span className="text-lg leading-none">↗</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function CaseStudies() {
  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headerRef, { once: true, margin: "-60px" });
  const published = usePublishedCaseStudies();
  // Featured first, then most recent; show up to 4 on the homepage.
  const cases = [...published]
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, 4);

  return (
    <section id="case-studies" className="bg-bg py-24 md:py-32 relative">
      {/* Subtle horizontal line divider */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-stroke to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-accent/50" />
              <span className="font-mono text-xs text-muted tracking-[0.3em] uppercase">Our Work</span>
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-text-primary leading-tight">
              Outcomes that{" "}
              <span className="accent-gradient-text">speak in numbers</span>
            </h2>
          </div>
          <motion.div whileHover={{ scale: 1.03 }} className="hidden md:block">
            <Link
              to="/case-studies"
              className="flex items-center gap-2 font-body text-sm text-muted hover:text-text-primary border border-stroke hover:border-accent/30 rounded-full px-5 py-2.5 transition-all"
            >
              View all case studies ↗
            </Link>
          </motion.div>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {cases.map((c, i) => (
            <CaseCard key={c.id} c={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
