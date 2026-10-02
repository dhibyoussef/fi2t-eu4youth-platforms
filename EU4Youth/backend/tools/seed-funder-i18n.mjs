import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const storePath = join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'store.json')
const store = JSON.parse(readFileSync(storePath, 'utf8'))
const t = store.translations

const need = [
  {
    key: 'funder.eu_line1',
    fr: 'Financé par',
    en: 'Funded by',
    ar: 'بتمويل من',
  },
  {
    key: 'funder.eu_line2',
    fr: "l'Union européenne",
    en: 'the European Union',
    ar: 'الاتحاد الأوروبي',
  },
  {
    key: 'funder.tn_line1',
    fr: 'République',
    en: 'Republic of',
    ar: 'الجمهورية',
  },
  {
    key: 'funder.tn_line2',
    fr: 'Tunisienne',
    en: 'Tunisia',
    ar: 'التونسية',
  },
  {
    key: 'funder.aria',
    fr: "Financé par l'Union européenne — République Tunisienne",
    en: 'Funded by the European Union — Republic of Tunisia',
    ar: 'بتمويل من الاتحاد الأوروبي — الجمهورية التونسية',
  },
]

let n = 0
for (const row of need) {
  const existing = t.find((x) => x.key === row.key)
  if (existing) {
    Object.assign(existing, row)
  } else {
    t.push(row)
  }
  n++
}

writeFileSync(storePath, JSON.stringify(store, null, 2))
console.log('upserted funder keys', n)
