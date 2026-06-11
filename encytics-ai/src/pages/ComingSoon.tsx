import { Link } from "react-router-dom";
import SubPageLayout from "../components/SubPageLayout";
import Seo from "../components/Seo";

export default function ComingSoon({
  title,
  blurb,
}: {
  title: string;
  blurb: string;
}) {
  return (
    <SubPageLayout>
      <Seo title={title} description={blurb} path={`/${title.toLowerCase()}`} />
      <div className="max-w-[1200px] xl:max-w-[1440px] 2xl:max-w-[1760px] mx-auto px-6 md:px-10 lg:px-16 py-32 text-center">
        <span className="font-mono text-xs text-muted tracking-[0.3em] uppercase">Coming Soon</span>
        <h1 className="font-display font-bold text-5xl md:text-6xl text-text-primary mt-4 mb-6">
          {title}
        </h1>
        <p className="font-body text-muted text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          {blurb}
        </p>
        <Link
          to="/#contact"
          className="relative inline-flex rounded-full text-base font-body font-semibold px-8 py-3.5 overflow-hidden"
        >
          <span className="absolute inset-0 accent-gradient" />
          <span className="relative z-10 text-bg">Get in touch →</span>
        </Link>
      </div>
    </SubPageLayout>
  );
}
