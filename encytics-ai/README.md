# Encytics AI — Marketing Site

A React 19 + TypeScript + Vite marketing site for the Encytics data consultancy,
with a built-in, role-based content workflow for case studies.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Configuration (optional)

Copy `.env.example` to `.env` and fill in what you need. Everything works
without these — the form falls back to a `mailto:` and analytics stays off.

| Variable | Purpose |
| --- | --- |
| `VITE_CONTACT_ENDPOINT` | Where the contact form POSTs (e.g. a [Formspree](https://formspree.io) endpoint). If empty, the form opens the visitor's mail client instead. |
| `VITE_ANALYTICS_DOMAIN` | Your domain for privacy-friendly [Plausible](https://plausible.io) analytics. Empty = analytics disabled. |

Business details (name, email, social links, domain) live in
[`src/config/site.ts`](src/config/site.ts) — edit them in one place.

## Routes

| Path | Page |
| --- | --- |
| `/` | Landing page (animated single-page scroll site) |
| `/case-studies` | All published case studies |
| `/case-studies/:slug` | Case study detail |
| `/privacy`, `/terms` | Legal pages |
| `/blog`, `/careers` | "Coming soon" placeholders |
| `/admin` | Content Studio (login required) |
| `*` | 404 |

## Content workflow (case studies)

Team members manage case studies at **`/admin`**. There are two roles:

- **Editor** — can create and edit case studies. New entries are saved as
  `pending` and do **not** appear on the public site.
- **Admin** (higher access) — can do everything an editor can, plus
  **publish/unpublish**, feature on the homepage, and delete. Only `published`
  case studies are shown publicly.

So the flow is: *editor drafts → admin reviews → admin publishes → live*.

Demo accounts (defined in [`src/lib/auth.tsx`](src/lib/auth.tsx) — **replace before launch**):

```
admin@encytics.ai  / admin123
editor@encytics.ai / editor123
```

### ⚠️ Current persistence is local, by design

To keep the site zero-infrastructure for now, content and login state are stored
in the **browser's localStorage** ([`src/lib/caseStudiesStore.ts`](src/lib/caseStudiesStore.ts),
[`src/lib/auth.tsx`](src/lib/auth.tsx)). That means:

- Content a team member creates is saved **only in their browser** — it is not
  shared across devices or visitors, and the auth is a client-side gate (not real
  security).
- This is perfect for demos and for proving out the workflow, but **not** for a
  multi-user production site.

**To productionize**, swap the two `lib/` modules for a real backend (e.g.
Supabase, Firebase, or your own API):

- `caseStudiesStore.ts` — replace the CRUD function bodies with `fetch()` calls.
  The public function signatures (`getPublished`, `create`, `setStatus`, …) and
  the React hooks stay the same, so no UI changes are needed.
- `auth.tsx` — replace `login()` with a real auth call that returns the
  `{ email, name, role }` user. The rest of the app already reads role from context.

## Deployment

Static SPA — deploy `dist/` to Netlify, Vercel, Cloudflare Pages, etc.
`public/_redirects` is included so client-side routes resolve on Netlify; on
Vercel add a rewrite of all paths to `/index.html`.

## Tech stack

React 19 · TypeScript · Vite · React Router · Tailwind CSS · Framer Motion · GSAP
