// Static (non-product) assets, e.g. the landing hero photo, live in the
// same Garage S3 bucket as Strapi-managed product images:
// https://storage.reggiespace.ca/health/leftorium/... — see DEPLOYMENT.md.
// Runtime-configurable via window.__ENV__ (see docker/docker-entrypoint.sh)
// so a photo can be added without rebuilding the image, same pattern as
// VITE_STRAPI_URL in services/strapiService.ts.
export const HERO_IMAGE_URL: string | undefined =
  (typeof window !== 'undefined' && (window as any).__ENV__?.VITE_HERO_IMAGE_URL) ||
  import.meta.env.VITE_HERO_IMAGE_URL ||
  undefined;
