# Developer Onboarding & Local Environment

How a new developer goes from `git clone` to a fully working local stack —
site, database, auth emulator, admin studio — with **no ZIP files, no shared
asset folders, and no production credentials**.

---

## 1. Prerequisites (one-time, any OS)

| Tool | Why | Install |
|---|---|---|
| Git | clone/push | https://git-scm.com |
| Docker Desktop (or Docker Engine on Linux) | runs the frontend container **and** the Supabase local stack | https://docs.docker.com/get-docker/ |
| Supabase CLI | local Postgres + auth + Studio, migration tooling | https://supabase.com/docs/guides/local-development/cli/getting-started (Windows: `scoop install supabase`, macOS: `brew install supabase/tap/supabase`) |
| Node 24 (optional) | only needed to run Vite *outside* Docker | https://nodejs.org |

## 2. First boot (every new machine)

```bash
git clone https://github.com/snigdhrf/encytics_v0.git
cd encytics_v0/encytics-ai

# 1. Boot the local database stack (Postgres, REST API, auth, Studio).
#    Applies every file in supabase/migrations/ in order, then supabase/seed.sql.
supabase start

# 2. Bridge the CLI's machine-generated API key into Vite's env
#    (writes .env.development.local — gitignored).
npm run setup:local        # needs Node; OR copy the key from `supabase status`
                           # into encytics-ai/.env.development.local by hand

# 3. Boot the frontend (from the repository root).
cd ..
docker compose up
```

Open:

| URL | What |
|---|---|
| http://localhost:5173 | the site, hot reload on every save |
| http://127.0.0.1:54323 | Supabase Studio — browse/edit the local DB |

The local DB starts with the 4 launch case studies (seeded by migration 0001)
**plus** a draft and a pending fixture (seeded by `supabase/seed.sql`,
local-only) so the Content Studio review workflow is testable immediately.

No production URL, key, or dashboard access is involved anywhere above. The
only people who need production credentials are the maintainers who deploy.

## 3. Daily workflow

```bash
docker compose up          # start frontend (Ctrl-C stops it)
supabase start             # start DB stack (idempotent; survives reboots via Docker)
supabase stop              # stop DB stack, data is preserved
supabase db reset          # nuke + re-apply all migrations + seed (clean slate)
```

Code changes hot-reload through the bind mount. Dependency changes
(`package.json`) need a rebuild: `docker compose up --build`.

Prefer running Node directly? `npm install && npm run dev` inside
`encytics-ai/` works identically — Docker is the *standard* path, not the
only one.

## 4. Changing the database schema

Migrations are append-only files in `encytics-ai/supabase/migrations/`,
applied in filename order. **Never edit a migration that has been pushed.**

```bash
cd encytics-ai
supabase migration new add_profiles_table   # creates a timestamped empty file
# ...write SQL in the new file...
supabase db reset                           # prove the full chain applies cleanly
```

Commit the migration file with the code that uses it — reviewers see schema
and behavior in one PR. A maintainer applies it to production with
`supabase db push` (after `supabase link`) or via the dashboard SQL Editor.

Seed policy:
- **Launch/production content** → belongs in a migration (like the 4 studies
  in `0001`), so production activation produces it.
- **Dev-only fixtures** → `supabase/seed.sql`, which production never runs.

## 5. File tree (infrastructure view)

```
encytics_v0/                        ← git root, clone this
├── docker-compose.yml              ← `docker compose up` = frontend dev server
├── DEVELOPMENT.md                  ← this file
└── encytics-ai/                    ← the application (Netlify base dir)
    ├── Dockerfile                  ← dev / build / preview targets
    ├── .dockerignore
    ├── .env.example                ← documents every env var (production shape)
    ├── .env.development            ← committed dev defaults (non-secret)
    ├── .env.development.local      ← per-machine Supabase key (GITIGNORED,
    │                                  written by `npm run setup:local`)
    ├── package.json                ← scripts: dev / build / lint / setup:local
    ├── scripts/
    │   ├── prerender.mjs           ← build-time static HTML for sub-pages
    │   └── setup-local-env.mjs     ← supabase status → .env.development.local
    ├── src/                        ← React app
    ├── public/                     ← static assets + _headers (CSP)
    └── supabase/
        ├── config.toml             ← local stack config (project_id, seed paths)
        ├── migrations/
        │   └── 0001_case_studies.sql   ← schema + triggers + RLS + launch seed
        └── seed.sql                ← local-only fixtures (draft/pending studies)
```

## 6. Systems diagram — local stack vs. production

```
LOCAL (every developer's machine)
┌─────────────────────────────────────────────────────────────────┐
│ Browser ── http://localhost:5173                                 │
│    │                         │                                   │
│    │ page + HMR              │ REST/auth calls                   │
│    ▼                         ▼                                   │
│ ┌───────────────────┐   ┌──────────────────────────────────────┐ │
│ │ docker compose:    │   │ supabase start (own Docker stack):   │ │
│ │  web (node:24)     │   │  :54321 API gateway (REST + auth)    │ │
│ │  vite dev :5173    │   │  :54322 Postgres  ← migrations+seed  │ │
│ │  src/ bind-mounted │   │  :54323 Studio (DB admin UI)         │ │
│ └───────────────────┘   └──────────────────────────────────────┘ │
│   reads .env.development + .env.development.local                │
└─────────────────────────────────────────────────────────────────┘

PRODUCTION (unchanged by this setup)
┌─────────────────────────────────────────────────────────────────┐
│ Browser ── https://encytics.ai                                   │
│    │                         │                                   │
│    ▼                         ▼                                   │
│ Static host (CDN)        Supabase Cloud                          │
│  dist/ from `npm run     Postgres + RLS + auth                   │
│  build`, _headers CSP    (same migrations, no seed.sql)          │
│                                                                  │
│ Optional sidecars: Formspree (contact), Plausible (analytics),   │
│ Sentry (errors) — all opt-in via env vars                        │
└─────────────────────────────────────────────────────────────────┘
```

The local stack is a 1:1 mirror of production's *shape*: same bundle, same
schema (identical migrations), same auth API. What differs is only where it
runs and which env file feeds it.

## 7. Microservices — current position

**No. This project does not need microservices, and adopting them now would
be a net negative.** Recorded here so the question doesn't resurface every
quarter:

- The product is a content/marketing site with a small CMS. There is exactly
  one domain (case studies) and one team. Microservices solve *organizational*
  scaling problems — many teams shipping independently — that we do not have.
- Our "services" are already externalized to managed vendors: database/auth
  (Supabase), forms (Formspree), analytics (Plausible), error tracking
  (Sentry). The code we own is a single static bundle on a CDN, which scales
  horizontally by default and has no servers to decompose.
- The price of microservices (service discovery, versioned APIs, distributed
  tracing, N pipelines, integration environments) would exceed the entire
  current engineering budget of the site.

**The growth path that keeps this true:** when server-side logic becomes
necessary (e.g. the planned `/api/leads` endpoint with spam protection), it
ships as a **Supabase Edge Function** inside `supabase/functions/` —
independently deployable, testable via `supabase functions serve`, and zero
new infrastructure. If, much later, a genuinely separate product domain with
its own team appears, *that* is the moment to give it its own service — and
the containerized layout above means extracting it is adding a service to
`docker-compose.yml`, not a rewrite.

## 8. Ground rules

1. **Never** commit `.env`, `.env.*.local`, or any production key. The
   committed env files (`.env.example`, `.env.development`) are non-secret by
   construction.
2. **Never** distribute code as ZIPs or shared folders — if it isn't in git,
   it doesn't exist.
3. Schema changes ride in migrations, in the same PR as the code using them.
4. Branch from `Abhianv_branch`, PR back into it. Direct pushes are for
   maintainers only.
