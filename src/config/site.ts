// Central site configuration.
// Everything that is environment- or business-specific lives here so the rest
// of the app never hardcodes it. Override the contact endpoint / analytics id
// with Vite env vars (see .env.example) without touching component code.

export const site = {
  name: "Encytics AI",
  shortName: "encytics.ai",
  domain: "https://encytics.ai",
  email: "hello@encytics.ai",
  description:
    "Transform raw data into intelligence. Expert data engineering, AI/ML, analytics, and strategy consulting for enterprise teams.",
  founded: 2018,

  // Where the contact form POSTs. Set VITE_CONTACT_ENDPOINT to a Formspree
  // (or compatible) endpoint, e.g. https://formspree.io/f/abcdwxyz.
  // If empty, the form gracefully falls back to a mailto: handoff.
  contactEndpoint: import.meta.env.VITE_CONTACT_ENDPOINT ?? "",

  // Optional analytics. Set VITE_ANALYTICS_DOMAIN to enable the Plausible
  // snippet (privacy-friendly, no cookie banner strictly required).
  analyticsDomain: import.meta.env.VITE_ANALYTICS_DOMAIN ?? "",

  social: {
    LinkedIn: "https://www.linkedin.com/company/encytics",
    Twitter: "https://twitter.com/encytics",
    GitHub: "https://github.com/encytics",
    Medium: "https://medium.com/@encytics",
  } as Record<string, string>,
} as const;
