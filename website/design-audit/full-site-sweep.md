# Full-site pixel-perfect sweep

Reference comps: user-attached PNGs in Cursor + `EU4Youth/UI Web Design/` PDFs.

Scaling: `1rem = 10 design px`, desktop `--zoom: 0.7`.

## Route checklist

| Route | Comp | Status | Notes |
|-------|------|--------|-------|
| `/` Accueil | Accueil_01–04 | **In progress** | Stories grid, newsletter measured type, publications CTA chevron fixed |
| `/programme/a-propos` | a_propos_01–04 | Pending | Map card footer deviation |
| `/carte` | carte_v2_01–07 | **Fixed** | Desktop results catalogue restored |
| `/contact` | Contact_01–04 | **Partial** | Submit hover fixed; wire banner still dev-only |
| `/actualites` | Actualité_01–03 | **Partial** | Quick-type chips, type badge, sort bar visible on desktop |
| `/opportunites` | opportunités_01–03 | **Partial** | Quick-type chips, status badge, sort bar on desktop |
| `/publications` | Publications_01–02 | **Partial** | Filters, quick chips, card meta visible on desktop |
| `/glossaire` | Glossaire_01–02 | Pending | Editorial density |
| `/projets/:slug` | projet_01–02 + banners | Pending | Per-project hero banners |
| `/actualites/:slug` etc. | Article detail | OK | Sidebar restored |
| `/agenda` | — | Pending | Hero intro + filter parity |
| `/stories`, `/partenaires`, etc. | — | Functional | No full comp |

## Fixes applied (this sweep)

1. **Carte** — `map-results` + filter head visible on desktop (`carte.css`).
2. **Actualités** — removed desktop hiding of results head, active filters, quick chips; added type quick nav + card type label.
3. **Opportunités** — removed desktop hiding of search, sort bar, quick chips; added type quick nav + status badge.
4. **Publications** — removed desktop hiding of search, filters toolbar, quick chips, card metadata.
5. **Home** — stories column width pinned to comp (103.16rem); newsletter type reverted to measured base; publications CTA chevron added.
6. **Contact** — duplicate submit hover rule removed (blue hover now works).

## Still to verify page-by-page

- Hero alignment under PROJETS tab (all pages)
- Nav dropdown states (Accueil_02–04)
- Projet detail pages vs `projet_banner_*.png`
- À propos long scroll vs a_propos comp
- Programme pages: objectifs, financement, gouvernance
- Mobile reflow @max-width 1099px after desktop fixes

## Deploy

After each batch: `npm run build` in `EU4Youth/eu4youth-website`, mirror to `website/dist/`, hard-refresh preprod.
