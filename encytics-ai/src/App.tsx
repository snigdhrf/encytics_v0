import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import CookieConsent from "./components/CookieConsent";
import Analytics from "./components/Analytics";
import Home from "./pages/Home";

// Sub-pages are lazy-loaded so the landing page ships the smallest bundle.
const CaseStudiesPage = lazy(() => import("./pages/CaseStudiesPage"));
const CaseStudyDetail = lazy(() => import("./pages/CaseStudyDetail"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const ComingSoon = lazy(() => import("./pages/ComingSoon"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Admin = lazy(() => import("./pages/admin/Admin"));

// Shown while a lazy-loaded route chunk is downloading.
function PageLoader() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div
        className="w-8 h-8 rounded-full border-2 border-stroke border-t-accent animate-spin motion-reduce:animate-none"
        role="status"
        aria-label="Loading page"
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Analytics />
      <ErrorBoundary>
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/case-studies" element={<CaseStudiesPage />} />
              <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route
                path="/blog"
                element={<ComingSoon title="Blog" blurb="Field notes on data engineering, AI, and analytics are on the way." />}
              />
              <Route
                path="/careers"
                element={<ComingSoon title="Careers" blurb="We're always looking for sharp data practitioners. Roles will be posted here soon." />}
              />
              <Route path="/admin/*" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <CookieConsent />
        </BrowserRouter>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
