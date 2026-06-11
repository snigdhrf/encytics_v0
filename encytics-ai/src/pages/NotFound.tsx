import { Link } from "react-router-dom";
import SubPageLayout from "../components/SubPageLayout";
import Seo from "../components/Seo";

export default function NotFound() {
  return (
    <SubPageLayout>
      <Seo title="Page not found" path="/404" />
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 py-32 text-center">
        <div className="font-display font-bold text-7xl md:text-9xl accent-gradient-text mb-4">
          404
        </div>
        <h1 className="font-display font-bold text-3xl text-text-primary mb-4">
          This page took an unexpected detour
        </h1>
        <p className="font-body text-muted text-lg max-w-md mx-auto mb-10">
          The page you're looking for doesn't exist or has moved.
        </p>
        <Link
          to="/"
          className="relative inline-flex rounded-full text-base font-body font-semibold px-8 py-3.5 overflow-hidden"
        >
          <span className="absolute inset-0 accent-gradient" />
          <span className="relative z-10 text-bg">← Back home</span>
        </Link>
      </div>
    </SubPageLayout>
  );
}
