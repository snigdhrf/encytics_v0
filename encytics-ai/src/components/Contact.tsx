import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";

const engagements = [
  { label: "Project-based", desc: "Defined scope, timeline, and deliverables" },
  { label: "Embedded Team", desc: "Work as part of your engineering squad" },
  { label: "Fractional CDO", desc: "Part-time Chief Data Officer advisory" },
  { label: "Training & Enablement", desc: "Upskill your team on modern data practices" },
];

const footerLinks = {
  Services: ["Data Engineering", "AI & Machine Learning", "Data Analytics", "Data Strategy", "Cloud & Infra"],
  Company: ["About", "Case Studies", "Blog", "Careers", "Contact"],
  Resources: ["Data Maturity Assessment", "Tech Stack Guide", "ROI Calculator", "Open Source"],
};

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!marqueeRef.current) return;
    gsap.to(marqueeRef.current, {
      xPercent: -50,
      duration: 35,
      ease: "none",
      repeat: -1,
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section id="contact" className="bg-bg relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-stroke to-transparent" />

      {/* Marquee strip */}
      <div className="py-5 border-b border-stroke overflow-hidden">
        <div ref={marqueeRef} className="flex whitespace-nowrap" style={{ width: "200%" }}>
          {Array(20).fill("ENGINEER • ANALYZE • PREDICT • TRANSFORM • ").map((text, i) => (
            <span key={i} className="font-display font-bold text-sm text-stroke tracking-[0.2em] uppercase mr-0">
              {text}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 pt-24 pb-12" ref={ref}>
        {/* CTA block */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-accent/50" />
              <span className="font-mono text-xs text-muted tracking-[0.3em] uppercase">Get In Touch</span>
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-text-primary leading-tight mb-6">
              Ready to unlock your <span className="accent-gradient-text">data's potential?</span>
            </h2>
            <p className="font-body text-muted mb-8 leading-relaxed">
              Tell us about your data challenge — we'll respond within 24 hours with initial thoughts on how we'd approach it.
            </p>

            {/* Engagement models */}
            <div className="space-y-3">
              {engagements.map((e, i) => (
                <motion.div
                  key={e.label}
                  className="flex items-center gap-4 group cursor-default"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.08 + 0.3, duration: 0.5 }}
                >
                  <div className="w-1.5 h-1.5 rounded-full accent-gradient flex-shrink-0" />
                  <div>
                    <span className="font-body text-sm font-medium text-text-primary">{e.label}</span>
                    <span className="font-body text-sm text-muted ml-2">— {e.desc}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Form / CTA */}
          <motion.div
            className="bg-surface border border-stroke rounded-2xl p-7 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="absolute inset-x-0 top-0 h-px accent-gradient" />

            {!submitted ? (
              <div>
                <h3 className="font-display font-bold text-xl text-text-primary mb-6">
                  Start with a free data audit
                </h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="font-mono text-xs text-muted tracking-wider block mb-2">Company Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm text-text-primary placeholder:text-muted/40 focus:outline-none focus:border-accent/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-xs text-muted tracking-wider block mb-2">Main Challenge</label>
                    <select className="w-full bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm text-text-primary focus:outline-none focus:border-accent/40 transition-colors appearance-none">
                      <option value="" className="bg-surface">Select one...</option>
                      <option value="pipeline" className="bg-surface">Slow/broken data pipelines</option>
                      <option value="ml" className="bg-surface">Building AI/ML capabilities</option>
                      <option value="analytics" className="bg-surface">Lack of analytics visibility</option>
                      <option value="governance" className="bg-surface">Data quality & governance</option>
                      <option value="cloud" className="bg-surface">Cloud migration/cost</option>
                    </select>
                  </div>
                </div>

                <motion.button
                  onClick={handleSubmit}
                  className="relative w-full rounded-xl py-3.5 font-body font-semibold text-bg overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="absolute inset-0 accent-gradient" />
                  <span className="relative z-10">Request Free Audit →</span>
                </motion.button>

                <p className="font-mono text-xs text-muted/50 text-center mt-3 tracking-wide">
                  No commitment · Response within 24h
                </p>
              </div>
            ) : (
              <motion.div
                className="flex flex-col items-center justify-center h-48 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="w-12 h-12 rounded-full accent-gradient flex items-center justify-center mb-4">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10L8 14L16 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h4 className="font-display font-bold text-xl text-text-primary mb-2">We'll be in touch!</h4>
                <p className="font-body text-sm text-muted">Check your inbox within 24 hours.</p>
              </motion.div>
            )}

            <div className="mt-6 pt-6 border-t border-stroke flex items-center justify-between">
              <span className="font-mono text-xs text-muted">Or email us directly</span>
              <a href="mailto:hello@encytics.ai" className="font-mono text-xs accent-gradient-text hover:opacity-80 transition-opacity">
                hello@encytics.ai ↗
              </a>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="border-t border-stroke pt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand column */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg accent-gradient flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" stroke="black" strokeWidth="1.5" fill="none"/>
                    <circle cx="7" cy="7" r="2" fill="black"/>
                  </svg>
                </div>
                <span className="font-display font-bold text-text-primary">
                  encytics<span className="accent-gradient-text">.ai</span>
                </span>
              </div>
              <p className="font-body text-xs text-muted leading-relaxed mb-4">
                Data Engineering · AI/ML · Analytics · Strategy
              </p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="font-mono text-xs text-muted/60">Available for projects</span>
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section}>
                <div className="font-mono text-xs text-muted/50 tracking-wider uppercase mb-4">{section}</div>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="font-body text-sm text-muted hover:text-text-primary transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stroke/40">
            <span className="font-mono text-xs text-muted/40 tracking-wider">
              © 2025 Encytics AI Consulting. All rights reserved.
            </span>
            <div className="flex items-center gap-6">
              {["LinkedIn", "Twitter", "GitHub", "Medium"].map((social) => (
                <a key={social} href="#" className="font-mono text-xs text-muted/40 hover:text-muted transition-colors">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
