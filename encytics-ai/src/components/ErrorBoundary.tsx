import { Component, type ErrorInfo, type ReactNode } from "react";
import { site } from "../config/site";

type Props = { children: ReactNode };
type State = { hasError: boolean };

// Class component because React only exposes render-error catching via the
// class lifecycle (getDerivedStateFromError / componentDidCatch).
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Sentry is loaded on demand (see main.tsx) so the SDK never ships in the
    // bundle when no DSN is configured.
    if (import.meta.env.VITE_SENTRY_DSN) {
      import("@sentry/react").then((Sentry) => {
        Sentry.captureException(error, {
          extra: { componentStack: info.componentStack },
        });
      });
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-12 h-12 rounded-xl accent-gradient flex items-center justify-center mx-auto mb-6">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 6V11M10 14H10.01M10 1L19 18H1L10 1Z"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-text-primary mb-3">
            Something went <span className="accent-gradient-text">wrong</span>
          </h1>
          <p className="font-body text-sm text-muted leading-relaxed mb-8">
            An unexpected error stopped this page from rendering. Reloading
            usually fixes it — if it keeps happening, drop us a line.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="relative w-full rounded-xl py-3.5 font-body font-semibold text-bg overflow-hidden mb-4"
          >
            <span className="absolute inset-0 accent-gradient" />
            <span className="relative z-10">Reload page</span>
          </button>
          <a
            href={`mailto:${site.email}`}
            className="font-mono text-xs accent-gradient-text hover:opacity-80 transition-opacity"
          >
            {site.email} ↗
          </a>
        </div>
      </div>
    );
  }
}
