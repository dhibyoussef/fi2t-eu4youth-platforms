import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const storePath = join(root, 'data', 'store.json')
const store = JSON.parse(readFileSync(storePath, 'utf8'))

const MAP = [
  { collection: 'news', page: 'actualites', fields: ['title', 'summary', 'type', 'dateLabel', 'source', 'body'] },
  {
    collection: 'opportunities',
    page: 'opportunites',
    fields: ['title', 'summary', 'type', 'status', 'deadlineLabel', 'periodLabel', 'source'],
  },
  {
    collection: 'publications',
    page: 'publications',
    fields: ['title', 'summary', 'type', 'dateLabel', 'format', 'language'],
  },
  { collection: 'events', page: 'agenda', fields: ['title', 'summary', 'type', 'dateLabel', 'location', 'format'] },
]

function cmsItems(page, locale) {
  const block = store.content.blocks.find(
    (b) => b.page === page && b.section === 'browser' && b.key === 'items' && b.locale === locale,
  )
  if (!block?.value) return []
  try {
    const parsed = JSON.parse(block.value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function asBag(current, fr, en, ar) {
  const bag = {
    fr: fr ?? '',
    en: en ?? '',
    ar: ar ?? '',
  }
  if (current && typeof current === 'object' && !Array.isArray(current)) {
    bag.fr = String(current.fr || bag.fr || '')
    bag.en = String(current.en || bag.en || '')
    bag.ar = String(current.ar || bag.ar || '')
  } else if (typeof current === 'string' && current.trim()) {
    bag.fr = bag.fr || current
  }
  if (!bag.en) bag.en = bag.fr
  if (!bag.ar) bag.ar = bag.fr
  return bag
}

function themesBag(current, frRow, enRow, arRow) {
  const frList = Array.isArray(current)
    ? current.map(String)
    : Array.isArray(frRow?.themes)
      ? frRow.themes.map(String)
      : String(frRow?.themes || '')
          .split(/[·,|]/)
          .map((s) => s.trim())
          .filter(Boolean)
  const enList = String(enRow?.themes || '')
    .split(/[·,|]/)
    .map((s) => s.trim())
    .filter(Boolean)
  const arList = String(arRow?.themes || '')
    .split(/[·,|]/)
    .map((s) => s.trim())
    .filter(Boolean)
  // Keep runtime shape as array for FR consumers; publicList only flattens object bags.
  // Store parallel localized arrays under themesLocalized; also upgrade themes when all locales known.
  return {
    themes: frList.length ? frList : current,
    themesLocalized: {
      fr: frList,
      en: enList.length ? enList : frList,
      ar: arList.length ? arList : frList,
    },
  }
}

let touched = 0
for (const { collection, page, fields } of MAP) {
  const list = store[collection]
  if (!Array.isArray(list) || !list.length) continue
  const frRows = cmsItems(page, 'fr')
  const enRows = cmsItems(page, 'en')
  const arRows = cmsItems(page, 'ar')
  if (!frRows.length && !enRows.length && !arRows.length) {
    console.log('skip', collection, '(no CMS browser.items)')
    continue
  }
  const index = (rows) => {
    const map = new Map()
    for (const row of rows) {
      const key = String(row.slug || row.id || '')
      if (key) map.set(key, row)
    }
    return map
  }
  const frMap = index(frRows)
  const enMap = index(enRows)
  const arMap = index(arRows)

  for (const item of list) {
    const key = String(item.slug || item.id || '')
    if (!key) continue
    const fr = frMap.get(key) || {}
    const en = enMap.get(key) || {}
    const ar = arMap.get(key) || {}
    let changed = false
    for (const field of fields) {
      const frVal = fr[field] != null ? String(fr[field]) : typeof item[field] === 'string' ? item[field] : item[field]?.fr
      const enVal = en[field] != null ? String(en[field]) : item[field]?.en
      const arVal = ar[field] != null ? String(ar[field]) : item[field]?.ar
      if (!frVal && !enVal && !arVal) continue
      const next = asBag(item[field], frVal, enVal, arVal)
      const prev = JSON.stringify(item[field] ?? null)
      const now = JSON.stringify(next)
      if (prev !== now) {
        item[field] = next
        changed = true
      }
    }
    if (fr.themes != null || en.themes != null || ar.themes != null || Array.isArray(item.themes)) {
      const { themes, themesLocalized } = themesBag(item.themes, fr, en, ar)
      item.themes = themes
      item.themesLocalized = themesLocalized
      changed = true
    }
    if (fr.locations != null || en.locations != null || ar.locations != null) {
      const loc = themesBag(item.locations, { themes: fr.locations }, { themes: en.locations }, { themes: ar.locations })
      item.locations = loc.themes
      item.locationsLocalized = loc.themesLocalized
      changed = true
    }
    if (changed) touched += 1
  }
  console.log(collection, 'updated items via', page)
}

writeFileSync(storePath, JSON.stringify(store, null, 2))
console.log('touched', touched)
