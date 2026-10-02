/**
 * SWAFY: translate EN/AR bags that were still French (Maghroum-style parity).
 */
import { loadStore, saveStore } from '../src/store.mjs'

const store = loadStore()
const p = store.projects.find((x) => x.slug === 'swafy')
if (!p) throw new Error('swafy missing')

p.acronym = { fr: 'SWAFY', en: 'SWAFY', ar: 'SWAFY' }

p.fullName = {
  fr: 'Science With And For Youth',
  en: 'Science With And For Youth',
  ar: 'العلوم مع الشباب ومن أجلهم',
}

const tagline = {
  fr: 'Renforcer la contribution de la recherche et de l’innovation au développement économique et social avec et pour les jeunes.',
  en: 'Strengthen the contribution of research and innovation to economic and social development with and for young people.',
  ar: 'تعزيز مساهمة البحث والابتكار في التنمية الاقتصادية والاجتماعية مع الشباب ومن أجلهم.',
}
p.tagline = { ...tagline }
p.taglineLocalized = { ...tagline }

p.generalObjective = {
  fr: 'Contribuer au renforcement de la contribution de la recherche scientifique et de l’innovation au développement économique et social en Tunisie, en favorisant l’intégration des jeunes dans les écosystèmes scientifiques, technologiques et entrepreneuriaux.',
  en: 'Help strengthen the contribution of scientific research and innovation to economic and social development in Tunisia, by fostering the integration of young people into scientific, technological and entrepreneurial ecosystems.',
  ar: 'المساهمة في تعزيز دور البحث العلمي والابتكار في التنمية الاقتصادية والاجتماعية في تونس، من خلال تيسير إدماج الشباب في المنظومات العلمية والتكنولوجية وريادة الأعمال.',
}

p.name = {
  fr: 'SWAFY — sciences et politiques publiques',
  en: 'SWAFY — science and public policy',
  ar: 'SWAFY — العلوم والسياسات العمومية',
}

p.presentation = {
  fr: [
    'SWAFY contribue au renforcement de la contribution de la recherche scientifique et de l’innovation au développement économique et social en Tunisie, en favorisant l’intégration des jeunes dans les écosystèmes scientifiques, technologiques et entrepreneuriaux.',
    'Le projet combine des bourses de recherche partenariale, des actions de culture scientifique et un dialogue national jeunesse-science.',
  ],
  en: [
    'SWAFY helps strengthen the contribution of scientific research and innovation to economic and social development in Tunisia, by fostering the integration of young people into scientific, technological and entrepreneurial ecosystems.',
    'The project combines partnership research scholarships, science-culture actions and a national youth–science dialogue.',
  ],
  ar: [
    'يساهم SWAFY في تعزيز دور البحث العلمي والابتكار في التنمية الاقتصادية والاجتماعية في تونس، من خلال تيسير إدماج الشباب في المنظومات العلمية والتكنولوجية وريادة الأعمال.',
    'ويجمع المشروع بين منح بحث تشاركي، وأنشطة للثقافة العلمية، وحوار وطني بين الشباب والعلم.',
  ],
}

p.specificObjectives = {
  fr: [
    'Renforcer l’employabilité des jeunes chercheurs et chercheuses.',
    'Développer la créativité et l’esprit entrepreneurial des jeunes.',
    'Renforcer la participation des jeunes dans les politiques Science, Technologie et Innovation.',
  ],
  en: [
    'Strengthen the employability of young researchers.',
    'Develop young people’s creativity and entrepreneurial mindset.',
    'Strengthen youth participation in Science, Technology and Innovation policies.',
  ],
  ar: [
    'تعزيز قابلية تشغيل الباحثين والباحثات الشباب.',
    'تنمية الإبداع وروح ريادة الأعمال لدى الشباب.',
    'تعزيز مشاركة الشباب في سياسات العلوم والتكنولوجيا والابتكار.',
  ],
}

p.kpis = {
  fr: [
    { value: '235', label: 'bourses MOBIDOC doctorales et post-doctorales prévues' },
    { value: '3', label: 'composantes structurantes' },
  ],
  en: [
    { value: '235', label: 'planned MOBIDOC doctoral and post-doctoral scholarships' },
    { value: '3', label: 'structuring components' },
  ],
  ar: [
    { value: '235', label: 'منحة MOBIDOC للدكتوراه وما بعد الدكتوراه مبرمجة' },
    { value: '3', label: 'مكوّنات هيكلية' },
  ],
}

p.components = {
  fr: [
    {
      name: 'MOBIDOC',
      tagline: 'Bourses de recherche partenariale',
      description:
        'Financement de collaborations entre structures de recherche et environnement socio-économique pour renforcer l’employabilité des jeunes chercheurs et chercheuses.',
      results: ['235 bourses doctorales et post-doctorales prévues'],
      sectors: ['Recherche', 'Innovation'],
    },
    {
      name: 'Jeunesse Créative',
      tagline: 'Créativité et culture scientifique',
      description:
        'Actions de médiation, de vulgarisation scientifique et d’expérimentation pour développer la créativité et l’esprit entrepreneurial des jeunes.',
      results: [],
      sectors: ['Culture scientifique', 'Éducation'],
    },
    {
      name: 'Débat Jeunesse et Science',
      tagline: 'Participation aux politiques STI',
      description:
        'Dialogue national jeunesse-science : analyses, recommandations, feuille de route et Congrès national Jeunesse–Science en appui à la stratégie nationale de la jeunesse 2035.',
      results: [],
      sectors: ['Politiques publiques'],
    },
  ],
  en: [
    {
      name: 'MOBIDOC',
      tagline: 'Partnership research scholarships',
      description:
        'Funding collaborations between research structures and the socio-economic environment to strengthen the employability of young researchers.',
      results: ['235 doctoral and post-doctoral scholarships planned'],
      sectors: ['Research', 'Innovation'],
    },
    {
      name: 'Creative Youth',
      tagline: 'Creativity and scientific culture',
      description:
        'Science mediation, outreach and experimentation actions to develop young people’s creativity and entrepreneurial mindset.',
      results: [],
      sectors: ['Scientific culture', 'Education'],
    },
    {
      name: 'Youth and Science Debate',
      tagline: 'Participation in STI policies',
      description:
        'National youth–science dialogue: analyses, recommendations, roadmap and National Youth–Science Congress in support of the 2035 national youth strategy.',
      results: [],
      sectors: ['Public policies'],
    },
  ],
  ar: [
    {
      name: 'MOBIDOC',
      tagline: 'منح بحث تشاركي',
      description:
        'تمويل تعاون بين هياكل البحث والمحيط الاجتماعي والاقتصادي لتعزيز قابلية تشغيل الباحثين والباحثات الشباب.',
      results: ['235 منحة دكتوراه وما بعد الدكتوراه مبرمجة'],
      sectors: ['البحث', 'الابتكار'],
    },
    {
      name: 'شباب مبدع',
      tagline: 'إبداع وثقافة علمية',
      description:
        'أنشطة وساطة وتعميم علمي وتجريب لتنمية الإبداع وروح ريادة الأعمال لدى الشباب.',
      results: [],
      sectors: ['الثقافة العلمية', 'التربية'],
    },
    {
      name: 'حوار الشباب والعلم',
      tagline: 'المشاركة في سياسات العلوم والتكنولوجيا والابتكار',
      description:
        'حوار وطني بين الشباب والعلم: تحليلات وتوصيات وخارطة طريق ومؤتمر وطني للشباب والعلم لدعم الاستراتيجية الوطنية للشباب 2035.',
      results: [],
      sectors: ['السياسات العمومية'],
    },
  ],
}

saveStore(store)

console.log('swafy parity ok')
console.log(
  'kpis',
  Object.fromEntries(['fr', 'en', 'ar'].map((loc) => [loc, p.kpis[loc].map((k) => k.label)])),
)
console.log(
  'components',
  Object.fromEntries(['fr', 'en', 'ar'].map((loc) => [loc, p.components[loc].map((c) => c.name)])),
)
