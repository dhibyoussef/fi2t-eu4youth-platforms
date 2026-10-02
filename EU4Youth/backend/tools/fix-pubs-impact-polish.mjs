import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const storePath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../data/store.json')
const store = JSON.parse(fs.readFileSync(storePath, 'utf8'))

const isBudgetLabel = (label) =>
  /^(BUDGET(\s+TOTAL|\s+GLOBAL)?|TOTAL\s+BUDGET|الميزانية(\s*الإجمالية)?)$/i.test(
    String(label || '').replace(/\s+/g, ' ').trim(),
  )

const periodLabel = {
  fr: 'DURÉE DU\nPROGRAMME',
  en: 'PROGRAMME\nPERIOD',
  ar: 'مدة\nالبرنامج',
}

let pubsFixed = 0
let impactFixed = 0

for (const block of store.content.blocks) {
  if (block.page === 'publications' && block.section === 'hero' && block.key === 'image') {
    if (String(block.value).includes('photo-livres')) {
      block.value = '/img/art-pile-livres.webp'
      pubsFixed++
    }
  }

  if (block.page === 'a-propos' && block.section === 'impact' && block.key === 'items') {
    let rows
    try {
      rows = typeof block.value === 'string' ? JSON.parse(block.value) : block.value
    } catch {
      continue
    }
    if (!Array.isArray(rows)) continue
    const locale = block.locale === 'en' ? 'en' : block.locale === 'ar' ? 'ar' : 'fr'
    const next = rows
      .map((row) => {
        const value = String(row?.value || '').trim()
        const label = String(row?.label || '')
        if (/^2019\s*[–-]\s*2027$/.test(value) && (/BUDGET/i.test(label) || isBudgetLabel(label))) {
          return { ...row, label: periodLabel[locale] }
        }
        return row
      })
      .filter((row) => {
        const value = String(row?.value || '').trim()
        if (/^2019\s*[–-]\s*2027$/.test(value)) return true
        return !isBudgetLabel(row?.label)
      })
    block.value = JSON.stringify(next)
    impactFixed++
  }
}

fs.writeFileSync(storePath, `${JSON.stringify(store, null, 2)}\n`)
console.log(`publications image fixed: ${pubsFixed}; impact locales fixed: ${impactFixed}`)
