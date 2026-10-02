import { readFileSync, writeFileSync } from 'fs'

const path = new URL('../data/store.json', import.meta.url)
const store = JSON.parse(readFileSync(path, 'utf8'))

const patches = [
  {
    page: 'a-propos',
    section: 'avenir',
    key: 'title',
    en: 'LOOKING TOWARD\nTHE FUTURE',
    ar: 'نظرة نحو\nالمستقبل',
  },
  {
    page: 'a-propos',
    section: 'impact',
    key: 'title',
    en: "THE PROGRAMME'S IMPACT",
    ar: 'أثر البرنامج',
  },
  {
    page: 'gouvernance',
    section: 'hero',
    key: 'badge',
    en: 'THE EU4YOUTH PROGRAMME',
    ar: 'برنامج EU4Youth',
  },
  {
    page: 'stories',
    section: 'hero',
    key: 'badge',
    en: 'VOICES, PATHS, INITIATIVES',
    ar: 'أصوات، مسارات، مبادرات',
  },
  {
    page: 'coin-media',
    section: 'hero',
    key: 'badge',
    en: 'INFORMATION AND RESOURCES',
    ar: 'معلومات وموارد',
  },
  {
    page: 'eu-en-tunisie',
    section: 'hero',
    key: 'badge',
    en: 'EUROPEAN UNION — TUNISIA COOPERATION',
    ar: 'تعاون الاتحاد الأوروبي — تونس',
  },
  {
    page: 'global',
    section: 'footer',
    key: 'col3',
    en: 'LEGAL INFORMATION',
    ar: 'معلومات قانونية',
  },
  {
    page: 'partenaires',
    section: 'figures',
    key: 'd0',
    en: 'Delegation of the European Union',
    ar: 'بعثة الاتحاد الأوروبي',
  },
]

let updated = 0
for (const p of patches) {
  for (const loc of ['en', 'ar']) {
    const val = p[loc]
    const block = store.content.blocks.find(
      (b) => b.page === p.page && b.section === p.section && b.key === p.key && b.locale === loc,
    )
    if (block) {
      if (block.value !== val) {
        block.value = val
        updated++
        console.log('upd', p.page, p.section, p.key, loc)
      }
    } else {
      store.content.blocks.push({
        page: p.page,
        section: p.section,
        key: p.key,
        locale: loc,
        type: 'text',
        value: val,
      })
      updated++
      console.log('add', p.page, p.section, p.key, loc)
    }
  }
}

writeFileSync(path, JSON.stringify(store, null, 2))
console.log('updated', updated)
