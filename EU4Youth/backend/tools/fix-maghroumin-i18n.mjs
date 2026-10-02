/**
 * Maghroum'IN: same FR content in EN/AR (translated), matching Irada parity approach.
 */
import { loadStore, saveStore } from '../src/store.mjs'

const store = loadStore()
const p = store.projects.find((x) => x.slug === 'maghroumin')
if (!p) throw new Error('maghroumin missing')

p.fullName = {
  fr: "Participation et inclusion des jeunes tunisien(ne)s à travers la création, l'accès à la culture et au sport",
  en: 'Participation and inclusion of young Tunisians through creation, access to culture and sport',
  ar: 'مشاركة وإدماج الشباب التونسي من خلال الإبداع والولوج إلى الثقافة والرياضة',
}

const objectiveLine = {
  fr: 'Renforcer l’inclusion et la participation des jeunes tunisien.ne.s en situation de vulnérabilité à travers la création, la culture et le sport.',
  en: 'Strengthen the inclusion and participation of vulnerable young Tunisians through creation, culture and sport.',
  ar: 'تعزيز إدماج ومشاركة الشباب التونسي في وضعية هشاشة من خلال الإبداع والثقافة والرياضة.',
}

p.generalObjective = { ...objectiveLine }
p.tagline = { ...objectiveLine }
p.taglineLocalized = { ...objectiveLine }

p.presentation = {
  fr: [
    'Maghroum’IN vise à renforcer l’inclusion et la participation des jeunes tunisien.ne.s en situation de vulnérabilité à travers la création, la culture et le sport.',
    'Le projet combine le renforcement des services publics culturels et sportifs, le soutien aux dynamiques communautaires et l’inclusion économique des jeunes dans ces secteurs.',
  ],
  en: [
    'Maghroum’IN aims to strengthen the inclusion and participation of vulnerable young Tunisians through creation, culture and sport.',
    'The project combines strengthening public cultural and sports services, supporting community dynamics, and economic inclusion of young people in these sectors.',
  ],
  ar: [
    'يهدف Maghroum’IN إلى تعزيز إدماج ومشاركة الشباب التونسي في وضعية هشاشة من خلال الإبداع والثقافة والرياضة.',
    'ويجمع المشروع بين تعزيز الخدمات العمومية الثقافية والرياضية، ودعم الديناميات المجتمعية، والإدماج الاقتصادي للشباب في هذه القطاعات.',
  ],
}

p.specificObjectives = {
  fr: [
    'Renforcer l’autonomie des jeunes dans les domaines du sport et de la culture.',
    'Soutenir et encourager leur engagement durable en faveur du changement dans les domaines du sport et de la culture.',
    'Favoriser leur représentation et veiller à ce qu’ils soient entendu.e.s dans les processus de prise de décision concernant leur vie culturelle et sportive.',
  ],
  en: [
    'Strengthen young people’s autonomy in sport and culture.',
    'Support and encourage their lasting engagement for change in sport and culture.',
    'Foster their representation and ensure they are heard in decision-making on their cultural and sporting lives.',
  ],
  ar: [
    'تعزيز استقلالية الشباب في مجالي الرياضة والثقافة.',
    'دعم وتشجيع التزامهم المستدام من أجل التغيير في مجالي الرياضة والثقافة.',
    'تيسير تمثيلهم والسهر على أن يُستمع إليهم في مسارات اتخاذ القرار المتعلقة بحياتهم الثقافية والرياضية.',
  ],
}

p.kpis = {
  fr: [
    { value: '3', label: "axes d'intervention" },
    { value: '60', label: 'mois de mise en œuvre' },
  ],
  en: [
    { value: '3', label: 'intervention axes' },
    { value: '60', label: 'months of implementation' },
  ],
  ar: [
    { value: '3', label: 'محاور تدخل' },
    { value: '60', label: 'شهرًا من التنفيذ' },
  ],
}

p.components = {
  fr: [
    {
      name: 'Services publics',
      tagline: 'Initiatives locales et nationales',
      description:
        'Initiatives locales et nationales, assistance technique aux ministères et échanges entre pairs pour renforcer l’accès des jeunes aux services culturels et sportifs.',
      results: [],
      sectors: ['Culture', 'Sport', 'Services publics'],
    },
    {
      name: 'Dynamiques communautaires',
      tagline: 'Engagement et apprentissage',
      description:
        'Soutien aux dynamiques communautaires via FESC, FAS, FOCUS, learning labs et Maghroum’IN Academy.',
      results: [],
      sectors: ['Société civile', 'Inclusion'],
    },
    {
      name: 'Inclusion économique',
      tagline: 'Incubation et accélération',
      description:
        'Incubation de nouvelles initiatives portées par des jeunes et accélération / relance d’entreprises existantes dans les secteurs culturel et sportif.',
      results: [],
      sectors: ['Entrepreneuriat', 'Industries créatives'],
    },
  ],
  en: [
    {
      name: 'Public services',
      tagline: 'Local and national initiatives',
      description:
        'Local and national initiatives, technical assistance to ministries and peer exchanges to strengthen young people’s access to cultural and sports services.',
      results: [],
      sectors: ['Culture', 'Sport', 'Public services'],
    },
    {
      name: 'Community dynamics',
      tagline: 'Engagement and learning',
      description:
        'Support for community dynamics through FESC, FAS, FOCUS, learning labs and Maghroum’IN Academy.',
      results: [],
      sectors: ['Civil society', 'Inclusion'],
    },
    {
      name: 'Economic inclusion',
      tagline: 'Incubation and acceleration',
      description:
        'Incubation of new youth-led initiatives and acceleration / relaunch of existing enterprises in the cultural and sports sectors.',
      results: [],
      sectors: ['Entrepreneurship', 'Creative industries'],
    },
  ],
  ar: [
    {
      name: 'الخدمات العمومية',
      tagline: 'مبادرات محلية ووطنية',
      description:
        'مبادرات محلية ووطنية، ومساعدة فنية للوزارات، وتبادل بين الأقران لتعزيز ولوج الشباب إلى الخدمات الثقافية والرياضية.',
      results: [],
      sectors: ['الثقافة', 'الرياضة', 'الخدمات العمومية'],
    },
    {
      name: 'الديناميات المجتمعية',
      tagline: 'التزام وتعلّم',
      description:
        'دعم الديناميات المجتمعية عبر FESC و FAS و FOCUS ومختبرات التعلّم وأكاديمية Maghroum’IN.',
      results: [],
      sectors: ['المجتمع المدني', 'الإدماج'],
    },
    {
      name: 'الإدماج الاقتصادي',
      tagline: 'احتضان وتسريع',
      description:
        'احتضان مبادرات جديدة يقودها الشباب وتسريع / إنعاش مؤسسات قائمة في القطاعين الثقافي والرياضي.',
      results: [],
      sectors: ['ريادة الأعمال', 'الصناعات الإبداعية'],
    },
  ],
}

saveStore(store)

console.log('maghroumin parity ok')
console.log(
  'kpis',
  Object.fromEntries(['fr', 'en', 'ar'].map((loc) => [loc, p.kpis[loc].map((k) => k.label)])),
)
console.log(
  'components',
  Object.fromEntries(['fr', 'en', 'ar'].map((loc) => [loc, p.components[loc].map((c) => c.name)])),
)
