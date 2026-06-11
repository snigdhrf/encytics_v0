import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { site } from "../config/site";

const links = [
  { label: "Home", id: "home" },
  { label: "Services", id: "services" },
  { label: "Case Studies", id: "case-studies" },
  { label: "About", id: "about" },
  { label: "Contact", id: "contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight the section currently in view.
  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => !!el);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", id === "home" ? "/" : `#${id}`);
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-10 py-5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {/* Logo */}
        <button onClick={() => scrollTo("home")} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg accent-gradient flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L15 4.5V11.5L8 15L1 11.5V4.5L8 1Z" stroke="black" strokeWidth="1.5" fill="none" />
              <circle cx="8" cy="8" r="2.5" fill="black" />
            </svg>
          </div>
          <span className="font-display font-bold text-text-primary text-base tracking-wide">
            encytics<span className="accent-gradient-text">.ai</span>
          </span>
        </button>

        {/* Center links — desktop */}
        <div
          className={`hidden md:flex items-center gap-1 rounded-full border px-2 py-1.5 transition-all duration-300 ${
            scrolled
              ? "border-stroke/80 bg-surface/90 backdrop-blur-xl shadow-lg shadow-black/20"
              : "border-stroke/40 bg-surface/40 backdrop-blur-md"
          }`}
        >
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`relative px-4 py-1.5 rounded-full text-sm font-body transition-all duration-200 ${
                active === link.id ? "text-bg" : "text-muted hover:text-text-primary"
              }`}
            >
              {active === link.id && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 accent-gradient rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{link.label}</span>
            </button>
          ))}
        </div>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <a
            href={`mailto:${site.email}`}
            className="hidden md:flex items-center gap-2 font-body text-sm text-muted hover:text-text-primary transition-colors"
          >
            {site.email}
          </a>
          <motion.button
            onClick={() => scrollTo("contact")}
            className="relative group rounded-full text-sm font-body font-medium px-5 py-2 overflow-hidden"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="absolute inset-0 accent-gradient opacity-90 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 text-bg font-semibold">Get Started ↗</span>
          </motion.button>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-stroke text-text-primary"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <div className="flex flex-col gap-1.5">
              <span className={`block w-4 h-px bg-current transition-transform ${menuOpen ? "translate-y-[3px] rotate-45" : ""}`} />
              <span className={`block w-4 h-px bg-current transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-4 h-px bg-current transition-transform ${menuOpen ? "-translate-y-[3px] -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden bg-bg/95 backdrop-blur-xl flex flex-col items-center justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`font-display font-bold text-3xl transition-colors ${
                  active === link.id ? "accent-gradient-text" : "text-text-primary"
                }`}
              >
                {link.label}
              </button>
            ))}
            <a href={`mailto:${site.email}`} className="font-mono text-sm text-muted mt-4">
              {site.email}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
