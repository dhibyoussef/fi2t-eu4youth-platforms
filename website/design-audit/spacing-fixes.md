# Spacing fixes

- Setup confirmed: PDF rendering via PyMuPDF and live browser verification available.
- Baseline target loaded from Actualité.pdf page 2 into design-audit/Actualite-page-2.png.
- First target: news/article detail layout on preprod.
- Baseline visual check captured from preprod article page: layout collapsed to a 163px justified text column with the sidebar hidden at desktop width.
- Applied hotfix override in dist/assets/index-Bk1XRgza.css to remove centered max-width, restore a two-column desktop article layout, and force left-aligned body/source copy.
- Root cause confirmed in source: `src/pages/content-detail.css` had a desktop (`min-width: 1100px`) rule for news detail that set `.content-detail--news .content-detail__related { display: none; }` and forced the layout to a single column.
- Fix applied properly in source: removed that desktop override so news detail keeps the sidebar visible and the 2-column grid (`grid-template-columns: minmax(0, 1fr) 48rem`) stays active on desktop.
- Rebuilt frontend and mirrored outputs into `website/dist/` (the folder used for preprod static hosting).
- Second global pass: removed the extra desktop `var(--canvas-offset)` / bleed-based gutter additions from `home.css`, `contact.css`, `glossaire.css`, `actualites.css`, `opportunites.css`, `publications.css`, `carte.css`, `projet.css`, and `content-detail.css`.
- Result: homepage hero and bands, map hero/dashboard, contact hero/form, actualités listing, publications listing, project banners, and article/detail pages now use the design gutter measurements directly instead of adding a second centering margin on top of the 70% scaled canvas.
- Visual verification on local preview (`http://localhost:3012/eu4youth/`) completed for `Accueil`, `Carte`, `Contact`, `Actualités`, `Publications & Ressources`, and `Jeun'ESS` project page.
- Homepage SIX PROJETS logos: removed the desktop grid override on `.band--projets .logos` that set `position: relative` on list items and broke the measured absolute logo cells (logos were pushed off-screen / clipped).
- Homepage streams band: fixed column 1 x coordinates in `home.ts` (values were 10× too small); added a desktop 3-column CSS grid so grey plates and cards span the full canvas width.
- Rebuilt to `index-BOx1-gDe.css` / `index-C86gpV9k.js` and mirrored into `website/dist/`.
- Global gutter pass: removed remaining `calc(var(--canvas-offset) + …)` double margins on agenda, partenaires, stories, coin-media, mecanismes, legal, eu-tunisie, plan-du-site, contact hero, publications hero, header search panel.
- Homepage SIX PROJETS: restored dashed decorative disc (bottom-right bleed) from Accueil comp.
- Added redirects so common URLs no longer 404: `/programme`, `/evenements`, `/news`, `/medias`, `/ressources`, `/about`.
- Added `website/design-audit/pixel-perfect-checklist.md` mapping every page to its PDF comp and measurements.
- Latest build: `index-Sxr56TJG.css` / `index-BV-CK0-n.js` mirrored to `website/dist/`.
- **Critical fix:** removed desktop CSS grid overrides on `.band--projets`, `.band--stories`, and `.band--newsletter` that were drifting elements 15–30 design px off Accueil.pdf. Restored measured absolute coordinates; Playwright verification at 1920px now passes within ±3 design px for hero, logos, stories button, newsletter, and publications bands.

