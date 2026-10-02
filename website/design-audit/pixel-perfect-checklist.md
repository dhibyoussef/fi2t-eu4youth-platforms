# Pixel-perfect design audit checklist

Reference comps: `EU4Youth/UI Web Design/` PDFs + PNG exports attached in Cursor.

Scaling: `1rem = 10 design px`, root `font-size: calc(100vw / 192 * 0.7)` (70% desktop canvas).

## Global

| Item | Design source | Live implementation | Status |
|------|---------------|---------------------|--------|
| Header institutional bar | Accueil p1, y 0–127 | `header.css` 12.7rem | OK |
| Nav bar | Accueil p1, y 127–277 | `header.css` 15rem, `nav.ts` x coords | OK |
| Hero text left edge | x ≈ 278 (PROJETS tab) | `home.css` hero 27.8rem | OK |
| Desktop gutters (listing pages) | PDF content col ~70–134px | `--*-left/right: 7rem` | Fixed (no double canvas-offset) |
| Contact gutters | Contact.pdf | `--contact-left/right: 24rem` | OK |
| Publications gutters | Publications.pdf | `--pub-left/right: 13.4rem` | OK |
| Responsive reflow | — | `responsive.css` @max-width 1099px | OK |

## Accueil (home)

| Band | Design y range | Height (rem) | Key checks |
|------|----------------|--------------|------------|
| Hero | 277–1330 | 105.3 | Text at 27.8rem, 3 CTAs |
| Chiffres | 1330–2175 | 84.5 | KPI 6-col grid, grey plate |
| Six projets | 2175–3040 | 86.5 | 6 logos + dashed disc bottom-right |
| Map | 3040–4057 | 101.7 | Orange block + map art + disc |
| Streams | 4057–6010 | 195.3 | 3 equal columns, full width |
| Stories | 6010–7180 | 117 | Pink band, photo left, copy right |
| Publications | 7353–8600 | 124.7 | Teal band, books right |
| Newsletter | 8600–9480 | 88 | Form left, collage right |

## Inner pages with PDF comps

| Page | Comp | Gutters | Hero colour |
|------|------|---------|-------------|
| À propos | a propos.pdf | bleed + 7.7rem | Pink vision plate |
| Carte | carte v2.pdf | 7.5rem | Orange cartography |
| Contact | Contact.pdf | 24rem | Blue + portrait disc |
| Actualités | Actualité.pdf | 7rem | Orange |
| Opportunités | opportunités.pdf | 7rem | Pink |
| Publications | Page Publications & Ressources.pdf | 13.4rem | Teal + books 71rem |
| Glossaire | Glossaire.pdf | 7rem | Blue #0755ad |
| Projet detail | projet.pdf + projet banner.pdf | 7rem | Per-project banner |

## Routes (404 prevention)

| URL | Redirect / page |
|-----|-----------------|
| `/programme` | → `/programme/a-propos` |
| `/evenements` | → `/agenda` |
| `/news` | → `/actualites` |
| `/medias` | → `/coin-media` |
| `/ressources` | → `/publications` |
| `/about` | → `/programme/a-propos` |
| Invalid slugs | Redirect to listing (not 404) |
| Unknown paths | StubPage "Page introuvable" |

## Pending / placeholder (no full comp)

- `/confidentialite`, `/mentions-legales`, `/accessibilite`, `/cookies` — LegalPendingPage skeleton
- `/stories`, `/eu-en-tunisie`, `/partenaires`, `/mecanismes-appui` — functional pages, no dedicated PDF comp

## Verification command

```bash
cd EU4Youth/eu4youth-website
npm run build
# Preview: npx vite preview --port 3012
# Compare band-by-band: python tools/audit.py <screenshot> Accueil-p1 50 0.7
```
