# Roadmap

## Shipped

- Landing, catalogue (filter/sort), product detail, submit-a-product, about, nav/footer shell
- Lefty/Righty toggle + mirror-the-site easter egg
- Decorative, local-only likes (`localStorage`, never persisted to a backend)
- Read-only, admin-curated comments
- Strapi-backed product catalogue with a static fallback so the site never depends on the backend being up

## Deliberately postponed

Everything below needs a registration story that doesn't exist yet — no
accounts means no reliable way to dedupe a vote or attribute a comment to a
person. Revisit if/when that's built:

- Persisted, one-per-person like/vote counts
- Public comment submission
- Star ratings
- Accounts, profiles, bookmarking, badges, forums, member directory — the
  original wide community roadmap this repo started with. Out of scope for
  the awareness-project/curio-shop direction the site settled on during
  design (an "an awareness project, disguised as a shop" catalogue, not a
  community platform); revisit only if the site's goals change.
