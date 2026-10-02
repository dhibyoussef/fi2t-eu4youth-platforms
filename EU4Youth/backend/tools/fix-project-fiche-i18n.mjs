/**
 * PJ1–PJ2: unwrap nested impactIntro bags and fill EN/AR fiche fields.
 */
import { loadStore, saveStore } from '../src/store.mjs'

function bag(fr, en, ar) {
  return { fr, en, ar }
}

function unwrapBag(value) {
  let current = value
  let guard = 0
  while (
    current &&
    typeof current === 'object' &&
    !Array.isArray(current) &&
    guard < 4
  ) {
    const nested =
      current.fr && typeof current.fr === 'object' && !Array.isArray(current.fr)
        ? current.fr
        : null
    if (!nested) break
    current = {
      fr: typeof nested.fr === 'string' ? nested.fr : '',
      en:
        (typeof current.en === 'string' && current.en) ||
        (typeof nested.en === 'string' ? nested.en : '') ||
        '',
      ar:
        (typeof current.ar === 'string' && current.ar) ||
        (typeof nested.ar === 'string' ? nested.ar : '') ||
        '',
    }
    guard += 1
  }
  if (current && typeof current === 'object' && !Array.isArray(current)) {
    return {
      fr: typeof current.fr === 'string' ? current.fr : '',
      en: typeof current.en === 'string' ? current.en : '',
      ar: typeof current.ar === 'string' ? current.ar : '',
    }
  }
  if (typeof current === 'string') return bag(current, '', '')
  return bag('', '', '')
}

/** Fiche translations — same meaning as FR. */
const FICHE = {
  jeuness: {
    period: bag(
      'Septembre 2019 – Août 2024',
      'September 2019 – August 2024',
      'سبتمبر 2019 – أغسطس 2024',
    ),
    partner: bag(
      'Organisation internationale du Travail (OIT)',
      'International Labour Organization (ILO)',
      'منظمة العمل الدولية (OIT)',
    ),
    sectors: bag(
      'Économie sociale et solidaire, entrepreneuriat social, emploi des jeunes, développement territorial',
      'Social and solidarity economy, social entrepreneurship, youth employment, territorial development',
      'الاقتصاد الاجتماعي والتضامني، ريادة الأعمال الاجتماعية، تشغيل الشباب، التنمية الترابية',
    ),
    fundingNote: bag(
      "l'Union européenne",
      'the European Union',
      'الاتحاد الأوروبي',
    ),
    impactIntro: bag('', '', ''),
  },
  go4youth: {
    period: bag(
      'Septembre 2021 – Juin 2027',
      'September 2021 – June 2027',
      'سبتمبر 2021 – يونيو 2027',
    ),
    partner: bag(
      'Banque mondiale - ANETI',
      'World Bank - ANETI',
      'البنك الدولي - الوكالة الوطنية للتشغيل والعمل المستقل (ANETI)',
    ),
    sectors: bag(
      "Emploi, employabilité, transformation numérique, services publics d'intermédiation",
      'Employment, employability, digital transformation, public intermediation services',
      'التشغيل، القابلية للتشغيل، التحول الرقمي، خدمات الوساطة العمومية',
    ),
    fundingNote: bag(
      'le Programme EU4Youth à travers le Fonds TERI de la Banque Mondiale',
      'the EU4Youth Programme through the World Bank TERI Fund',
      'برنامج EU4Youth عبر صندوق TERI التابع للبنك الدولي',
    ),
    impactIntro: bag('', '', ''),
  },
  swafy: {
    period: bag(
      'Juin 2022 – Juin 2027',
      'June 2022 – June 2027',
      'يونيو 2022 – يونيو 2027',
    ),
    partner: bag(
      'Agence Nationale de la Promotion de la Recherche Scientifique (ANPR)',
      'National Agency for the Promotion of Scientific Research (ANPR)',
      'الوكالة الوطنية للنهوض بالبحث العلمي (ANPR)',
    ),
    sectors: bag(
      'Recherche, innovation, culture scientifique, entrepreneuriat, politiques Science-Technologie-Innovation',
      'Research, innovation, scientific culture, entrepreneurship, Science-Technology-Innovation policies',
      'البحث، الابتكار، الثقافة العلمية، ريادة الأعمال، سياسات العلوم والتكنولوجيا والابتكار',
    ),
    fundingNote: bag(
      "l'Union européenne",
      'the European Union',
      'الاتحاد الأوروبي',
    ),
    impactIntro: bag('', '', ''),
  },
  irada4youth: {
    period: bag('2022–2027', '2022–2027', '2022–2027'),
    partner: bag(
      'Commissariat Général au Développement Régional (CGDR), en partenariat avec l’Office de Développement du Nord-Ouest (ODNO), l’Office de Développement du Centre-Ouest (ODCO) et l’Office de Développement du Sud (ODS)',
      'General Commissariat for Regional Development (CGDR), in partnership with the North-West Development Office (ODNO), the Central-West Development Office (ODCO) and the South Development Office (ODS)',
      'المندوبية العامة للتنمية الجهوية (CGDR)، بالشراكة مع ديوان تنمية الشمال الغربي (ODNO)، وديوان تنمية الوسط الغربي (ODCO)، وديوان تنمية الجنوب (ODS)',
    ),
    sectors: bag(
      'Développement économique local, filières porteuses, agriculture, artisanat, tourisme durable',
      'Local economic development, high-potential value chains, agriculture, crafts, sustainable tourism',
      'التنمية الاقتصادية المحلية، السلاسل الواعدة، الفلاحة، الصناعات التقليدية، السياحة المستدامة',
    ),
    fundingNote: bag(
      "l'Union européenne",
      'the European Union',
      'الاتحاد الأوروبي',
    ),
    impactIntro: bag('', '', ''),
  },
  maghroumin: {
    period: bag(
      'À partir du 1er janvier 2022 — 60 mois',
      'From 1 January 2022 — 60 months',
      'ابتداءً من 1 يناير 2022 — 60 شهرًا',
    ),
    partner: bag(
      'AECID – British Council – FIIAPP',
      'AECID – British Council – FIIAPP',
      'AECID – المجلس الثقافي البريطاني – FIIAPP',
    ),
    sectors: bag(
      'Culture, sport, création, inclusion',
      'Culture, sport, creation, inclusion',
      'الثقافة، الرياضة، الإبداع، الإدماج',
    ),
    fundingNote: bag(
      "l'Union européenne",
      'the European Union',
      'الاتحاد الأوروبي',
    ),
    impactIntro: bag('', '', ''),
  },
  fe3ila: {
    period: bag('2021–2026', '2021–2026', '2021–2026'),
    partner: bag(
      'CILG-VNG International et VNG International',
      'CILG-VNG International and VNG International',
      'المركز الدولي للتنمية المحلية والحكم الرشيد CILG-VNG International وVNG International',
    ),
    sectors: bag(
      'Gouvernance locale, participation des jeunes, entrepreneuriat et initiatives jeunes, engagement citoyen, espaces jeunesse',
      'Local governance, youth participation, youth entrepreneurship and initiatives, civic engagement, youth spaces',
      'الحوكمة المحلية، مشاركة الشباب، ريادة الأعمال والمبادرات الشبابية، الالتزام المدني، فضاءات الشباب',
    ),
    fundingNote: bag(
      "l'Union européenne avec la contribution du Royaume des Pays-Bas",
      'the European Union with a contribution from the Kingdom of the Netherlands',
      'الاتحاد الأوروبي بمساهمة من مملكة هولندا',
    ),
    impactIntro: null, // keep existing FR text; localize below if present
  },
}

const FE3ILA_IMPACT = bag(
  "Au-delà des résultats directs, Fe3il.a contribue à développer des modèles et mécanismes reproductibles pour renforcer durablement la participation des jeunes dans les politiques publiques. En mettant l’accent sur la co-construction, l’accompagnement des initiatives locales et la coopération entre acteurs, le projet favorise une approche inclusive et ancrée dans les territoires.",
  'Beyond direct results, Fe3il.a helps develop replicable models and mechanisms to sustainably strengthen youth participation in public policies. By emphasising co-construction, support for local initiatives and cooperation between actors, the project fosters an inclusive approach rooted in the territories.',
  'إلى جانب النتائج المباشرة، يساهم Fe3il.a في تطوير نماذج وآليات قابلة للتكرار لتعزيز مشاركة الشباب في السياسات العمومية بشكل مستدام. ومن خلال التركيز على البناء المشترك ومرافقة المبادرات المحلية والتعاون بين الفاعلين، يشجّع المشروع مقاربة دامجة متجذّرة في المناطق.',
)

const store = loadStore()
let n = 0
for (const project of store.projects || []) {
  const patch = FICHE[project.slug]
  if (!patch) continue

  project.impactIntro = unwrapBag(
    patch.impactIntro === null ? project.impactIntro : patch.impactIntro,
  )
  if (project.slug === 'fe3ila') {
    const existing = unwrapBag(project.impactIntro)
    project.impactIntro = {
      fr: existing.fr || FE3ILA_IMPACT.fr,
      en: existing.en || FE3ILA_IMPACT.en,
      ar: existing.ar || FE3ILA_IMPACT.ar,
    }
  }

  project.period = patch.period
  project.partner = patch.partner
  project.sectors = patch.sectors
  project.fundingNote = patch.fundingNote
  n += 1
  console.log('patched', project.slug)
}

saveStore(store)
console.log('done', n, 'projects')
