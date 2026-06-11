import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const services = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 5H19M3 11H13M3 17H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="17" cy="17" r="4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M17 15.5V17L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Data Engineering",
    tag: "01",
    desc: "Build resilient, scalable data pipelines. From ETL/ELT orchestration with Airflow & dbt, to cloud-native lakehouse architectures on Snowflake, BigQuery, and Databricks.",
    highlights: ["Apache Spark", "dbt", "Airflow", "Kafka", "Delta Lake"],
    accent: "from-cyan-500/20 to-blue-600/10",
    border: "hover:border-cyan-500/30",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M4 18C4 14.686 7.134 12 11 12C14.866 12 18 14.686 18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M15 5L17 3M17 3L19 5M17 3V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "AI & Machine Learning",
    tag: "02",
    desc: "Design, train, and productionize machine learning models. LLM fine-tuning, RAG architectures, computer vision, NLP, and end-to-end MLOps with full monitoring.",
    highlights: ["PyTorch", "LangChain", "MLflow", "Vertex AI", "SageMaker"],
    accent: "from-violet-500/20 to-purple-600/10",
    border: "hover:border-violet-500/30",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="12" width="4" height="7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <rect x="9" y="7" width="4" height="12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <rect x="15" y="3" width="4" height="16" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M3 6L8 3L13 5L19 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Data Analytics",
    tag: "03",
    desc: "Turn messy data into clear narratives. Self-serve BI platforms, executive dashboards, cohort & funnel analysis, A/B testing frameworks, and real-time operational reporting.",
    highlights: ["Looker", "Tableau", "dbt Metrics", "Power BI", "Metabase"],
    accent: "from-emerald-500/20 to-teal-600/10",
    border: "hover:border-emerald-500/30",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 2C6.03 2 2 6.03 2 11C2 15.97 6.03 20 11 20C15.97 20 20 15.97 20 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M16 2L20 6L16 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 6H12C10.343 6 9 7.343 9 9V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Data Strategy",
    tag: "04",
    desc: "Design your enterprise data vision. Data governance frameworks, GDPR/CCPA compliance, organizational data mesh design, tooling audits, and 90-day transformation roadmaps.",
    highlights: ["Data Mesh", "DataOps", "Governance", "MDM", "GDPR"],
    accent: "from-amber-500/20 to-orange-600/10",
    border: "hover:border-amber-500/30",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 9L10 12L7 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11 15H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Data Science",
    tag: "05",
    desc: "Applied statistical modeling for business impact. Demand forecasting, churn prediction, pricing optimization, anomaly detection, and customer segmentation at scale.",
    highlights: ["Python", "R", "Statsmodels", "XGBoost", "Prophet"],
    accent: "from-rose-500/20 to-pink-600/10",
    border: "hover:border-rose-500/30",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M4 6L11 2L18 6V14L11 18L4 14V6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M4 6L11 10M11 10L18 6M11 10V18" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    title: "Cloud & Infrastructure",
    tag: "06",
    desc: "Architect cost-efficient, scalable data infrastructure. Kubernetes-based data platforms, multi-cloud strategies, infrastructure-as-code, and FinOps data cost governance.",
    highlights: ["AWS", "GCP", "Azure", "Terraform", "Kubernetes"],
    accent: "from-sky-500/20 to-blue-600/10",
    border: "hover:border-sky-500/30",
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={`group relative bg-surface border border-stroke ${service.border} rounded-2xl p-6 cursor-default transition-all duration-300 overflow-hidden`}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -4 }}
    >
      {/* Background gradient on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${service.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="w-10 h-10 rounded-xl bg-surface-2 border border-stroke flex items-center justify-center text-muted group-hover:text-text-primary group-hover:border-accent/30 transition-all duration-300">
            {service.icon}
          </div>
          <span className="font-mono text-xs text-muted/40 tracking-wider">{service.tag}</span>
        </div>

        <h3 className="font-display font-bold text-xl text-text-primary mb-3 group-hover:accent-gradient-text transition-all duration-300">
          {service.title}
        </h3>

        <p className="font-body text-sm text-muted leading-relaxed mb-5">
          {service.desc}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2">
          {service.highlights.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] text-muted/70 tracking-wider bg-surface-2/60 border border-stroke/60 px-2.5 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section id="services" className="bg-bg py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-20" />

      <div className="max-w-[1200px] xl:max-w-[1440px] 2xl:max-w-[1760px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-accent/50" />
              <span className="font-mono text-xs text-muted tracking-[0.3em] uppercase">What We Do</span>
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-text-primary leading-tight">
              Full-spectrum{" "}
              <span className="accent-gradient-text">data services</span>
            </h2>
          </div>
          <p className="font-body text-muted text-base max-w-sm leading-relaxed md:text-right">
            From raw ingestion to production AI — we cover the entire data lifecycle for enterprise teams.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <ServiceCard key={s.title} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
