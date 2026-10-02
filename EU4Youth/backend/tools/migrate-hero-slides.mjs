/** Sync hero.image + slide2–5 into hero.slides JSON. */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const storePath = path.join(__dirname, '../data/store.json')

const LABELS = ['Photo 1', 'Photo 2', 'Photo 3', 'Photo 4', 'Photo 5']
const KEYS = ['image', 'slide2', 'slide3', 'slide4', 'slide5']
const DEFAULTS = [
  '/img/home-hero-v2.webp',
  '/img/apropos-hero-v2.webp',
  '/img/apropos-atelier.webp',
  '/img/art-femme-saut.webp',
  '/img/home-stories-v2.webp',
]

const store = JSON.parse(fs.readFileSync(storePath, 'utf8'))
const blocks = store.content.blocks

function readHero(key) {
  return blocks.find(
    (row) => row.page === 'home' && row.section === 'hero' && row.key === key && row.locale === '_all',
  )?.value
}

const slides = KEYS.map((key, index) => ({
  label: LABELS[index],
  image: readHero(key) || DEFAULTS[index],
}))

const payload = JSON.stringify(slides, null, 2)
const existing = blocks.filter((row) => row.page === 'home' && row.section === 'hero' && row.key === 'slides')

if (existing.length) {
  for (const row of existing) row.value = payload
} else {
  const nextId = Math.max(0, ...blocks.map((row) => row.id || 0)) + 1
  for (const [index, locale] of ['fr', 'en', 'ar'].entries()) {
    blocks.push({
      id: nextId + index,
      page: 'home',
      section: 'hero',
      key: 'slides',
      locale,
      type: 'json',
      value: payload,
      label: 'Photographies du bandeau',
      sort_order: 0,
    })
  }
}

const sections = store.content.sections
const euSections = sections.filter((row) => row.page === 'eu-en-tunisie')
const hasThemes = euSections.some((row) => row.slug === 'themes')
const hasExplore = euSections.some((row) => row.slug === 'explore')
const maxSort = Math.max(-1, ...euSections.map((row) => row.sort_order ?? 0))

if (!hasThemes) {
  sections.push({
    page: 'eu-en-tunisie',
    slug: 'themes',
    title: 'Thématiques',
    pattern: 'cards',
    sort_order: maxSort + 1,
  })
}
if (!hasExplore) {
  sections.push({
    page: 'eu-en-tunisie',
    slug: 'explore',
    title: 'Explorer',
    pattern: 'cta',
    sort_order: maxSort + 2,
  })
}

fs.writeFileSync(storePath, `${JSON.stringify(store, null, 2)}\n`)
console.log('hero.slides:', slides.map((row) => row.image).join(' | '))
