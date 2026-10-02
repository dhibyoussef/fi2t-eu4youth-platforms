/**
 * Deep AR layout probe: find absolute/left-locked content blocks on each page.
 */
import { chromium } from 'playwright'
import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'tools', '_site-locale-audit')
mkdirSync(outDir, { recursive: true })
const BASE = 'http://127.0.0.1:3030'

const ROUTES = [
  '/',
  '/programme/a-propos',
  '/programme/objectifs',
  '/programme/financement',
  '/programme/gouvernance',
  '/projets',
  '/projets/fe3ila',
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
]

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const all = []

for (const route of ROUTES) {
  await page.goto(`${BASE}${route}?locale=ar`, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.waitForTimeout(800)
  const rows = await page.evaluate((routeName) => {
    const vw = window.innerWidth
    const out = []
    const nodes = [...document.querySelectorAll('h1, h2, h3, [class*="__title"], [class*="__subtitle"], [class*="__eyebrow"], [class*="hero"] p, .card__title, .stream__heading')]
    for (const el of nodes) {
      const r = el.getBoundingClientRect()
      if (r.width < 30 || r.height < 8) continue
      if (r.bottom < 40 || r.top > window.innerHeight + 200) continue
      const cs = getComputedStyle(el)
      const text = (el.innerText || '').replace(/\s+/g, ' ').trim()
      if (!text) continue
      const hasAr = /[\u0600-\u06FF]/.test(text)
      const pos = cs.position
      const left = parseFloat(cs.left)
      const right = parseFloat(cs.right)
      const mid = r.left + r.width / 2
      const hugsLeft = r.left < vw * 0.18 && mid < vw * 0.42
      const absoluteLeft =
        (pos === 'absolute' || pos === 'fixed') &&
        Number.isFinite(left) &&
        left >= 0 &&
        left < vw * 0.35 &&
        (!Number.isFinite(right) || right === 0 || cs.right === 'auto')

      if (hasAr && (hugsLeft || absoluteLeft) && cs.textAlign !== 'center') {
        out.push({
          route: routeName,
          cls: (el.className || el.tagName).toString().slice(0, 80),
          text: text.slice(0, 60),
          left: Math.round(r.left),
          mid: Math.round(mid),
          textAlign: cs.textAlign,
          position: pos,
          cssLeft: cs.left,
          reason: absoluteLeft ? 'absolute-left' : 'hugs-left',
        })
      }
    }
    return out
  }, route)
  all.push(...rows)
  console.log(`${route}: ${rows.length} AR left-risk blocks`)
  for (const r of rows.slice(0, 8)) {
    console.log(`  - [${r.reason}] ${r.cls} @${r.left}px "${r.text}"`)
  }
}

writeFileSync(join(outDir, 'ar-left-risks.json'), JSON.stringify(all, null, 2), 'utf8')
console.log(`\nTotal left-risk hits: ${all.length}`)
await browser.close()
