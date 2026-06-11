# syntax=docker/dockerfile:1
# ============================================================================
# Encytics frontend — React 19 / Vite 8.
#
# Targets:
#   dev     (default for docker-compose) — Vite dev server with HMR on :5173.
#   build   — type-checks, bundles, and prerenders into /app/dist.
#   preview — serves the production build on :4173 (smoke-testing only; real
#             hosting stays on the static host, which also applies public/_headers).
#
# Node 24 matches the version the project is developed and built against.
# Vite 8 requires Node 20.19+ / 22.12+.
# ============================================================================

FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- Development server (docker compose up) --------------------------------
FROM deps AS dev
COPY . .
EXPOSE 5173
# --host 0.0.0.0 so the dev server is reachable from outside the container.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173", "--strictPort"]

# ---- Production build -------------------------------------------------------
FROM deps AS build
COPY . .
RUN npm run build

# ---- Static preview of the production build ---------------------------------
FROM build AS preview
EXPOSE 4173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173", "--strictPort"]
