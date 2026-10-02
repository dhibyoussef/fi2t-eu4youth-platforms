import { patternById, publicPatterns } from './patterns.mjs'
import { ensureContent } from './contentSeed.mjs'

const LOCALES = ['fr', 'en', 'ar']

export { publicPatterns, ensureContent }

export function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || `page-${Date.now().toString(36)}`
}

export function flattenPage(store, pageSlug, locale = 'fr') {
  const blocks = {}
  const rows = store.content.blocks.filter((item) => item.page === pageSlug)
  const rank = (item) => {
    if (item.locale === locale) return 3
    if (item.locale === 'fr') return 2
    if (item.locale === '_all') return 1
    return 0
  }
  const byKey = new Map()
  for (const row of rows) {
    const compound = `${row.section}.${row.key}`
    const prev = byKey.get(compound)
    if (!prev || rank(row) > rank(prev)) byKey.set(compound, row)
  }
  for (const [key, row] of byKey) {
    if (row.value != null && row.value !== '') blocks[key] = row.value
  }
  return blocks
}

export function matrixFor(store, pageSlug) {
  const page = store.content.pages.find((item) => item.slug === pageSlug) || null
  const sections = store.content.sections
    .filter((item) => item.page === pageSlug)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((section) => {
      const rows = store.content.blocks.filter(
        (item) => item.page === pageSlug && item.section === section.slug,
      )
      const keys = []
      for (const row of rows) {
        if (!keys.includes(row.key)) keys.push(row.key)
      }
      keys.sort((a, b) => {
        const ia = rows.find((item) => item.key === a)?.sort_order ?? 0
        const ib = rows.find((item) => item.key === b)?.sort_order ?? 0
        return ia - ib
      })
      return {
        name: section.slug,
        title: section.title,
        pattern: section.pattern,
        blocks: keys.map((key) => {
          const sample = rows.find((item) => item.key === key)
          const locales = {}
          for (const row of rows.filter((item) => item.key === key)) {
            locales[row.locale] = { id: row.id, value: row.value }
          }
          return {
            key,
            type: sample?.type || 'text',
            label: sample?.label || key,
            sort_order: sample?.sort_order || 0,
            locales,
          }
        }),
      }
    })
  return {
    page: pageSlug,
    page_meta: page,
    pages: store.content.pages.slice().sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
    sections,
  }
}

function nextBlockId(store) {
  store.content.nextBlockId = (store.content.nextBlockId || 1) + 1
  return store.content.nextBlockId
}

export function upsertBlock(store, payload) {
  const page = payload.page
  const section = payload.section
  const key = payload.key
  const locale = payload.locale || (payload.type === 'image' ? '_all' : 'fr')
  const type = payload.type || 'text'
  const existing = store.content.blocks.find(
    (item) => item.page === page && item.section === section && item.key === key && item.locale === locale,
  )
  if (existing) {
    existing.value = payload.value ?? existing.value
    if (payload.label !== undefined) existing.label = payload.label
    if (payload.sort_order !== undefined) existing.sort_order = payload.sort_order
    if (type) existing.type = type
    if (locale === '_all') {
      store.content.blocks = store.content.blocks.filter(
        (item) =>
          !(item.page === page && item.section === section && item.key === key && LOCALES.includes(item.locale)),
      )
    }
    return existing
  }
  const row = {
    id: nextBlockId(store),
    page,
    section,
    key,
    locale,
    type,
    value: payload.value ?? '',
    label: payload.label || key,
    sort_order: payload.sort_order ?? 0,
  }
  store.content.blocks.push(row)
  return row
}

export function insertPattern(store, { page, pattern, insert_after, section_title }) {
  const spec = patternById(pattern)
  if (!spec) return null
  const existing = store.content.sections.filter((item) => item.page === page)
  let slug = pattern
  let n = 2
  while (existing.some((item) => item.slug === slug)) {
    slug = `${pattern}-${n++}`
  }
  let order = existing.length
  if (insert_after === '__start__') {
    for (const item of existing) item.sort_order += 1
    order = 0
  } else if (insert_after && insert_after !== '__end__') {
    const target = existing.find((item) => item.slug === insert_after)
    if (target) {
      order = target.sort_order + 1
      for (const item of existing) {
        if (item.sort_order >= order) item.sort_order += 1
      }
    }
  }
  store.content.sections.push({
    page,
    slug,
    title: section_title || spec.title,
    pattern: spec.id,
    sort_order: order,
  })
  spec.blocks.forEach((field, index) => {
    if (field.type === 'image') {
      upsertBlock(store, {
        page,
        section: slug,
        key: field.key,
        locale: '_all',
        type: 'image',
        value: '',
        label: field.label,
        sort_order: index,
      })
    } else {
      for (const locale of LOCALES) {
        upsertBlock(store, {
          page,
          section: slug,
          key: field.key,
          locale,
          type: field.type,
          value: field.type === 'json' ? '[]' : '',
          label: field.label,
          sort_order: index,
        })
      }
    }
  })
  return slug
}

export function deleteSection(store, page, section) {
  store.content.sections = store.content.sections.filter(
    (item) => !(item.page === page && item.slug === section),
  )
  store.content.blocks = store.content.blocks.filter(
    (item) => !(item.page === page && item.section === section),
  )
}

export function reorderSections(store, page, order) {
  order.forEach((slug, index) => {
    const section = store.content.sections.find((item) => item.page === page && item.slug === slug)
    if (section) section.sort_order = index
  })
}

export function navTree(items, locale = 'fr') {
  const labelKey = locale === 'en' ? 'label_en' : locale === 'ar' ? 'label_ar' : 'label_fr'
  const roots = items
    .filter((item) => !item.parent_id && item.is_active !== false)
    .sort((a, b) => a.sort_order - b.sort_order)
  const childrenOf = (id) =>
    items
      .filter((item) => item.parent_id === id && item.is_active !== false)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((item) => ({
        ...item,
        label: item[labelKey] || item.label_fr,
        children: childrenOf(item.id),
      }))
  return roots.map((item) => ({
    ...item,
    label: item[labelKey] || item.label_fr,
    children: childrenOf(item.id),
  }))
}
