# Deploying to Dokploy

This repo builds to a single static site (a Vite/React SPA) served by
nginx. There's no server-side rendering and no server-side routing
(`HashRouter` keeps all real routes client-side), so it's a plain static
deploy.

## Docker image

- `Dockerfile` (repo root) — multi-stage: `pnpm build`, then copies
  `dist/` into an `nginx:alpine` image.
- `docker/nginx.conf` — serves the SPA, never caches `env-config.js`.
- `docker/docker-entrypoint.sh` — runs at container start, writes the
  current `VITE_STRAPI_URL`/`VITE_STRAPI_TOKEN`/`VITE_HERO_IMAGE_URL` env
  vars into `env-config.js`. The frontend reads `window.__ENV__` before
  falling back to the Vite build-time env (see `services/strapiService.ts`,
  `lib/assets.ts`), so **changing these only needs a container restart,
  not a rebuild.**

## Dokploy setup

1. Create a new **Application** in Dokploy, pointed at this repo (branch
   `leftorium-nocturne-redesign`, or wherever you merge it).
2. Build type: **Dockerfile**, path `Dockerfile` (repo root), build
   context repo root.
3. Port: container listens on `80`.
4. Domain: attach whatever domain you want this on (e.g. a
   `leftorium.reggiespace.ca` subdomain, or a custom domain if you point
   `leftorium.ca`'s DNS at your Dokploy host) and let Dokploy issue the
   Let's Encrypt certificate.
5. Environment variables (Dokploy → Environment):
   - `VITE_STRAPI_URL` — e.g. `https://strapi.reggiespace.ca`
   - `VITE_STRAPI_TOKEN` — only needed if you lock down the Public role in
     Strapi instead of leaving `find`/`findOne` public (see
     `STRAPI_SETUP.md`)
   - `VITE_HERO_IMAGE_URL` — optional, e.g.
     `https://storage.reggiespace.ca/health/leftorium/hero.jpg`; leave
     unset to keep the landing page's placeholder box
6. Deploy. To pick up a changed env var later, just **restart** the
   container in Dokploy — no rebuild required.

## Strapi (admin)

Point Dokploy's Strapi/CMS app (`strapi.reggiespace.ca`) at a Postgres or
SQLite volume as usual; that's independent of this repo. Once it's up, add
the three content types described in `STRAPI_SETUP.md` — either by
copying the folders in `/strapi-schema` into the Strapi project's `src/api/`
and restarting it, or by recreating the fields via the Content-Type
Builder in the admin UI.

The site works with **no Strapi at all**: `mockData.ts` has all 12 seed
products, so the catalogue is never empty. Connect Strapi whenever you're
ready to manage content without redeploying the frontend.

### Image storage (Garage S3)

Configure Strapi's upload provider to write to the Garage bucket at
`https://storage.reggiespace.ca/health` instead of local disk — otherwise
uploaded product photos are lost on the Strapi container's next redeploy.
See the "Image storage" section of `STRAPI_SETUP.md` and
[`/strapi-config`](strapi-config) for the provider config to copy in and
the env vars it needs (`S3_ENDPOINT`, `S3_BUCKET`,
`S3_ACCESS_KEY_ID`/`S3_SECRET_ACCESS_KEY`, etc.) — set as Strapi's own
environment variables, never committed to this repo.
