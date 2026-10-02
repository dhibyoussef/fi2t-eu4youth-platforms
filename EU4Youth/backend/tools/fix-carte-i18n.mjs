/**
 * Carte: repair EN/AR map legend (stale high/low/medium FR labels → none/t1–t4).
 */
import { loadStore, saveStore } from '../src/store.mjs'

const LEGEND = {
  fr: [
    { id: 'none', label: '0 intervention' },
    { id: 't1', label: '0 à 20' },
    { id: 't2', label: '20 à 40' },
    { id: 't3', label: '40 à 60' },
    { id: 't4', label: 'Plus de 60' },
  ],
  en: [
    { id: 'none', label: '0 interventions' },
    { id: 't1', label: '0 to 20' },
    { id: 't2', label: '20 to 40' },
    { id: 't3', label: '40 to 60' },
    { id: 't4', label: 'More than 60' },
  ],
  ar: [
    { id: 'none', label: '0 تدخل' },
    { id: 't1', label: '0 إلى 20' },
    { id: 't2', label: '20 إلى 40' },
    { id: 't3', label: '40 إلى 60' },
    { id: 't4', label: 'أكثر من 60' },
  ],
}

const VALID = new Set(['none', 't1', 't2', 't3', 't4'])

function needsRepair(value) {
  const text = typeof value === 'string' ? value : JSON.stringify(value ?? '')
  if (text.includes('Forte intensité') || text.includes('"high"') || text.includes('Intensité')) {
    return true
  }
  try {
    const rows = typeof value === 'string' ? JSON.parse(value) : value
    if (!Array.isArray(rows) || rows.length !== 5) return true
    return !rows.every((row) => VALID.has(String(row?.id || '')))
  } catch {
    return true
  }
}

const store = loadStore()
let n = 0
for (const locale of ['fr', 'en', 'ar']) {
  const block = (store.content.blocks || []).find(
    (item) =>
      item.page === 'carte' &&
      item.section === 'map' &&
      item.key === 'legend' &&
      item.locale === locale,
  )
  if (!block) continue
  if (!needsRepair(block.value) && locale === 'fr') continue
  if (needsRepair(block.value) || locale !== 'fr') {
    block.value = LEGEND[locale]
    block.type = 'json'
    n++
    console.log(`legend ${locale} → none/t1–t4`)
  }
}

saveStore(store)
console.log(`updated ${n} legend block(s)`)
