import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const KEY = "encytics.cookieConsent.v1";

export default function CookieConsent() {
  const [dismissed, setDismissed] = useState(
    () => !!localStorage.getItem(KEY)
  );

  const accept = () => {
    try {
      localStorage.setItem(KEY, new Date().toISOString());
    } catch {
      /* ignore */
    }
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          className="fixed bottom-4 inset-x-4 md:left-auto md:right-6 md:max-w-md z-[100] bg-surface border border-stroke rounded-2xl p-5 shadow-2xl shadow-black/40"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.4 }}
        >
          <p className="font-body text-sm text-muted leading-relaxed mb-4">
            We use minimal, privacy-friendly analytics to understand site usage.
            No tracking cookies, no selling data. See our{" "}
            <Link to="/privacy" className="accent-gradient-text hover:opacity-80">
              Privacy Policy
            </Link>
            .
          </p>
          <div className="flex justify-end">
            <button
              onClick={accept}
              className="relative rounded-full text-sm font-body font-semibold px-5 py-2 overflow-hidden text-bg"
            >
              <span className="absolute inset-0 accent-gradient" />
              <span className="relative z-10">Got it</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
