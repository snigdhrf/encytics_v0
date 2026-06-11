import SubPageLayout from "../components/SubPageLayout";
import Seo from "../components/Seo";
import { site } from "../config/site";

export default function TermsPage() {
  return (
    <SubPageLayout>
      <Seo title="Terms of Service" path="/terms" />
      <article className="max-w-3xl mx-auto px-6 md:px-10 py-20">
        <span className="font-mono text-xs text-muted tracking-[0.3em] uppercase">Legal</span>
        <h1 className="font-display font-bold text-4xl md:text-5xl text-text-primary mt-3 mb-2">
          Terms of Service
        </h1>
        <p className="font-mono text-xs text-muted/60 mb-10">
          Last updated: {new Date().getFullYear()}
        </p>

        <div className="space-y-8 font-body text-muted leading-relaxed">
          <section>
            <h2 className="font-display font-bold text-xl text-text-primary mb-3">1. Acceptance of terms</h2>
            <p>
              By accessing and using this website you accept and agree to be bound by these terms.
              If you do not agree, please do not use the site.
            </p>
          </section>
          <section>
            <h2 className="font-display font-bold text-xl text-text-primary mb-3">2. Use of the site</h2>
            <p>
              The content on this site is provided for general information about {site.name}'s
              services. You agree not to misuse the site or attempt to disrupt its operation.
            </p>
          </section>
          <section>
            <h2 className="font-display font-bold text-xl text-text-primary mb-3">3. Intellectual property</h2>
            <p>
              All content, branding, and materials on this site are the property of {site.name}
              unless otherwise stated, and may not be reproduced without permission.
            </p>
          </section>
          <section>
            <h2 className="font-display font-bold text-xl text-text-primary mb-3">4. Disclaimer</h2>
            <p>
              The site is provided "as is" without warranties of any kind. Case study metrics are
              illustrative of past engagements and are not a guarantee of future results.
            </p>
          </section>
          <section>
            <h2 className="font-display font-bold text-xl text-text-primary mb-3">5. Contact</h2>
            <p>
              Questions about these terms? Email{" "}
              <a href={`mailto:${site.email}`} className="accent-gradient-text">{site.email}</a>.
            </p>
          </section>
        </div>
      </article>
    </SubPageLayout>
  );
}
