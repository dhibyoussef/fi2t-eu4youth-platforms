/**
 * Jeun'ESS: fix swapped fullName/acronym, truncated names, KPI parity FR/EN/AR.
 */
import { loadStore, saveStore } from '../src/store.mjs'

const store = loadStore()
const p = store.projects.find((x) => x.slug === 'jeuness')
if (!p) throw new Error('jeuness missing')

p.acronym = {
  fr: "Jeun'ESS",
  en: "Jeun'ESS",
  ar: "Jeun'ESS",
}

p.fullName = {
  fr: "Projet de promotion de l'économie sociale et solidaire et de création d'emplois décents pour la jeunesse tunisienne",
  en: 'Project to promote the social and solidarity economy and create decent jobs for young people in Tunisia',
  ar: 'مشروع للنهوض بالاقتصاد الاجتماعي والتضامني وإحداث مواطن شغل لائق للشباب التونسي',
}

p.name = {
  fr: "Jeun'ESS — Projet de promotion de l'économie sociale et solidaire et de création d'emplois décents pour la jeunesse tunisienne",
  en: "Jeun'ESS — Project to promote the social and solidarity economy and create decent jobs for young people in Tunisia",
  ar: "Jeun'ESS — النهوض بالاقتصاد الاجتماعي والتضامني وإحداث مواطن شغل لائق للشباب التونسي",
}

p.kpis = {
  fr: [
    { value: '304', label: 'projets ESS soutenus' },
    { value: '186', label: 'structures accompagnées' },
    { value: '3 721', label: 'emplois soutenus' },
    { value: '765', label: 'jeunes incubés' },
    { value: '373', label: "personnes formées à l'accompagnement ESS" },
    { value: '49', label: "clubs LIMITL'ESS créés" },
    { value: '87', label: 'structures valorisées dans des salons et événements nationaux' },
    { value: '140', label: 'produits ESS référencés' },
  ],
  en: [
    { value: '304', label: 'SSE projects supported' },
    { value: '186', label: 'organisations supported' },
    { value: '3,721', label: 'jobs supported' },
    { value: '765', label: 'young people incubated' },
    { value: '373', label: 'people trained in SSE support and assistance' },
    { value: '49', label: "LIMITL'ESS clubs established" },
    { value: '87', label: 'organisations showcased at national fairs and events' },
    { value: '140', label: 'SSE products listed' },
  ],
  ar: [
    { value: '304', label: 'مشاريع اقتصاد اجتماعي وتضامني مدعومة' },
    { value: '186', label: 'هياكل تمت مرافقتها' },
    { value: '3 721', label: 'مواطن شغل مدعومة' },
    { value: '765', label: 'شباب تمت حضانتهم' },
    { value: '373', label: 'أشخاص تكوّنوا في مرافقة الاقتصاد الاجتماعي والتضامني' },
    { value: '49', label: "نوادي LIMITL'ESS أحدثت" },
    { value: '87', label: 'هياكل عُرّف بها في صالونات وتظاهرات وطنية' },
    { value: '140', label: 'منتجات اقتصاد اجتماعي وتضامني مُدرجة' },
  ],
}

saveStore(store)

console.log('jeuness parity ok')
console.log('acronym', p.acronym)
console.log('fullName.fr', p.fullName.fr)
console.log(
  'kpi counts',
  Object.fromEntries(['fr', 'en', 'ar'].map((loc) => [loc, p.kpis[loc].length])),
)
