import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { site } from "../config/site";

const engagements = [
  { label: "Project-based", desc: "Defined scope, timeline, and deliverables" },
  { label: "Embedded Team", desc: "Work as part of your engineering squad" },
  { label: "Fractional CDO", desc: "Part-time Chief Data Officer advisory" },
  { label: "Training & Enablement", desc: "Upskill your team on modern data practices" },
];

// type: "hash" = in-page anchor, "route" = client route, "mail" = mailto
type FooterLink = { label: string; href: string; type: "hash" | "route" | "mail" };

const footerLinks: Record<string, FooterLink[]> = {
  Services: [
    { label: "Data Engineering", href: "#services", type: "hash" },
    { label: "AI & Machine Learning", href: "#services", type: "hash" },
    { label: "Data Analytics", href: "#services", type: "hash" },
    { label: "Data Strategy", href: "#services", type: "hash" },
    { label: "Cloud & Infra", href: "#services", type: "hash" },
  ],
  Company: [
    { label: "About", href: "#about", type: "hash" },
    { label: "Case Studies", href: "/case-studies", type: "route" },
    { label: "Blog", href: "/blog", type: "route" },
    { label: "Careers", href: "/careers", type: "route" },
    { label: "Contact", href: "#contact", type: "hash" },
  ],
  Resources: [
    { label: "Data Maturity Assessment", href: "#contact", type: "hash" },
    { label: "Tech Stack Guide", href: "#contact", type: "hash" },
    { label: "ROI Calculator", href: "#contact", type: "hash" },
    { label: "Email Us", href: `mailto:${site.email}`, type: "mail" },
  ],
};

function FooterAnchor({ link }: { link: FooterLink }) {
  const cls =
    "font-body text-sm text-muted hover:text-text-primary transition-colors";
  if (link.type === "route")
    return <Link to={link.href} className={cls}>{link.label}</Link>;
  return <a href={link.href} className={cls}>{link.label}</a>;
}

type Status = "idle" | "submitting" | "success" | "error";

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [challenge, setChallenge] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!marqueeRef.current) return;
    gsap.to(marqueeRef.current, { xPercent: -50, duration: 35, ease: "none", repeat: -1 });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }

    const payload = {
      name: name.trim(),
      email: trimmed,
      challenge,
      _subject: `New data audit request from ${trimmed}`,
    };

    // No backend endpoint configured → hand off to the user's mail client.
    if (!site.contactEndpoint) {
      const body = encodeURIComponent(
        `Name: ${payload.name}\nEmail: ${payload.email}\nChallenge: ${challenge || "—"}`
      );
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
        "Free data audit request"
      )}&body=${body}`;
      setStatus("success");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch(site.contactEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setError("Something went wrong sending your request. Please email us directly.");
      }
    } catch {
      setStatus("error");
      setError("Network error. Please email us directly.");
    }
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

          {/* Form */}
          <motion.div
            className="bg-surface border border-stroke rounded-2xl p-7 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="absolute inset-x-0 top-0 h-px accent-gradient" />

            {status !== "success" ? (
              <form onSubmit={handleSubmit}>
                <h3 className="font-display font-bold text-xl text-text-primary mb-6">
                  Start with a free data audit
                </h3>

                {error && (
                  <div className="font-body text-sm text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-xl px-4 py-2.5 mb-4">
                    {error}
                  </div>
                )}

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="font-mono text-xs text-muted tracking-wider block mb-2">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm text-text-primary placeholder:text-muted/40 focus:outline-none focus:border-accent/40 transition-colors"
                    />
                  </div>
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
                    <select
                      value={challenge}
                      onChange={(e) => setChallenge(e.target.value)}
                      className="w-full bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm text-text-primary focus:outline-none focus:border-accent/40 transition-colors appearance-none"
                    >
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
                  type="submit"
                  disabled={status === "submitting"}
                  className="relative w-full rounded-xl py-3.5 font-body font-semibold text-bg overflow-hidden disabled:opacity-70"
                  whileHover={{ scale: status === "submitting" ? 1 : 1.02 }}
                  whileTap={{ scale: status === "submitting" ? 1 : 0.98 }}
                >
                  <span className="absolute inset-0 accent-gradient" />
                  <span className="relative z-10">
                    {status === "submitting" ? "Sending…" : "Request Free Audit →"}
                  </span>
                </motion.button>

                <p className="font-mono text-xs text-muted/50 text-center mt-3 tracking-wide">
                  No commitment · Response within 24h
                </p>
              </form>
            ) : (
              <motion.div
                className="flex flex-col items-center justify-center h-72 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="w-12 h-12 rounded-full accent-gradient flex items-center justify-center mb-4">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10L8 14L16 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h4 className="font-display font-bold text-xl text-text-primary mb-2">We'll be in touch!</h4>
                <p className="font-body text-sm text-muted">
                  {site.contactEndpoint
                    ? "Thanks — we've received your request and will reply within 24 hours."
                    : "Your email draft is ready — hit send and we'll reply within 24 hours."}
                </p>
              </motion.div>
            )}

            <div className="mt-6 pt-6 border-t border-stroke flex items-center justify-between">
              <span className="font-mono text-xs text-muted">Or email us directly</span>
              <a href={`mailto:${site.email}`} className="font-mono text-xs accent-gradient-text hover:opacity-80 transition-opacity">
                {site.email} ↗
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
                    <path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" stroke="black" strokeWidth="1.5" fill="none" />
                    <circle cx="7" cy="7" r="2" fill="black" />
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
            {Object.entries(footerLinks).map(([section, sectionLinks]) => (
              <div key={section}>
                <div className="font-mono text-xs text-muted/50 tracking-wider uppercase mb-4">{section}</div>
                <ul className="space-y-2.5">
                  {sectionLinks.map((link) => (
                    <li key={link.label}>
                      <FooterAnchor link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stroke/40">
            <div className="flex items-center gap-5">
              <span className="font-mono text-xs text-muted/40 tracking-wider">
                © {new Date().getFullYear()} {site.name} Consulting. All rights reserved.
              </span>
              <Link to="/privacy" className="font-mono text-xs text-muted/40 hover:text-muted transition-colors">Privacy</Link>
              <Link to="/terms" className="font-mono text-xs text-muted/40 hover:text-muted transition-colors">Terms</Link>
            </div>
            <div className="flex items-center gap-6">
              {Object.entries(site.social).map(([label, url]) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-muted/40 hover:text-muted transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
