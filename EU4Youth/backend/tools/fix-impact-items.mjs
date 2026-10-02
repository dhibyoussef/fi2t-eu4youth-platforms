import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const storePath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../data/store.json')
const store = JSON.parse(fs.readFileSync(storePath, 'utf8'))

const items = [
  { value: '24', label: 'GOUVERNORATS', note: 'Présence nationale', featured: '' },
  { value: '2019–2027', label: 'DURÉE DU\nPROGRAMME', note: 'Convention signée juin 2019', featured: '' },
  { value: '6', label: 'PROJETS\nCOMPLÉMENTAIRES', note: '3 composantes thématiques', featured: '' },
  { value: '+ 300', label: 'PROJETS PORTÉS\nPAR DES JEUNES', note: 'Économiques, culturels, sociaux, scientifiques', featured: '1' },
  { value: '+ 100', label: 'INITIATIVES\nASSOCIATIVES', note: 'Soutenues dans toutes les régions', featured: '' },
  { value: '+ 300', label: 'CLUBS CRÉÉS\nOU APPUYÉS', note: 'ESS, scientifiques, culturels, sportifs', featured: '' },
]

const json = JSON.stringify(items)
let count = 0
for (const block of store.content.blocks) {
  if (block.page === 'a-propos' && block.section === 'impact' && block.key === 'items' && (block.locale === 'fr' || !block.locale)) {
    block.value = json
    count++
  }
}

fs.writeFileSync(storePath, `${JSON.stringify(store, null, 2)}\n`)
console.log(`updated ${count} FR impact.items blocks (budget removed)`)
