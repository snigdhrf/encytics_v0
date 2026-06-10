import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const links = ["Home", "Services", "Case Studies", "About", "Contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("Home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-10 py-5"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg accent-gradient flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L15 4.5V11.5L8 15L1 11.5V4.5L8 1Z" stroke="black" strokeWidth="1.5" fill="none"/>
            <circle cx="8" cy="8" r="2.5" fill="black"/>
          </svg>
        </div>
        <span className="font-display font-bold text-text-primary text-base tracking-wide">
          encytics<span className="accent-gradient-text">.ai</span>
        </span>
      </div>

      {/* Center links — desktop */}
      <motion.div
        className={`hidden md:flex items-center gap-1 rounded-full border px-2 py-1.5 transition-all duration-300 ${
          scrolled
            ? "border-stroke/80 bg-surface/90 backdrop-blur-xl shadow-lg shadow-black/20"
            : "border-stroke/40 bg-surface/40 backdrop-blur-md"
        }`}
      >
        {links.map((link) => (
          <button
            key={link}
            onClick={() => setActive(link)}
            className={`relative px-4 py-1.5 rounded-full text-sm font-body transition-all duration-200 ${
              active === link
                ? "text-bg"
                : "text-muted hover:text-text-primary"
            }`}
          >
            {active === link && (
              <motion.span
                layoutId="nav-pill"
                className="absolute inset-0 accent-gradient rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{link}</span>
          </button>
        ))}
      </motion.div>

      {/* CTA */}
      <div className="flex items-center gap-3">
        <a
          href="#contact"
          className="hidden md:flex items-center gap-2 font-body text-sm text-muted hover:text-text-primary transition-colors"
        >
          hello@encytics.ai
        </a>
        <motion.a
          href="#contact"
          className="relative group rounded-full text-sm font-body font-medium px-5 py-2 overflow-hidden"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="absolute inset-0 accent-gradient opacity-90 group-hover:opacity-100 transition-opacity" />
          <span className="relative z-10 text-bg font-semibold">Get Started ↗</span>
        </motion.a>
      </div>
    </motion.nav>
  );
}
