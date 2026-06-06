import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onComplete: () => void;
}

const words = ["Engineer", "Analyze", "Predict", "Transform"];

export default function LoadingScreen({ onComplete }: Props) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const duration = 2800;
    const startTime = Date.now();
    let raf: number;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * 100));

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => onComplete(), 300);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % words.length);
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-bg flex flex-col overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hex grid bg */}
      <div className="absolute inset-0 hex-bg opacity-30" />

      {/* Scan line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent animate-scan" />
      </div>

      {/* Top row */}
      <motion.div
        className="flex items-center justify-between px-8 pt-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded accent-gradient flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" stroke="black" strokeWidth="1.5" fill="none"/>
              <circle cx="7" cy="7" r="2" fill="black"/>
            </svg>
          </div>
          <span className="font-display font-bold text-text-primary text-sm tracking-wider uppercase">
            encytics<span className="accent-gradient-text">.ai</span>
          </span>
        </div>
        <span className="font-mono text-xs text-muted tracking-[0.2em] uppercase">
          Initializing
        </span>
      </motion.div>

      {/* Center */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div className="font-mono text-xs text-muted/60 tracking-[0.3em] uppercase mb-2">
          Data Intelligence Platform
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={wordIndex}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-text-primary/80 tracking-tight"
            initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
            transition={{ duration: 0.35 }}
          >
            {words[wordIndex]}
          </motion.div>
        </AnimatePresence>

        {/* Mini chart animation */}
        <div className="flex items-end gap-1 h-8 mt-4">
          {[40, 60, 35, 80, 55, 90, 45, 70, 85, 60, 95].map((h, i) => (
            <motion.div
              key={i}
              className="w-1.5 accent-gradient rounded-sm"
              style={{ height: `${h}%` }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: "easeOut" }}
            />
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="px-8 pb-8">
        <div className="flex items-end justify-between mb-4">
          <div className="font-mono text-xs text-muted tracking-wider">
            Loading modules...
          </div>
          <motion.div
            className="font-display font-bold text-6xl md:text-8xl text-text-primary tabular-nums leading-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {String(count).padStart(3, "0")}
          </motion.div>
        </div>

        {/* Progress bar */}
        <div className="h-[2px] w-full bg-stroke/40 rounded-full overflow-hidden">
          <motion.div
            className="h-full accent-gradient rounded-full"
            style={{ width: `${count}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>

        <div className="flex justify-between mt-2">
          {["Data Engineering", "AI/ML", "Analytics", "Strategy"].map((label, i) => (
            <motion.span
              key={label}
              className="font-mono text-[10px] text-muted/50 tracking-wider uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: count > i * 25 ? 1 : 0.2 }}
              transition={{ duration: 0.3 }}
            >
              {label}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
