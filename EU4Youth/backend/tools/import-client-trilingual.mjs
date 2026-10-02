/**
 * Phase A: import client “Sections trilingues” packs into CMS store
 * (page blocks + project localized fields), then language can be CMS-only.
 *
 * Run from backend/: node tools/import-client-trilingual.mjs
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const websiteRoot = join(root, '..', 'eu4youth-website')
const extracted = join(websiteRoot, 'src', 'i18n', 'extracted')
const storePath = join(root, 'data', 'store.json')

const store = JSON.parse(readFileSync(storePath, 'utf8'))
const blocks = store.content.blocks
if (!store.content.nextBlockId) store.content.nextBlockId = blocks.reduce((m, b) => Math.max(m, b.id || 0), 0)

function readJson(name) {
  return JSON.parse(readFileSync(join(extracted, name), 'utf8'))
}

function upsertBlock(page, section, key, locale, value, type = 'text', label = '') {
  if (value == null || value === '') return false
  const str = typeof value === 'string' ? value : JSON.stringify(value)
  let row = blocks.find(
    (b) => b.page === page && b.section === section && b.key === key && b.locale === locale,
  )
  if (!row) {
    store.content.nextBlockId += 1
    row = {
      id: store.content.nextBlockId,
      page,
      section,
      key,
      locale,
      type,
      value: str,
      label: label || key,
      sort_order: blocks.filter((b) => b.page === page && b.section === section).length + 1,
    }
    blocks.push(row)
    return true
  }
  row.value = str
  row.type = type
  return true
}

function bag(fr, en, ar) {
  const asText = (value) => {
    if (value == null) return ''
    if (typeof value === 'string') return value
    if (typeof value === 'object' && !Array.isArray(value)) {
      const nested = value.fr ?? value.en ?? value.ar ?? ''
      return typeof nested === 'string' ? nested : ''
    }
    return String(value)
  }
  const frText = asText(fr)
  return { fr: frText, en: asText(en) || frText, ar: asText(ar) || frText }
}

function normalizeObjectives(raw) {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => {
      if (typeof item === 'string') return item.trim()
      if (item && typeof item === 'object') {
        const title = String(item.title || '').trim()
        const body = String(item.body || '').trim()
        if (title && body) return `${title} — ${body}`
        return title || body
      }
      return String(item || '').trim()
    })
    .filter(Boolean)
}

function mergeComponents(base = [], overlay = []) {
  if (!overlay?.length) return base
  if (!base?.length) {
    return overlay.map((c) => ({
      name: c.name || '',
      tagline: c.tagline || '',
      description: c.description || '',
      results: c.bullets?.length ? c.bullets.map(String) : c.results || [],
      sectors: c.sectors || [],
      mark: c.mark,
    }))
  }
  return base.map((item, index) => {
    const next = overlay[index]
    if (!next) return item
    return {
      ...item,
      name: next.name?.trim() || item.name,
      tagline: next.tagline?.trim() || item.tagline,
      description: next.description?.trim() || item.description,
      results: next.bullets?.length ? next.bullets.map(String) : item.results,
    }
  })
}

function cleanIntroParas(text, locale) {
  const parts = String(text || '')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
  return parts.filter(
    (p) =>
      !/^(héro|hero|page|العنوان|العنوان الفرعي|العنوان الرئيسي)/i.test(p) && p.length > 20,
  )
}

/** —— Projects —— */
const PROJECT_FILES = {
  fe3ila: 'fe3ila.json',
  go4youth: 'go4youth.json',
  irada4youth: 'irada4youth.json',
  jeuness: 'jeuness.json',
}

let projectsUpdated = 0
for (const [slug, file] of Object.entries(PROJECT_FILES)) {
  const doc = readJson(file)
  const project = (store.projects || []).find((p) => p.slug === slug)
  if (!project) {
    console.warn('skip missing project', slug)
    continue
  }
  const fr = doc.fr || {}
  const en = doc.en || {}
  const ar = doc.ar || {}

  const frPres = fr.presentation || project.presentation || []
  const enPres = en.presentation || frPres
  const arPres = ar.presentation || frPres

  const frObj = normalizeObjectives(fr.specificObjectives?.length ? fr.specificObjectives : project.specificObjectives)
  const enObj = normalizeObjectives(en.specificObjectives?.length ? en.specificObjectives : frObj)
  const arObj = normalizeObjectives(ar.specificObjectives?.length ? ar.specificObjectives : frObj)

  const frKpis = fr.kpis?.length ? fr.kpis : project.kpis || []
  const enKpis = en.kpis?.length ? en.kpis : frKpis
  const arKpis = ar.kpis?.length ? ar.kpis : frKpis

  const frComp = mergeComponents(project.components || [], fr.components)
  const enComp = mergeComponents(frComp, en.components)
  const arComp = mergeComponents(frComp, ar.components)

  const periodFr = fr.keyInfo?.period || project.period || ''
  const periodEn = en.keyInfo?.period || periodFr
  const periodAr = ar.keyInfo?.period || periodFr

  const implFr = fr.keyInfo?.implementer || project.partner || ''
  let implEn = en.keyInfo?.implementer || implFr
  let implAr = ar.keyInfo?.implementer || implFr
  if (/^\d{4}\s*[–-]\s*\d{4}$/.test(String(implEn).trim())) implEn = implFr
  if (/^\d{4}\s*[–-]\s*\d{4}$/.test(String(implAr).trim())) implAr = implFr

  project.acronym = bag(fr.acronym || project.acronym, en.acronym || fr.acronym || project.acronym, ar.acronym || project.acronym)
  project.fullName = bag(fr.fullName || project.fullName, en.fullName || fr.fullName, ar.fullName || fr.fullName)
  project.tagline = bag(fr.tagline || project.tagline, en.tagline || fr.tagline, ar.tagline || fr.tagline)
  project.name = bag(
    `${fr.acronym || project.acronym?.fr || slug} — ${(fr.tagline || '').slice(0, 80)}`,
    `${en.acronym || fr.acronym || slug} — ${(en.tagline || fr.tagline || '').slice(0, 80)}`,
    `${ar.acronym || fr.acronym || slug} — ${(ar.tagline || fr.tagline || '').slice(0, 80)}`,
  )
  project.taglineLocalized = bag(fr.tagline || project.taglineLocalized?.fr, en.tagline || fr.tagline, ar.tagline || fr.tagline)
  project.partner = bag(implFr, implEn, implAr)
  project.period = bag(periodFr, periodEn, periodAr)
  project.generalObjective = bag(fr.generalObjective || project.generalObjective, en.generalObjective, ar.generalObjective)
  project.impactIntro = bag(
    (fr.heritage || []).join(' ') || project.impactIntro || '',
    (en.heritage || []).join(' ') || '',
    (ar.heritage || []).join(' ') || '',
  )
  project.presentation = { fr: frPres, en: enPres, ar: arPres }
  project.specificObjectives = { fr: frObj, en: enObj, ar: arObj }
  project.kpis = { fr: frKpis, en: enKpis, ar: arKpis }
  project.components = { fr: frComp, en: enComp, ar: arComp }

  // Chrome labels on shared projet page (EN/AR)
  const chrome = {
    en: {
      'fiche.fullName': 'Full name',
      'fiche.acronym': 'Acronym',
      'fiche.period': 'Duration',
      'fiche.funding': 'Funding',
      'fiche.implementer': 'Implementing organisation',
      'fiche.sectors': "Sectors\nof intervention",
      'objectifs.title': 'OBJECTIVES',
      'objectifs.tabGeneral': 'Overall objective',
      'objectifs.tabSpecifiques': 'Specific objectives',
      'objectifs.generalHeading': 'OVERALL OBJECTIVE',
      'objectifs.specificHeading': 'SPECIFIC OBJECTIVES',
      'composantes.title': 'COMPONENTS',
      'impact.title': 'PROJECT IMPACT',
    },
    ar: {
      'fiche.fullName': 'الاسم الكامل',
      'fiche.acronym': 'الاسم المختصر',
      'fiche.period': 'المدة',
      'fiche.funding': 'التمويل',
      'fiche.implementer': 'جهة التنفيذ',
      'fiche.sectors': 'قطاعات\nالتدخل',
      'objectifs.title': 'الأهداف',
      'objectifs.tabGeneral': 'الهدف العام',
      'objectifs.tabSpecifiques': 'الأهداف الخصوصية',
      'objectifs.generalHeading': 'الهدف العام',
      'objectifs.specificHeading': 'الأهداف الخصوصية',
      'composantes.title': 'المكوّنات',
      'impact.title': 'أثر المشروع',
    },
  }
  for (const [locale, map] of Object.entries(chrome)) {
    for (const [path, text] of Object.entries(map)) {
      const [section, key] = path.split('.')
      upsertBlock('projet', section, key, locale, text, 'text', key)
    }
  }

  projectsUpdated += 1
  console.log('project', slug, 'updated')
}

/** —— Programme → a-propos —— */
const programme = readJson('programme.json')
let aproposN = 0
for (const locale of ['en', 'ar']) {
  const src = programme[locale]?.blocks || {}
  const cleaned = cleanIntroParas(src['intro.body'] || '', locale)

  if (locale === 'en') {
    upsertBlock('a-propos', 'hero', 'badge', 'en', 'A programme supporting Tunisia’s youth')
    upsertBlock(
      'a-propos',
      'hero',
      'title',
      'en',
      cleaned.find((p) => /^EU4Youth stands/i.test(p)) ||
        'EU4Youth stands with young Tunisian women and men in their paths, their projects and their engagement.',
    )
    const body = cleaned.filter((p) => !/^EU4Youth stands/i.test(p)).slice(0, 2).join('\n\n')
    if (body) upsertBlock('a-propos', 'hero', 'body', 'en', body)
  } else {
    upsertBlock('a-propos', 'hero', 'badge', 'ar', 'برنامج دعم الشباب التونسي')
    upsertBlock(
      'a-propos',
      'hero',
      'title',
      'ar',
      cleaned.find((p) => /يرافق EU4Youth/.test(p) && p.length < 160) ||
        'يرافق EU4Youth الشابات والشبان التونسيين في مساراتهم ومشاريعهم والتزامهم.',
    )
    const body = cleaned
      .filter((p) => !/يرافق EU4Youth/.test(p))
      .slice(0, 2)
      .join('\n\n')
    if (body) upsertBlock('a-propos', 'hero', 'body', 'ar', body)
  }

  if (src['pourquoi.body']) {
    upsertBlock('a-propos', 'pourquoi', 'body', locale, src['pourquoi.body'])
    aproposN++
  }
  if (src['pourquoi.title']) upsertBlock('a-propos', 'pourquoi', 'title', locale, src['pourquoi.title'])
  if (src['pourquoi.quote']) upsertBlock('a-propos', 'pourquoi', 'quote', locale, src['pourquoi.quote'])

  if (src['vision.body']) upsertBlock('a-propos', 'vision', 'body', locale, src['vision.body'])
  if (src['vision.title']) {
    const title = src['vision.title'].split('\n')[0]?.trim() || ''
    if (title && title.length < 120) upsertBlock('a-propos', 'vision', 'title', locale, title)
    else upsertBlock('a-propos', 'vision', 'title', locale, locale === 'en' ? 'A SHARED VISION' : 'رؤية مشتركة')
    if (src['vision.title'].length > 80) {
      upsertBlock('a-propos', 'vision', 'lead', locale, src['vision.title'].split('\n')[0].trim())
    }
  }

  if (src['territoires.body']) {
    const terr = src['territoires.body'].split(/\n{2,}/).slice(0, 3).join('\n\n')
    upsertBlock('a-propos', 'territoires', 'body', locale, terr)
  }
  if (src['projets.intro']) {
    const intro = src['projets.intro'].split(/\n{2,}/).slice(0, 2).join('\n\n')
    upsertBlock('a-propos', 'projets', 'body', locale, intro)
  }
}
console.log('a-propos locale fields refreshed')

/** —— EU en Tunisie —— */
const eu = readJson('eu-en-tunisie.json')
// Ensure EN hero/intro present (may have been empty in extract; pack was patched)
if (!eu.en?.heroTitle) {
  eu.en.heroTitle = 'The European Union in Tunisia'
}
if (!eu.en?.intro) {
  eu.en.intro =
    'The European Union supports Tunisia through cooperation covering a wide range of areas linked to the country’s social, economic, territorial and environmental challenges. Its action is organised around complementary themes, from human rights and equality to employment, innovation, economic development, the ecological transition and territorial development.\n\nDiscover the European Union’s main areas of intervention in Tunisia and explore the projects that contribute to these dynamics.'
}

for (const locale of ['en', 'ar']) {
  const pack = eu[locale] || {}
  if (locale === 'en') upsertBlock('eu-en-tunisie', 'hero', 'title', 'en', 'THE EUROPEAN UNION\nIN TUNISIA')
  else if (pack.heroTitle) upsertBlock('eu-en-tunisie', 'hero', 'title', 'ar', 'الاتحاد الأوروبي\nفي تونس')
  if (pack.intro) upsertBlock('eu-en-tunisie', 'intro', 'body', locale, pack.intro)
  if (pack.themesTitle) upsertBlock('eu-en-tunisie', 'themes', 'title', locale, pack.themesTitle)
  if (pack.themes?.length) upsertBlock('eu-en-tunisie', 'themes', 'items', locale, pack.themes, 'json', 'Thématiques')
  if (pack.links?.[0]?.label) upsertBlock('eu-en-tunisie', 'explore', 'mapCta', locale, pack.links[0].label)
  if (pack.links?.[1]?.label) upsertBlock('eu-en-tunisie', 'explore', 'siteCta', locale, pack.links[1].label)
  if (pack.ctaTitle) upsertBlock('eu-en-tunisie', 'explore', 'title', locale, pack.ctaTitle)
  if (pack.ctaBody) upsertBlock('eu-en-tunisie', 'explore', 'body', locale, pack.ctaBody)
}
console.log('eu-en-tunisie locale fields refreshed')

const backup = storePath + '.bak-phase-a'
if (!existsSync(backup)) copyFileSync(storePath, backup)
writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8')
console.log('saved', storePath)
console.log('projectsUpdated', projectsUpdated)
console.log('blocks now', blocks.length, 'nextBlockId', store.content.nextBlockId)
