/**
 * Sync CMS store from « Sections trilingues » source pack.
 * Safe: updates content/nav/glossary only; does not touch layout CSS beyond nav labels.
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const extractDir = join(root, 'tools', '_trilingual_extract')
const storePath = join(root, 'backend', 'data', 'store.json')
const catalogGlossPath = join(root, 'backend', 'data', 'catalog', 'glossary.json')
const backupPath = join(root, 'backend', 'data', `store.json.bak-trilingual-${Date.now()}`)

const bag = (fr, en, ar) => ({ fr, en, ar })

function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function setBlock(store, page, section, key, locale, value) {
  let block = store.content.blocks.find(
    (b) => b.page === page && b.section === section && b.key === key && b.locale === locale,
  )
  if (!block) {
    block = {
      id: store.content.nextBlockId++,
      page,
      section,
      key,
      locale,
      type: typeof value === 'string' && value.trim().startsWith('[') ? 'json' : 'text',
      label: key,
      value,
    }
    store.content.blocks.push(block)
  } else {
    block.value = value
  }
}

function setBlockAll(store, page, section, key, values) {
  for (const [locale, value] of Object.entries(values)) {
    setBlock(store, page, section, key, locale, value)
  }
}

// ---------- Glossary ----------
function importGlossary(store) {
  const DATA = loadJson(join(extractDir, 'glossary-parsed.json'))
  const glossary = DATA.map((cat) => ({
    id: cat.id,
    label: bag(cat.label_fr, cat.label_en, cat.label_ar),
    color: cat.color,
    entries: (cat.terms || []).map((t) => ({
      term: bag(t.term_fr, t.term_en, t.term_ar),
      tag: bag(t.tag_fr || '', t.tag_en || '', t.tag_ar || ''),
      def: bag(t.def_fr || '', t.def_en || '', t.def_ar || ''),
      ctx: bag(t.ctx_fr || '', t.ctx_en || '', t.ctx_ar || ''),
    })),
  }))
  store.glossary = glossary
  writeFileSync(catalogGlossPath, JSON.stringify(glossary, null, 2), 'utf8')
  const n = glossary.reduce((a, c) => a + c.entries.length, 0)
  console.log('glossary:', glossary.length, 'categories,', n, 'entries')
}

// ---------- Site nav (remarques) ----------
function syncNav(store) {
  const nav = store.siteNav || []
  const byId = (id) => nav.find((n) => n.id === id)

  // Rename top media menu → Restez informé·es
  const media = byId(21)
  if (media) {
    media.label_fr = 'Restez informé·es'
    media.label_en = 'Stay informed'
    media.label_ar = 'ابقوا على اطلاع'
    media.url = '/publications'
  }

  // Médias → Revue de presse
  const presse = byId(24)
  if (presse) {
    presse.label_fr = 'Revue de presse'
    presse.label_en = 'Press review'
    presse.label_ar = 'مراجعة الصحافة'
    presse.url = '/coin-media'
    presse.sort_order = 4
  }

  // Move Actualités under Stay informed; remove Événements
  const actualites = byId(17)
  if (actualites) {
    actualites.parent_id = 21
    actualites.sort_order = 1
  }

  // Reorder children of Stay informed: Actualités, Publications, Glossaire, Revue de presse
  const pubs = byId(22)
  const gloss = byId(23)
  if (pubs) pubs.sort_order = 2
  if (gloss) gloss.sort_order = 3
  if (presse) presse.sort_order = 4

  // Top-level news group becomes Opportunités only
  const newsGroup = byId(16)
  if (newsGroup) {
    newsGroup.label_fr = 'Opportunités'
    newsGroup.label_en = 'Opportunities'
    newsGroup.label_ar = 'الفرص'
    newsGroup.url = '/opportunites'
  }

  const opps = byId(18)
  if (opps) {
    opps.parent_id = 16
    opps.sort_order = 1
  }

  // Deactivate Événements in nav (route /agenda remains)
  const events = byId(19)
  if (events) {
    events.is_active = false
    events.parent_id = 21
    events.sort_order = 99
  }

  console.log('siteNav updated per remarques')
}

// ---------- Contact form lists ----------
function syncContact(store) {
  const profiles = {
    fr: [
      'Jeune',
      'Association / Organisation de la société civile',
      'Collectivité locale',
      'Administration publique',
      'Entreprise / Secteur privé',
      'Université / Centre de recherche',
      'Média',
      'Partenaire technique ou financier',
      'Autre',
    ],
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
    ],
    ar: [
      'شاب / شابة',
      'جمعية / منظمة مجتمع مدني',
      'جماعة محلية',
      'إدارة عمومية',
      'مؤسسة / قطاع خاص',
      'جامعة / مركز بحث',
      'إعلام',
      'شريك فني أو مالي',
      'آخر',
    ],
  }
  const projects = {
    fr: [
      'Programme EU4Youth',
      "Jeun'ESS",
      'Fe3il.a',
      "Maghroum'IN",
      'Swafy',
      'Irada4Youth',
      'GO4Youth',
      'Plusieurs projets',
      'Je ne sais pas',
    ],
    en: [
      'EU4Youth programme',
      "Jeun'ESS",
      'Fe3il.a',
      "Maghroum'IN",
      'SWAFY',
      'Irada4Youth',
      'GO4Youth',
      'Several projects',
      'I don’t know',
    ],
    ar: [
      'برنامج EU4Youth',
      "Jeun'ESS",
      'Fe3il.a',
      "Maghroum'IN",
      'SWAFY',
      'Irada4Youth',
      'GO4Youth',
      'عدة مشاريع',
      'لا أعرف',
    ],
  }
  const requestTypes = {
    fr: [
      "Demande d'information",
      'Demande de partenariat',
      'Proposition de projet / initiative',
      'Demande de sponsoring ou de mécénat',
      'Demande média / presse',
      'Invitation à un événement',
      'Opportunité de collaboration',
      'Réclamation',
      "Signalement d'un problème technique (site web)",
      'Autre',
    ],
    en: [
      'Information request',
      'Partnership request',
      'Project / initiative proposal',
      'Sponsorship / patronage request',
      'Media / press request',
      'Event invitation',
      'Collaboration opportunity',
      'Complaint',
      'Technical issue report (website)',
      'Other',
    ],
    ar: [
      'طلب معلومات',
      'طلب شراكة',
      'اقتراح مشروع / مبادرة',
      'طلب رعاية أو دعم',
      'طلب إعلامي / صحفي',
      'دعوة إلى فعالية',
      'فرصة تعاون',
      'شكوى',
      'الإبلاغ عن مشكل تقني (الموقع)',
      'آخر',
    ],
  }

  const toJson = (labels) => JSON.stringify(labels.map((label) => ({ label })))

  for (const locale of ['fr', 'en', 'ar']) {
    setBlock(store, 'contact', 'form', 'profiles', locale, toJson(profiles[locale]))
    setBlock(store, 'contact', 'form', 'projects', locale, toJson(projects[locale]))
    setBlock(store, 'contact', 'form', 'requestTypes', locale, toJson(requestTypes[locale]))
  }

  setBlockAll(store, 'contact', 'form', 'success', {
    fr: 'Merci ! Votre demande a bien été envoyée. Notre équipe vous répondra dans les meilleurs délais.',
    en: 'Thank you! Your request has been sent. Our team will get back to you as soon as possible.',
    ar: 'شكرًا لكم! تم إرسال طلبكم بنجاح. سيردّ فريقنا عليكم في أقرب الآجال.',
  })
  setBlockAll(store, 'contact', 'form', 'submit', {
    fr: 'Envoyer la demande',
    en: 'Send the request',
    ar: 'إرسال الطلب',
  })
  setBlockAll(store, 'contact', 'form', 'consent', {
    fr: "J'accepte que les informations renseignées dans ce formulaire soient utilisées uniquement pour le traitement de ma demande, conformément à la politique de confidentialité du site.",
    en: 'I agree that the information provided in this form will be used solely to process my request, in accordance with the site’s privacy policy.',
    ar: 'أوافق على أن تُستخدم المعلومات الواردة في هذا النموذج فقط لمعالجة طلبي، وفقًا لسياسة سرية الموقع.',
  })
  setBlockAll(store, 'contact', 'form', 'messagePlaceholder', {
    fr: 'Décrivez votre demande de manière détaillée afin que nous puissions vous répondre dans les meilleurs délais.',
    en: 'Please describe your request in detail so we can respond as quickly as possible.',
    ar: 'صفوا طلبكم بالتفصيل حتى نتمكن من الرد عليكم في أفضل الآجال.',
  })

  console.log('contact form lists synced')
}

// ---------- Section headers (texte entete) ----------
function syncSectionHeaders(store) {
  const path = join(extractDir, 'texte_entete_sections_-_trilingue_.txt')
  if (!existsSync(path)) {
    console.log('skip section headers (file missing)')
    return
  }
  const text = readFileSync(path, 'utf8')
  // Soft map common hero titles if present as FR / EN / AR triples in tables
  // File is short — store raw for audit; apply known pairs when detected.
  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean)
  writeFileSync(join(extractDir, 'entete-lines.json'), JSON.stringify(lines, null, 2))
  console.log('section headers extracted:', lines.length, 'lines (mapped selectively below)')
}

// ---------- Programme hero / pourquoi / vision / axes ----------
function syncProgramme(store) {
  // FR hero
  setBlockAll(store, 'a-propos', 'hero', 'badge', {
    fr: "Programme d'appui à la jeunesse tunisienne",
    en: "A programme supporting Tunisia's youth",
    ar: 'برنامج دعم الشباب التونسي',
  })
  setBlockAll(store, 'a-propos', 'hero', 'title', {
    fr: 'EU4Youth accompagne les jeunes Tunisiennes et Tunisiens dans leurs parcours, leurs projets et leur engagement.',
    en: 'EU4Youth stands with young Tunisian women and men in their paths, their projects and their engagement.',
    ar: 'يرافق EU4Youth الشابات والشبان التونسيين في مساراتهم ومشاريعهم والتزامهم.',
  })
  setBlockAll(store, 'a-propos', 'hero', 'body', {
    fr:
      "EU4Youth est le principal programme de l'Union européenne d’appui à la jeunesse tunisienne. Depuis 2019, il réunit six projets complémentaires qui agissent ensemble pour renforcer les opportunités d'emploi, d'entrepreneuriat, de culture, de sport, de science et de participation citoyenne des jeunes de 18 à 35 ans, dans toutes les régions du pays.\n\nEU4Youth s'inscrit dans une dynamique de coopération entre l'Union européenne, les institutions tunisiennes et les acteurs des territoires pour que chaque jeune, où qu'il se trouve, puisse accéder aux ressources, aux soutiens et aux opportunités.",
    en:
      "EU4Youth is the European Union's flagship programme in support of Tunisia's youth. Since 2019, it has brought together six complementary projects working in tandem to expand opportunities in employment, entrepreneurship, culture, sport, science and civic participation for young people aged 18 to 35, across every region of the country.\n\nEU4Youth is built on cooperation between the European Union, Tunisian institutions and local actors, so that every young person, wherever they live, can access resources, support and opportunities.",
    ar:
      'يُعد EU4Youth البرنامج الرئيسي للاتحاد الأوروبي لدعم الشباب في تونس. ومنذ سنة 2019، يجمع هذا البرنامج بين ستة مشاريع متكاملة تعمل معًا على توسيع فرص التشغيل وريادة الأعمال والثقافة والرياضة والعلوم والمشاركة المواطنية للشباب الذين تتراوح أعمارهم بين 18 و35 سنة، في جميع جهات البلاد.\n\nويقوم EU4Youth على ديناميكية تعاون بين الاتحاد الأوروبي والمؤسسات التونسية والفاعلين المحليين، حتى يتمكن كل شاب، أينما كان، من الوصول إلى الموارد وأشكال الدعم والفرص المتاحة.',
  })

  setBlockAll(store, 'a-propos', 'pourquoi', 'title', {
    fr: 'Pourquoi EU4Youth ?',
    en: 'Why EU4Youth?',
    ar: 'لماذا برنامج دعم الشباب التونسي؟',
  })
  setBlockAll(store, 'a-propos', 'pourquoi', 'quote', {
    fr: "« EU4Youth s'inscrit dans une dynamique de coopération entre l'Union européenne, les institutions tunisiennes et les acteurs locaux afin de soutenir les parcours, les initiatives et l'engagement des jeunes. »",
    en: '"EU4Youth is built on cooperation between the European Union, Tunisian institutions and local actors, in support of young people\'s paths, initiatives and engagement."',
    ar: '"يقوم EU4Youth على ديناميكية تعاون بين الاتحاد الأوروبي والمؤسسات التونسية والفاعلين المحليين، دعمًا لمسارات الشباب ومبادراتهم والتزامهم."',
  })

  setBlockAll(store, 'a-propos', 'comment', 'title', {
    fr: 'COMMENT\nLE PROGRAMME AGIT',
    en: 'HOW THE PROGRAMME\nWORKS',
    ar: 'كيف\nيعمل البرنامج',
  })
  setBlockAll(store, 'objectifs', 'action', 'title', {
    fr: 'COMMENT\nLE PROGRAMME AGIT',
    en: 'HOW THE PROGRAMME\nWORKS',
    ar: 'كيف\nيعمل البرنامج',
  })

  const axes = {
    fr: [
      {
        kicker: 'AXE 1',
        title: 'EMPLOI ET OPPORTUNITÉS ÉCONOMIQUES',
        body: "Le programme renforce l'accès des jeunes aux opportunités économiques, qu'il s'agisse de création d'entreprises, d'accès à l'emploi salarié ou de développement de projets dans des filières porteuses. Il agit sur plusieurs leviers complémentaires : le soutien à l'entrepreneuriat social et collectif, la modernisation des services d'orientation et d'intermédiation sur le marché du travail, la promotion de la recherche et de la créativité comme chemins vers l'emploi, et le financement de projets économiques ancrés dans les territoires.",
        icon: '1',
      },
      {
        kicker: 'AXE 2',
        title: 'CULTURE, SPORT ET PARTICIPATION',
        body: "EU4Youth considère la culture et le sport comme des leviers d'inclusion à part entière. Le programme renforce les opérateurs culturels et sportifs, améliore l'accès des jeunes en situation de vulnérabilité aux pratiques créatives et sportives, et développe l'employabilité dans ces secteurs. En parallèle, il crée les conditions d'une participation citoyenne authentique des jeunes — au niveau de leurs communes, de leurs associations, et des politiques publiques qui les concernent.",
        icon: '2',
      },
      {
        kicker: 'AXE 3',
        title: 'INNOVATION, RECHERCHE ET DÉVELOPPEMENT TERRITORIAL',
        body: "Le programme investit dans la recherche et l'innovation comme ressources pour l'emploi des jeunes chercheurs et pour le développement de la société. Il appuie également une logique de développement territorial fondée sur l'émergence d'écosystèmes locaux dynamiques — des réseaux d'acteurs qui se connaissent, coopèrent et créent ensemble des opportunités pour les jeunes de leurs régions. Cette logique territoriale est au coeur de la conception d'EU4Youth, de sa sélection des zones d'intervention à ses modalités de mise en oeuvre.",
        icon: '3',
      },
    ],
    en: [
      {
        kicker: 'AXIS 1',
        title: 'EMPLOYMENT AND ECONOMIC OPPORTUNITIES',
        body: "The programme strengthens young people's access to economic opportunities, whether through business creation, salaried employment or developing projects in promising sectors. It acts on several complementary levers: support for social and collective entrepreneurship, modernisation of guidance and labour-market intermediation services, promotion of research and creativity as pathways to employment, and funding of economic projects rooted in the territories.",
        icon: '1',
      },
      {
        kicker: 'AXIS 2',
        title: 'CULTURE, SPORT AND PARTICIPATION',
        body: 'EU4Youth treats culture and sport as full inclusion levers. The programme strengthens cultural and sports operators, improves access for vulnerable young people to creative and sports practice, and develops employability in these sectors. In parallel, it creates the conditions for genuine youth civic participation — in municipalities, associations, and the public policies that concern them.',
        icon: '2',
      },
      {
        kicker: 'AXIS 3',
        title: 'INNOVATION, RESEARCH AND TERRITORIAL DEVELOPMENT',
        body: "The programme invests in research and innovation as resources for young researchers' employment and for society's development. It also supports a territorial development approach based on dynamic local ecosystems — networks of actors who know each other, cooperate and create opportunities together for young people in their regions. This territorial logic is central to EU4Youth, from selecting intervention areas to delivery modalities.",
        icon: '3',
      },
    ],
    ar: [
      {
        kicker: 'المحور 1',
        title: 'التشغيل والفرص الاقتصادية',
        body: 'يعزز البرنامج نفاذ الشباب إلى الفرص الاقتصادية، سواء عبر إحداث مؤسسات أو النفاذ إلى الشغل القار أو تطوير مشاريع في قطاعات واعدة. ويعمل على عدة روافع متكاملة: دعم ريادة الأعمال الاجتماعية والجماعية، تحديث خدمات التوجيه والوساطة في سوق الشغل، تشجيع البحث والإبداع كمسارات نحو التشغيل، وتمويل مشاريع اقتصادية مترسّخة في الجهات.',
        icon: '1',
      },
      {
        kicker: 'المحور 2',
        title: 'الثقافة والرياضة والمشاركة',
        body: 'يعتبر EU4Youth الثقافة والرياضة رافعتين حقيقيتين للإدماج. فيعزّز البرنامج الفاعلين الثقافيين والرياضيين، ويحسّن نفاذ الشباب في وضعيات الهشاشة إلى الممارسات الإبداعية والرياضية، ويطوّر القابلية للتشغيل في هذين القطاعين. وبالتوازي، يهيّئ البرنامج الظروف لمشاركة مواطنية حقيقية للشباب، على مستوى بلدياتهم وجمعياتهم والسياسات العمومية التي تعنيهم.',
        icon: '2',
      },
      {
        kicker: 'المحور 3',
        title: 'الابتكار والبحث والتنمية الجهوية',
        body: 'يستثمر البرنامج في البحث العلمي والابتكار كموارد لتشغيل الباحثين الشباب ولتنمية المجتمع. كما يدعم مقاربة للتنمية الجهوية قائمة على بروز منظومات محلية دينامية، أي شبكات من الفاعلين يتعارفون ويتعاونون ويخلقون معًا فرصًا للشباب في جهاتهم. وتُعد هذه المقاربة الجهوية في صلب تصميم EU4Youth، من اختيار جهات التدخل إلى طرق التنفيذ.',
        icon: '3',
      },
    ],
  }

  for (const locale of ['fr', 'en', 'ar']) {
    setBlock(store, 'a-propos', 'comment', 'items', locale, JSON.stringify(axes[locale]))
    setBlock(store, 'objectifs', 'action', 'items', locale, JSON.stringify(axes[locale]))
  }

  console.log('programme hero / axes synced')
}

// ---------- Main ----------
copyFileSync(storePath, backupPath)
console.log('backup', backupPath)

const store = loadJson(storePath)
importGlossary(store)
syncNav(store)
syncContact(store)
syncSectionHeaders(store)
syncProgramme(store)

writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8')
console.log('store saved')
