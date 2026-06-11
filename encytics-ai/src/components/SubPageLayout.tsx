import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { site } from "../config/site";

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg accent-gradient flex items-center justify-center flex-shrink-0">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 1L15 4.5V11.5L8 15L1 11.5V4.5L8 1Z" stroke="black" strokeWidth="1.5" fill="none" />
          <circle cx="8" cy="8" r="2.5" fill="black" />
        </svg>
      </div>
      <span className="font-display font-bold text-text-primary text-base tracking-wide">
        encytics<span className="accent-gradient-text">.ai</span>
      </span>
    </Link>
  );
}

export default function SubPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {/* Header */}
      <header className="border-b border-stroke">
        <div className="max-w-[1200px] xl:max-w-[1440px] 2xl:max-w-[1760px] mx-auto px-6 md:px-10 lg:px-16 py-5 flex items-center justify-between">
          <Logo />
          <nav className="flex items-center gap-6">
            <Link to="/" className="font-body text-sm text-muted hover:text-text-primary transition-colors">
              Home
            </Link>
            <Link to="/case-studies" className="font-body text-sm text-muted hover:text-text-primary transition-colors">
              Case Studies
            </Link>
            <Link
              to="/#contact"
              className="relative rounded-full text-sm font-body font-semibold px-5 py-2 overflow-hidden"
            >
              <span className="absolute inset-0 accent-gradient" />
              <span className="relative z-10 text-bg">Get Started ↗</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-stroke">
        <div className="max-w-[1200px] xl:max-w-[1440px] 2xl:max-w-[1760px] mx-auto px-6 md:px-10 lg:px-16 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-mono text-xs text-muted/40 tracking-wider">
            © {new Date().getFullYear()} {site.name} Consulting. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="font-mono text-xs text-muted/40 hover:text-muted transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="font-mono text-xs text-muted/40 hover:text-muted transition-colors">
              Terms
            </Link>
            <a href={`mailto:${site.email}`} className="font-mono text-xs text-muted/40 hover:text-muted transition-colors">
              {site.email}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
