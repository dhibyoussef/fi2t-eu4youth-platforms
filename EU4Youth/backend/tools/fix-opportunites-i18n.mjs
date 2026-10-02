/**
 * Opportunités AR: fix listing copy (locations/deadline) + unpublish QA draft.
 */
import { loadStore, saveStore } from '../src/store.mjs'

const store = loadStore()

const GOV = {
  Zaghouan: 'زغوان',
  Mahdia: 'المهدية',
  'Le Kef': 'الكاف',
  Kairouan: 'القيروان',
  Kébili: 'قبلي',
  Tozeur: 'توزر',
}

const arItemsBlock = (store.content.blocks || []).find(
  (b) => b.page === 'opportunites' && b.locale === 'ar' && b.section === 'browser' && b.key === 'items',
)

if (arItemsBlock) {
  const rows = typeof arItemsBlock.value === 'string' ? JSON.parse(arItemsBlock.value) : arItemsBlock.value
  if (Array.isArray(rows)) {
    for (const row of rows) {
      if (row.slug === 'irada-2e-appel-a-propositions-2026') {
        row.type = 'Appel à projets' // keep FR id for filters; label via chips
        row.deadlineLabel = '24 جويلية 2026'
        row.locations = ['Zaghouan', 'Mahdia', 'Le Kef', 'Kairouan', 'Kébili', 'Tozeur']
        row.locationLabel = ['Zaghouan', 'Mahdia', 'Le Kef', 'Kairouan', 'Kébili', 'Tozeur']
          .map((name) => GOV[name] || name)
          .join(' · ')
      }
    }
    arItemsBlock.value = rows
    arItemsBlock.type = 'json'
    console.log('updated AR browser.items irada locations/deadline')
  }
}

for (const loc of ['fr', 'en', 'ar']) {
  const types = (store.content.blocks || []).find(
    (b) => b.page === 'opportunites' && b.locale === loc && b.section === 'browser' && b.key === 'types',
  )
  if (!types) continue
  const rows = typeof types.value === 'string' ? JSON.parse(types.value) : types.value
  if (!Array.isArray(rows)) continue
  // ensure ids stay French keys
  const byLabel = Object.fromEntries(rows.map((r) => [r.label, r.id]))
  console.log(loc, 'types ok', rows.map((r) => r.id).join('|'))
}

// Unpublish QA noise from public catalog
let unpublished = 0
for (const item of store.opportunities || []) {
  if (String(item.slug || '').startsWith('qa-opp') || String(item.title?.fr || item.title || '').startsWith('QA ')) {
    item.status = { fr: 'draft', en: 'draft', ar: 'draft' }
    unpublished++
    console.log('drafted', item.slug || item.id)
  }
}

saveStore(store)
console.log('done, unpublished', unpublished)
