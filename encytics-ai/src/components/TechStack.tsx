import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const techRows = [
  {
    label: "Data Platforms",
    techs: ["Snowflake", "Databricks", "BigQuery", "Redshift", "Synapse", "Clickhouse"],
  },
  {
    label: "Orchestration",
    techs: ["Apache Airflow", "Prefect", "dbt", "Apache Spark", "Kafka", "Flink"],
  },
  {
    label: "AI / ML",
    techs: ["PyTorch", "TensorFlow", "HuggingFace", "LangChain", "MLflow", "Vertex AI"],
  },
  {
    label: "Cloud & Infra",
    techs: ["AWS", "Google Cloud", "Azure", "Kubernetes", "Terraform", "Docker"],
  },
];

// Simple process flow
const steps = [
  {
    num: "01",
    title: "Data Audit",
    desc: "Assess existing data assets, infrastructure, quality, and organizational maturity.",
  },
  {
    num: "02",
    title: "Architecture Design",
    desc: "Design target-state data architecture aligned with your business objectives.",
  },
  {
    num: "03",
    title: "Build & Deploy",
    desc: "Iterative delivery with embedded best practices, testing, and documentation.",
  },
  {
    num: "04",
    title: "Optimize & Scale",
    desc: "Performance tuning, cost optimization, and team enablement for long-term success.",
  },
];

export default function TechStack() {
  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section className="bg-bg py-24 md:py-32 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-stroke to-transparent" />

      {/* Background hex pattern */}
      <div className="absolute inset-0 hex-bg opacity-15" />

      <div className="max-w-[1200px] xl:max-w-[1440px] 2xl:max-w-[1760px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        {/* Tech stack */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-accent/50" />
            <span className="font-mono text-xs text-muted tracking-[0.3em] uppercase">Technology</span>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-text-primary mb-12">
            Built on the <span className="accent-gradient-text">modern data stack</span>
          </h2>

          <div className="space-y-5">
            {techRows.map((row, ri) => (
              <motion.div
                key={row.label}
                className="flex flex-col sm:flex-row sm:items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: ri * 0.1 + 0.2, duration: 0.6 }}
              >
                <div className="w-32 shrink-0">
                  <span className="font-mono text-[10px] text-muted/50 tracking-wider uppercase">{row.label}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {row.techs.map((tech, ti) => (
                    <motion.span
                      key={tech}
                      className="font-mono text-xs text-text-primary/80 bg-surface border border-stroke hover:border-accent/40 hover:text-text-primary px-3 py-1.5 rounded-full cursor-default transition-all duration-200"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: ri * 0.1 + ti * 0.04 + 0.3, duration: 0.3 }}
                      whileHover={{ y: -2 }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Process */}
        <div className="mt-24 pt-16 border-t border-stroke/40">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-accent/50" />
            <span className="font-mono text-xs text-muted tracking-[0.3em] uppercase">How We Work</span>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-text-primary mb-12">
            A process built for <span className="accent-gradient-text">real outcomes</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.12 + 0.3, duration: 0.6 }}
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px z-0">
                    <div className="w-full h-full bg-gradient-to-r from-stroke to-transparent" />
                  </div>
                )}

                <div className="relative z-10 group cursor-default">
                  <div className="font-mono text-xs accent-gradient-text mb-3 tracking-wider">{step.num}</div>
                  <div className="w-10 h-10 rounded-xl border border-stroke bg-surface flex items-center justify-center mb-4 group-hover:border-accent/40 transition-all">
                    <div className="w-2 h-2 rounded-sm accent-gradient" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-text-primary mb-2">{step.title}</h4>
                  <p className="font-body text-sm text-muted leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
