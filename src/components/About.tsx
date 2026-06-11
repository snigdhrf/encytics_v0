import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const team = [
  {
    name: "Arjun Mehta",
    role: "Founder & Principal Data Engineer",
    exp: "12 yrs",
    prev: ["Google", "Databricks"],
    spec: "Data Architecture · Lakehouse · Streaming",
    initials: "AM",
  },
  {
    name: "Priya Nair",
    role: "Head of AI/ML",
    exp: "10 yrs",
    prev: ["DeepMind", "Flipkart"],
    spec: "LLMs · MLOps · Computer Vision",
    initials: "PN",
  },
  {
    name: "Lucas Schmidt",
    role: "Lead Analytics Engineer",
    exp: "8 yrs",
    prev: ["Airbnb", "Fivetran"],
    spec: "dbt · BI · Data Modeling",
    initials: "LS",
  },
  {
    name: "Ananya Rao",
    role: "Data Science Lead",
    exp: "9 yrs",
    prev: ["McKinsey", "Zomato"],
    spec: "Forecasting · Causal Inference · NLP",
    initials: "AR",
  },
];

const values = [
  { title: "Outcomes Over Output", desc: "We optimize for business results, not ticket counts." },
  { title: "Transparency by Default", desc: "Full visibility into our methods, decisions, and tradeoffs." },
  { title: "Modern Stack, Pragmatic Choices", desc: "Best tool for the job — never over-engineered." },
  { title: "Knowledge Transfer", desc: "We leave your team stronger than we found it." },
];

// Avatar with gradient border
function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-display font-bold text-lg text-bg ${color}`}>
      {initials}
    </div>
  );
}

const avatarColors = [
  "accent-gradient",
  "bg-gradient-to-br from-violet-500 to-purple-600",
  "bg-gradient-to-br from-emerald-500 to-teal-600",
  "bg-gradient-to-br from-amber-500 to-orange-600",
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="about" className="bg-bg py-24 md:py-32 relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-stroke to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        {/* Header */}
        <motion.div
          className="mb-16 grid md:grid-cols-2 gap-12 items-end"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-accent/50" />
              <span className="font-mono text-xs text-muted tracking-[0.3em] uppercase">About Us</span>
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-text-primary leading-tight">
              Data consultants,{" "}
              <span className="accent-gradient-text">not order-takers</span>
            </h2>
          </div>
          <p className="font-body text-muted text-base leading-relaxed">
            Founded in 2018, Encytics is a boutique data consultancy built by practitioners from top-tier tech companies and McKinsey. We embed directly with your team to solve hard data problems — not hand over decks.
          </p>
        </motion.div>

        {/* Team */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              className="group bg-surface border border-stroke hover:border-accent/30 rounded-2xl p-5 cursor-default transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-start justify-between mb-4">
                <Avatar initials={member.initials} color={avatarColors[i]} />
                <span className="font-mono text-xs text-muted/60 bg-surface-2 border border-stroke px-2 py-1 rounded-full">
                  {member.exp}
                </span>
              </div>

              <h4 className="font-display font-bold text-text-primary mb-1 group-hover:accent-gradient-text transition-all">
                {member.name}
              </h4>
              <div className="font-body text-sm text-muted mb-3">{member.role}</div>

              <div className="flex gap-1.5 mb-3">
                {member.prev.map((co) => (
                  <span key={co} className="font-mono text-[10px] text-muted/60 bg-surface-2 border border-stroke px-2 py-0.5 rounded-full">
                    {co}
                  </span>
                ))}
              </div>

              <div className="font-mono text-[10px] text-muted/50 leading-relaxed">{member.spec}</div>
            </motion.div>
          ))}
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              className="group"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 + 0.4, duration: 0.6 }}
            >
              <div className="w-6 h-px accent-gradient mb-4" />
              <h4 className="font-display font-semibold text-text-primary mb-2">{v.title}</h4>
              <p className="font-body text-sm text-muted leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
