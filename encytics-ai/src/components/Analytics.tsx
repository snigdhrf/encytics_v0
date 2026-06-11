import { site } from "../config/site";

// Privacy-friendly analytics. Only injected when VITE_ANALYTICS_DOMAIN is set.
// Uses Plausible (cookieless). React 19 hoists the <script> into <head>.
export default function Analytics() {
  if (!site.analyticsDomain) return null;
  return (
    <script
      defer
      data-domain={site.analyticsDomain}
      src="https://plausible.io/js/script.js"
    />
  );
}
