/**
 * Locale / RTL / type visual audit — FR + EN + AR across key routes.
 * Run: node tools/locale-rtl-audit.mjs
 * Needs site on :3030 (and ideally API on :8040).
 */
import { chromium } from 'playwright'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'tools', '_locale-rtl-audit')
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
]

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]

const browser = await chromium.launch({ headless: true })
const findings = []

function push(row) {
  findings.push(row)
  const mark = row.ok ? 'OK' : 'FAIL'
  console.log(`[${mark}] ${row.locale} ${row.viewport} ${row.route} — ${row.note}`)
}

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    locale: 'fr-FR',
  })
  const page = await context.newPage()

  for (const locale of LOCALES) {
    for (const route of ROUTES) {
      const url = `${BASE}${route}${route.includes('?') ? '&' : '?'}locale=${locale}`
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 })
        await page.waitForTimeout(700)

        const metrics = await page.evaluate(() => {
          const html = document.documentElement
          const body = document.body
          const cs = getComputedStyle(body)
          const h1 = document.querySelector('h1, .hero__title, .ap-hero__title, .stub__title')
          const h1cs = h1 ? getComputedStyle(h1) : null
          const overflowX = Math.max(
            document.documentElement.scrollWidth - window.innerWidth,
            document.body.scrollWidth - window.innerWidth,
          )
          const sample = (document.querySelector('main') || body).innerText.slice(0, 180)
          return {
            dir: html.getAttribute('dir'),
            lang: html.getAttribute('lang'),
            bodyFont: cs.fontFamily,
            bodySize: parseFloat(cs.fontSize),
            bodyAlign: cs.textAlign,
            h1Font: h1cs?.fontFamily || null,
            h1Size: h1cs ? parseFloat(h1cs.fontSize) : null,
            overflowX,
            sample,
          }
        })

        const expectRtl = locale === 'ar'
        const dirOk = expectRtl ? metrics.dir === 'rtl' : metrics.dir === 'ltr'
        const fontOk = expectRtl
          ? /changa/i.test(metrics.bodyFont)
          : /poppins/i.test(metrics.bodyFont)
        const overflowOk = metrics.overflowX <= 8
        const sizeOk = metrics.bodySize >= (vp.name === 'mobile' ? 12 : 10)

        const ok = dirOk && fontOk && overflowOk && sizeOk
        const notes = []
        if (!dirOk) notes.push(`dir=${metrics.dir}`)
        if (!fontOk) notes.push(`font=${metrics.bodyFont}`)
        if (!overflowOk) notes.push(`overflowX=${metrics.overflowX}`)
        if (!sizeOk) notes.push(`bodySize=${metrics.bodySize}`)
        if (!notes.length) notes.push(`dir=${metrics.dir} body=${metrics.bodySize.toFixed(1)}px h1=${metrics.h1Size?.toFixed?.(1) || '—'}px`)

        push({
          ok,
          locale,
          viewport: vp.name,
          route,
          note: notes.join('; '),
          metrics,
        })

        // Screenshot key pages in AR desktop for visual review
        if (locale === 'ar' && vp.name === 'desktop' && ['/', '/programme/a-propos', '/projets/fe3ila', '/eu-en-tunisie', '/contact'].includes(route)) {
          const safe = route.replace(/\W+/g, '_') || 'home'
          await page.screenshot({
            path: join(outDir, `ar_${safe}.png`),
            fullPage: false,
          })
        }
      } catch (err) {
        push({
          ok: false,
          locale,
          viewport: vp.name,
          route,
          note: String(err.message || err),
          metrics: null,
        })
      }
    }
  }

  await context.close()
}

await browser.close()

const failed = findings.filter((f) => !f.ok)
writeFileSync(join(outDir, 'report.json'), JSON.stringify({ failed: failed.length, findings }, null, 2))
console.log(`\nDone. ${failed.length} failures / ${findings.length} checks. Report: ${outDir}`)
process.exit(failed.length ? 1 : 0)
