import SubPageLayout from "../components/SubPageLayout";
import Seo from "../components/Seo";
import { site } from "../config/site";

export default function PrivacyPage() {
  return (
    <SubPageLayout>
      <Seo title="Privacy Policy" path="/privacy" />
      <article className="max-w-3xl mx-auto px-6 md:px-10 py-20 prose-invert">
        <span className="font-mono text-xs text-muted tracking-[0.3em] uppercase">Legal</span>
        <h1 className="font-display font-bold text-4xl md:text-5xl text-text-primary mt-3 mb-2">
          Privacy Policy
        </h1>
        <p className="font-mono text-xs text-muted/60 mb-10">
          Last updated: {new Date().getFullYear()}
        </p>

        <div className="space-y-8 font-body text-muted leading-relaxed">
          <section>
            <h2 className="font-display font-bold text-xl text-text-primary mb-3">1. Overview</h2>
            <p>
              {site.name} ("we", "us") respects your privacy. This policy explains what
              information we collect when you use this website and how we use it. We do not sell
              your personal data.
            </p>
          </section>
          <section>
            <h2 className="font-display font-bold text-xl text-text-primary mb-3">2. Information we collect</h2>
            <p>
              When you submit our contact form we collect the email address, company, and project
              details you provide so we can respond to your enquiry. We also collect anonymous,
              aggregate usage analytics (such as page views) to improve the site.
            </p>
          </section>
          <section>
            <h2 className="font-display font-bold text-xl text-text-primary mb-3">3. How we use it</h2>
            <p>
              We use the information you submit solely to respond to and manage your enquiry. We
              retain it only as long as necessary for that purpose or as required by law.
            </p>
          </section>
          <section>
            <h2 className="font-display font-bold text-xl text-text-primary mb-3">4. Your rights</h2>
            <p>
              Depending on your jurisdiction (including under GDPR and CCPA), you may have the right
              to access, correct, or delete the personal data we hold about you. To exercise these
              rights, email{" "}
              <a href={`mailto:${site.email}`} className="accent-gradient-text">{site.email}</a>.
            </p>
          </section>
          <section>
            <h2 className="font-display font-bold text-xl text-text-primary mb-3">5. Contact</h2>
            <p>
              Questions about this policy? Reach us at{" "}
              <a href={`mailto:${site.email}`} className="accent-gradient-text">{site.email}</a>.
            </p>
          </section>
        </div>
      </article>
    </SubPageLayout>
  );
}
