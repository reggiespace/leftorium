# Builds and serves the leftorium.ca frontend as a static site.
# Designed for Dokploy: point it at this Dockerfile in the repo root.
#
# VITE_STRAPI_URL is intentionally NOT a build ARG — Vite env vars are
# normally baked in at build time, which would mean rebuilding the image
# every time the Strapi URL changes. Instead docker-entrypoint.sh writes
# /usr/share/nginx/html/env-config.js from the container's real env vars
# at *startup*, and the frontend reads window.__ENV__ first (see
# services/strapiService.ts). Set VITE_STRAPI_URL as a normal Dokploy
# environment variable; no rebuild needed to change it.

FROM node:20-alpine AS build
WORKDIR /src
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM nginx:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/docker-entrypoint.sh /docker-entrypoint.d/40-leftorium-env.sh
RUN chmod +x /docker-entrypoint.d/40-leftorium-env.sh
COPY --from=build /src/dist /usr/share/nginx/html

EXPOSE 80
# Uses the base nginx image's own entrypoint, which runs every script in
# /docker-entrypoint.d/ (ours included) before starting nginx.
