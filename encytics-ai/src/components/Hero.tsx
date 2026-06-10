import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

const roles = ["Data Engineering", "AI & Machine Learning", "Data Analytics", "Data Strategy"];

// Animated mini data visualization
function DataViz() {
  const bars = [62, 45, 78, 55, 90, 38, 72, 85, 60, 92, 48, 76];
  return (
    <div className="flex items-end gap-1 h-16">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="w-2 rounded-sm"
          style={{
            height: `${h}%`,
            background: `hsl(${195 + i * 5} 100% ${50 + i * 2}% / ${0.4 + i * 0.04})`,
          }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 1.2 + i * 0.06, duration: 0.5, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function LiveCounter({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      className="flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.6 }}
    >
      <span className="font-display font-bold text-2xl text-text-primary">{value}</span>
      <span className="font-mono text-xs text-muted/70 tracking-wider uppercase mt-0.5">{label}</span>
    </motion.div>
  );
}

export default function Hero() {
  const [roleIdx, setRoleIdx] = useState(0);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(headlineRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, delay: 0.15 });
    tl.fromTo(subRef.current, { y: 30, opacity: 0, filter: "blur(8px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.9 }, "-=0.6");
    tl.fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.4");
  }, []);

  useEffect(() => {
    const t = setInterval(() => setRoleIdx((i) => (i + 1) % roles.length), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-bg">
      {/* Background elements */}
      <div className="absolute inset-0 dot-grid opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg pointer-events-none" />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/5 w-80 h-80 rounded-full bg-accent-2/5 blur-[100px] pointer-events-none" />

      {/* Floating card — top right */}
      <motion.div
        className="absolute top-28 right-6 md:right-16 w-52 bg-surface/80 backdrop-blur-xl border border-stroke rounded-2xl p-4 hidden md:block"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.3, duration: 0.7 }}
        style={{ animation: "float 6s ease-in-out infinite" }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-xs text-muted tracking-wider">PIPELINE STATUS</span>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>
        <DataViz />
        <div className="mt-3 flex items-center gap-2">
          <span className="font-mono text-xs text-muted">Throughput</span>
          <div className="flex-1 h-1 bg-stroke rounded-full overflow-hidden">
            <motion.div
              className="h-full accent-gradient"
              initial={{ width: 0 }}
              animate={{ width: "78%" }}
              transition={{ delay: 1.8, duration: 1, ease: "easeOut" }}
            />
          </div>
          <span className="font-mono text-xs accent-gradient-text">78%</span>
        </div>
      </motion.div>

      {/* Floating card — bottom left */}
      <motion.div
        className="absolute bottom-32 left-6 md:left-16 w-48 bg-surface/80 backdrop-blur-xl border border-stroke rounded-2xl p-4 hidden md:block"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.7 }}
        style={{ animation: "float 8s ease-in-out infinite 2s" }}
      >
        <div className="font-mono text-xs text-muted mb-2 tracking-wider">MODEL ACCURACY</div>
        <div className="font-display font-bold text-3xl accent-gradient-text">99.2%</div>
        <div className="mt-2 flex gap-1">
          {[1,1,1,1,1,0.6,0.3].map((o, i) => (
            <div key={i} className="w-4 h-1.5 rounded-sm bg-accent" style={{ opacity: o }} />
          ))}
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-10 pt-32 pb-20 text-center max-w-5xl mx-auto w-full">

        {/* Eyebrow */}
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.5 }}
        >
          <div className="h-px w-8 bg-accent/50" />
          <span className="font-mono text-xs text-muted tracking-[0.3em] uppercase">
            Data · AI · Analytics
          </span>
          <div className="h-px w-8 bg-accent/50" />
        </motion.div>

        {/* Headline */}
        <div ref={headlineRef} className="mb-6">
          <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-text-primary">
            Turn your data into
            <br />
            <span className="relative inline-block">
              <span className="accent-gradient-text glitch-text" data-text="intelligence">
                intelligence
              </span>
            </span>
          </h1>
        </div>

        {/* Role cycling */}
        <div className="mb-8 h-8 flex items-center justify-center gap-2">
          <span className="font-body text-muted text-base">Specializing in</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={roleIdx}
              className="font-body font-medium text-base accent-gradient-text"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {roles[roleIdx]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Description */}
        <div ref={subRef}>
          <p className="font-body text-muted text-lg max-w-2xl mb-12 leading-relaxed">
            We transform raw data into actionable intelligence — building pipelines, 
            deploying AI models, and designing analytics systems that drive decisions 
            at enterprise scale.
          </p>
        </div>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center gap-4">
          <motion.a
            href="#services"
            className="relative group rounded-full text-base font-body font-semibold px-8 py-3.5 overflow-hidden"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <span className="absolute inset-0 accent-gradient" />
            <span className="relative z-10 text-bg">Explore Services →</span>
          </motion.a>

          <motion.a
            href="#case-studies"
            className="group relative rounded-full text-base font-body font-semibold px-8 py-3.5 border border-stroke hover:border-accent/40 text-text-primary transition-all duration-200 overflow-hidden"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <span className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10">View Case Studies</span>
          </motion.a>
        </div>

        {/* Stats row */}
        <motion.div
          className="flex items-center gap-10 mt-16 pt-8 border-t border-stroke/40"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          <LiveCounter value="150+" label="Projects Delivered" />
          <div className="w-px h-10 bg-stroke" />
          <LiveCounter value="40TB+" label="Data Processed" />
          <div className="w-px h-10 bg-stroke" />
          <LiveCounter value="99.2%" label="Model Accuracy" />
          <div className="w-px h-10 bg-stroke hidden md:block" />
          <LiveCounter label="Client Retention" value="96%" />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-mono text-[10px] text-muted/50 tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-10 bg-stroke relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-4 accent-gradient animate-scan" />
        </div>
      </div>
    </section>
  );
}
