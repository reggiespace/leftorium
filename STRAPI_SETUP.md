# Strapi setup for leftorium.ca

The frontend talks to a Strapi 5 instance (e.g. `https://strapi.reggiespace.ca`)
for three collections. Content-type definitions you can drop straight into a
Strapi project's `src/api/` are in [`/strapi-schema`](strapi-schema) at the
repo root — copy each `leftorium-product/`, `leftorium-suggestion/` and
`leftorium-comment/` folder in there, restart Strapi, and the collections
appear in the admin. If you'd rather build them by hand, use the field lists
below (Content-Type Builder → Create new collection type).

If Strapi is unreachable or has no published products yet, the site falls
back to the 12 seed products baked into `mockData.ts` — the catalogue is
never empty either way.

## 1. Leftorium Product

The catalogue itself.

| Field | Type | Notes |
| --- | --- | --- |
| `title` | Text | required |
| `slug` | UID | target: `title` |
| `category` | Enumeration | `Kitchen`, `Office`, `Workshop`, `Sport`, `Idea Lab` |
| `is_real` | Boolean | true = REAL badge, false = AI badge |
| `price` | Text | e.g. `$12.99` or `Concept` |
| `blurb` | Text | short card copy |
| `description` | Text | long detail-page copy |
| `features` | JSON | array of short strings |
| `cost_note` | Text | answers "the right-handed version costs a lefty ___" |
| `image` | Media (single, images) | optional — falls back to `img_label` placeholder |
| `img_label` | Text | placeholder caption until a real image is uploaded |
| `likes_seed` | Number (integer) | starting like count (real likes are local-only, see below) |
| `views_seed` | Number (integer) | starting view count |

**Publish** each product — Strapi's API only returns published entries by
default, and this content type has Draft & Publish on.

### Permissions (Settings → Users & Permissions → Roles → Public)
Check `find` and `findOne` on **Leftorium-product** so the catalogue loads
without login. Nothing needs `create` here — new products only enter this
collection when you manually promote an approved **Leftorium Suggestion**.

## 2. Leftorium Suggestion

What the "Submit a product" page posts to — both tabs (a real find, or an
Idea Lab pitch) land here as unpublished entries for you to review.

| Field | Type | Notes |
| --- | --- | --- |
| `title` | Text | required |
| `category` | Enumeration | same list as above |
| `is_real` | Boolean | which tab it was submitted from |
| `source_or_look` | Text | "where to find it" (real) or "what it looks like" (fake) |
| `reasoning` | Text | "why a right-handed person never noticed" |

### Permissions (Public role)
Check **only** `create` on **Leftorium-suggestion**. Do **not** grant `find`/
`findOne` publicly — the submission queue counts shown on the Submit page
are static copy, not a live read of this table, so there's no reason to
expose it. Review submissions in the admin; when you approve one, create the
matching **Leftorium Product** by hand (or generate the AI art first, then
create it) and publish that.

## 3. Leftorium Comment

Read-only flavor comments shown on a product's detail page. There is
deliberately no public comment form (no registration system exists yet to
attribute comments to anyone) — you write these yourself in the admin to
seed a page.

| Field | Type | Notes |
| --- | --- | --- |
| `author_name` | Text | display handle |
| `text` | Text | the comment |
| `product` | Relation | many-to-one → Leftorium Product |

### Permissions (Public role)
Check `find` and `findOne` only. Never grant `create` — this collection is
admin-authored. If a product has no comments here, the page falls back to
generic seed comments from `mockData.ts`.

## Image storage (Garage S3)

Product photos/renders should be uploaded through Strapi's Media Library
(the `image` field on Leftorium Product), but **not** stored on local
disk — Dokploy containers are ephemeral, so a redeploy would silently
delete every uploaded photo. Point Strapi's upload provider at the Garage
bucket instead: copy [`/strapi-config`](strapi-config)'s `config/plugins.js`
and `config/middlewares.js` into the Strapi project (merge if it already
has custom middleware config), `npm install @strapi/provider-upload-aws-s3`
there, and set these env vars on the Strapi deployment:

```
S3_ENDPOINT=https://storage.reggiespace.ca
S3_BASE_URL=https://storage.reggiespace.ca/health
S3_BUCKET=health
S3_ROOT_PATH=leftorium
S3_REGION=garage
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
```

`S3_BUCKET=health` / the `leftorium` prefix is an assumption from the
bucket URL you gave (`storage.reggiespace.ca/health`) — correct it if
"health" is actually a path, not the bucket name, or if you'd rather not
share that bucket across projects. Never commit the access key/secret;
set them as Strapi's own environment variables in Dokploy.

Once configured, uploaded images just work on the frontend with no further
changes — `services/strapiService.ts` reads the media relation's URL
straight off the product, and `components/ImgPlaceholder.tsx` renders a
real `<img>` when it's present (falling back to the labelled placeholder
box for anything not yet photographed, or if an image URL 404s).

## Environment

The frontend reads the Strapi URL from `window.__ENV__.VITE_STRAPI_URL`
(injected at container start, see `docker/docker-entrypoint.sh`) or, in
local dev, from `.env.local`:

```
VITE_STRAPI_URL=http://localhost:1337
# VITE_STRAPI_TOKEN=only-needed-if-you-lock-down-the-Public-role-instead
# VITE_HERO_IMAGE_URL=https://storage.reggiespace.ca/health/leftorium/hero.jpg
```
