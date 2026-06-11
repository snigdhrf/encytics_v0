// SEO head tags. React 19 hoists <title>/<meta>/<link>/<script> rendered
// anywhere in the tree into <head>, so this component just declares them.

import { site } from "../config/site";

interface Props {
  title?: string;
  description?: string;
  path?: string; // e.g. "/case-studies"
  type?: string;
}

export default function Seo({
  title,
  description = site.description,
  path = "/",
  type = "website",
}: Props) {
  const fullTitle = title
    ? `${title} — ${site.shortName}`
    : `${site.shortName} — Data Engineering, AI & Analytics Consulting`;
  const url = `${site.domain}${path}`;

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.domain,
    email: site.email,
    foundingDate: String(site.founded),
    description: site.description,
    sameAs: Object.values(site.social),
  };

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={site.name} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      <script type="application/ld+json">{JSON.stringify(orgJsonLd)}</script>
    </>
  );
}
