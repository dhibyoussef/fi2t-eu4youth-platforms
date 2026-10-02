/**
 * Cross-locale layout audit: FR / EN / AR on every public route.
 * Flags RTL problems without changing FR/EN comps.
 * Run: node tools/site-locale-layout-audit.mjs
 */
import { chromium } from 'playwright'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'tools', '_site-locale-audit')
mkdirSync(outDir, { recursive: true })

const BASE = process.env.SITE_URL || 'http://127.0.0.1:3030'
const LOCALES = ['fr', 'en', 'ar']
const ROUTES = [
  '/',
  '/programme/a-propos',
  '/programme/objectifs',
  '/programme/financement',
  '/programme/gouvernance',
  '/projets',
  '/projets/fe3ila',
  '/projets/go4youth',
  '/projets/jeuness',
  '/projets/irada4youth',
  '/projets/swafy',
  '/carte',
  '/opportunites',
  '/actualites',
  '/publications',
  '/glossaire',
  '/contact',
  '/agenda',
  '/partenaires',
  '/mecanismes-appui',
  '/stories',
  '/eu-en-tunisie',
  '/coin-media',
  '/plan-du-site',
  '/recherche',
  '/confidentialite',
  '/mentions-legales',
  '/accessibilite',
  '/cookies',
]

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await context.newPage()
const findings = []

function add(row) {
  findings.push(row)
  const mark = row.severity === 'ok' ? 'OK' : row.severity.toUpperCase()
  console.log(`[${mark}] ${row.locale} ${row.route} — ${row.issue}`)
}

for (const locale of LOCALES) {
  for (const route of ROUTES) {
    const url = `${BASE}${route}?locale=${locale}`
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 })
      await page.waitForTimeout(650)

      const report = await page.evaluate((loc) => {
        const issues = []
        const html = document.documentElement
        const dir = html.getAttribute('dir') || 'ltr'
        const expectRtl = loc === 'ar'
        if (expectRtl && dir !== 'rtl') issues.push({ severity: 'fail', issue: `dir=${dir} expected rtl` })
        if (!expectRtl && dir === 'rtl') issues.push({ severity: 'fail', issue: `dir=rtl unexpected for ${loc}` })

        const bodyFont = getComputedStyle(document.body).fontFamily
        if (expectRtl && !/changa/i.test(bodyFont)) {
          issues.push({ severity: 'warn', issue: `body font missing Changa: ${bodyFont}` })
        }
        if (!expectRtl && !/poppins/i.test(bodyFont)) {
          issues.push({ severity: 'warn', issue: `body font missing Poppins: ${bodyFont}` })
        }

        const overflowX = Math.max(
          document.documentElement.scrollWidth - window.innerWidth,
          document.body.scrollWidth - window.innerWidth,
        )
        if (overflowX > 12) issues.push({ severity: 'fail', issue: `horizontal overflow ${overflowX}px` })

        // Header collision: logo and flags should not overlap
        const logo = document.querySelector('.header__logo')
        const flags = document.querySelector('.header__inst .funder-flags')
        if (logo && flags) {
          const a = logo.getBoundingClientRect()
          const b = flags.getBoundingClientRect()
          const overlap = !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom)
          if (overlap) issues.push({ severity: 'fail', issue: 'header logo overlaps funder flags' })
          // Logo should stay on left, flags on right for all locales (institutional bar)
          if (a.left > window.innerWidth * 0.4) {
            issues.push({ severity: 'warn', issue: `header logo not on left (left=${Math.round(a.left)})` })
          }
          if (b.right < window.innerWidth * 0.55) {
            issues.push({ severity: 'warn', issue: `header flags not on right (right=${Math.round(window.innerWidth - b.right)})` })
          }
        }

        if (expectRtl) {
          // Titles / heroes that are still physically left-anchored with left-align
          const suspects = [
            ...document.querySelectorAll(
              'h1, h2, .ap-hero__title, .ps-hero h1, .obj-hero h1, .gov-hero h1, .fin-hero h1, .partners-hero h1, .mechanisms-hero h1, .news-hero h1, .op-hero h1, .agenda-hero h1, .pub-hero h1, .gloss-hero h1, .stories-hero h1, .media-hero h1, .contact-hero h1, .eu-tn-hero h1, .map-hero h1, .legal-hero h1, .plan-hero h1, .search-page__hero h1, .pj-hero__title',
            ),
          ].slice(0, 12)

          for (const el of suspects) {
            const r = el.getBoundingClientRect()
            if (r.width < 40 || r.height < 10 || r.bottom < 0 || r.top > window.innerHeight) continue
            const cs = getComputedStyle(el)
            const text = (el.innerText || '').trim()
            if (!text || text.length < 2) continue
            const hasArabic = /[\u0600-\u06FF]/.test(text)
            // Physical left lock with text still hugging left edge of viewport
            if (hasArabic && r.left < 80 && cs.textAlign === 'left') {
              issues.push({
                severity: 'warn',
                issue: `Arabic title left-locked: ${el.className || el.tagName} "${text.slice(0, 36)}"`,
              })
            }
          }

          // Footer column pairing: programme column should contain programme-ish links
          const prog = document.querySelector('.footer__col--programme')
          if (prog) {
            const h = (prog.querySelector('h2')?.innerText || '').trim()
            const links = [...prog.querySelectorAll('a')].map((a) => a.textContent.trim()).join(' | ')
            if (/برنامج|programme/i.test(h) && /خصوص|privacy|كوكيز|cookie/i.test(links) && !/حول|propos|حوكمة|gouvern/i.test(links)) {
              issues.push({ severity: 'fail', issue: `footer programme column has wrong links: ${links.slice(0, 80)}` })
            }
          }

          // Contact / form fields should start-align
          const input = document.querySelector('form input, .contact-field input')
          if (input) {
            const align = getComputedStyle(input).textAlign
            if (align === 'left') {
              issues.push({ severity: 'warn', issue: `form input text-align=left under RTL` })
            }
          }
        }

        // FR/EN regression: hero copy should not be forced to the right
        if (!expectRtl) {
          const hero = document.querySelector('.hero__copy')
          if (hero) {
            const r = hero.getBoundingClientRect()
            if (r.left > window.innerWidth * 0.45) {
              issues.push({ severity: 'fail', issue: `LTR hero pushed right (left=${Math.round(r.left)})` })
            }
          }
        }

        if (!issues.length) issues.push({ severity: 'ok', issue: `dir=${dir}; overflow ok` })
        return issues
      }, locale)

      for (const item of report) {
        add({ locale, route, severity: item.severity, issue: item.issue })
      }
    } catch (err) {
      add({ locale, route, severity: 'fail', issue: String(err.message || err) })
    }
  }
}

await browser.close()

const fails = findings.filter((f) => f.severity === 'fail')
const warns = findings.filter((f) => f.severity === 'warn')
writeFileSync(
  join(outDir, 'report.json'),
  JSON.stringify({ fails: fails.length, warns: warns.length, findings }, null, 2),
  'utf8',
)
console.log(`\nFails: ${fails.length} | Warns: ${warns.length} | Total rows: ${findings.length}`)
console.log(`Report: ${outDir}`)
process.exit(fails.length ? 1 : 0)
