import { loadStore, saveStore } from '../src/store.mjs'
import { publicList } from '../src/catalogues.mjs'

const store = loadStore()
const p = store.projects.find((x) => x.slug === 'irada4youth')
if (!p) throw new Error('irada4youth missing')

p.period = {
  fr: '2022–2027',
  en: '2022–2027',
  ar: '2022–2027',
}

function fixKpiLabel(label) {
  return String(label || '')
    .replace(/([A-Za-z0-9])و([A-Za-z0-9])/g, '$1 و $2')
    .replace(/و([A-Za-z])/g, 'و $1')
    .replace(/([A-Za-z])و/g, '$1 و')
}

const bag = p.kpis
if (bag && typeof bag === 'object' && !Array.isArray(bag)) {
  for (const loc of ['fr', 'en', 'ar']) {
    if (!Array.isArray(bag[loc])) continue
    bag[loc] = bag[loc].map((kpi) => ({
      ...kpi,
      label: loc === 'ar' ? fixKpiLabel(kpi.label) : kpi.label,
    }))
  }
  console.log(
    'kpi ar tails',
    bag.ar?.map((k) => k.label).slice(-2),
  )
}

for (const b of store.content.blocks || []) {
  if (b.page !== 'projet' || b.section !== 'stories') continue
  if (b.key === 'title' && b.locale === 'ar' && typeof b.value === 'string') {
    const next = b.value
      .split('\n')
      .map((line) => line.replace(/^\.+/, '').trim())
      .join('\n')
      .trim()
    if (next !== b.value) {
      console.log('stories title', JSON.stringify(b.value), '->', JSON.stringify(next))
      b.value = next
    }
  }
}

saveStore(store)

const oppsFr = publicList(store, 'opportunities', { locale: 'fr' }).filter(
  (o) => o.projectSlug === 'irada4youth',
)
const oppsAr = publicList(store, 'opportunities', { locale: 'ar' }).filter(
  (o) => o.projectSlug === 'irada4youth',
)
console.log(
  'opps fr',
  oppsFr.map((o) => o.title?.slice?.(0, 40)),
)
console.log(
  'opps ar',
  oppsAr.map((o) => ({ t: o.title?.slice?.(0, 40), ok: o._localeOk })),
)
console.log('period', p.period)
