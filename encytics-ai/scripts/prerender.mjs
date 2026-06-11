// Build-time pre-rendering of public routes.
//
// Runs after `vite build` (see the "build" script in package.json). For each
// public route it writes a real static dist/<route>/index.html whose
// <title>, description, canonical and Open Graph / Twitter tags are correct
// for that page — so link-preview bots (LinkedIn, X, Slack) and crawlers get
// accurate per-page metadata without executing any JavaScript.
//
// Static hosts (Netlify/Vercel) serve these real files first; the SPA
// fallback in public/_redirects only catches paths that have no file.
//
// Note: this snapshots per-route METADATA. Full-content static generation
// (rendering the page body to HTML) is the audit's R4 "full version" —
// tracked for a later batch (Astro/SSG migration).

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");

// Keep in sync with src/config/site.ts and each page's <Seo …/> props.
const DOMAIN = "https://encytics.ai";
const SHORT_NAME = "encytics.ai";
const DEFAULT_DESC =
  "Transform raw data into intelligence. Expert data engineering, AI/ML, analytics, and strategy consulting for enterprise teams.";

const routes = [
  {
    path: "/case-studies",
    title: `Case Studies — ${SHORT_NAME}`,
    description:
      "Real outcomes from our data engineering, AI, and analytics engagements.",
  },
  {
    path: "/privacy",
    title: `Privacy Policy — ${SHORT_NAME}`,
    description: DEFAULT_DESC,
  },
  {
    path: "/terms",
    title: `Terms of Service — ${SHORT_NAME}`,
    description: DEFAULT_DESC,
  },
];

const escapeAttr = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

function setMeta(html, attr, key, value) {
  const re = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`);
  if (!re.test(html)) {
    throw new Error(`prerender: <meta ${attr}="${key}"> not found in dist/index.html`);
  }
  return html.replace(re, `$1${escapeAttr(value)}$2`);
}

const template = readFileSync(join(dist, "index.html"), "utf8");

for (const route of routes) {
  const url = `${DOMAIN}${route.path}`;
  let html = template;

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${route.title.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</title>`);
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  html = setMeta(html, "name", "description", route.description);
  html = setMeta(html, "property", "og:title", route.title);
  html = setMeta(html, "property", "og:description", route.description);
  html = setMeta(html, "property", "og:url", url);
  html = setMeta(html, "name", "twitter:title", route.title);
  html = setMeta(html, "name", "twitter:description", route.description);

  const outDir = join(dist, ...route.path.split("/").filter(Boolean));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), html);
  console.log(`✓ prerendered ${route.path}/index.html`);
}

console.log(`✓ prerender complete (${routes.length} routes + / from base index.html)`);
