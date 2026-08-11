#!/bin/sh
# Runs at container start (nginx's own entrypoint sources every script in
# /docker-entrypoint.d/). Writes the current environment into a small JS
# file the frontend reads before it boots, so Dokploy env var changes take
# effect on the next container restart — no image rebuild required.
set -eu

OUT=/usr/share/nginx/html/env-config.js

{
  echo "window.__ENV__ = {"
  echo "  VITE_STRAPI_URL: \"${VITE_STRAPI_URL:-}\","
  echo "  VITE_STRAPI_TOKEN: \"${VITE_STRAPI_TOKEN:-}\","
  echo "  VITE_HERO_IMAGE_URL: \"${VITE_HERO_IMAGE_URL:-}\""
  echo "};"
} > "$OUT"
