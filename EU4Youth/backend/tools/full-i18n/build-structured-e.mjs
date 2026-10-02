import { writeFileSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = dirname(fileURLToPath(import.meta.url))
const catalogs = JSON.parse(readFileSync(join(root, '..', '_fr-catalogs.json'), 'utf8'))

const typeEn = {
  'Vie du programme': 'Programme life',
  'Résultat / succès de terrain': 'Result / field success',
  Événement: 'Event',
  Communiqué: 'Press release',
  'Appel à projets': 'Call for projects',
  'Appel à propositions': 'Call for proposals',
  Newsletter: 'Newsletter',
  Rapport: 'Report',
  Capitalisation: 'Capitalisation',
}
const typeAr = {
  'Vie du programme': 'حياة البرنامج',
  'Résultat / succès de terrain': 'نتيجة / نجاح ميداني',
  Événement: 'فعالية',
  Communiqué: 'بيان صحفي',
  'Appel à projets': 'نداء مشاريع',
  'Appel à propositions': 'نداء مقترحات',
  Newsletter: 'نشرة إخبارية',
  Rapport: 'تقرير',
  Capitalisation: 'رسملة',
}

const monthEn = {
  Avril: 'April',
  Décembre: 'December',
  Mai: 'May',
  Janvier: 'January',
  Septembre: 'September',
  juin: 'June',
  Juin: 'June',
  Mars: 'March',
  juillet: 'July',
}
const monthAr = {
  Avril: 'أفريل',
  Décembre: 'ديسمبر',
  Mai: 'ماي',
  Janvier: 'جانفي',
  Septembre: 'سبتمبر',
  juin: 'جوان',
  Juin: 'جوان',
  Mars: 'مارس',
  juillet: 'جويلية',
}

function dateEn(label) {
  if (!label) return label
  if (label.includes('à confirmer')) return 'Publication date to be confirmed'
  let out = label
  for (const [fr, en] of Object.entries(monthEn)) out = out.replace(fr, en)
  return out
}
function dateAr(label) {
  if (!label) return label
  if (label.includes('à confirmer')) return 'تاريخ النشر يُؤكد لاحقاً'
  let out = label
  for (const [fr, ar] of Object.entries(monthAr)) out = out.replace(fr, ar)
  return out
}

const themesEn = {
  'Emploi et employabilité · Transformation digitale': 'Employment and employability · Digital transformation',
  'Emploi et employabilité': 'Employment and employability',
  'Emploi et employabilité · Gouvernance': 'Employment and employability · Governance',
  'Emploi et entrepreneuriat · Agriculture et agroalimentaire': 'Employment and entrepreneurship · Agriculture and agri-food',
  'Emploi et entrepreneuriat': 'Employment and entrepreneurship',
  'Suivi et résultats': 'Monitoring and results',
  'Gouvernance · Participation des jeunes': 'Governance · Youth participation',
}
const themesAr = {
  'Emploi et employabilité · Transformation digitale': 'التشغيل والقابلية للتشغيل · التحول الرقمي',
  'Emploi et employabilité': 'التشغيل والقابلية للتشغيل',
  'Emploi et employabilité · Gouvernance': 'التشغيل والقابلية للتشغيل · الحوكمة',
  'Emploi et entrepreneuriat · Agriculture et agroalimentaire': 'التشغيل وريادة الأعمال · الفلاحة والصناعات الغذائية',
  'Emploi et entrepreneuriat': 'التشغيل وريادة الأعمال',
  'Suivi et résultats': 'المتابعة والنتائج',
  'Gouvernance · Participation des jeunes': 'الحوكمة · مشاركة الشباب',
}

const locEn = {
  'Présence nationale': 'National presence',
  Tunis: 'Tunis',
}
const locAr = {
  'Présence nationale': 'حضور وطني',
  Tunis: 'تونس',
}

const newsEn = [
  {
    title: 'Major advances in ANETI’s digital transformation',
    summary:
      'Information system redesign under evaluation, GEC/GED rolled out and 102 sites connected to fibre optics.',
    source: 'ANETI Newsletter No. 11 — April 2026',
  },
  {
    title: 'Service rollout and matching preparation in 14 BETIs',
    summary:
      'Remote registration and online CIVP operational in 48 BETIs; 116,990 accounts created and 17,202 companies registered.',
    source: 'ANETI Newsletter No. 10 — December 2025',
  },
  {
    title: 'CIVP and online registration rolled out in 19 additional BETIs',
    summary:
      'Two major tools extended on 10 April then 8 May 2025, bringing to 25 the number of BETIs equipped after the pilot phase.',
    source: 'ANETI Newsletter No. 8 — May 2025',
  },
  {
    title: '48 BETI managers meet in Tunis to launch the rollout',
    summary:
      'Workshops on 4 and 5 December 2024 bringing together pilot BETIs and those in the first rollout phase.',
    source: 'ANETI Newsletter No. 7 — January 2025',
  },
  {
    title: '41 new BETIs selected for the 1st rollout phase',
    summary:
      'After the pilot phase in six offices, coverage reaches 42% of the national BETI network.',
    source: 'ANETI Newsletter No. 6 — September 2024',
  },
  {
    title: 'The Go4Youth COPIL confirms entry into the rollout phase',
    summary:
      'Meeting on 7 June 2024 under the chairmanship of Minister Lotfi Dhiab, the committee validates the move from the pilot phase to rollout.',
    source: 'ANETI Newsletter No. 5 — June 2024',
  },
  {
    title: 'The ANETI profiling tool is being redesigned',
    summary:
      'After several months of experimentation, more than 40% of segments are corrected in interview; a continuous improvement unit is created.',
    source: 'ANETI Newsletter No. 4 — March 2024',
  },
  {
    title: 'New services and tools in six pilot BETIs',
    summary:
      'Experimentation in Hammam Sousse, Gafsa, Le Kef, Charguia, Gabès and Fouchana, with 118 master trainers prepared since October 2022.',
    source: 'ANETI Newsletter No. 2 — June 2023',
  },
]

const newsAr = [
  {
    title: 'تقدم كبير في التحول الرقمي للوكالة الوطنية للتشغيل',
    summary:
      'إعادة تصميم نظام المعلومات قيد التقييم، وتعميم GEC/GED وربط 102 موقعاً بالألياف البصرية.',
    source: 'نشرة ANETI عدد 11 — أفريل 2026',
  },
  {
    title: 'تعميم الخدمات وتحضير المطابقة في 14 مكتب تشغيل',
    summary:
      'التسجيل عن بعد وCIVP عبر الإنترنت قيد التشغيل في 48 مكتباً؛ إنشاء 116990 حساباً وتسجيل 17202 مؤسسة.',
    source: 'نشرة ANETI عدد 10 — ديسمبر 2025',
  },
  {
    title: 'تعميم CIVP والتسجيل عبر الإنترنت في 19 مكتب تشغيل إضافياً',
    summary:
      'امتداد أداتين رئيسيتين في 10 أفريل ثم 8 ماي 2025، ليرتفع عدد مكاتب التشغيل المجهزة إلى 25 بعد المرحلة التجريبية.',
    source: 'نشرة ANETI عدد 8 — ماي 2025',
  },
  {
    title: '48 رئيس مكتب تشغيل يجتمعون في تونس لإطلاق التعميم',
    summary:
      'ورشات يومي 4 و5 ديسمبر 2024 تجمع مكاتب التشغيل التجريبية ومكاتب المرحلة الأولى من التعميم.',
    source: 'نشرة ANETI عدد 7 — جانفي 2025',
  },
  {
    title: 'اختيار 41 مكتب تشغيل جديداً للمرحلة الأولى من التعميم',
    summary: 'بعد المرحلة التجريبية في ستة مكاتب، تبلغ التغطية 42% من الشبكة الوطنية لمكاتب التشغيل.',
    source: 'نشرة ANETI عدد 6 — سبتمبر 2024',
  },
  {
    title: 'لجنة قيادة Go4Youth تصادق على الدخول في مرحلة التعميم',
    summary:
      'اجتمعت في 7 جوان 2024 برئاسة الوزير لطفي ذياب، وتصادق اللجنة على الانتقال من المرحلة التجريبية إلى التعميم.',
    source: 'نشرة ANETI عدد 5 — جوان 2024',
  },
  {
    title: 'أداة التشخيص لدى الوكالة الوطنية للتشغيل قيد إعادة التصميم',
    summary:
      'بعد عدة أشهر من التجريب، يُصحَّح أكثر من 40% من الشرائح في المقابلة؛ وتُحدث خلية تحسين مستمر.',
    source: 'نشرة ANETI عدد 4 — مارس 2024',
  },
  {
    title: 'خدمات وأدوات جديدة في ستة مكاتب تشغيل تجريبية',
    summary:
      'تجريب في حمام سوسة وقفصة والكاف والشرقية وقابس وفوشانة، مع إعداد 118 مكوناً رئيسياً منذ أكتوبر 2022.',
    source: 'نشرة ANETI عدد 2 — جوان 2023',
  },
]

function mapNews(lang) {
  const pack = lang === 'en' ? newsEn : newsAr
  const typeMap = lang === 'en' ? typeEn : typeAr
  const themeMap = lang === 'en' ? themesEn : themesAr
  const locMap = lang === 'en' ? locEn : locAr
  return catalogs.actualites.map((item, i) => ({
    ...item,
    title: pack[i].title,
    summary: pack[i].summary,
    source: pack[i].source,
    type: typeMap[item.type] || item.type,
    dateLabel: lang === 'en' ? dateEn(item.dateLabel) : dateAr(item.dateLabel),
    themes: themeMap[item.themes] || item.themes,
    locations: locMap[item.locations] || item.locations,
  }))
}

const oppEn = {
  title: 'Irada4Youth — 2nd call for proposals',
  type: 'Call for projects',
  summary:
    'Funding for job-creating projects in six priority governorates, with CGDR. Average grant of €21,000, up to 90% of the budget.',
  deadlineLabel: '24 July 2026',
  themes: 'Employment and entrepreneurship · Agriculture and agri-food',
  audiences: 'Young graduates · Professionally certified · Project holders',
}
const oppAr = {
  title: 'Irada4Youth — النداء الثاني لتقديم المقترحات',
  type: 'نداء مشاريع',
  summary:
    'تمويل مشاريع محدثة للتشغيل في ست ولايات ذات أولوية، مع CGDR. منحة متوسطة قدرها 21000 يورو، تصل إلى 90% من الميزانية.',
  deadlineLabel: '24 جويلية 2026',
  themes: 'التشغيل وريادة الأعمال · الفلاحة والصناعات الغذائية',
  audiences: 'شباب متخرجون · حاصلون على شهادات مهنية · حاملات وحاملو مشاريع',
}

function mapOpp(lang) {
  const pack = lang === 'en' ? oppEn : oppAr
  return catalogs.opportunites.map((item) => ({
    ...item,
    ...pack,
    locations: item.locations,
    locationLabel: item.locationLabel,
  }))
}

const pubsEn = [
  {
    title: 'ANETI newsletter — issue 11',
    summary:
      'Advances in ANETI’s digital transformation: information system under selection, GEC/GED rolled out and 102 sites connected to fibre.',
  },
  {
    title: 'ANETI newsletter — issue 10',
    summary:
      'New services operational in 48 BETIs; preparation of matching and vacancy management in 14 BETIs.',
  },
  {
    title: 'Go4Youth newsletter — issue 8',
    summary:
      'Rollout of CIVP and online registration in 19 additional BETIs, bringing the total equipped to 25.',
  },
  {
    title: 'ANETI newsletter — issue 7',
    summary: '48 BETI managers met in Tunis on 4 and 5 December 2024 to launch the rollout.',
  },
  {
    title: 'ANETI newsletter — issue 6',
    summary: 'Selection of 41 new BETIs for the first rollout phase (42% of the network).',
  },
  {
    title: 'ANETI newsletter — issue 5',
    summary: 'The steering committee of 7 June 2024 confirms the project’s entry into the rollout phase.',
  },
  {
    title: 'Go4Youth newsletter — issue 4',
    summary: 'Redesign of the profiling tool and creation of a continuous improvement unit.',
  },
  {
    title: 'Go4Youth newsletter — issue 2',
    summary: 'New services and tools tested in six pilot BETIs.',
  },
  {
    title: 'Irada4Youth — 2nd call for proposals',
    summary: 'Presentation of the conditions, priority sectors and modalities of the second call.',
  },
  {
    title: 'Irada4Youth — 2025 narrative report',
    summary:
      'Interim narrative report No. 3 on 2025 achievements: tranche monitoring, delays and capacity strengthening.',
  },
  {
    title: 'Irada4Youth — 2024 narrative report',
    summary: 'Interim narrative report No. 2: 51 contracts, implementation and preparation of the second call.',
  },
  {
    title: 'Irada4Youth — 2023 narrative report',
    summary:
      'Narrative report of achievements June 2022–December 2023: launch, first call and 306 eligible applications.',
  },
  {
    title: 'Capitalisation of the youth forums experience',
    summary: 'Capitalisation of the youth forums experience conducted under the Fe3il.a project.',
  },
]

const pubsAr = [
  {
    title: 'نشرة ANETI الإخبارية — العدد 11',
    summary:
      'تقدم في التحول الرقمي للوكالة الوطنية للتشغيل: نظام المعلومات قيد الاختيار، وتعميم GEC/GED وربط 102 موقعاً بالألياف.',
  },
  {
    title: 'نشرة ANETI الإخبارية — العدد 10',
    summary: 'خدمات جديدة قيد التشغيل في 48 مكتب تشغيل؛ تحضير المطابقة وتسيير العرض في 14 مكتباً.',
  },
  {
    title: 'نشرة Go4Youth الإخبارية — العدد 8',
    summary: 'تعميم CIVP والتسجيل عبر الإنترنت في 19 مكتب تشغيل إضافياً، ليرتفع المجموع المجهز إلى 25.',
  },
  {
    title: 'نشرة ANETI الإخبارية — العدد 7',
    summary: 'اجتماع 48 رئيس مكتب تشغيل في تونس يومي 4 و5 ديسمبر 2024 لإطلاق التعميم.',
  },
  {
    title: 'نشرة ANETI الإخبارية — العدد 6',
    summary: 'اختيار 41 مكتب تشغيل جديداً للمرحلة الأولى من التعميم (42% من الشبكة).',
  },
  {
    title: 'نشرة ANETI الإخبارية — العدد 5',
    summary: 'لجنة القيادة بتاريخ 7 جوان 2024 تصادق على دخول المشروع مرحلة التعميم.',
  },
  {
    title: 'نشرة Go4Youth الإخبارية — العدد 4',
    summary: 'إعادة تصميم أداة التشخيص وإحداث خلية تحسين مستمر.',
  },
  {
    title: 'نشرة Go4Youth الإخبارية — العدد 2',
    summary: 'خدمات وأدوات جديدة مجرَّبة في ستة مكاتب تشغيل تجريبية.',
  },
  {
    title: 'Irada4Youth — النداء الثاني لتقديم المقترحات',
    summary: 'عرض شروط النداء الثاني والقطاعات ذات الأولوية وصيغه.',
  },
  {
    title: 'Irada4Youth — التقرير السردي 2025',
    summary: 'تقرير سردي وسيط عدد 3 حول إنجازات 2025: متابعة الأقساط والتأخيرات وتعزيز القدرات.',
  },
  {
    title: 'Irada4Youth — التقرير السردي 2024',
    summary: 'تقرير سردي وسيط عدد 2: 51 عقداً، والتنفيذ وتحضير النداء الثاني.',
  },
  {
    title: 'Irada4Youth — التقرير السردي 2023',
    summary: 'تقرير سردي للإنجازات يونيو 2022–ديسمبر 2023: الإطلاق والنداء الأول و306 ملفات مؤهلة.',
  },
  {
    title: 'رسملة تجربة منتديات الشباب',
    summary: 'رسملة تجربة منتديات الشباب المنجزة في إطار مشروع Fe3il.a.',
  },
]

function mapPubs(lang) {
  const pack = lang === 'en' ? pubsEn : pubsAr
  const typeMap = lang === 'en' ? typeEn : typeAr
  const themeMap = lang === 'en' ? themesEn : themesAr
  return catalogs.publications.map((item, i) => ({
    ...item,
    title: pack[i].title,
    summary: pack[i].summary,
    type: typeMap[item.type] || item.type,
    dateLabel: lang === 'en' ? dateEn(item.dateLabel) : dateAr(item.dateLabel),
    themes: themeMap[item.themes] || item.themes,
    language: lang === 'en' ? 'French' : 'الفرنسية',
    fileSize: item.fileSize
      ? lang === 'en'
        ? item.fileSize.replace('Mo', 'MB').replace('Ko', 'KB')
        : item.fileSize
      : item.fileSize,
  }))
}

const structured = {
  'actualites|browser|items': { en: mapNews('en'), ar: mapNews('ar') },
  'opportunites|browser|items': { en: mapOpp('en'), ar: mapOpp('ar') },
  'publications|browser|items': { en: mapPubs('en'), ar: mapPubs('ar') },
  'home|hero|slides': {
    en: [{ label: 'Home photo', image: '/img/home-hero-v2.webp' }],
    ar: [{ label: 'صورة الصفحة الرئيسية', image: '/img/home-hero-v2.webp' }],
  },
}

writeFileSync(join(root, 'structured-e.json'), JSON.stringify(structured, null, 2))
console.log('Wrote structured-e', Object.keys(structured).length)
