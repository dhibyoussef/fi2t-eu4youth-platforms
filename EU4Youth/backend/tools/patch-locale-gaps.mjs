/**
 * Fill EN/AR CMS gaps that were still French copies (contact form + home stream cards).
 * Run: node tools/patch-locale-gaps.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const storePath = join(root, 'data', 'store.json')
const store = JSON.parse(readFileSync(storePath, 'utf8'))
const blocks = store.content.blocks

function setBlock(page, section, key, locale, value) {
  const row = blocks.find(
    (b) => b.page === page && b.section === section && b.key === key && b.locale === locale,
  )
  if (!row) {
    console.warn('MISSING', page, section, key, locale)
    return false
  }
  row.value = typeof value === 'string' ? value : JSON.stringify(value, null, 2)
  return true
}

const contactLabels = {
  en: [
    { key: 'lastName', text: 'Last name' },
    { key: 'firstName', text: 'First name' },
    { key: 'organisation', text: 'Organisation / Structure' },
    { key: 'role', text: 'Role' },
    { key: 'email', text: 'Email address' },
    { key: 'phone', text: 'Phone' },
    { key: 'profile', text: 'You are…' },
    { key: 'project', text: 'Related project' },
    { key: 'location', text: 'Geographic area concerned' },
    { key: 'requestType', text: 'Purpose of the request' },
    { key: 'subject', text: 'Subject' },
    { key: 'message', text: 'Message' },
    { key: 'subjectHint', text: '100 characters maximum' },
    { key: 'messageHint', text: '2,000 characters maximum' },
  ],
  ar: [
    { key: 'lastName', text: 'اللقب' },
    { key: 'firstName', text: 'الاسم' },
    { key: 'organisation', text: 'المنظمة / الهيكل' },
    { key: 'role', text: 'الوظيفة' },
    { key: 'email', text: 'البريد الإلكتروني' },
    { key: 'phone', text: 'الهاتف' },
    { key: 'profile', text: 'أنت…' },
    { key: 'project', text: 'المشروع المعني' },
    { key: 'location', text: 'المنطقة الجغرافية المعنية' },
    { key: 'requestType', text: 'موضوع الطلب' },
    { key: 'subject', text: 'الموضوع' },
    { key: 'message', text: 'الرسالة' },
    { key: 'subjectHint', text: '100 حرف كحد أقصى' },
    { key: 'messageHint', text: '2000 حرف كحد أقصى' },
  ],
}

const contactProfiles = {
  en: [
    'Young person',
    'Association / Civil society organisation',
    'Local authority',
    'Public administration',
    'Company / Private sector',
    'University / Research centre',
    'Media',
    'Technical or financial partner',
    'Other',
  ].map((label) => ({ label })),
  ar: [
    'شاب / شابة',
    'جمعية / منظمة مجتمع مدني',
    'جماعة محلية',
    'إدارة عمومية',
    'مؤسسة / قطاع خاص',
    'جامعة / مركز بحث',
    'إعلام',
    'شريك تقني أو مالي',
    'أخرى',
  ].map((label) => ({ label })),
}

const contactProjects = {
  en: [
    'EU4Youth programme',
    "Jeun'ESS",
    'Fe3il.a',
    "Maghroum'IN",
    'Swafy',
    'Irada4Youth',
    'GO4Youth',
    'Several projects',
    "I don't know",
  ].map((label) => ({ label })),
  ar: [
    'برنامج EU4Youth',
    "Jeun'ESS",
    'Fe3il.a',
    "Maghroum'IN",
    'Swafy',
    'Irada4Youth',
    'GO4Youth',
    'عدة مشاريع',
    'لا أعرف',
  ].map((label) => ({ label })),
}

const contactLocations = {
  en: [
    'National',
    'Ariana',
    'Béja',
    'Ben Arous',
    'Bizerte',
    'Gabès',
    'Gafsa',
    'Jendouba',
    'Kairouan',
    'Kasserine',
    'Kébili',
    'Le Kef',
    'Mahdia',
    'La Manouba',
    'Médenine',
    'Monastir',
    'Nabeul',
    'Sfax',
    'Sidi Bouzid',
    'Siliana',
    'Sousse',
    'Tataouine',
    'Tozeur',
    'Tunis',
    'Zaghouan',
    'International',
    'Not applicable',
  ].map((label) => ({ label })),
  ar: [
    'وطنية',
    'أريانة',
    'باجة',
    'بن عروس',
    'بنزرت',
    'قابس',
    'قفصة',
    'جندوبة',
    'القيروان',
    'القصرين',
    'قبلي',
    'الكاف',
    'المهدية',
    'منوبة',
    'مدنين',
    'المنستير',
    'نابل',
    'صفاقس',
    'سيدي بوزيد',
    'سليانة',
    'سوسة',
    'تطاوين',
    'توزر',
    'تونس',
    'زغوان',
    'دولية',
    'غير معني',
  ].map((label) => ({ label })),
}

const contactRequests = {
  en: [
    'Information request',
    'Partnership request',
    'Project / initiative proposal',
    'Sponsorship or patronage request',
    'Media / press request',
    'Event invitation',
    'Collaboration opportunity',
    'Complaint',
    'Technical issue report (website)',
    'Other',
  ].map((label) => ({ label })),
  ar: [
    'طلب معلومات',
    'طلب شراكة',
    'اقتراح مشروع / مبادرة',
    'طلب رعاية أو دعم',
    'طلب إعلامي / صحافة',
    'دعوة إلى فعالية',
    'فرصة تعاون',
    'شكوى',
    'الإبلاغ عن مشكل تقني (الموقع)',
    'أخرى',
  ].map((label) => ({ label })),
}

const contactMisc = {
  en: {
    reset: 'Reset',
    submit: 'Send the request',
    successTitle: 'THANK YOU!',
    successBody: 'Your request has been sent. Our team will get back to you as soon as possible.',
    consent:
      'I agree that the information provided in this form will be used only to process my request, in accordance with the site privacy policy.',
    heroTitle: 'CONTACT',
  },
  ar: {
    reset: 'إعادة التعيين',
    submit: 'إرسال الطلب',
    successTitle: 'شكراً!',
    successBody: 'تم إرسال طلبكم. سيتصل بكم فريقنا في أقرب الآجال.',
    consent:
      'أوافق على أن تُستخدم المعلومات الواردة في هذا النموذج فقط لمعالجة طلبي، وفقاً لسياسة الخصوصية الخاصة بالموقع.',
    heroTitle: 'الاتصال بـ EU4Youth تونس',
  },
}

const opportunityCards = {
  en: [
    {
      title: 'Irada4Youth — 2nd call for proposals',
      meta: 'Call for projects · Closed',
      body: 'Funding for job-creating projects in six priority governorates, with CGDR.',
      date: '24 JUL 2026',
      location: 'Zaghouan · Mahdia · Le Kef · Kairouan · Kébili · Tozeur',
      action: 'See the call',
      to: '/opportunites/irada-2e-appel-a-propositions-2026',
      logo: 'irada4youth',
      thumb: '/img/photo-entretien.webp',
    },
  ],
  ar: [
    {
      title: 'Irada4Youth — النداء الثاني لتقديم المقترحات',
      meta: 'نداء مشاريع · مغلق',
      body: 'تمويل مشاريع محدثة للتشغيل في ست ولايات ذات أولوية، مع CGDR.',
      date: '24 جويلية 2026',
      location: 'زغوان · المهدية · الكاف · القيروان · قبلي · توزر',
      action: 'عرض النداء',
      to: '/opportunites/irada-2e-appel-a-propositions-2026',
      logo: 'irada4youth',
      thumb: '/img/photo-entretien.webp',
    },
  ],
}

const newsCards = {
  en: [
    {
      title: 'Major advances in ANETI’s digital transformation',
      meta: 'Go4Youth',
      body: 'SI redesign underway, GEC/GED rolled out and 102 sites connected to fibre.',
      date: 'APRIL 2026',
      location: '',
      action: 'Read the article',
      to: '/actualites/go4youth-avancees-transformation-digitale-aneti-avril-2026',
      logo: '',
      thumb: '/img/photo-celebration.webp',
    },
    {
      title: 'Go4Youth services rolled out in 48 BETIs',
      meta: 'Go4Youth',
      body: 'Remote registration and online CIVP operational; matching prepared in 14 BETIs.',
      date: 'DEC 2025',
      location: '',
      action: 'Read the article',
      to: '/actualites/go4youth-generalisation-matching-14-betis-decembre-2025',
      logo: '',
      thumb: '/img/photo-livres.webp',
    },
  ],
  ar: [
    {
      title: 'تقدم كبير في التحول الرقمي للوكالة الوطنية للتشغيل',
      meta: 'Go4Youth',
      body: 'إعادة تصميم نظام المعلومات جارية، وتعميم GEC/GED وربط 102 موقعاً بالألياف البصرية.',
      date: 'أفريل 2026',
      location: '',
      action: 'قراءة المقال',
      to: '/actualites/go4youth-avancees-transformation-digitale-aneti-avril-2026',
      logo: '',
      thumb: '/img/photo-celebration.webp',
    },
    {
      title: 'تعميم خدمات Go4Youth في 48 مكتب تشغيل',
      meta: 'Go4Youth',
      body: 'التسجيل عن بعد وCIVP عبر الإنترنت قيد التشغيل؛ التحضير للمطابقة في 14 مكتباً.',
      date: 'ديسمبر 2025',
      location: '',
      action: 'قراءة المقال',
      to: '/actualites/go4youth-generalisation-matching-14-betis-decembre-2025',
      logo: '',
      thumb: '/img/photo-livres.webp',
    },
  ],
}

const eventCards = {
  en: [
    {
      title: '48 BETI managers meet to prepare the rollout',
      meta: 'Go4Youth',
      body: 'Two workshop days bringing together pilot BETIs and those in the first rollout phase.',
      date: '4–5 DEC 2024',
      location: 'Tunis',
      action: 'See the archives',
      to: '/actualites/go4youth-48-chefs-beti-tunis-decembre-2024',
      logo: '',
      thumb: '/img/art-graffiti.webp',
    },
  ],
  ar: [
    {
      title: '48 رئيس مكتب تشغيل يجتمعون لتحضير التعميم',
      meta: 'Go4Youth',
      body: 'يومان من الورشات يجمعان مكاتب التشغيل التجريبية ومكاتب المرحلة الأولى من التعميم.',
      date: '4–5 ديسمبر 2024',
      location: 'تونس',
      action: 'عرض الأرشيف',
      to: '/actualites/go4youth-48-chefs-beti-tunis-decembre-2024',
      logo: '',
      thumb: '/img/art-graffiti.webp',
    },
  ],
}

let n = 0
for (const loc of ['en', 'ar']) {
  if (setBlock('contact', 'form', 'labels', loc, contactLabels[loc])) n++
  if (setBlock('contact', 'form', 'profiles', loc, contactProfiles[loc])) n++
  if (setBlock('contact', 'form', 'projects', loc, contactProjects[loc])) n++
  if (setBlock('contact', 'form', 'locations', loc, contactLocations[loc])) n++
  if (setBlock('contact', 'form', 'requestTypes', loc, contactRequests[loc])) n++
  if (setBlock('contact', 'form', 'reset', loc, contactMisc[loc].reset)) n++
  if (setBlock('contact', 'form', 'submit', loc, contactMisc[loc].submit)) n++
  if (setBlock('contact', 'form', 'successTitle', loc, contactMisc[loc].successTitle)) n++
  if (setBlock('contact', 'form', 'successBody', loc, contactMisc[loc].successBody)) n++
  if (setBlock('contact', 'form', 'consent', loc, contactMisc[loc].consent)) n++
  if (setBlock('contact', 'hero', 'title', loc, contactMisc[loc].heroTitle)) n++
  if (setBlock('home', 'streams', 'opportunityCards', loc, opportunityCards[loc])) n++
  if (setBlock('home', 'streams', 'newsCards', loc, newsCards[loc])) n++
  if (setBlock('home', 'streams', 'eventCards', loc, eventCards[loc])) n++
}

writeFileSync(storePath, JSON.stringify(store, null, 2))
console.log('Updated', n, 'locale blocks in', storePath)
