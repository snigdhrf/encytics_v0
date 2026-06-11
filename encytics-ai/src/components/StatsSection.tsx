import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 150, suffix: "+", label: "Projects Delivered", sub: "Across 20+ industries" },
  { value: 40, suffix: "TB+", label: "Data Processed Monthly", sub: "Petabyte-scale experience" },
  { value: 96, suffix: "%", label: "Client Retention Rate", sub: "Long-term partnerships" },
  { value: 99, suffix: ".2%", label: "Model Accuracy (avg)", sub: "Production deployments" },
  { value: 8, suffix: "×", label: "Avg Query Speedup", sub: "After optimization" },
  { value: 60, suffix: "%", label: "Cost Reduction", sub: "Cloud infrastructure" },
];

function Counter({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = Date.now();

    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span className="font-display font-bold text-4xl md:text-5xl accent-gradient-text tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

// Insight quote cards
const insights = [
  {
    quote: "Companies that adopt data-driven strategies are 23× more likely to acquire customers and 19× more likely to be profitable.",
    source: "McKinsey Global Institute",
  },
  {
    quote: "The global AI market is projected to reach $1.85 trillion by 2030, with data infrastructure as the key enabler.",
    source: "Grand View Research",
  },
  {
    quote: "Organizations with mature data governance frameworks experience 3× faster decision-making cycles.",
    source: "Gartner Data & Analytics Summit",
  },
];

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [insightIdx, setInsightIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setInsightIdx((i) => (i + 1) % insights.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="bg-bg py-24 md:py-32 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-stroke to-transparent" />

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/3 blur-[150px] pointer-events-none" />

      <div className="max-w-[1200px] xl:max-w-[1440px] 2xl:max-w-[1760px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-accent/50" />
            <span className="font-mono text-xs text-muted tracking-[0.3em] uppercase">By the Numbers</span>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-text-primary">
            Results that <span className="accent-gradient-text">compound</span>
          </h2>
        </motion.div>

        <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-20">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="group relative bg-surface border border-stroke rounded-2xl p-6 cursor-default overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              whileHover={{ y: -4 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10">
                <Counter value={s.value} suffix={s.suffix} inView={inView} />
                <div className="font-display font-semibold text-sm text-text-primary mt-2 mb-1">{s.label}</div>
                <div className="font-mono text-xs text-muted/60">{s.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Insight rotator */}
        <motion.div
          className="relative bg-surface border border-stroke rounded-2xl p-8 md:p-10 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <div className="absolute inset-x-0 top-0 h-px accent-gradient" />
          <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />

          <div className="flex items-start gap-6 relative z-10">
            <div className="shrink-0 w-10 h-10 rounded-xl accent-gradient flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 6C3 4.343 4.343 3 6 3H7V6H5V10H7C7 11.657 5.657 13 4 13H3V6Z" fill="black"/>
                <path d="M9 6C9 4.343 10.343 3 12 3H13V6H11V10H13C13 11.657 11.657 13 10 13H9V6Z" fill="black"/>
              </svg>
            </div>

            <div className="flex-1 min-h-[80px]">
              <motion.div
                key={insightIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
              >
                <p className="font-body text-lg text-text-primary leading-relaxed mb-3">
                  "{insights[insightIdx].quote}"
                </p>
                <span className="font-mono text-xs text-muted/60 tracking-wider">
                  — {insights[insightIdx].source}
                </span>
              </motion.div>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2 mt-6 ml-16">
            {insights.map((_, i) => (
              <button
                key={i}
                onClick={() => setInsightIdx(i)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === insightIdx ? "w-6 accent-gradient" : "w-2 bg-stroke"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
