# leftorium.ca

> Everything here is built the other way round.

Leftorium is a fictional awareness project disguised as a shop: a catalogue
of left-handed tools — some real, some invented — that calls attention to
how much of the physical world defaults to right-handed. Nothing is for
sale. This build implements a design produced in Claude Design (Nocturne
design system: dark blurple, outlined buttons, quiet badges) on top of this
repo's existing React/Vite/Strapi scaffold.

## Tech stack

- React 19 + TypeScript + Vite, `HashRouter` (so a static host needs no
  server-side rewrite rules)
- Tailwind CSS v4, hand-ported Nocturne design tokens — see `globals.css` /
  `tailwind.config.ts`
- Strapi 5 as the (optional) content backend — see [STRAPI_SETUP.md](STRAPI_SETUP.md)
  and [`/strapi-schema`](strapi-schema). The site works with zero backend:
  it falls back to the 12 seed products in `mockData.ts`.

## What's implemented

All six sections from the design: landing (hero, most-viewed shelf, stats
band), catalogue (real/invented filter, views/likes/A–Z sort), product
detail (decorative local-only likes, read-only comments), submit-a-product
(real find vs. Idea Lab pitch, awaiting-approval state), about, and the
nav/footer shell — including both easter eggs (the Lefty/Righty toggle and
the "mirror the whole site" footer link).

**Deliberately not implemented yet:** user registration/login, and anything
that depends on it (persisted like/vote counts, public comment submission,
star ratings). There's no way to count likes or attribute comments
per-person without accounts, so for now likes are decorative and
per-browser only (`lib/useLikes.ts`, via `localStorage`, never sent to the
backend), and comments are read-only, admin-curated flavor text. Revisit
once there's a registration story.

## Getting started

```bash
pnpm install
cp .env.sample .env.local   # set VITE_STRAPI_URL if you have a Strapi instance
pnpm dev
```

## Deployment

See [`/docker`](docker) and [`DEPLOYMENT.md`](DEPLOYMENT.md) at the repo
root for the Dokploy setup (Dockerfile + nginx + runtime env injection, so
`VITE_STRAPI_URL` and friends can change without rebuilding the image), and
[`/strapi-config`](strapi-config) for pointing Strapi's media library at
Garage S3 instead of local disk.
