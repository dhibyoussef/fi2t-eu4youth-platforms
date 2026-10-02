import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const catalogDir = join(root, 'data', 'catalog')

const COLORS = {
  jeuness: '#e34171',
  fe3ila: '#050b86',
  maghroumin: '#f2a849',
  swafy: '#1a9a94',
  go4youth: '#074ea2',
  irada4youth: '#58ac48',
}

export const CATALOG_KEYS = [
  'news',
  'publications',
  'events',
  'opportunities',
  'stories',
  'videos',
  'initiatives',
  'glossary',
  'projects',
]

function readJson(name) {
  const path = join(catalogDir, `${name}.json`)
  if (!existsSync(path)) return []
  return JSON.parse(readFileSync(path, 'utf8'))
}

function published(item) {
  const status = item.status
  if (!status) return true
  if (typeof status === 'string') return status === 'published'
  if (typeof status === 'object' && !Array.isArray(status)) {
    return ['fr', 'en', 'ar'].some((locale) => status[locale] === 'published')
  }
  return false
}

export function ensureCatalogues(store) {
  const news = readJson('news').map((item) => ({ status: 'published', ...item }))
  const publications = readJson('publications').map((item) => ({ status: 'published', ...item }))
  const events = readJson('events').map((item) => ({ status: 'published', ...item }))
  const opportunities = readJson('opportunities').map((item) => ({
    ...item,
    status: item.status || 'published',
    title: typeof item.title === 'string' ? item.title : item.title?.fr || 'Opportunité',
  }))
  const glossary = readJson('glossary')
  const fiches = readJson('projects')
  const interventions = readJson('interventions')

  if (!Array.isArray(store.news) || store.news.length === 0) store.news = news
  if (!Array.isArray(store.publications) || store.publications.length === 0) {
    store.publications = publications
  }
  if (!Array.isArray(store.events) || store.events.length === 0) store.events = events
  /* Seed once only — never wipe CMS localized titles/bodies on reload. */
  if (!Array.isArray(store.opportunities) || store.opportunities.length === 0) {
    store.opportunities = opportunities
  }
  if (!Array.isArray(store.glossary) || store.glossary.length < 3) store.glossary = glossary
  if (!Array.isArray(store.initiatives) || store.initiatives.length < 50) {
    store.initiatives = interventions.map((item) => ({
      ...item,
      status: 'published',
      lat: item.lat ?? null,
      lng: item.lng ?? null,
    }))
  }
  if (Array.isArray(fiches) && fiches.length) {
    const bySlug = new Map((store.projects || []).map((item) => [item.slug, item]))
    store.projects = fiches.map((fiche) => {
      const prev = bySlug.get(fiche.slug) || {}
      const asBag = (value, fallback) => {
        const raw =
          value && typeof value === 'object' && !Array.isArray(value)
            ? unwrapBag(value)
            : value
        return raw && typeof raw === 'object' && !Array.isArray(raw)
          ? raw
          : {
              fr: fallback ?? (typeof raw === 'string' ? raw : ''),
              en: fallback ?? (typeof raw === 'string' ? raw : ''),
              ar: fallback ?? (typeof raw === 'string' ? raw : ''),
            }
      }
      const asArrayBag = (value, fallbackArr) => {
        if (value && typeof value === 'object' && !Array.isArray(value)) return value
        const base = Array.isArray(value) ? value : Array.isArray(fallbackArr) ? fallbackArr : []
        return { fr: base, en: base, ar: base }
      }
      return {
        ...fiche,
        ...prev,
        color: prev.color || COLORS[fiche.slug] || '#074ea2',
        status: prev.status || 'published',
        slug: fiche.slug,
        theme: fiche.theme || prev.theme || fiche.slug,
        name: prev.name || { fr: fiche.fullName, en: fiche.fullName, ar: fiche.fullName },
        taglineLocalized: prev.taglineLocalized || {
          fr: fiche.tagline,
          en: fiche.tagline,
          ar: fiche.tagline,
        },
        fullName: asBag(prev.fullName, fiche.fullName),
        tagline: asBag(prev.tagline, fiche.tagline),
        acronym: asBag(prev.acronym, fiche.acronym),
        partner: asBag(prev.partner, fiche.partner),
        period: asBag(prev.period, fiche.period),
        sectors: asBag(prev.sectors, fiche.sectors),
        generalObjective: asBag(prev.generalObjective, fiche.generalObjective),
        impactIntro: asBag(prev.impactIntro, fiche.impactIntro || ''),
        presentation: asArrayBag(prev.presentation, fiche.presentation),
        specificObjectives: asArrayBag(prev.specificObjectives, fiche.specificObjectives),
        kpis: asArrayBag(prev.kpis, fiche.kpis),
        components: asArrayBag(prev.components, fiche.components),
        governorates: prev.governorates || fiche.governorates,
        beneficiaries: prev.beneficiaries || fiche.beneficiaries,
        budget: prev.budget || fiche.budget,
        composante: prev.composante || fiche.composante,
      }
    })
  }
  if (!Array.isArray(store.stories)) store.stories = []
  store.stories = (store.stories || []).filter(
    (item) => !['Amina', 'Yassine', 'Sarra'].includes(item.firstName),
  )
  if (!Array.isArray(store.videos)) store.videos = []
  if (Array.isArray(store.inbox)) {
    store.inbox = store.inbox.filter((item) => !String(item.from || '').includes('example.tn'))
  }
  if (store.settings) {
    store.settings.contactEndpointConfigured = true
    store.settings.newsletterEndpointConfigured = true
    if (!store.settings.publicSiteUrl) store.settings.publicSiteUrl = 'http://localhost:3030'
  }
  return store
}

function unwrapBag(value) {
  let current = value
  let guard = 0
  while (
    current &&
    typeof current === 'object' &&
    !Array.isArray(current) &&
    guard < 4
  ) {
    const nested =
      current.fr && typeof current.fr === 'object' && !Array.isArray(current.fr)
        ? current.fr
        : null
    if (!nested) break
    /* Nested bag: { fr: { fr, en, ar }, en, ar } → prefer inner bag merged with outer. */
    current = {
      fr: nested.fr ?? current.fr,
      en: (typeof current.en === 'string' && current.en) || nested.en || '',
      ar: (typeof current.ar === 'string' && current.ar) || nested.ar || '',
    }
    guard += 1
  }
  return current
}

function hasLocaleText(value, locale) {
  if (value == null) return false
  if (typeof value === 'string') return locale === 'fr' && value.trim().length > 0
  if (typeof value === 'object' && !Array.isArray(value)) {
    const bag = unwrapBag(value)
    const picked = bag?.[locale]
    if (typeof picked === 'string') return picked.trim().length > 0
    if (picked && typeof picked === 'object') return hasLocaleText(picked, locale)
    return false
  }
  return false
}

function flattenLoc(value, locale) {
  if (value == null) return value
  if (typeof value === 'string') return value
  if (typeof value === 'object' && !Array.isArray(value)) {
    const bag = unwrapBag(value)
    let picked = bag?.[locale] ?? bag?.fr ?? bag?.en ?? bag?.ar ?? ''
    let guard = 0
    while (picked && typeof picked === 'object' && !Array.isArray(picked) && guard < 4) {
      picked = picked[locale] ?? picked.fr ?? picked.en ?? picked.ar ?? ''
      guard += 1
    }
    if (typeof picked === 'string') return picked
    if (picked == null) return ''
    return String(picked)
  }
  return value
}

const LOC_KEYS = [
  'title',
  'summary',
  'body',
  'quote',
  'name',
  'description',
  'taglineLocalized',
  'tagline',
  'fullName',
  'acronym',
  'partner',
  'period',
  'territory',
  'budget',
  'sectors',
  'generalObjective',
  'impactIntro',
  'fundingNote',
  'type',
  'dateLabel',
  'source',
  'status',
  'deadlineLabel',
  'periodLabel',
  'location',
  'format',
  'language',
  'project',
  'locationLabel',
  'label',
  'term',
  'tag',
  'def',
  'ctx',
  'nature',
  'sector',
  'governorate',
  'locality',
  'project',
]

const LOC_ARRAY_KEYS = ['presentation', 'specificObjectives', 'kpis', 'components']

function flattenItem(item, locale) {
  const flat = { ...item }
  flat._localeOk = locale === 'fr' || hasLocaleText(item.title, locale)
  for (const key of LOC_KEYS) {
    if (flat[key] != null && typeof flat[key] === 'object' && !Array.isArray(flat[key])) {
      flat[key] = flattenLoc(flat[key], locale)
    }
  }
  for (const key of LOC_ARRAY_KEYS) {
    if (flat[key] != null && typeof flat[key] === 'object' && !Array.isArray(flat[key])) {
      const bag = flat[key]
      const picked = bag[locale] || bag.fr || bag.en || bag.ar
      flat[key] = Array.isArray(picked) ? picked : []
    }
  }
  if (flat.themesLocalized && typeof flat.themesLocalized === 'object') {
    const bag = flat.themesLocalized
    const picked = bag[locale] || bag.fr || bag.en || bag.ar
    if (Array.isArray(picked) && picked.length) flat.themes = picked
    else if (typeof picked === 'string' && picked.trim()) {
      flat.themes = picked.split(/[·,|]/).map((s) => s.trim()).filter(Boolean)
    }
  }
  if (flat.locationsLocalized && typeof flat.locationsLocalized === 'object') {
    const bag = flat.locationsLocalized
    const picked = bag[locale] || bag.fr || bag.en || bag.ar
    if (Array.isArray(picked) && picked.length) flat.locations = picked
    else if (typeof picked === 'string' && picked.trim()) {
      flat.locations = picked.split(/[·,|]/).map((s) => s.trim()).filter(Boolean)
    }
  }
  if (flat.audiencesLocalized && typeof flat.audiencesLocalized === 'object') {
    const bag = flat.audiencesLocalized
    const picked = bag[locale] || bag.fr || bag.en || bag.ar
    if (Array.isArray(picked) && picked.length) flat.audiences = picked
    else if (typeof picked === 'string' && picked.trim()) {
      flat.audiences = picked.split(/[·,|]/).map((s) => s.trim()).filter(Boolean)
    }
  }
  return flat
}

export function publicList(store, kind, { locale = 'fr', project } = {}) {
  if (kind === 'glossary') {
    const list = Array.isArray(store.glossary) ? store.glossary : []
    return list.map((item) => {
      const flat = flattenItem(item, locale)
      if (Array.isArray(flat.entries)) {
        flat.entries = flat.entries.map((entry) => {
          const row = { ...entry }
          for (const key of ['term', 'tag', 'def', 'ctx']) {
            if (row[key] != null && typeof row[key] === 'object' && !Array.isArray(row[key])) {
              row[key] = flattenLoc(row[key], locale)
            }
          }
          return row
        })
      }
      return flat
    })
  }
  const list = Array.isArray(store[kind]) ? store[kind] : []
  return list
    .filter((item) => {
      if (!published(item)) return false
      if (kind === 'stories' && item.consent === false) return false
      if (project && item.projectSlug && item.projectSlug !== project) return false
      return true
    })
    .map((item) => flattenItem(item, locale))
}

export function findBySlug(store, kind, slug, locale = 'fr') {
  const list = store[kind] || []
  const item = list.find((item) => String(item.slug || item.id || item.key) === String(slug)) || null
  return item ? flattenItem(item, locale) : null
}

export function nextId(list) {
  return Math.max(0, ...list.map((item) => Number(item.id) || 0)) + 1
}
