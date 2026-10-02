import { upsertBlock } from './content.mjs'
import { translateText } from './translate.mjs'

const LOCALES = ['fr', 'en', 'ar']
const SHARED = /^(slug|img|image|url|href|icon|date|id|photo|logo|cover|youtubeId|publishedAt|opensAt|deadline|status)$/i

export async function syncBulk(store, blocks, { source = 'fr', translate = false } = {}) {
  const touched = new Set()
  for (const item of blocks) {
    upsertBlock(store, item)
    touched.add(`${item.page}::${item.section}::${item.key}`)
  }
  if (!translate) return
  for (const id of touched) {
    const [page, section, key] = id.split('::')
    const rows = store.content.blocks.filter(
      (item) => item.page === page && item.section === section && item.key === key,
    )
    const sourceRow = rows.find((item) => item.locale === source)
    if (!sourceRow || sourceRow.type === 'image' || SHARED.test(key)) continue
    for (const locale of LOCALES) {
      if (locale === source) continue
      let row = rows.find((item) => item.locale === locale)
      const shouldFill = !row || !String(row.value || '').trim() || row.value === sourceRow.value
      if (!shouldFill && !translate) continue
      let value = sourceRow.value
      if (sourceRow.type === 'text' && String(value).trim()) {
        value = await translateText(String(value), source, locale)
      }
      upsertBlock(store, {
        page,
        section,
        key,
        locale,
        type: sourceRow.type,
        value,
        label: sourceRow.label,
        sort_order: sourceRow.sort_order,
      })
    }
  }
}

export async function autoFillTranslations(store, source = 'fr', { overwrite = false } = {}) {
  let filled = 0
  for (const row of store.translations) {
    const from = String(row[source] || '').trim()
    if (!from) continue
    for (const locale of LOCALES) {
      if (locale === source) continue
      if (String(row[locale] || '').trim() && !overwrite) continue
      row[locale] = await translateText(from, source, locale)
      filled += 1
    }
  }
  return filled
}

const CATALOG_LOC_KEYS = [
  'title',
  'summary',
  'body',
  'quote',
  'name',
  'description',
  'taglineLocalized',
  'term',
  'definition',
]

const CATALOG_COLLECTIONS = [
  'news',
  'publications',
  'events',
  'opportunities',
  'stories',
  'videos',
  'projects',
  'glossary',
  'initiatives',
]

/** Fill EN/AR on localized catalog fields from FR (or `source`). */
export async function fillCatalogLocales(item, source = 'fr', { translate = false } = {}) {
  if (!item || typeof item !== 'object') return item
  for (const key of CATALOG_LOC_KEYS) {
    const value = item[key]
    if (!value || typeof value !== 'object' || Array.isArray(value)) continue
    const bag = { fr: '', en: '', ar: '', ...value }
    const from = String(bag[source] || bag.fr || '').trim()
    if (!from) continue
    for (const locale of LOCALES) {
      if (locale === source) continue
      if (String(bag[locale] || '').trim() && !translate) continue
      bag[locale] = await translateText(from, source, locale)
    }
    item[key] = bag
  }
  return item
}

export async function syncCatalogLocales(store, { source = 'fr', translate = false, collections = CATALOG_COLLECTIONS } = {}) {
  let items = 0
  for (const name of collections) {
    const list = store[name]
    if (!Array.isArray(list)) continue
    for (const item of list) {
      await fillCatalogLocales(item, source, { translate })
      items += 1
    }
  }
  return items
}
