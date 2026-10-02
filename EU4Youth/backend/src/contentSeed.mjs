/** Seeded CMS pages that mirror the public EU4Youth site structure. */

import { ROLE_PERMISSIONS, TRANSLATIONS } from './seed.mjs'
import { legalChapterJson, legalDocuments } from './legalPages.mjs'

const L = (fr, en, ar) => ({ fr, en, ar })

function pageMeta({
  slug,
  path,
  title,
  group,
  status = 'published',
  template = 'default',
  is_system = false,
  sort_order = 0,
  meta_title = '',
  meta_description = '',
}) {
  return {
    slug,
    path,
    title,
    group,
    status,
    template,
    is_system,
    sort_order,
    meta_title: meta_title || `${title} | EU4Youth Tunisie`,
    meta_description,
  }
}

export function createContentState() {
  const pages = []
  const sections = []
  const blocks = []
  let blockId = 1

  const add = (meta, bands) => {
    pages.push(meta)
    bands.forEach((band, index) => {
      sections.push({
        page: meta.slug,
        slug: band.slug,
        title: band.title,
        pattern: band.pattern,
        sort_order: index,
      })
      band.fields.forEach((field, fieldIndex) => {
        if (field.type === 'image') {
          blocks.push({
            id: blockId++,
            page: meta.slug,
            section: band.slug,
            key: field.key,
            locale: '_all',
            type: 'image',
            value: field.value || '',
            label: field.label,
            sort_order: fieldIndex,
          })
          return
        }
        const locales = field.type === 'json' || field.type === 'text' ? ['fr', 'en', 'ar'] : ['_all']
        for (const locale of locales) {
          let value = ''
          if (field.type === 'json') {
            const raw = field.value?.[locale] ?? field.value?.fr ?? field.value ?? []
            value = typeof raw === 'string' ? raw : JSON.stringify(raw, null, 2)
          } else {
            value = field.value?.[locale] ?? ''
          }
          blocks.push({
            id: blockId++,
            page: meta.slug,
            section: band.slug,
            key: field.key,
            locale,
            type: field.type,
            value,
            label: field.label,
            sort_order: fieldIndex,
          })
        }
      })
    })
  }

  add(
    pageMeta({
      slug: 'home',
      path: '/',
      title: 'Accueil',
      group: 'Public',
      template: 'home',
      is_system: true,
      sort_order: 1,
      meta_description:
        "Découvrez EU4Youth, le programme de l'Union européenne d'appui à la jeunesse tunisienne.",
    }),
    [
      {
        slug: 'hero',
        title: 'Bannière',
        pattern: 'hero',
        fields: [
          {
            key: 'slides',
            type: 'json',
            label: 'Photographies du bandeau',
            value: [
              { label: 'Photo 1', image: '/img/home-hero-v2.webp' },
              { label: 'Photo 2', image: '/img/apropos-hero-v2.webp' },
              { label: 'Photo 3', image: '/img/apropos-atelier.webp' },
              { label: 'Photo 4', image: '/img/art-femme-saut.webp' },
              { label: 'Photo 5', image: '/img/home-stories-v2.webp' },
            ],
          },
          {
            key: 'badge',
            type: 'text',
            label: 'Badge',
            value: L(
              'LA JEUNESSE TUNISIENNE PORTE LES SOLUTIONS DE DEMAIN.',
              "TUNISIAN YOUTH CARRIES TOMORROW'S SOLUTIONS.",
              'الشباب التونسي يحمل حلول الغد.',
            ),
          },
          {
            key: 'title',
            type: 'text',
            label: 'Titre',
            value: L(
              'EU4Youth accompagne\nles jeunes dans leurs\nparcours, leurs projets\net leur engagement.',
              'EU4Youth supports\nyoung people in their\npaths, their projects\nand their engagement.',
              'EU4Youth يرافق الشباب\nفي مساراتهم ومشاريعهم\nوانخراطهم.',
            ),
          },
          {
            key: 'body',
            type: 'text',
            label: 'Texte',
            value: L(
              'Vous avez entre 18 et 35 ans. Vous avez une idée, un projet, une envie de faire quelque chose pour votre quartier, votre commune ou votre gouvernorat. EU4Youth Tunisie vous accompagne.',
              'You are between 18 and 35. You have an idea, a project, a wish to do something for your neighbourhood, your municipality or your governorate. EU4Youth Tunisia is with you.',
              'عمرك بين 18 و 35 سنة. لديك فكرة أو مشروع أو رغبة في الفعل من أجل حيك أو بلديتك أو ولايتك. برنامج EU4Youth تونس يرافقك.',
            ),
          },
          {
            key: 'ctaProjects',
            type: 'text',
            label: 'Bouton projets',
            value: L('Découvrir les projets', 'Discover the projects', 'اكتشف المشاريع'),
          },
          {
            key: 'ctaOpportunities',
            type: 'text',
            label: 'Bouton opportunités',
            value: L('Voir les opportunités ouvertes', 'See open opportunities', 'عرض الفرص المفتوحة'),
          },
          {
            key: 'ctaMap',
            type: 'text',
            label: 'Bouton carte',
            value: L('Explorer la carte des initiatives', 'Explore the initiatives map', 'استكشف خريطة المبادرات'),
          },
        ],
      },
      {
        slug: 'chiffres',
        title: 'EU4Youth en chiffres',
        pattern: 'stats',
        fields: [
          {
            key: 'title',
            type: 'text',
            label: 'Titre',
            value: L('EU4YOUTH EN CHIFFRES', 'EU4YOUTH IN FIGURES', 'EU4YOUTH بالأرقام'),
          },
          {
            key: 'period',
            type: 'text',
            label: 'Période',
            value: L('2019 – 2027', '2019 – 2027', '2019 – 2027'),
          },
          {
            key: 'items',
            type: 'json',
            label: 'Indicateurs',
            value: {
              fr: [
                { value: '6', label: 'PROJETS', to: '/projets', cx: '200' },
                { value: '+ 300', label: 'CLUBS', to: '/mecanismes-appui', cx: '520' },
                { value: '+ 300', label: 'PROJETS', to: '/projets', cx: '840' },
                { value: '+ 100', label: 'INITIATIVES', to: '/carte', cx: '1160' },
                { value: '24', label: 'GOUVERNORATS', to: '/carte', cx: '1480' },
              ],
              en: [
                { value: '6', label: 'PROJECTS', to: '/projets', cx: '200' },
                { value: '+ 300', label: 'CLUBS', to: '/mecanismes-appui', cx: '520' },
                { value: '+ 300', label: 'PROJECTS', to: '/projets', cx: '840' },
                { value: '+ 100', label: 'INITIATIVES', to: '/carte', cx: '1160' },
                { value: '24', label: 'GOVERNORATES', to: '/carte', cx: '1480' },
              ],
              ar: [
                { value: '6', label: 'مشاريع', to: '/projets', cx: '200' },
                { value: '+ 300', label: 'نوادٍ', to: '/mecanismes-appui', cx: '520' },
                { value: '+ 300', label: 'مشاريع', to: '/projets', cx: '840' },
                { value: '+ 100', label: 'مبادرات', to: '/carte', cx: '1160' },
                { value: '24', label: 'ولايات', to: '/carte', cx: '1480' },
              ],
            },
          },
          { key: 'kpi0Value', type: 'text', label: 'Chiffre 1', value: L('6', '6', '6') },
          { key: 'kpi0Label', type: 'text', label: 'Libellé 1', value: L('PROJETS', 'PROJECTS', 'مشاريع') },
          { key: 'kpi1Value', type: 'text', label: 'Chiffre 2', value: L('+ 300', '+ 300', '+ 300') },
          { key: 'kpi1Label', type: 'text', label: 'Libellé 2', value: L('CLUBS', 'CLUBS', 'نوادٍ') },
          { key: 'kpi2Value', type: 'text', label: 'Chiffre 3', value: L('+ 300', '+ 300', '+ 300') },
          { key: 'kpi2Label', type: 'text', label: 'Libellé 3', value: L('PROJETS', 'PROJECTS', 'مشاريع') },
          { key: 'kpi3Value', type: 'text', label: 'Chiffre 4', value: L('+ 100', '+ 100', '+ 100') },
          { key: 'kpi3Label', type: 'text', label: 'Libellé 4', value: L('INITIATIVES', 'INITIATIVES', 'مبادرات') },
          { key: 'kpi4Value', type: 'text', label: 'Chiffre 5', value: L('24', '24', '24') },
          { key: 'kpi4Label', type: 'text', label: 'Libellé 5', value: L('GOUVERNORATS', 'GOVERNORATES', 'ولايات') },
        ],
      },
      {
        slug: 'projets',
        title: 'Six projets',
        pattern: 'projects_band',
        fields: [
          { key: 'title', type: 'text', label: 'Titre', value: L('SIX PROJETS', 'SIX PROJECTS', 'ستة مشاريع') },
          {
            key: 'subtitle',
            type: 'text',
            label: 'Sous-titre',
            value: L('UNE VISION COMMUNE.', 'ONE SHARED VISION.', 'رؤية مشتركة.'),
          },
          {
            key: 'body',
            type: 'text',
            label: 'Texte',
            value: L(
              'EU4Youth Tunisie s’organise en trois composantes thématiques portées par six projets complémentaires. Chaque projet intervient sur une dimension spécifique de l’inclusion des jeunes tunisiennes et tunisiens.',
              'EU4Youth Tunisia is organised in three thematic components carried by six complementary projects. Each project works on a specific dimension of youth inclusion.',
              'ينتظم برنامج EU4Youth تونس في ثلاث مكونات موضوعية يحملها ستة مشاريع متكاملة.',
            ),
          },
          {
            key: 'logos',
            type: 'json',
            label: 'Logos des six projets',
            value: {
              fr: [
                { slug: 'irada4youth', name: 'IRADA4YOUTH', image: '/img/logo-irada4youth.png' },
                { slug: 'swafy', name: 'SWAFY', image: '/img/logo-swafy.png' },
                { slug: 'jeuness', name: "Jeun'ESS", image: '/img/logo-jeuness.png' },
                { slug: 'fe3ila', name: 'Fe3il.a', image: '/img/logo-fe3ila.png' },
                { slug: 'maghroumin', name: "Maghroum'IN", image: '/img/logo-maghroumin.png' },
                { slug: 'go4youth', name: 'GO4Youth', image: '/img/logo-go4youth.png' },
              ],
            },
          },
        ],
      },
      {
        slug: 'map',
        title: 'Partout en Tunisie',
        pattern: 'map_band',
        fields: [
          { key: 'image', type: 'image', label: 'Visuel', value: '/img/map-obj1.png' },
          { key: 'title', type: 'text', label: 'Titre', value: L('EU4YOUTH', 'EU4YOUTH', 'EU4YOUTH') },
          {
            key: 'subtitle',
            type: 'text',
            label: 'Sous-titre',
            value: L('PARTOUT EN TUNISIE', 'EVERYWHERE IN TUNISIA', 'في كل أنحاء تونس'),
          },
          {
            key: 'body',
            type: 'text',
            label: 'Texte',
            value: L(
              'De Bizerte à Ben Guerdane, de Jendouba à Tataouine, EU4Youth accompagne les jeunes Tunisiennes et Tunisiens dans les 24 gouvernorats de la Tunisie.',
              'From Bizerte to Ben Guerdane, from Jendouba to Tataouine, EU4Youth supports young Tunisians in all 24 governorates.',
              'من بنزرت إلى بن قردان، ومن جندوبة إلى تطاوين، يرافق EU4Youth الشباب التونسي في الولايات الأربع والعشرين.',
            ),
          },
          {
            key: 'cta',
            type: 'text',
            label: 'Bouton',
            value: L('Explorer la carte', 'Explore the map', 'استكشف الخريطة'),
          },
        ],
      },
      {
        slug: 'streams',
        title: 'Opportunités, actualités, agenda',
        pattern: 'cards_grid',
        fields: [
          {
            key: 'opportunitiesTitle',
            type: 'text',
            label: 'Titre opportunités',
            value: L('OPPORTUNITÉS\nEN COURS', 'OPEN\nOPPORTUNITIES', 'فرص\nجارية'),
          },
          {
            key: 'newsTitle',
            type: 'text',
            label: 'Titre actualités',
            value: L('DERNIÈRES\nACTUALITÉS', 'LATEST\nNEWS', 'آخر\nالأخبار'),
          },
          {
            key: 'eventsTitle',
            type: 'text',
            label: 'Titre événements',
            value: L('PROCHAINS\nÉVÉNEMENTS', 'UPCOMING\nEVENTS', 'الفعاليات\nالقادمة'),
          },
          {
            key: 'opportunityCta',
            type: 'text',
            label: 'CTA opportunités',
            value: L(
              'Voir toutes les opportunités disponibles',
              'See all available opportunities',
              'عرض كل الفرص المتاحة',
            ),
          },
          {
            key: 'newsCta',
            type: 'text',
            label: 'CTA actualités',
            value: L('Voir toutes les actualités', 'See all news', 'عرض كل الأخبار'),
          },
          {
            key: 'eventCta',
            type: 'text',
            label: 'CTA événements',
            value: L('Voir l’agenda complet', 'See the full agenda', 'عرض كل الأجندة'),
          },
          {
            key: 'opportunityCards',
            type: 'json',
            label: 'Cartes opportunités',
            value: {
              fr: [
                {
                  title: 'Irada4Youth — 2e appel à propositions',
                  meta: 'Appel à projets · Clôturé',
                  body: 'Financement de projets créateurs d’emplois dans six gouvernorats prioritaires, avec le CGDR.',
                  date: '24 JUIL 2026',
                  location: 'Zaghouan · Mahdia · Le Kef · Kairouan · Kébili · Tozeur',
                  action: 'Voir l’appel',
                  to: '/opportunites/irada-2e-appel-a-propositions-2026',
                  logo: 'irada4youth',
                  thumb: '/img/photo-entretien.webp',
                },
              ],
            },
          },
          {
            key: 'newsCards',
            type: 'json',
            label: 'Cartes actualités',
            value: {
              fr: [
                {
                  title: 'Avancées majeures dans la transformation digitale de l’ANETI',
                  meta: 'Go4Youth',
                  body: 'Refonte du SI en cours, GEC/GED généralisé et 102 sites raccordés à la fibre optique.',
                  date: 'AVRIL 2026',
                  location: '',
                  action: 'Lire l’article',
                  to: '/actualites/go4youth-avancees-transformation-digitale-aneti-avril-2026',
                  logo: '',
                  thumb: '/img/photo-celebration.webp',
                },
                {
                  title: 'Généralisation des services Go4Youth dans 48 BETIs',
                  meta: 'Go4Youth',
                  body: 'Inscription à distance et CIVP en ligne opérationnels ; matching préparé dans 14 BETIs.',
                  date: 'DÉC 2025',
                  location: '',
                  action: 'Lire l’article',
                  to: '/actualites/go4youth-generalisation-matching-14-betis-decembre-2025',
                  logo: '',
                  thumb: '/img/photo-livres.webp',
                },
              ],
            },
          },
          {
            key: 'eventCards',
            type: 'json',
            label: 'Cartes événements',
            value: {
              fr: [
                {
                  title: '48 chefs de BETIs réunis pour préparer la généralisation',
                  meta: 'Go4Youth',
                  body: 'Deux journées d’ateliers réunissant les BETIs pilotes et ceux de la première phase de généralisation.',
                  date: '4–5 DÉC 2024',
                  location: 'Tunis',
                  action: 'Voir les archives',
                  to: '/actualites/go4youth-48-chefs-beti-tunis-decembre-2024',
                  logo: '',
                  thumb: '/img/art-graffiti.webp',
                },
              ],
            },
          },
        ],
      },
      {
        slug: 'stories',
        title: 'Youth portraits',
        pattern: 'stories_band',
        fields: [
          {
            key: 'collage',
            type: 'image',
            label: 'Collage (détouré)',
            value: '/img/stories-collage-transparent.png',
          },
          { key: 'image', type: 'image', label: 'Image (plaque)', value: '/img/stories-collage-transparent.png' },
          { key: 'portrait', type: 'image', label: 'Portrait jeune', value: '/img/art-femme-saut.webp' },
          { key: 'graffiti', type: 'image', label: 'Graphisme graffiti', value: '/img/art-graffiti.webp' },
          {
            key: 'eyebrow',
            type: 'text',
            label: 'Sur-titre',
            value: L('YOUTH PORTRAITS', 'YOUTH PORTRAITS', 'صور الشباب'),
          },
          {
            key: 'title',
            type: 'text',
            label: 'Titre',
            value: L(
              'DES JEUNES QUI AGISSENT.\nDES TERRITOIRES QUI\nCHANGENT.',
              'YOUNG PEOPLE WHO ACT.\nTERRITORIES THAT\nCHANGE.',
              'شباب يفعل.\nأقاليم تتغير.',
            ),
          },
          {
            key: 'cta',
            type: 'text',
            label: 'Bouton',
            value: L('Découvrir toutes les stories', 'Discover all stories', 'اكتشف كل القصص'),
          },
        ],
      },
      {
        slug: 'publications',
        title: 'Ressources et publications',
        pattern: 'cta_banner',
        fields: [
          { key: 'image', type: 'image', label: 'Image (plaque)', value: '/img/home-publications.webp' },
          { key: 'books', type: 'image', label: 'Pile de livres', value: '/img/art-pile-livres.webp' },
          {
            key: 'title',
            type: 'text',
            label: 'Titre',
            value: L('RESSOURCES ET\nPUBLICATIONS', 'RESOURCES AND\nPUBLICATIONS', 'موارد و\nمنشورات'),
          },
          {
            key: 'body',
            type: 'text',
            label: 'Texte',
            value: L(
              'EU4Youth produit des connaissances et les met à disposition de tous. Rapports de suivi, études sectorielles, guides pratiques : téléchargez librement les documents du programme.',
              'EU4Youth produces knowledge and makes it available to all. Monitoring reports, sector studies, practical guides: download programme documents freely.',
              'ينتج برنامج EU4Youth معارف ويضعها في متناول الجميع.',
            ),
          },
          {
            key: 'cta',
            type: 'text',
            label: 'Bouton',
            value: L('Accéder à toutes les publications', 'Browse all publications', 'الاطلاع على كل المنشورات'),
          },
        ],
      },
      {
        slug: 'newsletter',
        title: 'Newsletter',
        pattern: 'newsletter',
        fields: [
          {
            key: 'title',
            type: 'text',
            label: 'Titre',
            value: L('RESTEZ INFORMÉ.ES', 'STAY INFORMED', 'ابقوا على اطلاع'),
          },
          {
            key: 'body',
            type: 'text',
            label: 'Texte',
            value: L(
              'Inscrivez-vous à la newsletter du programme et recevez en avant-première les appels à projets, formations, bourses et événements ouverts aux jeunes tunisiennes et tunisiens.',
              'Subscribe to the programme newsletter and receive calls, trainings, grants and events for young Tunisians first.',
              'اشتركوا في النشرة الإلكترونية للبرنامج.',
            ),
          },
          {
            key: 'legal',
            type: 'text',
            label: 'Mention légale',
            value: L(
              'En vous inscrivant, vous acceptez de recevoir des communications du programme EU4Youth Tunisie. Vous pouvez vous désinscrire à tout moment.',
              'By subscribing you agree to receive communications from EU4Youth Tunisia. You can unsubscribe at any time.',
              'بالاشتراك توافقون على تلقي رسائل برنامج EU4Youth تونس. يمكنكم إلغاء الاشتراك في أي وقت.',
            ),
          },
          { key: 'collage', type: 'image', label: 'Collage photo', value: '/img/home-newsletter.jpg' },
          {
            key: 'placeholder',
            type: 'text',
            label: 'Champ e-mail',
            value: L('Votre adresse e-mail', 'Your email address', 'بريدك الإلكتروني'),
          },
          {
            key: 'submit',
            type: 'text',
            label: 'Bouton inscription',
            value: L('Je m’inscris', 'Subscribe', 'أُسجّل'),
          },
        ],
      },
    ],
  )

  add(
    pageMeta({
      slug: 'a-propos',
      path: '/programme/a-propos',
      title: 'À propos',
      group: 'Programme',
      sort_order: 2,
      meta_description: 'Vision, objectifs, territoires et partenaires du programme EU4Youth Tunisie.',
    }),
    [
      {
        slug: 'hero',
        title: 'Introduction',
        pattern: 'hero',
        fields: [
          {
            key: 'badge',
            type: 'text',
            label: 'Badge',
            value: L(
              "PROGRAMME D'APPUI À LA JEUNESSE TUNISIENNE",
              'SUPPORT PROGRAMME FOR TUNISIAN YOUTH',
              'برنامج دعم الشباب التونسي',
            ),
          },
          {
            key: 'title',
            type: 'text',
            label: 'Titre',
            value: L(
              'EU4Youth accompagne les jeunes dans leurs parcours, leurs projets et leur engagement.',
              'EU4Youth supports young people in their paths, their projects and their engagement.',
              'EU4Youth يرافق الشباب في مساراتهم ومشاريعهم وانخراطهم.',
            ),
          },
          {
            key: 'body',
            type: 'text',
            label: 'Texte',
            value: L(
              "EU4Youth est le programme de l'Union européenne d’appui à la jeunesse tunisienne. Depuis 2019, il réunit six projets complémentaires qui agissent ensemble pour renforcer les opportunités d'emploi, d'entrepreneuriat, de culture, de sport, de science et de participation citoyenne des jeunes de 18 à 35 ans.",
              'EU4Youth is the European Union support programme for Tunisian youth. Since 2019 it brings together six complementary projects working on employment, entrepreneurship, culture, sport, science and civic participation for people aged 18 to 35.',
              'EU4Youth هو برنامج الاتحاد الأوروبي لدعم الشباب التونسي. منذ 2019 يجمع ستة مشاريع متكاملة.',
            ),
          },
          {
            key: 'ctaProjects',
            type: 'text',
            label: 'Bouton projets',
            value: L('Découvrir les projets', 'Discover the projects', 'اكتشف المشاريع'),
          },
          {
            key: 'ctaOpportunities',
            type: 'text',
            label: 'Bouton opportunités',
            value: L('Voir les opportunités ouvertes', 'See open opportunities', 'عرض الفرص المفتوحة'),
          },
          {
            key: 'ctaMap',
            type: 'text',
            label: 'Bouton carte',
            value: L('Explorer la carte des initiatives', 'Explore the initiatives map', 'استكشف خريطة المبادرات'),
          },
          { key: 'image', type: 'image', label: 'Image de fond', value: '/img/apropos-hero-v2.webp' },
        ],
      },
      {
        slug: 'pourquoi',
        title: 'Pourquoi EU4Youth',
        pattern: 'text',
        fields: [
          {
            key: 'title',
            type: 'text',
            label: 'Titre',
            value: L('POURQUOI\nEU4YOUTH ?', 'WHY\nEU4YOUTH?', 'لماذا\nEU4YOUTH؟'),
          },
          {
            key: 'body',
            type: 'text',
            label: 'Texte',
            value: L(
              'La Tunisie est un pays jeune. Les moins de 35 ans représentent plus de la moitié de la population. Cette réalité démographique porte une énergie créatrice que les communautés et le pays tout entier ont intérêt à valoriser.',
              'Tunisia is a young country. People under 35 represent more than half of the population. That demographic reality carries creative energy that communities and the country as a whole have an interest in valuing.',
              'تونس بلد شاب. من هم دون 35 سنة يمثلون أكثر من نصف السكان.',
            ),
          },
          {
            key: 'more',
            type: 'text',
            label: 'Bouton lire la suite',
            value: L('Lire La suite', 'Read more', 'اقرأ المزيد'),
          },
          {
            key: 'quote',
            type: 'text',
            label: 'Citation',
            value: L(
              "« EU4Youth s'inscrit dans une dynamique de coopération entre l'Union européenne, les institutions tunisiennes et les acteurs locaux afin de soutenir les parcours, les initiatives et l'engagement des jeunes. »",
              '“EU4Youth is part of a cooperation dynamic between the European Union, Tunisian institutions and local actors to support young people’s paths, initiatives and engagement.”',
              '«يندرج EU4Youth في دينامية تعاون بين الاتحاد الأوروبي والمؤسسات التونسية والفاعلين المحليين.»',
            ),
          },
          {
            key: 'moreBody',
            type: 'text',
            label: 'Texte « lire la suite »',
            value: L(
              "Pourtant, tous n'ont pas accès aux mêmes possibilités. Les territoires connaissent des dynamiques diverses.\n\nC'est dans cette réalité complexe que s'inscrit EU4Youth comme un investissement dans les capacités de toute une jeunesse.",
              'Yet not everyone has access to the same possibilities. Territories follow different dynamics.',
              'ومع ذلك لا يتمتع الجميع بنفس الإمكانيات.',
            ),
          },
          {
            key: 'photos',
            type: 'json',
            label: 'Photos du carrousel',
            value: {
              fr: [
                { src: '/img/apropos-atelier.webp', alt: 'Objets gravés au laser réalisés par un jeune atelier tunisien' },
                { src: '/img/apropos-plongee.webp', alt: 'Jeune plongeur sous la surface au large des côtes tunisiennes' },
              ],
            },
          },
        ],
      },
      {
        slug: 'vision',
        title: 'Vision',
        pattern: 'text',
        fields: [
          { key: 'title', type: 'text', label: 'Titre', value: L('UNE VISION\nCOMMUNE', 'A SHARED\nVISION', 'رؤية\nمشتركة') },
          {
            key: 'lead',
            type: 'text',
            label: 'Chapô',
            value: L(
              'EU4Youth part d’une conviction fondamentale : les jeunes Tunisiennes et Tunisiens sont des acteurs à part entière du changement.',
              'EU4Youth starts from a core conviction: young Tunisians are full actors of change.',
              'ينطلق EU4Youth من قناعة أساسية: الشباب التونسي فاعل كامل في التغيير.',
            ),
          },
          {
            key: 'body',
            type: 'text',
            label: 'Texte',
            value: L(
              "Le programme se construit sur une logique d'investissement dans les capacités, dans les opportunités et dans les conditions d'autonomisation.",
              'The programme is built on investing in capacities, opportunities and conditions for empowerment.',
              'يُبنى البرنامج على الاستثمار في القدرات والفرص وشروط التمكين.',
            ),
          },
          {
            key: 'more',
            type: 'text',
            label: 'Bouton lire la suite',
            value: L('Lire La suite', 'Read more', 'اقرأ المزيد'),
          },
          {
            key: 'principles',
            type: 'json',
            label: 'Principes',
            value: {
              fr: [
                { text: 'Créer des opportunités réelles de développement personnel et professionnel pour les jeunes, là où ils vivent.' },
                { text: 'Prioriser celles et ceux qui font face aux obstacles les plus importants.' },
                { text: 'Associer les jeunes à la conception et à la mise en oeuvre des activités qui les concernent.' },
                { text: 'Ancrer les interventions dans les territoires.' },
                { text: 'Construire des mécanismes durables de représentation et de participation des jeunes.' },
                { text: 'Capitaliser sur les expériences passées et les dynamiques déjà engagées.' },
                { text: 'Coordonner les six projets entre eux et avec les autres programmes européens en Tunisie.' },
              ],
            },
          },
          {
            key: 'closing',
            type: 'text',
            label: 'Texte de clôture',
            value: L(
              'À ces principes s’ajoutent des engagements transversaux partagés par tous les projets : genre, handicap, ruralité, environnement et durabilité.',
              'These principles are joined by cross-cutting commitments shared by all projects.',
              'تُضاف إلى هذه المبادئ التزامات عرضية مشتركة بين كل المشاريع.',
            ),
          },
        ],
      },
      {
        slug: 'objectifs',
        title: 'Objectifs',
        pattern: 'simple_list',
        fields: [
          { key: 'title', type: 'text', label: 'Titre', value: L('OBJECTIFS\nDU PROGRAMME', 'PROGRAMME\nOBJECTIVES', 'أهداف\nالبرنامج') },
          {
            key: 'items',
            type: 'json',
            label: 'Objectifs',
            value: {
              fr: [
                { kicker: '', title: 'OBJECTIF\nGÉNÉRAL', body: "Contribuer à l'amélioration de l'inclusion économique, sociale et citoyenne des jeunes Tunisiennes et Tunisiens." },
                { kicker: 'OBJECTIF SPÉCIFIQUE 1', title: 'EMPLOI, EMPLOYABILITÉ ET ENTREPRENEURIAT', body: "Renforcer l'accès des jeunes à des emplois décents et développer leurs compétences entrepreneuriales." },
                { kicker: 'OBJECTIF SPÉCIFIQUE 2', title: "CULTURE ET SPORT POUR L'INCLUSION", body: "Renforcer l'inclusion des jeunes à travers la culture et le sport." },
                { kicker: 'OBJECTIF SPÉCIFIQUE 3', title: 'POLITIQUES PUBLIQUES ET PARTICIPATION DES JEUNES', body: 'Renforcer la place des jeunes dans les politiques publiques.' },
              ],
            },
          },
        ],
      },
      {
        slug: 'comment',
        title: 'Comment le programme agit',
        pattern: 'simple_list',
        fields: [
          { key: 'title', type: 'text', label: 'Titre', value: L('COMMENT\nLE PROGRAMME AGIT', 'HOW THE PROGRAMME WORKS', 'كيف يعمل البرنامج') },
          {
            key: 'items',
            type: 'json',
            label: 'Axes',
            value: {
              fr: [
                { kicker: 'AXE 1', title: 'EMPLOI ET OPPORTUNITÉS ÉCONOMIQUES', body: "Le programme renforce l'accès des jeunes aux opportunités économiques." },
                { kicker: 'AXE 2', title: 'CULTURE, SPORT ET PARTICIPATION', body: "EU4Youth considère la culture et le sport comme des leviers d'inclusion." },
                { kicker: 'AXE 3', title: 'INNOVATION, RECHERCHE ET DÉVELOPPEMENT TERRITORIAL', body: "Le programme investit dans la recherche et l'innovation." },
              ],
            },
          },
        ],
      },
      {
        slug: 'projets',
        title: 'Six projets',
        pattern: 'projects_band',
        fields: [
          { key: 'title', type: 'text', label: 'Titre', value: L('SIX PROJETS', 'SIX PROJECTS', 'ستة مشاريع') },
          { key: 'subtitle', type: 'text', label: 'Sous-titre', value: L('UNE VISION COMMUNE.', 'A SHARED VISION.', 'رؤية مشتركة.') },
          {
            key: 'body',
            type: 'text',
            label: 'Texte',
            value: L(
              'EU4Youth Tunisie s’organise en trois composantes thématiques portées par six projets complémentaires.',
              'EU4Youth Tunisia is organised in three thematic components carried by six complementary projects.',
              'ينتظم برنامج EU4Youth تونس في ثلاث مكونات موضوعية يحملها ستة مشاريع متكاملة.',
            ),
          },
          {
            key: 'ficheCta',
            type: 'text',
            label: 'Bouton fiche projet',
            value: L('Découvrir plus sur', 'Discover more about', 'اكتشف المزيد عن'),
          },
          {
            key: 'fiches',
            type: 'json',
            label: 'Fiches projet',
            value: {
              fr: [
                {
                  slug: 'irada4youth',
                  name: 'IRADA4YOUTH',
                  tagline: 'AMÉLIORER L’INCLUSION ÉCONOMIQUE ET SOCIALE DES JEUNES PAR UNE APPROCHE CONÇUE LOCALEMENT.',
                  quote: 'Améliorer l’inclusion économique et sociale des jeunes par une approche conçue localement.',
                  composante: 'EMPLOI, EMPLOYABILITÉ ET ENTREPRENEURIAT',
                  budget: '5 MILLIONS D’EUROS',
                  partner: 'CGDR AVEC ODNO, ODCO ET ODS',
                  territory: '6 GOUVERNORATS PRIORITAIRES',
                  period: '2022 – 2027 • 60 MOIS',
                },
                {
                  slug: 'jeuness',
                  name: "JEUN'ESS",
                  tagline: 'L’ÉCONOMIE SOCIALE ET SOLIDAIRE, UN LEVIER POUR L’EMPLOI DÉCENT DES JEUNES TUNISIENS.',
                  quote: 'L’économie sociale et solidaire, un levier pour l’emploi décent des jeunes tunisiens.',
                  composante: 'EMPLOI, EMPLOYABILITÉ ET ENTREPRENEURIAT',
                  budget: '9 MILLIONS D’EUROS',
                  partner: 'ORGANISATION INTERNATIONALE DU TRAVAIL (OIT)',
                  territory: '5 GOUVERNORATS : JENDOUBA, LE KEF, KAIROUAN, SIDI BOUZID, KÉBILI',
                  period: 'SEPTEMBRE 2019 – AOÛT 2024',
                },
                {
                  slug: 'swafy',
                  name: 'SWAFY',
                  tagline: 'RENFORCER LA CONTRIBUTION DE LA RECHERCHE ET DE L’INNOVATION AU DÉVELOPPEMENT AVEC ET POUR LES JEUNES.',
                  quote: 'Renforcer la contribution de la recherche et de l’innovation au développement économique et social avec et pour les jeunes.',
                  composante: 'EMPLOI, EMPLOYABILITÉ ET ENTREPRENEURIAT',
                  budget: '9 MILLIONS D’EUROS',
                  partner: 'ANPR',
                  territory: 'PRÉSENCE NATIONALE',
                  period: 'JUIN 2022 – JUIN 2027',
                },
                {
                  slug: 'fe3ila',
                  name: 'FE3IL.A',
                  tagline: 'FAIRE DES JEUNES DES ACTEURS DU CHANGEMENT DANS LEURS TERRITOIRES.',
                  quote: 'Faire des jeunes des acteurs du changement dans leurs territoires.',
                  composante: 'POLITIQUES PUBLIQUES ET PARTICIPATION DES JEUNES',
                  budget: '9,1 MILLIONS D’EUROS',
                  partner: 'CILG-VNG INTERNATIONAL · MINISTÈRE DE LA JEUNESSE ET DES SPORTS',
                  territory: '8 COMMUNES PARTENAIRES',
                  period: '2021 – 2026',
                },
                {
                  slug: 'maghroumin',
                  name: "MAGHROUM'IN",
                  tagline: 'RENFORCER L’INCLUSION DES JEUNES À TRAVERS LA CRÉATION, LA CULTURE ET LE SPORT.',
                  quote: 'Renforcer l’inclusion et la participation des jeunes tunisien.ne.s en situation de vulnérabilité à travers la création, la culture et le sport.',
                  composante: 'CULTURE ET SPORT POUR L’INCLUSION',
                  budget: '15,46 MILLIONS D’EUROS',
                  partner: 'AECID – BRITISH COUNCIL – FIIAPP',
                  territory: 'COUVERTURE NATIONALE',
                  period: 'À PARTIR DU 1ER JANVIER 2022 — 60 MOIS',
                },
                {
                  slug: 'go4youth',
                  name: 'GO4YOUTH',
                  tagline: 'RENFORCER LES SERVICES D’EMPLOI POUR AMÉLIORER L’ACCÈS DES JEUNES À DES OPPORTUNITÉS DÉCENTES.',
                  quote: 'Renforcer les services d’emploi pour améliorer l’accès des jeunes à des opportunités professionnelles décentes.',
                  composante: 'EMPLOI, EMPLOYABILITÉ ET ENTREPRENEURIAT',
                  budget: '10 MILLIONS D’EUROS',
                  partner: 'BANQUE MONDIALE ET ANETI',
                  territory: 'DÉPLOIEMENT PROGRESSIF — 6 BETI PILOTES PUIS 48 BETI SÉLECTIONNÉS',
                  period: 'SEPTEMBRE 2021 – JUIN 2027',
                },
              ],
            },
          },
        ],
      },
      {
        slug: 'territoires',
        title: 'Territoires',
        pattern: 'map_band',
        fields: [
          { key: 'title', type: 'text', label: 'Titre', value: L('UNE ACTION DANS LES TERRITOIRES', 'ACTION IN THE TERRITORIES', 'عمل في الأقاليم') },
          {
            key: 'body',
            type: 'text',
            label: 'Texte',
            value: L(
              'De Bizerte à Ben Guerdane, de Jendouba à Tataouine, EU4Youth accompagne les jeunes Tunisiennes et Tunisiens dans les 24 gouvernorats de la Tunisie.',
              'From Bizerte to Ben Guerdane, from Jendouba to Tataouine, EU4Youth supports young Tunisians in all 24 governorates.',
              'من بنزرت إلى بن قردان ومن جندوبة إلى تطاوين يرافق EU4Youth الشباب التونسي في الولايات الأربع والعشرين.',
            ),
          },
          {
            key: 'legendTitle',
            type: 'text',
            label: 'Titre légende carte',
            value: L('LES GOUVERNORATS CIBLÉS EN PRIORITÉ', 'PRIORITY GOVERNORATES', 'الولايات ذات الأولوية'),
          },
          {
            key: 'legendNote',
            type: 'text',
            label: 'Note légende carte',
            value: L(
              "PLUSIEURS PROJETS CIBLENT DES GOUVERNORATS SPÉCIFIQUES, CHOISIS SUR LA BASE D'INDICATEURS DE VULNÉRABILITÉ ET D'OPPORTUNITÉS LOCALES :",
              'SEVERAL PROJECTS TARGET SPECIFIC GOVERNORATES, CHOSEN FROM VULNERABILITY AND LOCAL OPPORTUNITY INDICATORS:',
              'تستهدف عدة مشاريع ولايات محددة:',
            ),
          },
        ],
      },
      {
        slug: 'impact',
        title: 'Impact',
        pattern: 'stats',
        fields: [
          { key: 'title', type: 'text', label: 'Titre', value: L("L'IMPACT DU PROGRAMME", 'PROGRAMME IMPACT', 'أثر البرنامج') },
          {
            key: 'body',
            type: 'text',
            label: 'Texte',
            value: L(
              'Depuis 2019, EU4Youth a mobilisé des centaines d’acteurs, dans toutes les régions de Tunisie, autour d’une vision commune.',
              'Since 2019 EU4Youth has mobilised hundreds of actors across Tunisia around a shared vision.',
              'منذ 2019 عبّأ EU4Youth مئات الفاعلين في كل جهات تونس حول رؤية مشتركة.',
            ),
          },
          {
            key: 'items',
            type: 'json',
            label: 'Chiffres d’impact',
            value: {
              fr: [
                { value: '24', label: 'GOUVERNORATS', note: 'Présence nationale', featured: '' },
                { value: '2019–2027', label: 'DURÉE DU\nPROGRAMME', note: 'Convention signée juin 2019', featured: '' },
                { value: '6', label: 'PROJETS\nCOMPLÉMENTAIRES', note: '3 composantes thématiques', featured: '' },
                { value: '+ 300', label: 'PROJETS PORTÉS\nPAR DES JEUNES', note: 'Économiques, culturels, sociaux, scientifiques', featured: '1' },
                { value: '+ 100', label: 'INITIATIVES\nASSOCIATIVES', note: 'Soutenues dans toutes les régions', featured: '' },
                { value: '+ 300', label: 'CLUBS CRÉÉS\nOU APPUYÉS', note: 'ESS, scientifiques, culturels, sportifs', featured: '' },
              ],
            },
          },
          {
            key: 'chartHint',
            type: 'text',
            label: 'Lien graphique',
            value: L('Voir les secteurs', 'See the sectors', 'عرض القطاعات'),
          },
          {
            key: 'chartTitle',
            type: 'text',
            label: 'Titre du graphique',
            value: L("SECTEURS D'ACTIVITÉS", 'ACTIVITY SECTORS', 'قطاعات النشاط'),
          },
          {
            key: 'chartHeadValue',
            type: 'text',
            label: 'Chiffre du graphique',
            value: L('+ 300', '+ 300', '+ 300'),
          },
          {
            key: 'chartHeadLabel',
            type: 'text',
            label: 'Libellé du graphique',
            value: L('PROJETS PORTÉS PAR DES JEUNES', 'YOUTH-LED PROJECTS', 'مشاريع يقودها الشباب'),
          },
          {
            key: 'secteurs',
            type: 'json',
            label: 'Barres du graphique',
            value: {
              fr: [
                { label: '1/16', value: '12.6', color: '#58ac48' },
                { label: '2/16', value: '9.2', color: '#1a9a94' },
                { label: '3/16', value: '17.8', color: '#074ea2' },
                { label: '4/16', value: '14.1', color: '#e34171' },
                { label: '5/16', value: '20', color: '#f2a849' },
              ],
            },
          },
        ],
      },
      {
        slug: 'partners',
        title: 'Partenaires',
        pattern: 'text',
        fields: [
          { key: 'title', type: 'text', label: 'Titre', value: L('LES PARTENAIRES', 'THE PARTNERS', 'الشركاء') },
          {
            key: 'body',
            type: 'text',
            label: 'Texte',
            value: L(
              'EU4Youth Tunisie mobilise un réseau unique de partenaires institutionnels, d’organisations internationales et d’acteurs de terrain.',
              'EU4Youth Tunisia mobilises a unique network of institutional partners, international organisations and field actors.',
              'يعبّئ EU4Youth تونس شبكة فريدة من الشركاء المؤسسيين والمنظمات الدولية وفاعلي الميدان.',
            ),
          },
          {
            key: 'tabs',
            type: 'json',
            label: 'Onglets partenaires',
            value: {
              fr: [
                { line1: "L'UNION", line2: 'EUROPÉENNE', body: 'L’Union européenne finance le programme et l’inscrit dans sa coopération avec la Tunisie.' },
                { line1: 'LES INSTITUTIONS', line2: 'TUNISIENNES', body: 'Les ministères et institutions tunisiennes sont des partenaires centraux du programme.' },
                { line1: 'LES PARTENAIRES', line2: 'DE MISE EN OEUVRE', body: 'Agences des Nations unies et organisations de la société civile mettent en œuvre les six projets.' },
              ],
            },
          },
        ],
      },
      {
        slug: 'avenir',
        title: 'Avenir',
        pattern: 'cta_banner',
        fields: [
          { key: 'title', type: 'text', label: 'Titre', value: L("REGARDER VERS\nL'AVENIR", 'LOOKING AHEAD', 'النظر إلى المستقبل') },
          {
            key: 'body',
            type: 'text',
            label: 'Texte',
            value: L(
              'À l’horizon 2027, EU4Youth laisse un héritage qui dépasse la durée du financement.',
              'By 2027 EU4Youth leaves a legacy that goes beyond the funding period.',
              'في أفق 2027 يترك EU4Youth إرثًا يتجاوز مدة التمويل.',
            ),
          },
          { key: 'image', type: 'image', label: 'Image', value: '/img/apropos-panneaux-v3.webp' },
          {
            key: 'items',
            type: 'json',
            label: 'Accordéons',
            value: {
              fr: [
                { kicker: '', title: 'DES ACQUIS SOLIDES', body: 'Le programme a construit des bases durables de gouvernance et de participation.' },
                { kicker: '', title: 'DES CONNAISSANCES PARTAGÉES', body: 'EU4Youth a investi dans la production de connaissances utiles et accessibles.' },
                { kicker: '', title: 'DES RÉSEAUX VIVANTS', body: 'Des acteurs qui ne se connaissaient pas coopèrent désormais.' },
                { kicker: '', title: 'DES INITIATIVES QUI CONTINUENT', body: 'Les dynamiques créées ont leur propre élan au-delà du programme.' },
                { kicker: '', title: 'UNE GÉNÉRATION FORMÉE', body: 'Une génération de praticiens a intégré les approches participatives.' },
              ],
            },
          },
        ],
      },
    ],
  )

  const simpleHero = (slug, path, title, group, badge, heading, body, extra = {}) =>
    add(pageMeta({ slug, path, title, group, ...extra }), [
      {
        slug: 'hero',
        title: 'En-tête',
        pattern: 'hero',
        fields: [
          { key: 'badge', type: 'text', label: 'Badge', value: badge },
          { key: 'title', type: 'text', label: 'Titre', value: heading },
          { key: 'body', type: 'text', label: 'Texte', value: body },
        ],
      },
    ])

  add(
    pageMeta({
      slug: 'objectifs',
      path: '/programme/objectifs',
      title: 'Objectifs',
      group: 'Programme',
      sort_order: 3,
      meta_description:
        'Objectifs du programme EU4Youth Tunisie : inclusion économique, sociale et civique des jeunes.',
    }),
    [
      {
        slug: 'hero',
        title: 'En-tête',
        pattern: 'hero',
        fields: [
          { key: 'badge', type: 'text', label: 'Badge', value: L('LE PROGRAMME EU4YOUTH', 'EU4YOUTH PROGRAMME', 'برنامج EU4YOUTH') },
          { key: 'title', type: 'text', label: 'Titre', value: L('OBJECTIFS DU PROGRAMME', 'PROGRAMME OBJECTIVES', 'أهداف البرنامج') },
          { key: 'vision', type: 'text', label: 'Sous-titre vision', value: L('UNE VISION COMMUNE', 'A SHARED VISION', 'رؤية مشتركة') },
          {
            key: 'body',
            type: 'text',
            label: 'Chapô',
            value: L(
              'EU4Youth part d’une conviction fondamentale : les jeunes Tunisiennes et Tunisiens sont des acteurs à part entière du changement.',
              'EU4Youth starts from a core conviction: young Tunisian women and men are full actors of change.',
              'ينطلق EU4Youth من قناعة أساسية: الشابات والشبان التونسيون فاعلون كاملون في التغيير.',
            ),
          },
          {
            key: 'visionBody',
            type: 'text',
            label: 'Texte vision',
            value: L(
              "Le programme se construit sur une logique d'investissement dans les capacités, dans les opportunités et dans les conditions d'autonomisation et d’intégration socioéconomique dans tous les territoires du pays.",
              'The programme is built on investing in capacities, opportunities and the conditions for socio-economic inclusion across the country.',
              'يُبنى البرنامج على الاستثمار في القدرات والفرص وشروط الإدماج في كل الأقاليم.',
            ),
          },
          {
            key: 'principles',
            type: 'json',
            label: 'Principes',
            value: {
              fr: [
                { text: 'Créer des opportunités réelles de développement personnel et professionnel pour les jeunes, là où ils vivent.' },
                { text: 'Prioriser celles et ceux qui font face aux obstacles les plus importants : éloignement géographique, précarité, chômage, discrimination.' },
                { text: 'Associer les jeunes à la conception et à la mise en oeuvre des activités qui les concernent pas seulement comme bénéficiaires, mais comme acteurs.' },
                { text: 'Ancrer les interventions dans les territoires, au niveau des communes, des gouvernorats et des écosystèmes locaux.' },
                { text: 'Construire des mécanismes durables de représentation et de participation des jeunes dans la vie citoyenne et l’action publique.' },
                { text: 'Capitaliser sur les expériences passées et les dynamiques déjà engagées, pour construire sur ce qui fonctionne.' },
                { text: 'Coordonner les six projets entre eux et avec les autres programmes européens en Tunisie pour produire un impact cohérent et démultiplié.' },
              ],
            },
          },
          {
            key: 'closing',
            type: 'text',
            label: 'Clôture',
            value: L(
              "À ces principes s'ajoutent des engagements transversaux partagés par tous les projets : intégration systématique de la dimension genre, attention aux besoins spécifiques des jeunes femmes, des jeunes porteurs de handicap et des jeunes des zones rurales ou enclavées ainsi que la dimension environnement et durabilité.\n\nEU4Youth accompagne les aspirations des jeunes Tunisiennes et Tunisiens en renforçant les opportunités, les partenariats et les initiatives qui contribuent au développement des territoires.",
              'These principles are joined by cross-cutting commitments shared by all projects, including gender, disability, rural youth, environment and sustainability.',
              'تُضاف إلى هذه المبادئ التزامات عرضية مشتركة بين كل المشاريع.',
            ),
          },
        ],
      },
      {
        slug: 'objectives',
        title: 'Objectifs du programme',
        pattern: 'text',
        fields: [
          { key: 'title', type: 'text', label: 'Titre de section', value: L('OBJECTIFS\nDU PROGRAMME', 'PROGRAMME\nOBJECTIVES', 'أهداف\nالبرنامج') },
          { key: 'icon', type: 'image', label: 'Icône', value: '/img/icon-objectifs.svg' },
          {
            key: 'items',
            type: 'json',
            label: 'Objectifs',
            value: {
              fr: [
                { kicker: '', title: 'OBJECTIF\nGÉNÉRAL', body: "Contribuer à l'amélioration de l'inclusion économique, sociale et citoyenne des jeunes Tunisiennes et Tunisiens, à travers une approche ancrée dans les territoires et dans les dynamiques locales." },
                { kicker: 'OBJECTIF SPÉCIFIQUE 1', title: 'EMPLOI, EMPLOYABILITÉ ET ENTREPRENEURIAT', body: "Renforcer l'accès des jeunes à des emplois décents, développer leurs compétences et leurs capacités entrepreneuriales, soutenir les filières économiques porteuses dans les régions ciblées.\n\nCela passe par le soutien à l'économie sociale et solidaire, la modernisation des services publics d'intermédiation sur le marché du travail, l'appui à la recherche et à la créativité des jeunes chercheurs, et le financement de projets économiques dans des filières identifiées localement." },
                { kicker: 'OBJECTIF SPÉCIFIQUE 2', title: "CULTURE ET SPORT POUR L'INCLUSION", body: "Renforcer l'inclusion et la participation des jeunes à travers l'accès à la culture et au sport.\n\nLa culture et le sport ne sont pas des accessoires dans la vie d'un jeune; ils en sont des conditions fondamentales d'épanouissement." },
                { kicker: 'OBJECTIF SPÉCIFIQUE 3', title: 'POLITIQUES PUBLIQUES ET PARTICIPATION DES JEUNES', body: 'Renforcer la place des jeunes dans la conception et la mise en œuvre des politiques publiques, au niveau local comme au niveau national.\n\nLes politiques en faveur de la jeunesse ne peuvent être efficaces que si les jeunes eux-mêmes y participent.' },
              ],
            },
          },
        ],
      },
      {
        slug: 'action',
        title: 'Comment le programme agit',
        pattern: 'text',
        fields: [
          { key: 'title', type: 'text', label: 'Titre de section', value: L('COMMENT\nLE PROGRAMME AGIT', 'HOW THE PROGRAMME\nWORKS', 'كيف\nيعمل البرنامج') },
          {
            key: 'items',
            type: 'json',
            label: 'Axes',
            value: {
              fr: [
                { kicker: 'AXE 1', title: 'EMPLOI ET OPPORTUNITÉS ÉCONOMIQUES', body: "Le programme renforce l'accès des jeunes aux opportunités économiques, qu'il s'agisse de création d'entreprises, d'accès à l'emploi salarié ou de développement de projets dans des filières porteuses. Il agit sur plusieurs leviers complémentaires : le soutien à l'entrepreneuriat social et collectif, la modernisation des services d'orientation et d'intermédiation sur le marché du travail, la promotion de la recherche et de la créativité comme chemins vers l'emploi, et le financement de projets économiques ancrés dans les territoires.", icon: '/img/icon-axe-1.webp' },
                { kicker: 'AXE 2', title: 'CULTURE, SPORT ET PARTICIPATION', body: "EU4Youth considère la culture et le sport comme des leviers d'inclusion à part entière. Le programme renforce les opérateurs culturels et sportifs, améliore l'accès des jeunes en situation de vulnérabilité aux pratiques créatives et sportives, et développe l'employabilité dans ces secteurs. En parallèle, il crée les conditions d'une participation citoyenne authentique des jeunes — au niveau de leurs communes, de leurs associations, et des politiques publiques qui les concernent.", icon: '/img/icon-axe-2.webp' },
                { kicker: 'AXE 3', title: 'INNOVATION, RECHERCHE ET DÉVELOPPEMENT TERRITORIAL', body: "Le programme investit dans la recherche et l'innovation comme ressources pour l'emploi des jeunes chercheurs et pour le développement de la société. Il appuie également une logique de développement territorial fondée sur l'émergence d'écosystèmes locaux dynamiques — des réseaux d'acteurs qui se connaissent, coopèrent et créent ensemble des opportunités pour les jeunes de leurs régions. Cette logique territoriale est au coeur de la conception d'EU4Youth, de sa sélection des zones d'intervention à ses modalités de mise en oeuvre.", icon: '/img/icon-axe-3.webp' },
              ],
            },
          },
        ],
      },
      {
        slug: 'projets',
        title: 'Six projets',
        pattern: 'text',
        fields: [
          { key: 'title', type: 'text', label: 'Titre', value: L('SIX PROJETS', 'SIX PROJECTS', 'ستة مشاريع') },
          { key: 'subtitle', type: 'text', label: 'Sous-titre', value: L('UNE VISION COMMUNE.', 'A SHARED VISION.', 'رؤية مشتركة.') },
          {
            key: 'body',
            type: 'text',
            label: 'Texte',
            value: L(
              'EU4Youth Tunisie s’organise en trois composantes thématiques portées par six projets complémentaires. Chaque projet intervient sur une dimension spécifique de l’inclusion des jeunes tunisiennes et tunisiens.',
              'EU4Youth Tunisia is organised in three thematic components carried by six complementary projects.',
              'ينتظم برنامج EU4Youth تونس في ثلاث مكونات موضوعية يحملها ستة مشاريع متكاملة.',
            ),
          },
          {
            key: 'cta',
            type: 'text',
            label: 'Bouton',
            value: L('Découvrir les projets', 'Discover the projects', 'اكتشف المشاريع'),
          },
          {
            key: 'logos',
            type: 'json',
            label: 'Logos projet',
            value: {
              fr: [
                { slug: 'irada4youth', name: 'IRADA4YOUTH', grey: '/img/logo-irada4youth-grey.png', color: '/img/logo-irada4youth.png' },
                { slug: 'swafy', name: 'SWAFY', grey: '/img/logo-swafy-grey.png', color: '/img/logo-swafy.png' },
                { slug: 'jeuness', name: "Jeun'ESS", grey: '/img/logo-jeuness-grey.png', color: '/img/logo-jeuness.png' },
                { slug: 'fe3ila', name: 'Fe3il.a', grey: '/img/logo-fe3ila-grey.png', color: '/img/logo-fe3ila.png' },
                { slug: 'maghroumin', name: "Maghroum'IN", grey: '/img/logo-maghroumin-grey.png', color: '/img/logo-maghroumin.png' },
                { slug: 'go4youth', name: 'GO4Youth', grey: '/img/logo-go4youth-grey.png', color: '/img/logo-go4youth.png' },
              ],
            },
          },
          {
            key: 'composantes',
            type: 'json',
            label: 'Composantes',
            value: {
              fr: [
                {
                  code: 'C1',
                  title: 'Emploi, employabilité et entrepreneuriat',
                  links: "jeuness|Jeun'ESS\ngo4youth|GO4Youth\nswafy|SWAFY\nirada4youth|IRADA4YOUTH",
                },
                {
                  code: 'C2',
                  title: "Culture et sport pour l'inclusion",
                  links: "maghroumin|Maghroum'IN",
                },
                {
                  code: 'C3',
                  title: 'Politiques publiques et participation des jeunes',
                  links: 'fe3ila|Fe3il.a',
                },
              ],
            },
          },
        ],
      },
    ],
  )

  add(
    pageMeta({
      slug: 'financement',
      path: '/programme/financement',
      title: 'Financement',
      group: 'Programme',
      sort_order: 4,
      meta_description:
        'EU4Youth est financé par l’Union européenne. Cadre financier, budgets des six projets et organisation du financement.',
    }),
    [
      {
        slug: 'hero',
        title: 'En-tête',
        pattern: 'hero',
        fields: [
          { key: 'badge', type: 'text', label: 'Badge', value: L('LE PROGRAMME EU4YOUTH', 'THE EU4YOUTH PROGRAMME', 'برنامج EU4YOUTH') },
          { key: 'title', type: 'text', label: 'Titre', value: L('FINANCEMENT\nUNION EUROPÉENNE', 'EUROPEAN UNION\nFUNDING', 'تمويل\nالاتحاد الأوروبي') },
          {
            key: 'body',
            type: 'text',
            label: 'Chapô',
            value: L(
              'EU4Youth est le programme d’appui à la jeunesse tunisienne financé par l’Union européenne et mis en œuvre en partenariat avec les institutions tunisiennes et les acteurs nationaux et internationaux engagés en faveur des jeunes.',
              'EU4Youth is the EU-funded youth programme implemented with Tunisian institutions and national and international partners.',
              'EU4Youth برنامج لدعم الشباب التونسي، بتمويل من الاتحاد الأوروبي وبالشراكة مع المؤسسات التونسية والفاعلين الوطنيين والدوليين المنخرطين لفائدة الشباب.',
            ),
          },
          { key: 'amount', type: 'text', label: 'Montant', value: L('60', '60', '60') },
          { key: 'unit', type: 'text', label: 'Unité', value: L('M€', 'M€', 'M€') },
          { key: 'figureLabel', type: 'text', label: 'Libellé budget', value: L('BUDGET GLOBAL', 'TOTAL BUDGET', 'الميزانية الإجمالية') },
          { key: 'flags', type: 'image', label: 'Drapeaux', value: '/img/footer-flags-v2.webp' },
        ],
      },
      {
        slug: 'facts',
        title: 'Le financement en chiffres',
        pattern: 'text',
        fields: [
          { key: 'title', type: 'text', label: 'Titre', value: L('LE FINANCEMENT EN CHIFFRES', 'FUNDING IN FIGURES', 'التمويل بالأرقام') },
          {
            key: 'intro',
            type: 'text',
            label: 'Introduction',
            value: L(
              'Doté d’un budget de 60 millions d’euros pour 2019–2027, EU4Youth est la plus importante enveloppe européenne dédiée à la jeunesse tunisienne. La convention de financement a été signée en juin 2019.',
              'With a budget of €60 million for 2019–2027, EU4Youth is the largest European envelope dedicated to Tunisian youth. The financing agreement was signed in June 2019.',
              'بميزانية 60 مليون يورو للفترة 2019–2027، يُعد EU4Youth أكبر غلاف أوروبي مخصص للشباب التونسي.',
            ),
          },
          {
            key: 'items',
            type: 'json',
            label: 'Chiffres',
            value: {
              fr: [
                { value: '60 M€', label: 'BUDGET GLOBAL', note: "Financé par l'Union européenne" },
                { value: '2019–2027', label: 'PÉRIODE', note: 'Convention signée en juin 2019' },
                { value: '6', label: 'PROJETS', note: 'Complémentaires et coordonnés' },
                { value: '24', label: 'GOUVERNORATS', note: 'Une présence nationale' },
              ],
            },
          },
        ],
      },
      {
        slug: 'projects',
        title: 'Les six projets',
        pattern: 'text',
        fields: [
          { key: 'eyebrow', type: 'text', label: 'Sur-titre', value: L('BUDGETS PUBLIÉS DES PROJETS', 'PUBLISHED PROJECT BUDGETS', 'ميزانيات المشاريع المنشورة') },
          { key: 'title', type: 'text', label: 'Titre', value: L('LES SIX PROJETS', 'THE SIX PROJECTS', 'المشاريع الستة') },
          {
            key: 'body',
            type: 'text',
            label: 'Texte',
            value: L(
              'Chaque projet dispose de son propre budget, partenaire de mise en œuvre et périmètre d’action. Les montants ci-dessous sont les enveloppes publiées ; leur somme ne reconstitue pas seule le budget global du programme.',
              'Each project has its own budget, implementing partner and scope. The amounts below are the published envelopes; they do not by themselves add up to the programme total.',
              'لكل مشروع ميزانيته وشريكه ونطاقه. المبالغ أدناه هي الأغلفة المنشورة.',
            ),
          },
          { key: 'fundingLabel', type: 'text', label: 'Libellé financement', value: L('Financement', 'Funding', 'تمويل') },
          { key: 'partnerLabel', type: 'text', label: 'Libellé partenaire', value: L('Partenaire', 'Partner', 'الشريك') },
          { key: 'periodLabel', type: 'text', label: 'Libellé période', value: L('Période', 'Period', 'الفترة') },
          { key: 'more', type: 'text', label: 'Lien projet', value: L('Découvrir le projet', 'Discover the project', 'اكتشف المشروع') },
          {
            key: 'items',
            type: 'json',
            label: 'Budgets des projets',
            value: {
              fr: [
                { slug: 'jeuness', acronym: "Jeun'ESS", budget: "9 millions d'euros", composante: 'Emploi, employabilité et entrepreneuriat', funding: "Financé par l'Union européenne dans le cadre d'EU4Youth", partner: 'Organisation internationale du Travail (OIT)', period: 'Septembre 2019 – Août 2024', logo: '/img/logo-jeuness.png' },
                { slug: 'go4youth', acronym: 'GO4Youth', budget: '10 millions d’euros', composante: 'Emploi, employabilité et entrepreneuriat', funding: "Financé par l'Union européenne dans le cadre d'EU4Youth", partner: 'Banque mondiale / ANETI', period: 'Septembre 2021 – Juin 2027', logo: '/img/logo-go4youth.png' },
                { slug: 'swafy', acronym: 'SWAFY', budget: '9 millions d’euros', composante: 'Emploi, employabilité et entrepreneuriat', funding: "Financé par l'Union européenne dans le cadre d'EU4Youth", partner: 'Agence Nationale de Promotion de la Recherche (ANPR)', period: 'Juin 2022 – Juin 2027', logo: '/img/logo-swafy.png' },
                { slug: 'irada4youth', acronym: 'IRADA4YOUTH', budget: '5 millions d’euros', composante: 'Emploi, employabilité et entrepreneuriat', funding: 'Contrat de subvention financé à 100 % par l’Union européenne', partner: 'CGDR + Offices de Développement Régional', period: '2022 – 2027', logo: '/img/logo-irada4youth.png' },
                { slug: 'maghroumin', acronym: "Maghroum'IN", budget: '15,46 millions d’euros', composante: "Culture et sport pour l'inclusion", funding: "Financé par l'Union européenne dans le cadre d'EU4Youth", partner: 'Consortium EUNIC : AECID (Espagne) · FIIAPP (Espagne) · British Council (Royaume-Uni)', period: 'Janvier 2022 – Décembre 2026', logo: '/img/logo-maghroumin.png' },
                { slug: 'fe3ila', acronym: 'Fe3il.a', budget: '9,1 millions d’euros', composante: 'Politiques publiques et participation des jeunes', funding: 'Union européenne, avec la contribution du Royaume des Pays-Bas', partner: 'CILG-VNG International (Pays-Bas)', period: '2021 – 2026', logo: '/img/logo-fe3ila.png' },
              ],
              en: [
                { slug: 'jeuness', acronym: "Jeun'ESS", budget: '€9 million', composante: 'Employment, employability and entrepreneurship', funding: 'Funded by the European Union under EU4Youth', partner: 'International Labour Organization (ILO)', period: 'September 2019 – August 2024', logo: '/img/logo-jeuness.png' },
                { slug: 'go4youth', acronym: 'GO4Youth', budget: '€10 million', composante: 'Employment, employability and entrepreneurship', funding: 'Funded by the European Union under EU4Youth', partner: 'World Bank / ANETI', period: 'September 2021 – June 2027', logo: '/img/logo-go4youth.png' },
                { slug: 'swafy', acronym: 'SWAFY', budget: '€9 million', composante: 'Employment, employability and entrepreneurship', funding: 'Funded by the European Union under EU4Youth', partner: 'National Agency for Research Promotion (ANPR)', period: 'June 2022 – June 2027', logo: '/img/logo-swafy.png' },
                { slug: 'irada4youth', acronym: 'IRADA4YOUTH', budget: '€5 million', composante: 'Employment, employability and entrepreneurship', funding: 'Grant contract funded 100% by the European Union', partner: 'CGDR + Regional Development Offices', period: '2022 – 2027', logo: '/img/logo-irada4youth.png' },
                { slug: 'maghroumin', acronym: "Maghroum'IN", budget: '€15.46 million', composante: 'Culture and sport for inclusion', funding: 'Funded by the European Union under EU4Youth', partner: 'EUNIC Consortium: AECID (Spain) · FIIAPP (Spain) · British Council (United Kingdom)', period: 'January 2022 – December 2026', logo: '/img/logo-maghroumin.png' },
                { slug: 'fe3ila', acronym: 'Fe3il.a', budget: '€9.1 million', composante: 'Public policies and youth participation', funding: 'European Union, with a contribution from the Kingdom of the Netherlands', partner: 'CILG-VNG International (Netherlands)', period: '2021 – 2026', logo: '/img/logo-fe3ila.png' },
              ],
              ar: [
                { slug: 'jeuness', acronym: "Jeun'ESS", budget: '9 ملايين يورو', composante: 'التشغيل والقابلية للتشغيل وريادة الأعمال', funding: 'بتمويل من الاتحاد الأوروبي في إطار EU4Youth', partner: 'منظمة العمل الدولية (OIT)', period: 'سبتمبر 2019 – أغسطس 2024', logo: '/img/logo-jeuness.png' },
                { slug: 'go4youth', acronym: 'GO4Youth', budget: '10 ملايين يورو', composante: 'التشغيل والقابلية للتشغيل وريادة الأعمال', funding: 'بتمويل من الاتحاد الأوروبي في إطار EU4Youth', partner: 'البنك الدولي / الوكالة الوطنية للتشغيل', period: 'سبتمبر 2021 – يونيو 2027', logo: '/img/logo-go4youth.png' },
                { slug: 'swafy', acronym: 'SWAFY', budget: '9 ملايين يورو', composante: 'التشغيل والقابلية للتشغيل وريادة الأعمال', funding: 'بتمويل من الاتحاد الأوروبي في إطار EU4Youth', partner: 'الوكالة الوطنية لترقية البحث (ANPR)', period: 'يونيو 2022 – يونيو 2027', logo: '/img/logo-swafy.png' },
                { slug: 'irada4youth', acronym: 'IRADA4YOUTH', budget: '5 ملايين يورو', composante: 'التشغيل والقابلية للتشغيل وريادة الأعمال', funding: 'عقد منحة مموَّل بنسبة 100% من الاتحاد الأوروبي', partner: 'المندوبية العامة للتنمية الجهوية + مكاتب التنمية الجهوية', period: '2022 – 2027', logo: '/img/logo-irada4youth.png' },
                { slug: 'maghroumin', acronym: "Maghroum'IN", budget: '15,46 مليون يورو', composante: 'الثقافة والرياضة من أجل الإدماج', funding: 'بتمويل من الاتحاد الأوروبي في إطار EU4Youth', partner: 'كونسورتيوم EUNIC: AECID (إسبانيا) · FIIAPP (إسبانيا) · المجلس البريطاني (المملكة المتحدة)', period: 'يناير 2022 – ديسمبر 2026', logo: '/img/logo-maghroumin.png' },
                { slug: 'fe3ila', acronym: 'Fe3il.a', budget: '9,1 ملايين يورو', composante: 'السياسات العمومية ومشاركة الشباب', funding: 'الاتحاد الأوروبي، مع مساهمة مملكة هولندا', partner: 'CILG-VNG International (هولندا)', period: '2021 – 2026', logo: '/img/logo-fe3ila.png' },
              ],
            },
          },
        ],
      },
      {
        slug: 'purpose',
        title: 'Au service des territoires',
        pattern: 'text',
        fields: [
          { key: 'title', type: 'text', label: 'Titre', value: L('UN FINANCEMENT\nAU SERVICE DES TERRITOIRES', 'FUNDING\nFOR THE TERRITORIES', 'تمويل\nفي خدمة الأقاليم') },
          {
            key: 'items',
            type: 'json',
            label: 'Axes de financement',
            value: {
              fr: [
                { title: 'EMPLOI ET ENTREPRENEURIAT', text: "Le financement soutient l'accès à l'emploi décent, l'entrepreneuriat, l'économie sociale et solidaire, la recherche appliquée et les filières économiques porteuses." },
                { title: 'CULTURE ET SPORT', text: "Il renforce les opérateurs, les espaces et les initiatives qui font de la culture et du sport des leviers d'inclusion, d'expression et d'employabilité." },
                { title: 'PARTICIPATION DES JEUNES', text: 'Il accompagne les communes, les institutions et la société civile pour associer durablement les jeunes aux politiques publiques qui les concernent.' },
              ],
            },
          },
        ],
      },
      {
        slug: 'structure',
        title: 'Organisation du financement',
        pattern: 'text',
        fields: [
          { key: 'title', type: 'text', label: 'Titre', value: L('COMMENT LE FINANCEMENT EST ORGANISÉ', 'HOW THE FUNDING IS ORGANISED', 'كيف يُنظَّم التمويل') },
          {
            key: 'items',
            type: 'json',
            label: 'Organisation',
            value: {
              fr: [
                { title: 'Programme-cadre', body: "EU4Youth regroupe six projets distincts sous une vision commune. Le programme fixe les objectifs globaux, la gouvernance d'ensemble et les mécanismes de coordination." },
                { title: 'Convention de financement', body: 'Signée en juin 2019 entre la Commission européenne et le gouvernement tunisien, elle formalise le budget, la durée, les objectifs et les conditions de mise en œuvre. Sa durée a été portée à 96 mois par avenant en décembre 2021.' },
                { title: 'Supervision', body: "La Délégation de l'Union européenne en Tunisie assure la supervision stratégique des six projets. Les institutions tunisiennes et les partenaires de mise en œuvre portent l'exécution opérationnelle et le reporting." },
              ],
            },
          },
        ],
      },
      {
        slug: 'cta',
        title: 'Aller plus loin',
        pattern: 'text',
        fields: [
          { key: 'eyebrow', type: 'text', label: 'Sur-titre', value: L('ALLER PLUS LOIN', 'GO FURTHER', 'لمعرفة المزيد') },
          { key: 'title', type: 'text', label: 'Titre', value: L('DÉCOUVRIR LES ACTIONS FINANCÉES', 'DISCOVER FUNDED ACTIONS', 'اكتشفوا الأنشطة المموّلة') },
          { key: 'projects', type: 'text', label: 'Bouton projets', value: L('Voir les six projets', 'See the six projects', 'اطلع على المشاريع الستة') },
          { key: 'publications', type: 'text', label: 'Bouton publications', value: L('Publications et ressources', 'Publications and resources', 'المنشورات والموارد') },
        ],
      },
    ],
  )
  add(
    pageMeta({
      slug: 'gouvernance',
      path: '/programme/gouvernance',
      title: 'Gouvernance',
      group: 'Programme',
      sort_order: 5,
      meta_description:
        'Gouvernance et pilotage d’EU4Youth : Union européenne, cadre interministériel, partenaires de mise en œuvre et territoires.',
    }),
    [
      {
        slug: 'hero',
        title: 'En-tête',
        pattern: 'hero',
        fields: [
          { key: 'badge', type: 'text', label: 'Badge', value: L('LE PROGRAMME EU4YOUTH', 'EU4YOUTH PROGRAMME', 'برنامج EU4YOUTH') },
          { key: 'title', type: 'text', label: 'Titre', value: L('GOUVERNANCE\nET PILOTAGE', 'GOVERNANCE\nAND STEERING', 'الحوكمة\nوالتسيير') },
          {
            key: 'body',
            type: 'text',
            label: 'Chapô',
            value: L(
              'EU4Youth repose sur une gouvernance partenariale qui relie l’Union européenne, les institutions tunisiennes, les partenaires de mise en œuvre et les acteurs des territoires autour d’une vision commune pour la jeunesse.',
              'EU4Youth relies on partnership governance linking the EU, Tunisian institutions, implementing partners and territorial actors.',
              'يقوم EU4Youth على حوكمة شراكة تربط الاتحاد الأوروبي والمؤسسات التونسية وشركاء التنفيذ.',
            ),
          },
        ],
      },
      {
        slug: 'model',
        title: 'Gouvernance partagée',
        pattern: 'text',
        fields: [
          { key: 'title', type: 'text', label: 'Titre', value: L('UNE GOUVERNANCE\nPARTAGÉE', 'SHARED\nGOVERNANCE', 'حوكمة\nمشتركة') },
          {
            key: 'intro',
            type: 'text',
            label: 'Introduction',
            value: L(
              'Le programme coordonne six projets complémentaires à travers une supervision stratégique européenne, un cadre de concertation interministériel et des partenaires opérationnels ancrés dans les territoires.',
              'The programme coordinates six complementary projects through EU strategic supervision, an interministerial framework and operational partners.',
              'ينسق البرنامج ستة مشاريع عبر إشراف أوروبي وإطار وزاري وشركاء ميدانيين.',
            ),
          },
          {
            key: 'items',
            type: 'json',
            label: 'Niveaux',
            value: {
              fr: [
                { number: '01', title: "L'UNION EUROPÉENNE", body: "La Délégation de l'Union européenne en Tunisie assure la supervision stratégique des six projets, veille à la cohérence du programme et constitue l'interlocuteur institutionnel de référence auprès des autorités tunisiennes." },
                { number: '02', title: 'CADRE INTERMINISTÉRIEL', body: 'Présidé par le Ministère de l’Économie et de la Planification, ce cadre réunit les ministères concernés, l’ONJ, les agences partenaires, la DUE et les chefs d’équipe des projets pour le suivi et la coordination nationale.' },
                { number: '03', title: 'PARTENAIRES DE MISE EN ŒUVRE', body: 'Chaque organisation signe un contrat de subvention avec la DUE et est responsable des résultats, de la gestion financière et du reporting de son projet.' },
                { number: '04', title: 'TERRITOIRES ET JEUNES', body: 'Communes, services régionaux, associations et jeunes participent à la conception, à la mise en œuvre et au suivi des actions, notamment dans les consultations et comités locaux.' },
              ],
            },
          },
        ],
      },
      {
        slug: 'map',
        title: 'Carte',
        pattern: 'text',
        fields: [
          { key: 'eyebrow', type: 'text', label: 'Sur-titre', value: L('DU NATIONAL AU LOCAL', 'FROM NATIONAL TO LOCAL', 'من الوطني إلى المحلي') },
          { key: 'title', type: 'text', label: 'Titre', value: L('LA GOUVERNANCE\nSUR LE TERRITOIRE', 'GOVERNANCE\nON THE TERRITORY', 'الحوكمة\nعلى الأرض') },
          {
            key: 'body',
            type: 'text',
            label: 'Texte',
            value: L(
              'Chaque niveau de pilotage agit à une échelle différente. Choisissez un niveau pour voir où il intervient en Tunisie.',
              'Each steering level acts at a different scale. Choose a level to see where it operates in Tunisia.',
              'كل مستوى من التسيير يعمل على نطاق مختلف. اختر مستوى لرؤية تدخله في تونس.',
            ),
          },
          {
            key: 'layers',
            type: 'json',
            label: 'Couches de la carte',
            value: {
              fr: [
                { id: 'ue', number: '01', tab: 'Union européenne', title: 'SUPERVISION STRATÉGIQUE', body: "La Délégation de l'Union européenne en Tunisie supervise l'ensemble du programme depuis Tunis : cohérence des six projets, dialogue institutionnel et suivi.", readout: 'Portée nationale — un interlocuteur institutionnel unique', national: 'oui', governorates: '', nodes: "Tunis|Délégation de l'UE" },
                { id: 'cadre', number: '02', tab: 'Cadre interministériel', title: 'COORDINATION NATIONALE', body: 'Le cadre de concertation interministériel, présidé par le Ministère de l’Économie et de la Planification, réunit ministères, ONJ, agences, DUE et chefs d’équipe.', readout: 'Portée nationale — présidence du MEP, suivi semestriel', national: 'oui', governorates: '', nodes: 'Tunis|MEP — présidence' },
                { id: 'partenaires', number: '03', tab: 'Mise en œuvre', title: 'PILOTAGE OPÉRATIONNEL', body: 'Les partenaires de mise en œuvre déploient les projets dans les gouvernorats ciblés. Trois projets — GO4Youth, SWAFY et Maghroum’IN — ont une ambition de couverture large ; leur cartographie détaillée reste liée aux sources de déploiement (BETI, régions, mapping).', readout: '14 gouvernorats nommés dans les fiches projets', national: 'non', governorates: 'Jendouba, Le Kef, Kairouan, Sidi Bouzid, Kébili, Zaghouan, Mahdia, Tozeur, Sfax, Médenine, Kasserine, Manouba, Siliana, Béja', nodes: '' },
                { id: 'territoires', number: '04', tab: 'Territoires et jeunes', title: 'PARTICIPATION LOCALE', body: 'Avec Fe3il.a, huit communes partenaires construisent des stratégies jeunesse participatives : consultations, forums et espaces de décision ouverts aux jeunes.', readout: '8 communes partenaires réparties sur 7 gouvernorats', national: 'non', governorates: 'Sfax, Médenine, Kasserine, Manouba, Siliana, Kébili, Béja', nodes: '' },
              ],
            },
          },
        ],
      },
      {
        slug: 'eu',
        title: 'Union européenne',
        pattern: 'text',
        fields: [
          { key: 'eyebrow', type: 'text', label: 'Sur-titre', value: L('SUPERVISION STRATÉGIQUE', 'STRATEGIC SUPERVISION', 'الإشراف الاستراتيجي') },
          { key: 'title', type: 'text', label: 'Titre', value: L('L’UNION EUROPÉENNE', 'THE EUROPEAN UNION', 'الاتحاد الأوروبي') },
          {
            key: 'body',
            type: 'text',
            label: 'Texte',
            value: L(
              "EU4Youth s’inscrit dans le Partenariat UE–Tunisie pour la Jeunesse, annoncé conjointement en décembre 2016. La Délégation de l’Union européenne assure le pilotage stratégique et le suivi des six projets.\n\nLa convention de financement signée en juin 2019 fixe les objectifs globaux, le budget, la durée et les conditions de mise en œuvre du programme.",
              'EU4Youth is part of the EU–Tunisia Youth Partnership announced in December 2016. The EU Delegation provides strategic steering of the six projects.',
              'يندرج EU4Youth في شراكة الاتحاد الأوروبي وتونس من أجل الشباب المعلنة في ديسمبر 2016.',
            ),
          },
          { key: 'flags', type: 'image', label: 'Drapeaux', value: '/img/footer-flags-v2.webp' },
        ],
      },
      {
        slug: 'framework',
        title: 'Cadre interministériel',
        pattern: 'text',
        fields: [
          { key: 'eyebrow', type: 'text', label: 'Sur-titre', value: L('COORDINATION NATIONALE', 'NATIONAL COORDINATION', 'التنسيق الوطني') },
          { key: 'title', type: 'text', label: 'Titre', value: L('CADRE DE CONCERTATION\nINTERMINISTÉRIEL', 'INTERMINISTERIAL\nCONSULTATION FRAMEWORK', 'إطار التشاور\nبين الوزارات') },
          {
            key: 'body',
            type: 'text',
            label: 'Texte',
            value: L(
              'Mécanisme de gouvernance d’EU4Youth réunissant les représentants des ministères concernés, de l’ONJ, des agences partenaires, de la DUE et des chefs d’équipe des projets. Présidé par le Ministère de l’Économie et de la Planification, il assure le suivi et la coordination du programme au niveau national.\n\nLes comités de suivi semestriel du programme réunissent ces acteurs pour partager les avancées, les bonnes pratiques et les synergies entre projets.',
              'EU4Youth governance mechanism chaired by the Ministry of Economy and Planning.',
              'آلية حوكمة يرأسها وزارة الاقتصاد والتخطيط.',
            ),
          },
          {
            key: 'members',
            type: 'json',
            label: 'Composition',
            value: {
              fr: [
                { text: 'Ministère de l’Économie et de la Planification (présidence)' },
                { text: 'Ministères partenaires du programme' },
                { text: 'Observatoire National de la Jeunesse' },
                { text: 'Agences partenaires (ANETI, ANPR, CGDR…)' },
                { text: 'Délégation de l’Union européenne' },
                { text: 'Chefs d’équipe des six projets' },
              ],
            },
          },
        ],
      },
      {
        slug: 'institutions',
        title: 'Institutions tunisiennes',
        pattern: 'text',
        fields: [
          { key: 'title', type: 'text', label: 'Titre', value: L('LES INSTITUTIONS TUNISIENNES', 'TUNISIAN INSTITUTIONS', 'المؤسسات التونسية') },
          {
            key: 'body',
            type: 'text',
            label: 'Texte',
            value: L(
              'Les ministères et institutions tunisiennes sont des partenaires centraux du programme. Ils président les cadres de concertation, accompagnent la mise en œuvre et portent l’appropriation institutionnelle des acquis.',
              'Tunisian ministries and institutions are core partners of the programme.',
              'الوزارات والمؤسسات التونسية شركاء أساسيون للبرنامج.',
            ),
          },
          {
            key: 'items',
            type: 'json',
            label: 'Logos',
            value: {
              fr: [
                { src: '/img/org-economie-planification.webp', alt: "Ministère de l'Économie et de la Planification" },
                { src: '/img/org-affaires-culturelles.webp', alt: 'Ministère des Affaires Culturelles' },
                { src: '/img/org-jeunesse-sports.webp', alt: 'Ministère de la Jeunesse et des Sports' },
                { src: '/img/org-aneti.webp', alt: "Agence Nationale pour l'Emploi et le Travail Indépendant" },
                { src: '/img/org-formation-emploi.webp', alt: "Ministère de la Formation Professionnelle et de l'Emploi" },
                { src: '/img/org-cgdr.webp', alt: 'Commissariat Général au Développement Régional' },
                { src: '/img/org-observatoire-jeunesse.webp', alt: 'Observatoire National de la Jeunesse' },
                { src: '/img/org-mesrs.webp', alt: "Ministère de l'Enseignement Supérieur et de la Recherche Scientifique" },
                { src: '/img/org-anpr.webp', alt: 'Agence Nationale de la Promotion de la Recherche scientifique' },
                { src: '', alt: 'Ministère de l’Éducation' },
              ],
              en: [
                { src: '/img/org-economie-planification.webp', alt: 'Ministry of Economy and Planning' },
                { src: '/img/org-affaires-culturelles.webp', alt: 'Ministry of Cultural Affairs' },
                { src: '/img/org-jeunesse-sports.webp', alt: 'Ministry of Youth and Sports' },
                { src: '/img/org-aneti.webp', alt: 'National Agency for Employment and Self-Employment' },
                { src: '/img/org-formation-emploi.webp', alt: 'Ministry of Vocational Training and Employment' },
                { src: '/img/org-cgdr.webp', alt: 'General Commissariat for Regional Development' },
                { src: '/img/org-observatoire-jeunesse.webp', alt: 'National Youth Observatory' },
                { src: '/img/org-mesrs.webp', alt: 'Ministry of Higher Education and Scientific Research' },
                { src: '/img/org-anpr.webp', alt: 'National Agency for the Promotion of Scientific Research' },
                { src: '', alt: 'Ministry of Education' },
              ],
              ar: [
                { src: '/img/org-economie-planification.webp', alt: 'وزارة الاقتصاد والتخطيط' },
                { src: '/img/org-affaires-culturelles.webp', alt: 'وزارة الشؤون الثقافية' },
                { src: '/img/org-jeunesse-sports.webp', alt: 'وزارة الشباب والرياضة' },
                { src: '/img/org-aneti.webp', alt: 'الوكالة الوطنية للتشغيل والعمل المستقل' },
                { src: '/img/org-formation-emploi.webp', alt: 'وزارة التكوين المهني والتشغيل' },
                { src: '/img/org-cgdr.webp', alt: 'المندوبية العامة للتنمية الجهوية' },
                { src: '/img/org-observatoire-jeunesse.webp', alt: 'المرصد الوطني للشباب' },
                { src: '/img/org-mesrs.webp', alt: 'وزارة التعليم العالي والبحث العلمي' },
                { src: '/img/org-anpr.webp', alt: 'الوكالة الوطنية للنهوض بالبحث العلمي' },
                { src: '', alt: 'وزارة التربية' },
              ],
            },
          },
        ],
      },
      {
        slug: 'implementation',
        title: 'Mise en œuvre',
        pattern: 'text',
        fields: [
          { key: 'eyebrow', type: 'text', label: 'Sur-titre', value: L('PILOTAGE OPÉRATIONNEL', 'OPERATIONAL STEERING', 'التسيير العملياتي') },
          { key: 'title', type: 'text', label: 'Titre', value: L('LES PARTENAIRES DE MISE EN ŒUVRE', 'IMPLEMENTING PARTNERS', 'شركاء التنفيذ') },
          {
            key: 'body',
            type: 'text',
            label: 'Texte',
            value: L(
              'Chaque partenaire assure la gestion opérationnelle d’un projet : résultats, gestion financière et reporting auprès de la DUE.',
              'Each partner manages a project operationally: results, finances and reporting to the EU Delegation.',
              'يتولى كل شريك التسيير العملياتي لمشروع: النتائج والمالية والتقارير.',
            ),
          },
          {
            key: 'items',
            type: 'json',
            label: 'Partenaires',
            value: {
              fr: [
                { slug: 'jeuness', acronym: "Jeun'ESS", partner: 'Organisation internationale du Travail (OIT)', composante: 'Emploi, employabilité et entrepreneuriat', logo: '/img/logo-jeuness.png' },
                { slug: 'go4youth', acronym: 'GO4Youth', partner: 'Banque mondiale et ANETI', composante: 'Emploi, employabilité et entrepreneuriat', logo: '/img/logo-go4youth.png' },
                { slug: 'swafy', acronym: 'SWAFY', partner: 'Agence Nationale de la Promotion de la Recherche Scientifique (ANPR)', composante: 'Emploi, employabilité et entrepreneuriat', logo: '/img/logo-swafy.png' },
                { slug: 'irada4youth', acronym: 'IRADA4YOUTH', partner: 'CGDR avec ODNO, ODCO et ODS', composante: 'Emploi, employabilité et entrepreneuriat', logo: '/img/logo-irada4youth.png' },
                { slug: 'maghroumin', acronym: "Maghroum'IN", partner: 'AECID – British Council – FIIAPP', composante: "Culture et sport pour l'inclusion", logo: '/img/logo-maghroumin.png' },
                { slug: 'fe3ila', acronym: 'Fe3il.a', partner: 'CILG-VNG International · Ministère de la Jeunesse et des Sports', composante: 'Politiques publiques et participation des jeunes', logo: '/img/logo-fe3ila.png' },
              ],
            },
          },
        ],
      },
      {
        slug: 'accountability',
        title: 'Redevabilité',
        pattern: 'text',
        fields: [
          { key: 'title', type: 'text', label: 'Titre', value: L('SUIVI, REPORTING ET REDEVABILITÉ', 'MONITORING, REPORTING AND ACCOUNTABILITY', 'المتابعة والتقارير والمساءلة') },
          {
            key: 'items',
            type: 'json',
            label: 'Blocs',
            value: {
              fr: [
                { title: 'Reporting régulier', body: 'Les partenaires de mise en œuvre produisent des rapports d’activité semestriels et annuels à destination de la DUE, selon des modèles standardisés.' },
                { title: 'Coordination des six projets', body: 'EU4Youth vise à coordonner les projets entre eux et avec les autres programmes européens en Tunisie pour produire un impact cohérent et démultiplié.' },
                { title: 'Redevabilité locale', body: 'Le programme renforce aussi la redevabilité des communes envers leurs citoyens, notamment les jeunes, à travers les processus participatifs soutenus par Fe3il.a.' },
              ],
            },
          },
        ],
      },
      {
        slug: 'youth',
        title: 'Jeunes',
        pattern: 'text',
        fields: [
          { key: 'eyebrow', type: 'text', label: 'Sur-titre', value: L('PARTICIPATION', 'PARTICIPATION', 'المشاركة') },
          { key: 'title', type: 'text', label: 'Titre', value: L('LES JEUNES, ACTEURS DU PILOTAGE', 'YOUNG PEOPLE AS STEERING ACTORS', 'الشباب فاعلون في التسيير') },
          {
            key: 'body',
            type: 'text',
            label: 'Texte',
            value: L(
              'Associer les jeunes à la conception et à la mise en œuvre des activités qui les concernent — pas seulement comme bénéficiaires, mais comme acteurs — est un principe transversal du programme.\n\nEU4Youth construit des mécanismes durables de représentation et de participation dans la vie citoyenne et l’action publique : stratégies jeunesse locales, forums, consultations et espaces destinés à devenir permanents dans les communes, les comités de pilotage et les processus de consultation.',
              'Involving young people as actors, not only beneficiaries, is a cross-cutting principle of the programme.',
              'إشراك الشباب كفاعلين لا كمستفيدين فقط مبدأ عرضي للبرنامج.',
            ),
          },
        ],
      },
      {
        slug: 'legacy',
        title: 'Héritage',
        pattern: 'text',
        fields: [
          { key: 'eyebrow', type: 'text', label: 'Sur-titre', value: L('UNE ARCHITECTURE DURABLE', 'A LASTING ARCHITECTURE', 'بنية دائمة') },
          { key: 'title', type: 'text', label: 'Titre', value: L('PILOTER AUJOURD’HUI, CONSOLIDER DEMAIN', 'STEER TODAY, CONSOLIDATE TOMORROW', 'التسيير اليوم وترسيخ الغد') },
          {
            key: 'body',
            type: 'text',
            label: 'Texte',
            value: L(
              'Le programme a construit des bases durables : une architecture de gouvernance interministérielle qui réunit, dans un cadre formel et régulier, les ministères et les partenaires autour des enjeux de la jeunesse. Des capacités renforcées dans des dizaines d’organisations, d’institutions, de communes et d’associations.',
              'The programme has built lasting foundations: an interministerial governance architecture and stronger capacities across organisations, municipalities and associations.',
              'بنى البرنامج أسساً دائمة: هندسة حوكمة وزارية وقدرات معززة.',
            ),
          },
        ],
      },
      {
        slug: 'cta',
        title: 'Explorer',
        pattern: 'text',
        fields: [
          { key: 'title', type: 'text', label: 'Titre', value: L('EXPLORER LE PROGRAMME', 'EXPLORE THE PROGRAMME', 'استكشف البرنامج') },
          { key: 'about', type: 'text', label: 'Bouton à propos', value: L('À propos d’EU4Youth', 'About EU4Youth', 'حول EU4Youth') },
          { key: 'funding', type: 'text', label: 'Bouton financement', value: L('Financement UE', 'EU funding', 'تمويل الاتحاد الأوروبي') },
        ],
      },
    ],
  )
  add(
    pageMeta({
      slug: 'projets',
      path: '/projets',
      title: 'Les six projets',
      group: 'Projets',
      sort_order: 6,
      meta_description: 'Les six projets complémentaires du programme EU4Youth Tunisie.',
    }),
    [
      {
        slug: 'hero',
        title: 'En-tête',
        pattern: 'hero',
        fields: [
          { key: 'badge', type: 'text', label: 'Badge', value: L('EU4YOUTH TUNISIE', 'EU4YOUTH TUNISIA', 'EU4YOUTH تونس') },
          { key: 'title', type: 'text', label: 'Titre', value: L('LES SIX\nPROJETS', 'THE SIX\nPROJECTS', 'المشاريع\nالستة') },
          {
            key: 'body',
            type: 'text',
            label: 'Texte',
            value: L(
              'EU4Youth met en œuvre six projets complémentaires, portés par des partenaires internationaux et des institutions tunisiennes, autour de l’emploi, de la culture et du sport, et de la participation des jeunes aux politiques publiques.',
              'EU4Youth implements six complementary projects, led by international partners and Tunisian institutions, around employment, culture and sport, and youth participation in public policy.',
              'ينفّذ EU4Youth ستة مشاريع متكاملة مع شركاء دوليين ومؤسسات تونسية حول التشغيل والثقافة والرياضة ومشاركة الشباب في السياسات العمومية.',
            ),
          },
        ],
      },
      {
        slug: 'filters',
        title: 'Filtres',
        pattern: 'text',
        fields: [
          { key: 'eyebrow', type: 'text', label: 'Sur-titre', value: L('COMPARER LES PROJETS', 'COMPARE THE PROJECTS', 'مقارنة المشاريع') },
          { key: 'title', type: 'text', label: 'Titre', value: L('FILTRER LA GRILLE', 'FILTER THE GRID', 'تصفية الشبكة') },
          { key: 'theme', type: 'text', label: 'Filtre thématique', value: L('Thématique', 'Theme', 'المحور') },
          { key: 'governorate', type: 'text', label: 'Filtre gouvernorat', value: L('Gouvernorat', 'Governorate', 'الولاية') },
          { key: 'beneficiary', type: 'text', label: 'Filtre public', value: L('Public bénéficiaire', 'Beneficiaries', 'الفئة المستفيدة') },
          { key: 'all', type: 'text', label: 'Option Tous', value: L('Tous', 'All', 'الكل') },
          { key: 'reset', type: 'text', label: 'Réinitialiser', value: L('Réinitialiser', 'Reset', 'إعادة ضبط') },
          { key: 'projectOne', type: 'text', label: 'Projet (singulier)', value: L('projet', 'project', 'مشروع') },
          { key: 'projectMany', type: 'text', label: 'Projets (pluriel)', value: L('projets', 'projects', 'مشاريع') },
        ],
      },
      {
        slug: 'grid',
        title: 'Grille',
        pattern: 'cards_grid',
        fields: [
          {
            key: 'composantes',
            type: 'json',
            label: 'Composantes',
            value: {
              fr: [
                { kicker: 'COMPOSANTE 1', name: 'Emploi, employabilité et entrepreneuriat' },
                { kicker: 'COMPOSANTE 2', name: "Culture et sport pour l'inclusion" },
                { kicker: 'COMPOSANTE 3', name: 'Politiques publiques et participation des jeunes' },
              ],
            },
          },
          {
            key: 'items',
            type: 'json',
            label: 'Projets',
            value: {
              fr: [
                { slug: 'jeuness', acronym: "Jeun'ESS", tagline: "L'économie sociale et solidaire, un levier pour l'emploi décent des jeunes tunisiens.", partner: 'Organisation internationale du Travail (OIT)', budget: "9 millions d'euros", period: 'Septembre 2019 – Août 2024', territory: '7 gouvernorats : Jendouba, Le Kef, Kairouan, Kasserine, Sidi Bouzid, Gabès, Kébili', composante: 'Emploi, employabilité et entrepreneuriat' },
                { slug: 'go4youth', acronym: 'GO4Youth', tagline: 'Renforcer les services d’emploi pour améliorer l’accès des jeunes à des opportunités professionnelles décentes.', partner: 'Banque mondiale et ANETI', budget: "10 millions d'euros", period: 'Septembre 2021 – Juin 2027', territory: 'Déploiement progressif dans les BETI concernés — 6 BETI pilotes puis 48 BETI sélectionnés', composante: 'Emploi, employabilité et entrepreneuriat' },
                { slug: 'swafy', acronym: 'SWAFY', tagline: 'Renforcer la contribution de la recherche et de l’innovation au développement économique et social avec et pour les jeunes.', partner: 'Agence Nationale de la Promotion de la Recherche Scientifique (ANPR)', budget: "9 millions d'euros", period: 'Juin 2022 – Juin 2027', territory: 'Toutes les régions', composante: 'Emploi, employabilité et entrepreneuriat' },
                { slug: 'irada4youth', acronym: 'IRADA4YOUTH', tagline: 'Améliorer l’inclusion économique et sociale des jeunes par une approche conçue localement.', partner: 'CGDR avec ODNO, ODCO et ODS', budget: "5 millions d'euros", period: '2022 – 2027 · 60 mois', territory: '6 gouvernorats prioritaires', composante: 'Emploi, employabilité et entrepreneuriat' },
                { slug: 'maghroumin', acronym: "Maghroum'IN", tagline: 'Renforcer l’inclusion et la participation des jeunes tunisien.ne.s en situation de vulnérabilité à travers la création, la culture et le sport.', partner: 'AECID – British Council – FIIAPP', budget: "15,46 millions d'euros", period: 'À partir du 1er janvier 2022 — 60 mois', territory: 'Couverture nationale', composante: "Culture et sport pour l'inclusion" },
                { slug: 'fe3ila', acronym: 'Fe3il.a', tagline: 'Faire des jeunes des acteurs du changement dans leurs territoires.', partner: 'CILG-VNG International · Ministère de la Jeunesse et des Sports', budget: "9,1 millions d'euros", period: '2021 – 2026', territory: '8 communes partenaires', composante: 'Politiques publiques et participation des jeunes' },
              ],
            },
          },
          { key: 'link', type: 'text', label: 'Lien carte', value: L('Découvrir le projet »', 'Discover the project »', 'اكتشف المشروع »') },
          { key: 'partner', type: 'text', label: 'Libellé partenaire', value: L('Mise en œuvre', 'Implementation', 'التنفيذ') },
          { key: 'budget', type: 'text', label: 'Libellé budget', value: L('Budget', 'Budget', 'الميزانية') },
          { key: 'period', type: 'text', label: 'Libellé période', value: L('Période', 'Period', 'الفترة') },
          { key: 'territory', type: 'text', label: 'Libellé territoire', value: L('Territoire', 'Territory', 'المجال الترابي') },
          { key: 'emptyTitle', type: 'text', label: 'Aucun résultat', value: L('Aucun projet ne correspond à cette combinaison.', 'No project matches this combination.', 'لا يوجد مشروع يطابق هذا التركيب.') },
          { key: 'emptyCta', type: 'text', label: 'Bouton vide', value: L('Afficher les six projets', 'Show the six projects', 'عرض المشاريع الستة') },
        ],
      },
      {
        slug: 'cta',
        title: 'Aller plus loin',
        pattern: 'text',
        fields: [
          { key: 'title', type: 'text', label: 'Titre', value: L('SITUER LES PROJETS SUR LE TERRITOIRE', 'LOCATE THE PROJECTS ON THE MAP', 'تحديد المشاريع على التراب') },
          { key: 'map', type: 'text', label: 'Bouton carte', value: L('Carte des initiatives', 'Initiatives map', 'خريطة المبادرات') },
          { key: 'objectives', type: 'text', label: 'Bouton objectifs', value: L('Objectifs du programme', 'Programme objectives', 'أهداف البرنامج') },
        ],
      },
    ],
  )
  add(
    pageMeta({
      slug: 'projet',
      path: '/projets/jeuness',
      title: 'Fiche projet',
      group: 'Projets',
      sort_order: 6,
      is_system: true,
      meta_description:
        'Gabarit des pages projet : présentation, objectifs, composantes et ressources.',
    }),
    [
      {
        slug: 'presentation',
        title: 'Présentation',
        pattern: 'text',
        fields: [
          {
            key: 'title',
            type: 'text',
            label: 'Titre',
            value: L('PRÉSENTATION\nDU PROJET', 'PROJECT\nOVERVIEW', 'عرض\nالمشروع'),
          },
        ],
      },
      {
        slug: 'fiche',
        title: 'Fiche d’identité',
        pattern: 'text',
        fields: [
          { key: 'fullName', type: 'text', label: 'Libellé nom', value: L('Nom complet', 'Full name', 'الاسم الكامل') },
          { key: 'acronym', type: 'text', label: 'Libellé acronyme', value: L('Acronyme', 'Acronym', 'الاختصار') },
          { key: 'period', type: 'text', label: 'Libellé durée', value: L('Durée', 'Duration', 'المدة') },
          { key: 'funding', type: 'text', label: 'Libellé financement', value: L('Financement', 'Funding', 'التمويل') },
          { key: 'implementer', type: 'text', label: 'Libellé mise en œuvre', value: L('Mise en œuvre', 'Implementation', 'التنفيذ') },
          { key: 'sectors', type: 'text', label: 'Libellé secteurs', value: L("Secteurs d'intervention", 'Sectors of intervention', 'قطاعات التدخل') },
        ],
      },
      {
        slug: 'objectifs',
        title: 'Objectifs',
        pattern: 'text',
        fields: [
          { key: 'title', type: 'text', label: 'Titre', value: L('OBJECTIFS', 'OBJECTIVES', 'الأهداف') },
          { key: 'tabGeneral', type: 'text', label: 'Onglet général', value: L('Objectif général', 'Overall objective', 'الهدف العام') },
          { key: 'tabSpecifiques', type: 'text', label: 'Onglet spécifiques', value: L('Objectifs spécifiques', 'Specific objectives', 'الأهداف المحددة') },
          { key: 'generalHeading', type: 'text', label: 'Titre général', value: L('OBJECTIF GÉNÉRAL', 'OVERALL OBJECTIVE', 'الهدف العام') },
          { key: 'specificHeading', type: 'text', label: 'Titre spécifiques', value: L('OBJECTIFS SPÉCIFIQUES', 'SPECIFIC OBJECTIVES', 'الأهداف المحددة') },
        ],
      },
      {
        slug: 'composantes',
        title: 'Composantes',
        pattern: 'cards_grid',
        fields: [{ key: 'title', type: 'text', label: 'Titre', value: L('COMPOSANTES', 'COMPONENTS', 'المكونات') }],
      },
      {
        slug: 'impact',
        title: 'Chiffres clés',
        pattern: 'stats',
        fields: [
          {
            key: 'title',
            type: 'text',
            label: 'Titre',
            value: L('CHIFFRES CLÉS DU PROJET', 'PROJECT KEY FIGURES', 'أرقام المشروع الرئيسية'),
          },
        ],
      },
      {
        slug: 'stories',
        title: 'Youth portraits',
        pattern: 'stories_band',
        fields: [
          { key: 'eyebrow', type: 'text', label: 'Sur-titre', value: L('HISTOIRE DU MOIS', 'STORY OF THE MONTH', 'قصة الشهر') },
          {
            key: 'title',
            type: 'text',
            label: 'Titre',
            value: L(
              'DES JEUNES QUI AGISSENT.\nDES TERRITOIRES QUI CHANGENT.',
              'YOUNG PEOPLE WHO ACT.\nTERRITORIES THAT CHANGE.',
              'شباب يفعل.\nأقاليم تتغير.',
            ),
          },
          { key: 'cta', type: 'text', label: 'Bouton', value: L('Découvrir toutes les stories', 'Discover all stories', 'اكتشف كل القصص') },
        ],
      },
      {
        slug: 'feeds',
        title: 'Actualité du projet',
        pattern: 'cards_grid',
        fields: [
          { key: 'oppsTitle', type: 'text', label: 'Titre opportunités', value: L('OPPORTUNITÉS EN COURS', 'OPEN OPPORTUNITIES', 'فرص جارية') },
          {
            key: 'oppsBody',
            type: 'text',
            label: 'Texte opportunités',
            value: L(
              'Appels à candidatures, bourses et formations ouverts, filtrables par projet et par gouvernorat.',
              'Open calls, grants and trainings, filterable by project and governorate.',
              'دعوات وبرامج منح وتكوين مفتوحة، قابلة للتصفية حسب المشروع والولاية.',
            ),
          },
          { key: 'oppsCta', type: 'text', label: 'Bouton opportunités', value: L('Voir toutes les opportunités', 'See all opportunities', 'عرض كل الفرص') },
          { key: 'newsTitle', type: 'text', label: 'Titre actualités', value: L('DERNIÈRES ACTUALITÉS', 'LATEST NEWS', 'آخر الأخبار') },
          {
            key: 'newsBody',
            type: 'text',
            label: 'Texte actualités',
            value: L(
              'Les avancées, publications et temps forts du projet et des cinq autres projets du programme.',
              'Progress, publications and highlights from the project and the five other programme projects.',
              'تقدم المشروع والمنشورات والمحطات البارزة مع المشاريع الخمسة الأخرى.',
            ),
          },
          { key: 'newsCta', type: 'text', label: 'Bouton actualités', value: L('Voir toutes les actualités', 'See all news', 'عرض كل الأخبار') },
          { key: 'eventsTitle', type: 'text', label: 'Titre événements', value: L('PROCHAINS ÉVÉNEMENTS', 'UPCOMING EVENTS', 'الفعاليات القادمة') },
          {
            key: 'eventsBody',
            type: 'text',
            label: 'Texte événements',
            value: L(
              'Ateliers, forums et rencontres organisés dans les territoires couverts par le programme.',
              'Workshops, forums and meetings held in the territories covered by the programme.',
              'ورشات ومنتديات ولقاءات في المناطق التي يغطيها البرنامج.',
            ),
          },
          { key: 'eventsCta', type: 'text', label: 'Bouton événements', value: L('Voir l’agenda complet', 'See the full agenda', 'عرض الأجندة كاملة') },
        ],
      },
      {
        slug: 'ressources',
        title: 'Ressources',
        pattern: 'cta_banner',
        fields: [
          { key: 'title', type: 'text', label: 'Titre', value: L('RESSOURCES', 'RESOURCES', 'موارد') },
          {
            key: 'body',
            type: 'text',
            label: 'Texte',
            value: L(
              'Rapports, newsletters et supports produits par le projet et par le programme EU4Youth.',
              'Reports, newsletters and materials produced by the project and the EU4Youth programme.',
              'تقارير ونشرات ومواد ينتجها المشروع وبرنامج EU4Youth.',
            ),
          },
          {
            key: 'cta',
            type: 'text',
            label: 'Bouton',
            value: L('Accéder à toutes les publications', 'Browse all publications', 'الاطلاع على كل المنشورات'),
          },
        ],
      },
      {
        slug: 'siblings',
        title: 'Les six projets',
        pattern: 'projects_band',
        fields: [{ key: 'title', type: 'text', label: 'Titre', value: L('LES SIX PROJETS', 'THE SIX PROJECTS', 'المشاريع الستة') }],
      },
    ],
  )
  add(
    pageMeta({
      slug: 'carte',
      path: '/carte',
      title: 'Carte des initiatives',
      group: 'Mapping',
      sort_order: 7,
      meta_description:
        'Carte des interventions territoriales EU4Youth dans les 24 gouvernorats de Tunisie.',
    }),
    [
      {
        slug: 'hero',
        title: 'En-tête',
        pattern: 'hero',
        fields: [
          {
            key: 'badge',
            type: 'text',
            label: 'Badge',
            value: L(
              'CARTOGRAPHIE\nDES INTERVENTIONS TERRITORIALES',
              'MAPPING\nTERRITORIAL INTERVENTIONS',
              'رسم خرائط\nالتدخلات الترابية',
            ),
          },
          { key: 'title', type: 'text', label: 'Titre', value: L('EU4YOUTH', 'EU4YOUTH', 'EU4YOUTH') },
          {
            key: 'body',
            type: 'text',
            label: 'Chapô',
            value: L(
              'De Bizerte à Ben Guerdane, de Jendouba à Tataouine, EU4Youth accompagne les jeunes Tunisiennes et Tunisiens dans les 24 gouvernorats de la Tunisie.',
              'From Bizerte to Ben Guerdane, from Jendouba to Tataouine, EU4Youth supports young Tunisians in all 24 governorates.',
              'من بنزرت إلى بن قردان ومن جندوبة إلى تطاوين، يرافق EU4Youth الشابات والشبان في الولايات الأربع والعشرين.',
            ),
          },
          {
            key: 'lead',
            type: 'text',
            label: 'Accroche',
            value: L(
              'Découvrez les initiatives, les projets et les histoires qui prennent vie près de chez vous.',
              'Discover the initiatives, projects and stories taking shape near you.',
              'اكتشفوا المبادرات والمشاريع والقصص التي تنبض بالحياة قربكم.',
            ),
          },
        ],
      },
      {
        slug: 'filters',
        title: 'Filtres',
        pattern: 'text',
        fields: [
          { key: 'eyebrow', type: 'text', label: 'Sur-titre', value: L('EXPLORER LE PROGRAMME', 'EXPLORE THE PROGRAMME', 'استكشف البرنامج') },
          { key: 'title', type: 'text', label: 'Titre', value: L('FILTRER LA CARTE', 'FILTER THE MAP', 'تصفية الخريطة') },
          { key: 'project', type: 'text', label: 'Filtre projet', value: L('Projet EU4Youth', 'EU4Youth project', 'مشروع EU4Youth') },
          { key: 'nature', type: 'text', label: 'Filtre nature', value: L('Nature du bénéficiaire / partenaire', 'Beneficiary / partner type', 'طبيعة المستفيد / الشريك') },
          { key: 'governorate', type: 'text', label: 'Filtre gouvernorat', value: L('Gouvernorat', 'Governorate', 'الولاية') },
          { key: 'sector', type: 'text', label: 'Filtre secteur', value: L('Secteur d’activité', 'Activity sector', 'قطاع النشاط') },
          { key: 'all', type: 'text', label: 'Option Tous', value: L('Tous', 'All', 'الكل') },
          { key: 'allProjects', type: 'text', label: 'Tous les projets', value: L('Tous les projets', 'All projects', 'كل المشاريع') },
          { key: 'allGovernorates', type: 'text', label: 'Tous les gouvernorats', value: L('Tous les gouvernorats', 'All governorates', 'كل الولايات') },
          { key: 'unstated', type: 'text', label: 'Non renseigné', value: L('Non renseigné', 'Not specified', 'غير مذكور') },
          {
            key: 'note',
            type: 'text',
            label: 'Note filtres',
            value: L(
              'Les filtres projet, gouvernorat, nature et secteur sont actifs. Les interventions « Grand Tunis » colorent Tunis, Ariana, Ben Arous et Manouba ; celles menées à l’échelle nationale restent dans la liste sans colorer la carte.',
              'Project, governorate, type and sector filters are active. “Grand Tunis” records colour Tunis, Ariana, Ben Arous and Manouba; nationwide records stay in the list without colouring the map.',
              'مرشحات المشروع والولاية والطبيعة والقطاع نشطة. تسجّلات «تونس الكبرى» تلوّن تونس وأريانة وبن عروس ومنوبة؛ والتدخلات الوطنية تبقى في القائمة دون تلوين الخريطة.',
            ),
          },
          { key: 'search', type: 'text', label: 'Recherche', value: L('Rechercher une intervention', 'Search an intervention', 'البحث عن تدخل') },
          { key: 'placeholder', type: 'text', label: 'Placeholder', value: L('Nom, localité, projet…', 'Name, locality, project…', 'الاسم، المعتمدية، المشروع…') },
          { key: 'reset', type: 'text', label: 'Réinitialiser', value: L('Réinitialiser Les Filtres', 'Reset filters', 'إعادة ضبط المرشحات') },
          {
            key: 'stats',
            type: 'json',
            label: 'Chiffres',
            value: {
              fr: [
                { id: 'covered', label: 'Gouvernorats couverts' },
                { id: 'structures', label: 'Structures bénéficiaires' },
                { id: 'projects', label: 'Projets EU4Youth' },
                { id: 'sectors', label: "Secteurs d'activité représentés" },
                { id: 'total', label: "Total d'interventions territoriales" },
              ],
            },
          },
        ],
      },
      {
        slug: 'map',
        title: 'Carte',
        pattern: 'text',
        fields: [
          { key: 'aria', type: 'text', label: 'Libellé carte', value: L('Carte des interventions territoriales EU4Youth', 'Map of EU4Youth territorial interventions', 'خريطة التدخلات الترابية لـ EU4Youth') },
          {
            key: 'legend',
            type: 'json',
            label: 'Légende',
            value: {
              fr: [
                { id: 'none', label: '0 intervention' },
                { id: 't1', label: '0 à 20' },
                { id: 't2', label: '20 à 40' },
                { id: 't3', label: '40 à 60' },
                { id: 't4', label: 'Plus de 60' },
              ],
            },
          },
          { key: 'ficheOne', type: 'text', label: 'Fiche (singulier)', value: L('fiche territoriale', 'territorial record', 'بطاقة ترابية') },
          { key: 'ficheMany', type: 'text', label: 'Fiches (pluriel)', value: L('fiches territoriales', 'territorial records', 'بطاقات ترابية') },
        ],
      },
      {
        slug: 'results',
        title: 'Résultats',
        pattern: 'cards_grid',
        fields: [
          { key: 'eyebrow', type: 'text', label: 'Sur-titre', value: L('RÉSULTATS DE LA CARTE', 'MAP RESULTS', 'نتائج الخريطة') },
          { key: 'interventionOne', type: 'text', label: 'Intervention (singulier)', value: L('INTERVENTION', 'INTERVENTION', 'تدخل') },
          { key: 'interventionMany', type: 'text', label: 'Interventions (pluriel)', value: L('INTERVENTIONS', 'INTERVENTIONS', 'تدخلات') },
          { key: 'visibleOne', type: 'text', label: 'Visible (singulier)', value: L('VISIBLE', 'VISIBLE', 'ظاهر') },
          { key: 'visibleMany', type: 'text', label: 'Visibles (pluriel)', value: L('VISIBLES', 'VISIBLE', 'ظاهرة') },
          { key: 'export', type: 'text', label: 'Exporter', value: L('Exporter en CSV', 'Export CSV', 'تصدير CSV') },
          { key: 'empty', type: 'text', label: 'Aucun résultat', value: L('Aucune intervention ne correspond à cette combinaison.', 'No intervention matches this combination.', 'لا يوجد تدخل يطابق هذا التركيب.') },
          { key: 'emptyCta', type: 'text', label: 'Bouton vide', value: L('Réinitialiser Les Filtres', 'Reset filters', 'إعادة ضبط المرشحات') },
          { key: 'prev', type: 'text', label: 'Précédent', value: L('Précédent', 'Previous', 'السابق') },
          { key: 'next', type: 'text', label: 'Suivant', value: L('Suivant', 'Next', 'التالي') },
          { key: 'pageOf', type: 'text', label: 'Page X sur Y', value: L('Page {page} sur {pages}', 'Page {page} of {pages}', 'الصفحة {page} من {pages}') },
          { key: 'detailEyebrow', type: 'text', label: 'Sur-titre détail', value: L('INTERVENTION #{id}', 'INTERVENTION #{id}', 'تدخل #{id}') },
          { key: 'close', type: 'text', label: 'Fermer', value: L('Fermer le détail', 'Close detail', 'إغلاق التفصيل') },
          { key: 'dtProject', type: 'text', label: 'Libellé projet', value: L('Projet', 'Project', 'المشروع') },
          { key: 'dtGovernorate', type: 'text', label: 'Libellé gouvernorat', value: L('Gouvernorat', 'Governorate', 'الولاية') },
          { key: 'dtLocality', type: 'text', label: 'Libellé localité', value: L('Délégation / commune', 'Delegation / municipality', 'المعتمدية / البلدية') },
          { key: 'dtNature', type: 'text', label: 'Libellé nature', value: L('Nature', 'Type', 'الطبيعة') },
          { key: 'dtSector', type: 'text', label: 'Libellé secteur', value: L('Secteur', 'Sector', 'القطاع') },
          { key: 'link', type: 'text', label: 'Lien projet', value: L('Découvrir le projet', 'Discover the project', 'اكتشف المشروع') },
        ],
      },
    ],
  )
  add(
    pageMeta({
      slug: 'opportunites',
      path: '/opportunites',
      title: 'Opportunités',
      group: 'Jeunes',
      sort_order: 8,
      meta_description:
        'Appels à projets, candidatures, formations et opportunités EU4Youth.',
    }),
    [
      {
        slug: 'hero',
        title: 'En-tête',
        pattern: 'hero',
        fields: [
          { key: 'title', type: 'text', label: 'Titre', value: L('OPPORTUNITÉS', 'OPPORTUNITIES', 'الفرص') },
          {
            key: 'body',
            type: 'text',
            label: 'Chapô',
            value: L(
              'Cette rubrique rassemble les appels à projets, appels à candidatures, offres de stage ou d’emploi, bourses et formations ouverts par les projets de l’écosystème EU4Youth. Chaque opportunité précise son porteur, son public cible et sa date limite, pour permettre aux jeunes, aux associations et aux structures partenaires d’identifier rapidement les dispositifs auxquels ils peuvent prétendre.',
              'This section gathers calls, internships, grants and trainings opened by EU4Youth projects. Each opportunity states its host, audience and deadline.',
              'تجمع هذه الصفحة الدعوات والتربصات والمنح والتكوينات التي تفتحها مشاريع EU4Youth.',
            ),
          },
        ],
      },
      {
        slug: 'browser',
        title: 'Filtres et résultats',
        pattern: 'cards_grid',
        fields: [
          { key: 'search', type: 'text', label: 'Recherche', value: L('Recherche', 'Search', 'بحث') },
          { key: 'placeholder', type: 'text', label: 'Placeholder', value: L('Intitulé, secteur, mot-clé…', 'Title, sector, keyword…', 'العنوان، القطاع، كلمة مفتاح…') },
          { key: 'filtersTitle', type: 'text', label: 'Titre filtres', value: L('Filtrer par', 'Filter by', 'تصفية حسب') },
          { key: 'reset', type: 'text', label: 'Réinitialiser', value: L('Réinitialiser', 'Reset', 'إعادة ضبط') },
          { key: 'type', type: 'text', label: 'Filtre type', value: L('Type d’opportunité', 'Opportunity type', 'نوع الفرصة') },
          { key: 'status', type: 'text', label: 'Filtre statut', value: L('Statut', 'Status', 'الحالة') },
          { key: 'theme', type: 'text', label: 'Filtre thématique', value: L('Thématique', 'Theme', 'المحور') },
          { key: 'project', type: 'text', label: 'Filtre projet', value: L('Projet associé', 'Related project', 'المشروع المرتبط') },
          { key: 'location', type: 'text', label: 'Filtre localisation', value: L('Localisation / éligibilité', 'Location / eligibility', 'المكان / الأهلية') },
          { key: 'audience', type: 'text', label: 'Filtre public', value: L('Public cible', 'Target audience', 'الجمهور المستهدف') },
          { key: 'allF', type: 'text', label: 'Option Toutes', value: L('Toutes', 'All', 'الكل') },
          { key: 'allM', type: 'text', label: 'Option Tous', value: L('Tous', 'All', 'الكل') },
          {
            key: 'types',
            type: 'json',
            label: 'Types',
            value: {
              fr: [
                { id: 'Toutes', label: 'Toutes' },
                { id: 'Appel à projets', label: 'Appel à projets' },
                { id: 'Appel à candidatures', label: 'Appel à candidatures' },
                { id: 'Stage / emploi', label: 'Stage / emploi' },
                { id: 'Bourse', label: 'Bourse' },
                { id: 'Formation', label: 'Formation' },
              ],
            },
          },
          {
            key: 'items',
            type: 'json',
            label: 'Opportunités',
            value: {
              fr: [
                {
                  id: 'irada-2aap-2026',
                  slug: 'irada-2e-appel-a-propositions-2026',
                  title: 'Irada4Youth — 2e appel à propositions',
                  type: 'Appel à projets',
                  summary:
                    'Financement de projets créateurs d’emplois dans six gouvernorats prioritaires, avec le CGDR. Subvention moyenne de 21 000 €, jusqu’à 90 % du budget.',
                  opensAt: '2026-06-26',
                  deadline: '2026-07-24',
                  deadlineLabel: '24 juillet 2026',
                  locations: 'Zaghouan · Mahdia · Le Kef · Kairouan · Kébili · Tozeur',
                  locationLabel: 'Zaghouan · Mahdia · Le Kef · Kairouan · Kébili · Tozeur',
                  project: 'Irada4Youth',
                  projectSlug: 'irada4youth',
                  themes: 'Emploi et entrepreneuriat · Agriculture et agroalimentaire',
                  audiences: 'Jeunes diplômés · Certifiés professionnels · Porteuses de projets',
                  image: '/img/photo-entretien.webp',
                },
              ],
            },
          },
          { key: 'statusOpen', type: 'text', label: 'Statut ouverte', value: L('Ouverte', 'Open', 'مفتوحة') },
          { key: 'statusSoon', type: 'text', label: 'Statut à venir', value: L('À venir', 'Upcoming', 'قادمة') },
          { key: 'statusClosed', type: 'text', label: 'Statut clôturée', value: L('Clôturée', 'Closed', 'مغلقة') },
          { key: 'one', type: 'text', label: 'Singulier', value: L('opportunité', 'opportunity', 'فرصة') },
          { key: 'many', type: 'text', label: 'Pluriel', value: L('opportunités', 'opportunities', 'فرص') },
          { key: 'sort', type: 'text', label: 'Trier par', value: L('Trier par', 'Sort by', 'ترتيب حسب') },
          { key: 'sortDeadline', type: 'text', label: 'Tri date limite', value: L('Date limite la plus proche', 'Nearest deadline', 'أقرب أجل') },
          { key: 'sortRecent', type: 'text', label: 'Tri récentes', value: L('Plus récentes', 'Most recent', 'الأحدث') },
          { key: 'emptyEyebrow', type: 'text', label: 'Sur-titre vide', value: L('CATALOGUE PRÊT', 'CATALOGUE READY', 'الكتالوج جاهز') },
          { key: 'emptyOpen', type: 'text', label: 'Aucune ouverte', value: L('Aucune opportunité ouverte pour le moment.', 'No open opportunity at the moment.', 'لا توجد فرصة مفتوحة حالياً.') },
          { key: 'empty', type: 'text', label: 'Aucun résultat', value: L('Aucune opportunité ne correspond à ces critères.', 'No opportunity matches these criteria.', 'لا توجد فرصة تطابق هذه المعايير.') },
          { key: 'emptyHint', type: 'text', label: 'Conseil vide', value: L('Essayez d’élargir votre recherche ou de réinitialiser les filtres.', 'Try widening the search or resetting the filters.', 'وسّعوا البحث أو أعيدوا ضبط المرشحات.') },
          { key: 'emptyArchives', type: 'text', label: 'Texte archives', value: L('Les nouveaux appels seront publiés ici dès validation. Consultez les archives pour les appels clôturés.', 'New calls will appear here once validated. See the archives for closed calls.', 'ستُنشر الدعوات الجديدة هنا بعد المصادقة. راجعوا الأرشيف للدعوات المغلقة.') },
          { key: 'emptyCta', type: 'text', label: 'Bouton vide', value: L('Réinitialiser les filtres', 'Reset filters', 'إعادة ضبط المرشحات') },
          { key: 'archives', type: 'text', label: 'Archives', value: L('Voir les archives', 'See archives', 'عرض الأرشيف') },
          { key: 'agenda', type: 'text', label: 'Lien agenda', value: L('Agenda', 'Agenda', 'الأجندة') },
          { key: 'news', type: 'text', label: 'Lien actualités', value: L('Actualités', 'News', 'الأخبار') },
        ],
      },
    ],
  )
  add(
    pageMeta({
      slug: 'opportunite',
      path: '/opportunites/irada-2e-appel-a-propositions-2026',
      title: 'Fiche opportunité',
      group: 'Jeunes',
      sort_order: 81,
      is_system: true,
      meta_description: 'Gabarit des pages opportunité : retour, métadonnées et dossier.',
    }),
    [
      {
        slug: 'fiche',
        title: 'Fiche opportunité',
        pattern: 'text',
        fields: [
          { key: 'back', type: 'text', label: 'Lien retour', value: L('← Toutes les opportunités', '← All opportunities', '→ كل الفرص') },
          { key: 'statusOpen', type: 'text', label: 'Statut ouverte', value: L('Ouverte', 'Open', 'مفتوحة') },
          { key: 'statusSoon', type: 'text', label: 'Statut à venir', value: L('À venir', 'Upcoming', 'قادمة') },
          { key: 'statusClosed', type: 'text', label: 'Statut clôturée', value: L('Clôturée', 'Closed', 'مغلقة') },
          { key: 'deadline', type: 'text', label: 'Libellé date limite', value: L('Date limite :', 'Deadline:', 'آخر أجل:') },
          { key: 'period', type: 'text', label: 'Période', value: L('Période de candidature', 'Application period', 'فترة الترشح') },
          { key: 'periodFrom', type: 'text', label: 'Période de', value: L('Du', 'From', 'من') },
          { key: 'periodTo', type: 'text', label: 'Période à', value: L('au', 'to', 'إلى') },
          { key: 'territories', type: 'text', label: 'Territoires', value: L('Territoires éligibles', 'Eligible territories', 'الولايات المؤهلة') },
          { key: 'audiences', type: 'text', label: 'Publics', value: L('Publics cibles', 'Target audiences', 'الجمهور المستهدف') },
          { key: 'themes', type: 'text', label: 'Thématiques', value: L('Thématiques', 'Themes', 'المحاور') },
          { key: 'project', type: 'text', label: 'Projet porteur', value: L('Projet porteur', 'Lead project', 'المشروع الحامل') },
          { key: 'dossierTitle', type: 'text', label: 'Titre dossier', value: L('Dossier de l’appel', 'Call dossier', 'ملف الدعوة') },
          {
            key: 'dossierBody',
            type: 'text',
            label: 'Texte dossier',
            value: L(
              'Le document officiel présente les conditions, le financement et le calendrier disponibles dans la source fournie par Irada4Youth.',
              'The official document sets out the conditions, funding and calendar from the Irada4Youth source.',
              'يعرض الوثيقة الرسمية الشروط والتمويل والرزنامة الواردة في مصدر إرادة للشباب.',
            ),
          },
          { key: 'download', type: 'text', label: 'Télécharger', value: L('Télécharger le document officiel', 'Download the official document', 'تنزيل الوثيقة الرسمية') },
          {
            key: 'closedNotice',
            type: 'text',
            label: 'Avis clôturé',
            value: L(
              'Cet appel est clôturé et reste publié à titre d’archive.',
              'This call is closed and remains published as an archive.',
              'هذه الدعوة مغلقة وتبقى منشورة للأرشيف.',
            ),
          },
          { key: 'contact', type: 'text', label: 'Contacter', value: L('Contacter l’équipe de l’appel', 'Contact the call team', 'الاتصال بفريق الدعوة') },
          { key: 'helpTitle', type: 'text', label: 'Aide titre', value: L('Besoin d’aide ?', 'Need help?', 'هل تحتاجون مساعدة؟') },
          {
            key: 'helpBody',
            type: 'text',
            label: 'Aide texte',
            value: L(
              'Vérifiez les critères dans le document officiel avant toute démarche.',
              'Check the criteria in the official document before applying.',
              'تحققوا من المعايير في الوثيقة الرسمية قبل أي خطوة.',
            ),
          },
        ],
      },
    ],
  )
  add(
    pageMeta({
      slug: 'actualites',
      path: '/actualites',
      title: 'Actualités',
      group: 'Media',
      sort_order: 9,
      meta_description: 'Avancées, événements et résultats vérifiés des projets EU4Youth.',
    }),
    [
      {
        slug: 'hero',
        title: 'En-tête',
        pattern: 'hero',
        fields: [
          { key: 'title', type: 'text', label: 'Titre', value: L('ACTUALITÉS', 'NEWS', 'الأخبار') },
          {
            key: 'body',
            type: 'text',
            label: 'Chapô',
            value: L(
              'Cette rubrique retrace les avancées, les temps forts et les résultats des projets de l’écosystème EU4Youth. Communiqués, comptes rendus d’événements, partenariats noués et succès de terrain y sont rassemblés au fil de la mise en œuvre du programme, pour donner à voir une coopération en mouvement plutôt qu’un simple flux d’annonces.',
              'This section traces verified progress, events and results from EU4Youth projects.',
              'ترصد هذه الصفحة تقدم مشاريع EU4Youth ونتائجها وفعالياتها الموثّقة.',
            ),
          },
        ],
      },
      {
        slug: 'browser',
        title: 'Filtres et résultats',
        pattern: 'cards_grid',
        fields: [
          { key: 'search', type: 'text', label: 'Recherche', value: L('Recherche', 'Search', 'بحث') },
          { key: 'placeholder', type: 'text', label: 'Placeholder', value: L('Mot-clé…', 'Keyword…', 'كلمة مفتاح…') },
          { key: 'filtersTitle', type: 'text', label: 'Titre filtres', value: L('Filtrer par', 'Filter by', 'تصفية حسب') },
          { key: 'reset', type: 'text', label: 'Réinitialiser', value: L('Réinitialiser', 'Reset', 'إعادة ضبط') },
          { key: 'type', type: 'text', label: 'Filtre type', value: L('Type d’actualité', 'News type', 'نوع الخبر') },
          { key: 'project', type: 'text', label: 'Filtre projet', value: L('Projet associé', 'Related project', 'المشروع المرتبط') },
          { key: 'theme', type: 'text', label: 'Filtre thématique', value: L('Thématique', 'Theme', 'المحور') },
          { key: 'period', type: 'text', label: 'Filtre période', value: L('Période', 'Period', 'الفترة') },
          { key: 'location', type: 'text', label: 'Filtre localisation', value: L('Localisation', 'Location', 'المكان') },
          { key: 'allF', type: 'text', label: 'Option Toutes', value: L('Toutes', 'All', 'الكل') },
          {
            key: 'types',
            type: 'json',
            label: 'Types',
            value: {
              fr: [
                { id: 'Toutes', label: 'Toutes' },
                { id: 'Communiqué', label: 'Communiqué' },
                { id: 'Événement', label: 'Événement' },
                { id: 'Partenariat', label: 'Partenariat' },
                { id: 'Résultat / succès de terrain', label: 'Résultat / succès de terrain' },
                { id: 'Vie du programme', label: 'Vie du programme' },
              ],
            },
          },
          {
            key: 'items',
            type: 'json',
            label: 'Actualités',
            value: {
              fr: [
                { id: 'go4youth-nl11-avril-2026', slug: 'go4youth-avancees-transformation-digitale-aneti-avril-2026', title: 'Avancées majeures dans la transformation digitale de l’ANETI', type: 'Vie du programme', summary: 'Refonte du système d’information en cours d’évaluation, GEC/GED généralisé et 102 sites raccordés à la fibre optique.', publishedAt: '2026-04-01', dateLabel: 'Avril 2026', project: 'Go4Youth', projectSlug: 'go4youth', themes: 'Emploi et employabilité · Transformation digitale', locations: 'Présence nationale', image: '/img/photo-entretien.webp', source: 'ANETI Newsletter n°11 — Avril 2026' },
                { id: 'go4youth-nl10-decembre-2025', slug: 'go4youth-generalisation-matching-14-betis-decembre-2025', title: 'Généralisation des services et préparation du matching dans 14 BETIs', type: 'Résultat / succès de terrain', summary: 'Inscription à distance et CIVP en ligne opérationnels dans 48 BETIs ; 116 990 comptes créés et 17 202 entreprises inscrites.', publishedAt: '2025-12-01', dateLabel: 'Décembre 2025', project: 'Go4Youth', projectSlug: 'go4youth', themes: 'Emploi et employabilité · Transformation digitale', locations: 'Présence nationale', image: '/img/photo-celebration.webp', source: 'ANETI Newsletter n°10 — Décembre 2025' },
                { id: 'go4youth-nl8-mai-2025', slug: 'go4youth-civp-inscription-19-betis-mai-2025', title: 'CIVP et inscription en ligne déployés dans 19 BETIs supplémentaires', type: 'Résultat / succès de terrain', summary: 'Deux outils majeurs étendus le 10 avril puis le 8 mai 2025, portant à 25 le nombre de BETIs équipés après la phase pilote.', publishedAt: '2025-05-01', dateLabel: 'Mai 2025', project: 'Go4Youth', projectSlug: 'go4youth', themes: 'Emploi et employabilité · Transformation digitale', locations: 'Présence nationale · Grand Tunis', image: '/img/photo-livres.webp', source: 'ANETI Newsletter n°8 — Mai 2025' },
                { id: 'go4youth-nl7-janvier-2025', slug: 'go4youth-48-chefs-beti-tunis-decembre-2024', title: '48 chefs de BETIs réunis à Tunis pour lancer la généralisation', type: 'Événement', summary: 'Ateliers des 4 et 5 décembre 2024 réunissant les BETIs pilotes et ceux de la première phase de généralisation.', publishedAt: '2025-01-01', dateLabel: 'Janvier 2025', project: 'Go4Youth', projectSlug: 'go4youth', themes: 'Emploi et employabilité', locations: 'Tunis', image: '/img/art-graffiti.webp', source: 'ANETI Newsletter n°7 — Janvier 2025' },
                { id: 'go4youth-nl6-septembre-2024', slug: 'go4youth-41-beti-phase-generalisation-septembre-2024', title: '41 nouveaux BETIs sélectionnés pour la 1re phase de généralisation', type: 'Résultat / succès de terrain', summary: 'Après la phase pilote dans six bureaux, la couverture atteint 42 % du réseau national des BETIs.', publishedAt: '2024-09-01', dateLabel: 'Septembre 2024', project: 'Go4Youth', projectSlug: 'go4youth', themes: 'Emploi et employabilité', locations: 'Présence nationale', image: '/img/photo-recyclage.webp', source: 'ANETI Newsletter n°6 — Septembre 2024' },
                { id: 'go4youth-nl5-juin-2024', slug: 'go4youth-copil-entree-generalisation-juin-2024', title: 'Le COPIL Go4Youth acte l’entrée en phase de généralisation', type: 'Communiqué', summary: 'Réuni le 7 juin 2024 sous la présidence du ministre Lotfi Dhiab, le comité valide le passage de la phase pilote à la généralisation.', publishedAt: '2024-06-07', dateLabel: '7 juin 2024', project: 'Go4Youth', projectSlug: 'go4youth', themes: 'Emploi et employabilité · Gouvernance', locations: 'Tunis', image: '/img/photo-elevage.webp', source: 'ANETI Newsletter n°5 — Juin 2024' },
                { id: 'go4youth-nl4-mars-2024', slug: 'go4youth-refonte-outil-profilage-mars-2024', title: 'L’outil de profilage ANETI est en cours de refonte', type: 'Vie du programme', summary: 'Après plusieurs mois d’expérimentation, plus de 40 % des segments sont corrigés en entretien ; une cellule d’amélioration continue est créée.', publishedAt: '2024-03-01', dateLabel: 'Mars 2024', project: 'Go4Youth', projectSlug: 'go4youth', themes: 'Emploi et employabilité · Transformation digitale', locations: 'Présence nationale', image: '/img/photo-entretien.webp', source: 'ANETI Newsletter n°4 — Mars 2024' },
                { id: 'go4youth-nl2-juin-2023', slug: 'go4youth-nouveaux-services-six-beti-pilotes-juin-2023', title: 'Nouveaux services et outils dans six BETIs pilotes', type: 'Résultat / succès de terrain', summary: 'Expérimentation à Hammam Sousse, Gafsa, Le Kef, Charguia, Gabès et Fouchana, avec 118 maîtres formateurs préparés depuis octobre 2022.', publishedAt: '2023-06-01', dateLabel: 'Juin 2023', project: 'Go4Youth', projectSlug: 'go4youth', themes: 'Emploi et employabilité', locations: 'Hammam Sousse · Gafsa · Le Kef · Charguia · Gabès · Fouchana', image: '/img/photo-celebration.webp', source: 'ANETI Newsletter n°2 — Juin 2023' },
              ],
            },
          },
          { key: 'one', type: 'text', label: 'Singulier', value: L('actualité', 'news item', 'خبر') },
          { key: 'many', type: 'text', label: 'Pluriel', value: L('actualités', 'news items', 'أخبار') },
          { key: 'sortHint', type: 'text', label: 'Tri', value: L('Les plus récentes en premier', 'Most recent first', 'الأحدث أولاً') },
          { key: 'read', type: 'text', label: 'Lire l’article', value: L("Lire l'article", 'Read the article', 'اقرأ المقال') },
          { key: 'prev', type: 'text', label: 'Précédent', value: L('‹', '‹', '‹') },
          { key: 'next', type: 'text', label: 'Suivant', value: L('›', '›', '›') },
          { key: 'empty', type: 'text', label: 'Aucun résultat', value: L('Aucune actualité publiée pour le moment.', 'No news published yet.', 'لا توجد أخبار منشورة حالياً.') },
          { key: 'emptyHint', type: 'text', label: 'Conseil vide', value: L('Les résultats et événements restent consultables sur les pages des six projets jusqu’à publication des premiers articles datés.', 'Results and events remain on the six project pages until dated articles are published.', 'تبقى النتائج والفعاليات على صفحات المشاريع إلى حين نشر المقالات.') },
          { key: 'emptyCta', type: 'text', label: 'Lien projets', value: L('Explorer les projets', 'Explore the projects', 'استكشفوا المشاريع') },
        ],
      },
    ],
  )
  add(
    pageMeta({
      slug: 'actualite',
      path: '/actualites/go4youth-avancees-transformation-digitale-aneti-avril-2026',
      title: 'Fiche actualité',
      group: 'Media',
      sort_order: 82,
      is_system: true,
      meta_description: 'Gabarit des pages actualité : retour, source et métadonnées.',
    }),
    [
      {
        slug: 'fiche',
        title: 'Fiche actualité',
        pattern: 'text',
        fields: [
          { key: 'back', type: 'text', label: 'Lien retour', value: L('← Toutes les actualités', '← All news', '→ كل الأخبار') },
          { key: 'sourceTitle', type: 'text', label: 'Titre source', value: L('Source vérifiée', 'Verified source', 'مصدر موثّق') },
          { key: 'sourceLead', type: 'text', label: 'Texte source', value: L('Cette fiche restitue les informations publiées dans', 'This page restates information published in', 'تستعيد هذه البطاقة المعلومات المنشورة في') },
          { key: 'sourceCta', type: 'text', label: 'Bouton source', value: L('Consulter la publication source', 'Open the source publication', 'اطلع على المنشور المصدر') },
          { key: 'dtProject', type: 'text', label: 'Projet associé', value: L('Projet associé', 'Related project', 'المشروع المرتبط') },
          { key: 'dtThemes', type: 'text', label: 'Thématiques', value: L('Thématiques', 'Themes', 'المحاور') },
          { key: 'dtTerritory', type: 'text', label: 'Territoire', value: L('Territoire', 'Territory', 'المجال الترابي') },
          { key: 'dtType', type: 'text', label: 'Type', value: L('Type d’actualité', 'News type', 'نوع الخبر') },
          { key: 'related', type: 'text', label: 'À lire aussi', value: L('À lire aussi', 'Read also', 'اقرأ أيضاً') },
        ],
      },
    ],
  )
  add(
    pageMeta({
      slug: 'publications',
      path: '/publications',
      title: 'Publications',
      group: 'Media',
      sort_order: 10,
      meta_description: 'Rapports, guides et ressources téléchargeables du programme EU4Youth.',
    }),
    [
      {
        slug: 'hero',
        title: 'En-tête',
        pattern: 'hero',
        fields: [
          { key: 'title', type: 'text', label: 'Titre', value: L('PUBLICATIONS\nET RESSOURCES', 'PUBLICATIONS AND\nRESOURCES', 'منشورات\nوموارد') },
          {
            key: 'body',
            type: 'text',
            label: 'Chapô',
            value: L(
              'Cette rubrique valorise la production documentaire des projets de l’écosystème EU4Youth : études, guides méthodologiques, fiches techniques, rapports et outils élaborés au fil de la mise en œuvre du programme. Elle donne accès aux enseignements et aux méthodes capitalisés par les équipes, dans une logique de transmission plutôt que d’archivage exhaustif.',
              'This section highlights documentary production from EU4Youth projects: studies, guides, reports and tools produced during implementation.',
              'تبرز هذه الصفحة الإنتاج الوثائقي لمشاريع EU4Youth: دراسات وأدلة وتقارير وأدوات.',
            ),
          },
          { key: 'image', type: 'image', label: 'Image', value: '/img/photo-livres.webp' },
        ],
      },
      {
        slug: 'browser',
        title: 'Filtres et résultats',
        pattern: 'cards_grid',
        fields: [
          { key: 'search', type: 'text', label: 'Recherche', value: L('Rechercher', 'Search', 'بحث') },
          { key: 'placeholder', type: 'text', label: 'Placeholder', value: L('Titre, projet, thématique…', 'Title, project, theme…', 'العنوان، المشروع، المحور…') },
          { key: 'type', type: 'text', label: 'Filtre type', value: L('Type de ressource', 'Resource type', 'نوع المورد') },
          { key: 'theme', type: 'text', label: 'Filtre thématique', value: L('Thématique', 'Theme', 'المحور') },
          { key: 'project', type: 'text', label: 'Filtre projet', value: L('Projet associé', 'Related project', 'المشروع المرتبط') },
          { key: 'year', type: 'text', label: 'Filtre année', value: L('Année de publication', 'Publication year', 'سنة النشر') },
          { key: 'language', type: 'text', label: 'Filtre langue', value: L('Langue', 'Language', 'اللغة') },
          { key: 'format', type: 'text', label: 'Filtre format', value: L('Format', 'Format', 'الصيغة') },
          { key: 'sort', type: 'text', label: 'Filtre tri', value: L('Tri par', 'Sort by', 'ترتيب حسب') },
          { key: 'allF', type: 'text', label: 'Option Toutes', value: L('Toutes', 'All', 'الكل') },
          {
            key: 'types',
            type: 'json',
            label: 'Types',
            value: {
              fr: [
                { id: 'Toutes', label: 'Toutes' },
                { id: 'Newsletter', label: 'Newsletter' },
                { id: 'Rapport', label: 'Rapport' },
                { id: 'Module de formation', label: 'Module de formation' },
                { id: 'Appel à propositions', label: 'Appel à propositions' },
                { id: 'Capitalisation', label: 'Capitalisation' },
              ],
            },
          },
          {
            key: 'sorts',
            type: 'json',
            label: 'Tris',
            value: {
              fr: [
                { id: 'default', label: 'par défaut' },
                { id: 'downloads', label: 'plus téléchargées' },
                { id: 'views', label: 'plus consultées' },
                { id: 'recent', label: 'plus récents' },
              ],
            },
          },
          {
            key: 'items',
            type: 'json',
            label: 'Publications',
            value: {
              fr: [
                { id: 'go4youth-newsletter-11', title: 'Lettre d’information ANETI — numéro 11', type: 'Newsletter', summary: 'Avancées dans la transformation digitale de l’ANETI : SI en cours de sélection, GEC/GED généralisé et 102 sites raccordés à la fibre.', project: 'Go4Youth', projectSlug: 'go4youth', publishedAt: '2026-04-01', dateLabel: 'Avril 2026', year: '2026', language: 'Français', format: 'PDF', themes: 'Emploi et employabilité · Transformation digitale', href: '/docs/go4youth/newsletter-11-avril-2026.pdf', fileSize: '2,9 Mo', cover: '/img/pub-covers/newsletter-11-avril-2026.webp' },
                { id: 'go4youth-newsletter-10', title: 'Lettre d’information ANETI — numéro 10', type: 'Newsletter', summary: 'Nouveaux services opérationnels dans 48 BETIs ; préparation du matching et de la gestion de l’offre dans 14 BETIs.', project: 'Go4Youth', projectSlug: 'go4youth', publishedAt: '2025-12-01', dateLabel: 'Décembre 2025', year: '2025', language: 'Français', format: 'PDF', themes: 'Emploi et employabilité · Transformation digitale', href: '/docs/go4youth/newsletter-10-decembre-2025.pdf', fileSize: '2,6 Mo', cover: '/img/pub-covers/newsletter-10-decembre-2025.webp' },
                { id: 'go4youth-newsletter-8', title: 'Lettre d’information Go4Youth — numéro 8', type: 'Newsletter', summary: 'Déploiement du CIVP et de l’inscription en ligne dans 19 BETIs supplémentaires, portant à 25 le total équipé.', project: 'Go4Youth', projectSlug: 'go4youth', publishedAt: '2025-05-01', dateLabel: 'Mai 2025', year: '2025', language: 'Français', format: 'PDF', themes: 'Emploi et employabilité · Transformation digitale', href: '/docs/go4youth/newsletter-8-mai-2025.pdf', fileSize: '1,5 Mo', cover: '/img/pub-covers/newsletter-8-mai-2025.webp' },
                { id: 'go4youth-newsletter-7', title: 'Lettre d’information ANETI — numéro 7', type: 'Newsletter', summary: '48 chefs de BETIs réunis à Tunis les 4 et 5 décembre 2024 pour lancer la généralisation.', project: 'Go4Youth', projectSlug: 'go4youth', publishedAt: '2025-01-01', dateLabel: 'Janvier 2025', year: '2025', language: 'Français', format: 'PDF', themes: 'Emploi et employabilité', href: '/docs/go4youth/newsletter-7-janvier-2025.pdf', fileSize: '1,3 Mo', cover: '/img/pub-covers/newsletter-7-janvier-2025.webp' },
                { id: 'go4youth-newsletter-6', title: 'Lettre d’information ANETI — numéro 6', type: 'Newsletter', summary: 'Sélection de 41 nouveaux BETIs pour la première phase de généralisation (42 % du réseau).', project: 'Go4Youth', projectSlug: 'go4youth', publishedAt: '2024-09-01', dateLabel: 'Septembre 2024', year: '2024', language: 'Français', format: 'PDF', themes: 'Emploi et employabilité', href: '/docs/go4youth/newsletter-6-septembre-2024.pdf', fileSize: '1,9 Mo', cover: '/img/pub-covers/newsletter-6-septembre-2024.webp' },
                { id: 'go4youth-newsletter-5', title: 'Lettre d’information ANETI — numéro 5', type: 'Newsletter', summary: 'Le comité de pilotage du 7 juin 2024 acte l’entrée du projet en phase de généralisation.', project: 'Go4Youth', projectSlug: 'go4youth', publishedAt: '2024-06-01', dateLabel: 'Juin 2024', year: '2024', language: 'Français', format: 'PDF', themes: 'Emploi et employabilité · Gouvernance', href: '/docs/go4youth/newsletter-5-juin-2024.pdf', fileSize: '1,6 Mo', cover: '/img/pub-covers/newsletter-5-juin-2024.webp' },
                { id: 'go4youth-newsletter-4', title: 'Lettre d’information Go4Youth — numéro 4', type: 'Newsletter', summary: 'Refonte de l’outil de profilage et création d’une cellule d’amélioration continue.', project: 'Go4Youth', projectSlug: 'go4youth', publishedAt: '2024-03-01', dateLabel: 'Mars 2024', year: '2024', language: 'Français', format: 'PDF', themes: 'Emploi et employabilité · Transformation digitale', href: '/docs/go4youth/newsletter-4-mars-2024.pdf', fileSize: '745 Ko', cover: '/img/pub-covers/newsletter-4-mars-2024.webp' },
                { id: 'go4youth-newsletter-2', title: 'Lettre d’information Go4Youth — numéro 2', type: 'Newsletter', summary: 'Nouveaux services et outils expérimentés dans six BETIs pilotes.', project: 'Go4Youth', projectSlug: 'go4youth', publishedAt: '2023-06-01', dateLabel: 'Juin 2023', year: '2023', language: 'Français', format: 'PDF', themes: 'Emploi et employabilité', href: '/docs/go4youth/newsletter-2-juin-2023.pdf', fileSize: '1,6 Mo', cover: '/img/pub-covers/newsletter-2-juin-2023.webp' },
                { id: 'irada-appel-propositions-2026', title: 'Irada4Youth — 2e appel à propositions', type: 'Appel à propositions', summary: 'Présentation des conditions, secteurs prioritaires et modalités du second appel.', project: 'Irada4Youth', projectSlug: 'irada4youth', publishedAt: '2026-06-26', dateLabel: '26 juin 2026', year: '2026', language: 'Français', format: 'PDF', themes: 'Emploi et entrepreneuriat', href: '/docs/irada4youth/2e-appel-propositions-juin-2026.pdf', fileSize: '1,2 Mo', cover: '/img/pub-covers/2e-appel-propositions-juin-2026.webp' },
                { id: 'irada-rapport-narratif-2025', title: 'Irada4Youth — rapport narratif 2025', type: 'Rapport', summary: 'Rapport narratif intermédiaire n°3 sur les réalisations 2025 : suivi des tranches, retards et renforcement des capacités.', project: 'Irada4Youth', projectSlug: 'irada4youth', publishedAt: '2026-04-01', dateLabel: 'Avril 2026', year: '2026', language: 'Français', format: 'PDF', themes: 'Suivi et résultats', href: '/docs/irada4youth/rapport-narratif-2025.pdf', fileSize: '1,9 Mo', cover: '/img/pub-covers/rapport-narratif-2025.webp' },
                { id: 'irada-rapport-narratif-2024', title: 'Irada4Youth — rapport narratif 2024', type: 'Rapport', summary: 'Rapport narratif intermédiaire n°2 : 51 contrats, mise en œuvre et préparation du second appel.', project: 'Irada4Youth', projectSlug: 'irada4youth', publishedAt: '2025-06-01', dateLabel: 'Juin 2025', year: '2025', language: 'Français', format: 'PDF', themes: 'Suivi et résultats', href: '/docs/irada4youth/rapport-narratif-2024.pdf', fileSize: '1,6 Mo', cover: '/img/pub-covers/rapport-narratif-2024.webp' },
                { id: 'irada-rapport-narratif-2023', title: 'Irada4Youth — rapport narratif 2023', type: 'Rapport', summary: 'Rapport narratif des réalisations juin 2022–décembre 2023 : lancement, premier appel et 306 dossiers éligibles.', project: 'Irada4Youth', projectSlug: 'irada4youth', publishedAt: '2024-03-01', dateLabel: 'Mars 2024', year: '2024', language: 'Français', format: 'PDF', themes: 'Suivi et résultats', href: '/docs/irada4youth/rapport-narratif-2023.pdf', fileSize: '8,5 Mo', cover: '/img/pub-covers/rapport-narratif-2023.webp' },
                { id: 'fe3ila-capitalisation-forums-jeunes', title: 'Capitalisation de l’expérience des forums des jeunes', type: 'Capitalisation', summary: 'Capitalisation de l’expérience des forums des jeunes conduits dans le cadre du projet Fe3il.a.', project: 'Fe3il.a', projectSlug: 'fe3ila', publishedAt: '', dateLabel: 'Date de publication à confirmer', year: '', language: 'Français', format: 'PDF', themes: 'Gouvernance · Participation des jeunes', href: '', fileSize: '', cover: '/img/pub-covers/fe3ila-capitalisation-forums-jeunes.webp' },
              ],
            },
          },
          { key: 'one', type: 'text', label: 'Singulier', value: L('ressource', 'resource', 'مورد') },
          { key: 'many', type: 'text', label: 'Pluriel', value: L('ressources', 'resources', 'موارد') },
          { key: 'reset', type: 'text', label: 'Réinitialiser', value: L('Réinitialiser les filtres', 'Reset filters', 'إعادة ضبط عوامل التصفية') },
          { key: 'download', type: 'text', label: 'Télécharger', value: L('Télécharger', 'Download', 'تنزيل') },
          { key: 'missingFile', type: 'text', label: 'Fichier manquant', value: L('Fichier à fournir', 'File forthcoming', 'الملف سيُوفَّر لاحقاً') },
          { key: 'prev', type: 'text', label: 'Précédent', value: L('‹', '‹', '‹') },
          { key: 'next', type: 'text', label: 'Suivant', value: L('›', '›', '›') },
          { key: 'empty', type: 'text', label: 'Aucun résultat', value: L('Aucune ressource ne correspond à ces critères.', 'No resource matches these criteria.', 'لا يوجد مورد يوافق هذه المعايير.') },
          { key: 'emptyHint', type: 'text', label: 'Conseil vide', value: L('Élargissez la recherche ou réinitialisez les filtres.', 'Widen the search or reset the filters.', 'وسّعوا البحث أو أعيدوا ضبط عوامل التصفية.') },
        ],
      },
    ],
  )
  add(
    pageMeta({
      slug: 'publication',
      path: '/publications/go4youth-newsletter-11',
      title: 'Fiche publication',
      group: 'Media',
      sort_order: 83,
      is_system: true,
      meta_description: 'Gabarit des pages publication : métadonnées, source et ressources liées.',
    }),
    [
      {
        slug: 'fiche',
        title: 'Fiche publication',
        pattern: 'text',
        fields: [
          { key: 'back', type: 'text', label: 'Lien retour', value: L('← Toutes les publications', '← All publications', '→ كل المنشورات') },
          { key: 'dtType', type: 'text', label: 'Type', value: L('Type de ressource', 'Resource type', 'نوع المورد') },
          { key: 'dtProject', type: 'text', label: 'Projet associé', value: L('Projet associé', 'Related project', 'المشروع المرتبط') },
          { key: 'dtDate', type: 'text', label: 'Date', value: L('Date', 'Date', 'التاريخ') },
          { key: 'dtFormat', type: 'text', label: 'Format', value: L('Format', 'Format', 'الصيغة') },
          { key: 'dtLanguage', type: 'text', label: 'Langue', value: L('Langue', 'Language', 'اللغة') },
          { key: 'dtThemes', type: 'text', label: 'Thématiques', value: L('Thématiques', 'Themes', 'المحاور') },
          { key: 'sourceTitle', type: 'text', label: 'Titre source', value: L('Document source', 'Source document', 'الوثيقة المصدر') },
          { key: 'sourceLead', type: 'text', label: 'Texte source', value: L('Le fichier fourni est disponible au téléchargement dans son format original.', 'The supplied file is available for download in its original format.', 'الملف متاح للتنزيل بصيغته الأصلية.') },
          { key: 'sourceMissing', type: 'text', label: 'Fichier manquant', value: L('Le fichier PDF sera proposé au téléchargement dès qu’il sera disponible.', 'The PDF will be offered for download once it is available.', 'سيُقترح ملف PDF للتنزيل فور توفره.') },
          { key: 'download', type: 'text', label: 'Télécharger', value: L('Télécharger le PDF', 'Download the PDF', 'تنزيل ملف PDF') },
          { key: 'related', type: 'text', label: 'Ressources liées', value: L('Ressources liées', 'Related resources', 'موارد ذات صلة') },
          { key: 'relatedEmpty', type: 'text', label: 'Vide', value: L('Aucune autre ressource liée n’est actuellement fournie.', 'No other related resource is currently available.', 'لا توجد حالياً موارد أخرى ذات صلة.') },
          { key: 'projectCta', type: 'text', label: 'Lien projet', value: L('Découvrir le projet', 'Discover the project', 'اكتشفوا المشروع') },
        ],
      },
    ],
  )
  add(
    pageMeta({
      slug: 'stories',
      path: '/stories',
      title: 'Youth Stories',
      group: 'Jeunes',
      status: 'published',
      sort_order: 11,
      meta_description: 'Portraits de bénéficiaires et voix d’engagement — avec consentement.',
    }),
    [
      {
        slug: 'hero',
        title: 'En-tête',
        pattern: 'hero',
        fields: [
          { key: 'image', type: 'image', label: 'Image', value: '/img/home-stories-v2.webp' },
          {
            key: 'badge',
            type: 'text',
            label: 'Sur-titre',
            value: L('PAROLES, PARCOURS, INITIATIVES', 'WORDS, PATHS, INITIATIVES', 'كلمات، مسارات، مبادرات'),
          },
          { key: 'title', type: 'text', label: 'Titre', value: L('YOUTH STORIES', 'YOUTH STORIES', 'قصص الشباب') },
          {
            key: 'lead',
            type: 'text',
            label: 'Chapeau',
            value: L(
              'Portraits, voix et initiatives de jeunes accompagnés par EU4Youth Tunisie — des parcours concrets qui donnent à voir l’impact du programme sur le terrain.',
              'Portraits, voices and initiatives of young people supported by EU4Youth Tunisia — concrete pathways that show the programme’s impact on the ground.',
              'صور وأصوات ومبادرات لشباب يرافقهم برنامج EU4Youth تونس — مسارات ملموسة تُظهر أثر البرنامج على الميدان.',
            ),
          },
        ],
      },
      {
        slug: 'archive',
        title: 'Archive',
        pattern: 'text',
        fields: [
          { key: 'eyebrow', type: 'text', label: 'Sur-titre archive', value: L('ARCHIVE PUBLIÉE', 'PUBLISHED ARCHIVE', 'الأرشيف المنشور') },
          { key: 'title', type: 'text', label: 'Titre archive', value: L('Portraits et voix validés', 'Validated portraits and voices', 'صور وأصوات موثّقة') },
          { key: 'emptyNumber', type: 'text', label: 'Chiffre', value: L('00', '00', '00') },
          { key: 'emptyEyebrow', type: 'text', label: 'Sur-titre vide', value: L('ARCHIVE DES STORIES', 'STORIES ARCHIVE', 'أرشيف القصص') },
          {
            key: 'emptyTitle',
            type: 'text',
            label: 'Titre vide',
            value: L(
              'Structure prête à recevoir les portraits',
              'Structure ready for the portraits',
              'هيكل جاهز لاستقبال الصور',
            ),
          },
          {
            key: 'emptyBody',
            type: 'text',
            label: 'Texte vide',
            value: L(
              'Les témoignages et parcours seront présentés ici dès que leurs contenus éditoriaux seront validés. L’archive et la grille ci-dessous sont déjà en place pour les accueillir.',
              'Testimonials and pathways will appear here once editorial content is validated. The archive and grid below are already in place.',
              'ستُعرض الشهادات والمسارات هنا فور المصادقة على المحتويات. الأرشيف والشبكة جاهزان.',
            ),
          },
          { key: 'ctaProjects', type: 'text', label: 'Lien projets', value: L('Découvrir les projets', 'Discover the projects', 'اكتشفوا المشاريع') },
          { key: 'ctaContact', type: 'text', label: 'Lien contact', value: L('Nous contacter', 'Contact us', 'اتصلوا بنا') },
        ],
      },
      {
        slug: 'slots',
        title: 'Formats prévus',
        pattern: 'cards_grid',
        fields: [
          { key: 'eyebrow', type: 'text', label: 'Sur-titre formats', value: L('FORMATS PRÉVUS', 'PLANNED FORMATS', 'صيغ مقررة') },
          {
            key: 'title',
            type: 'text',
            label: 'Titre formats',
            value: L(
              'Emplacements prêts à être renseignés',
              'Slots ready to be filled',
              'خانات جاهزة للتعبئة',
            ),
          },
          {
            key: 'items',
            type: 'json',
            label: 'Formats',
            value: {
              fr: [
                { id: 'portrait', number: '01', label: 'Portrait', title: 'Parcours d’une ou d’un bénéficiaire' },
                { id: 'initiative', number: '02', label: 'Initiative', title: 'Une action portée sur le territoire' },
                { id: 'voix', number: '03', label: 'Voix', title: 'Témoignage et engagement' },
              ],
              en: [
                { id: 'portrait', number: '01', label: 'Portrait', title: 'Pathway of a beneficiary' },
                { id: 'initiative', number: '02', label: 'Initiative', title: 'An action rooted in the territory' },
                { id: 'voix', number: '03', label: 'Voice', title: 'Testimony and engagement' },
              ],
              ar: [
                { id: 'portrait', number: '01', label: 'بورتريه', title: 'مسار مستفيد أو مستفيدة' },
                { id: 'initiative', number: '02', label: 'مبادرة', title: 'عمل ميداني في الجهة' },
                { id: 'voix', number: '03', label: 'صوت', title: 'شهادة والتزام' },
              ],
            },
          },
          { key: 'badge', type: 'text', label: 'Badge carte', value: L('CONTENU À RENSEIGNER', 'CONTENT TO COMPLETE', 'محتوى للتعبئة') },
          {
            key: 'hint',
            type: 'text',
            label: 'Texte carte',
            value: L(
              'Zone réservée au portrait et au texte validés par l’éditeur.',
              'Reserved for the portrait and text validated by the editor.',
              'منطقة مخصصة للصورة والنص بعد مصادقة المحرر.',
            ),
          },
        ],
      },
      {
        slug: 'projects',
        title: 'Projets',
        pattern: 'text',
        fields: [
          { key: 'eyebrow', type: 'text', label: 'Sur-titre projets', value: L('EN ATTENDANT', 'MEANWHILE', 'في الأثناء') },
          { key: 'title', type: 'text', label: 'Titre projets', value: L('SIX PROJETS À DÉCOUVRIR', 'SIX PROJECTS TO DISCOVER', 'ستة مشاريع لاكتشافها') },
        ],
      },
    ],
  )
  add(
    pageMeta({
      slug: 'coin-media',
      path: '/coin-media',
      title: 'Coin média',
      group: 'Media',
      status: 'published',
      sort_order: 12,
      meta_description: 'Actualités, publications, vidéothèque et contact presse EU4Youth.',
    }),
    [
      {
        slug: 'hero',
        title: 'En-tête',
        pattern: 'hero',
        fields: [
          {
            key: 'badge',
            type: 'text',
            label: 'Sur-titre',
            value: L('INFORMATIONS ET RESSOURCES', 'INFORMATION AND RESOURCES', 'معلومات وموارد'),
          },
          { key: 'title', type: 'text', label: 'Titre', value: L('COIN\nMÉDIA', 'MEDIA\nHUB', 'ركن\nالإعلام') },
          { key: 'mark', type: 'text', label: 'Filigrane', value: L('MEDIA', 'MEDIA', 'إعلام') },
        ],
      },
      {
        slug: 'access',
        title: 'Accès rapide',
        pattern: 'text',
        fields: [
          { key: 'eyebrow', type: 'text', label: 'Sur-titre accès', value: L('ACCÈS RAPIDE', 'QUICK ACCESS', 'وصول سريع') },
          {
            key: 'title',
            type: 'text',
            label: 'Titre accès',
            value: L('SUIVRE ET DOCUMENTER EU4YOUTH', 'FOLLOW AND DOCUMENT EU4YOUTH', 'تابعوا ووثّقوا EU4YOUTH'),
          },
          {
            key: 'items',
            type: 'json',
            label: 'Raccourcis',
            value: {
              fr: [
                { n: '01', label: 'Actualités', to: '/actualites' },
                { n: '02', label: 'Publications', to: '/publications' },
                { n: '03', label: 'Agenda', to: '/agenda' },
              ],
              en: [
                { n: '01', label: 'News', to: '/actualites' },
                { n: '02', label: 'Publications', to: '/publications' },
                { n: '03', label: 'Agenda', to: '/agenda' },
              ],
              ar: [
                { n: '01', label: 'الأخبار', to: '/actualites' },
                { n: '02', label: 'المنشورات', to: '/publications' },
                { n: '03', label: 'الأجندة', to: '/agenda' },
              ],
            },
          },
        ],
      },
      {
        slug: 'news',
        title: 'À la une',
        pattern: 'cards_grid',
        fields: [
          {
            key: 'eyebrow',
            type: 'text',
            label: 'Sur-titre une',
            value: L('DERNIÈRES INFORMATIONS VÉRIFIÉES', 'LATEST VERIFIED UPDATES', 'آخر المعلومات الموثّقة'),
          },
          { key: 'title', type: 'text', label: 'Titre une', value: L('À LA UNE', 'HEADLINES', 'في الواجهة') },
          { key: 'more', type: 'text', label: 'Lien actualités', value: L('Toutes les actualités →', 'All news →', 'كل الأخبار →') },
          {
            key: 'empty',
            type: 'text',
            label: 'Texte vide une',
            value: L(
              'Les actualités publiées apparaîtront ici.',
              'Published news will appear here.',
              'ستظهر هنا الأخبار المنشورة.',
            ),
          },
        ],
      },
      {
        slug: 'videos',
        title: 'Vidéothèque',
        pattern: 'text',
        fields: [
          { key: 'eyebrow', type: 'text', label: 'Sur-titre vidéos', value: L('VIDÉOTHÈQUE', 'VIDEO LIBRARY', 'مكتبة الفيديو') },
          { key: 'title', type: 'text', label: 'Titre vidéos', value: L('FILMS ET TÉMOIGNAGES', 'FILMS AND TESTIMONIALS', 'أفلام وشهادات') },
          {
            key: 'empty',
            type: 'text',
            label: 'Texte vide vidéos',
            value: L(
              'Les films et témoignages validés apparaîtront ici dès qu’une vidéo YouTube sera publiée dans la vidéothèque.',
              'Validated films and testimonials will appear here once a YouTube video is published in the video library.',
              'ستظهر هنا الأفلام والشهادات بعد نشر فيديو يوتيوب في المكتبة.',
            ),
          },
        ],
      },
      {
        slug: 'resources',
        title: 'Ressources',
        pattern: 'cards_grid',
        fields: [
          { key: 'eyebrow', type: 'text', label: 'Sur-titre ressources', value: L('DOCUMENTATION', 'DOCUMENTATION', 'التوثيق') },
          { key: 'title', type: 'text', label: 'Titre ressources', value: L('RESSOURCES RÉCENTES', 'RECENT RESOURCES', 'موارد حديثة') },
          {
            key: 'more',
            type: 'text',
            label: 'Lien publications',
            value: L('Voir toute la bibliothèque →', 'Browse the full library →', 'اطلعوا على المكتبة كاملة →'),
          },
          { key: 'download', type: 'text', label: 'Télécharger', value: L('Télécharger', 'Download', 'تنزيل') },
          { key: 'missingFile', type: 'text', label: 'Fichier manquant', value: L('Fichier à fournir', 'File forthcoming', 'الملف سيُوفَّر لاحقاً') },
          { key: 'undated', type: 'text', label: 'Non daté', value: L('Non daté', 'Undated', 'بدون تاريخ') },
          {
            key: 'empty',
            type: 'text',
            label: 'Texte vide ressources',
            value: L(
              'Les publications récentes apparaîtront ici.',
              'Recent publications will appear here.',
              'ستظهر هنا المنشورات الحديثة.',
            ),
          },
        ],
      },
      {
        slug: 'press',
        title: 'Presse',
        pattern: 'cta_banner',
        fields: [
          { key: 'eyebrow', type: 'text', label: 'Sur-titre presse', value: L('DEMANDE MÉDIA / PRESSE', 'MEDIA / PRESS REQUEST', 'طلب إعلام / صحافة') },
          {
            key: 'title',
            type: 'text',
            label: 'Titre presse',
            value: L('CONTACTER L’ÉQUIPE EU4YOUTH', 'CONTACT THE EU4YOUTH TEAM', 'الاتصال بفريق EU4YOUTH'),
          },
          {
            key: 'body',
            type: 'text',
            label: 'Texte presse',
            value: L(
              'Le formulaire de contact permet de préciser le média, le projet concerné et l’objet de la demande. Aucun dossier de presse distinct n’a été fourni à ce jour.',
              'The contact form lets you specify the outlet, the related project and the purpose of the request. No separate press kit has been supplied yet.',
              'يتيح نموذج الاتصال تحديد الوسيلة الإعلامية والمشروع المعني وموضوع الطلب. لم تُوفَّر حافظة صحافية منفصلة حتى الآن.',
            ),
          },
          { key: 'cta', type: 'text', label: 'Bouton presse', value: L('Envoyer une demande', 'Send a request', 'إرسال طلب') },
        ],
      },
    ],
  )
  add(
    pageMeta({
      slug: 'glossaire',
      path: '/glossaire',
      title: 'Glossaire',
      group: 'Ressources',
      sort_order: 13,
      meta_description: 'Lexique des termes, dispositifs et acteurs de l’écosystème EU4Youth.',
    }),
    [
      {
        slug: 'hero',
        title: 'En-tête',
        pattern: 'hero',
        fields: [
          { key: 'badge', type: 'text', label: 'Sur-titre', value: L('LEXIQUE', 'GLOSSARY', 'معجم') },
          { key: 'title', type: 'text', label: 'Titre', value: L('GLOSSAIRE', 'GLOSSARY', 'المعجم') },
          { key: 'mark', type: 'text', label: 'Filigrane', value: L('EU\n4Y', 'EU\n4Y', 'EU\n4Y') },
          {
            key: 'body',
            type: 'text',
            label: 'Chapô',
            value: L(
              'Ce glossaire réunit les termes techniques et institutionnels mobilisés par les projets de l’écosystème EU4Youth — dispositifs de coopération internationale, mécanismes de financement, notions propres aux politiques de jeunesse. Il vise à faciliter la lecture des contenus du site pour des publics qui n’évoluent pas nécessairement dans l’univers de la coopération internationale.',
              'This glossary brings together the technical and institutional terms used by EU4Youth projects — international cooperation instruments, funding mechanisms, and youth-policy concepts. It is meant to make the site easier to read for audiences who do not necessarily work in international cooperation.',
              'يجمع هذا المعجم المصطلحات التقنية والمؤسسية التي تستخدمها مشاريع EU4Youth — أدوات التعاون الدولي وآليات التمويل ومفاهيم سياسات الشباب. وهو ييسّر قراءة الموقع لجمهور لا يعمل بالضرورة في مجال التعاون الدولي.',
            ),
          },
        ],
      },
      {
        slug: 'browser',
        title: 'Recherche et index',
        pattern: 'cards_grid',
        fields: [
          { key: 'search', type: 'text', label: 'Recherche', value: L('Rechercher un terme', 'Search a term', 'ابحثوا عن مصطلح') },
          { key: 'placeholder', type: 'text', label: 'Placeholder', value: L('Rechercher un terme', 'Search a term', 'ابحثوا عن مصطلح') },
          { key: 'allF', type: 'text', label: 'Toutes', value: L('Toutes', 'All', 'الكل') },
          { key: 'one', type: 'text', label: 'Singulier', value: L('terme', 'term', 'مصطلح') },
          { key: 'many', type: 'text', label: 'Pluriel', value: L('termes', 'terms', 'مصطلحات') },
          { key: 'reset', type: 'text', label: 'Effacer', value: L('Effacer le filtre', 'Clear filter', 'مسح التصفية') },
          {
            key: 'empty',
            type: 'text',
            label: 'Texte vide',
            value: L(
              'Aucun terme ne correspond à votre recherche.',
              'No term matches your search.',
              'لا يوجد مصطلح مطابق لبحثكم.',
            ),
          },
          {
            key: 'emptyCta',
            type: 'text',
            label: 'Réinitialiser',
            value: L('Réinitialiser la recherche', 'Reset search', 'إعادة ضبط البحث'),
          },
        ],
      },
    ],
  )
  add(
    pageMeta({
      slug: 'contact',
      path: '/contact',
      title: 'Contact',
      group: 'Public',
      sort_order: 14,
      meta_description: 'Contacter l’équipe du programme EU4Youth Tunisie.',
    }),
    [
      {
        slug: 'hero',
        title: 'En-tête',
        pattern: 'hero',
        fields: [
          { key: 'portrait', type: 'image', label: 'Portrait', value: '/img/contact-hero-person.webp' },
          { key: 'title', type: 'text', label: 'Titre', value: L('CONTACT', 'CONTACT', 'الاتصال') },
          {
            key: 'body',
            type: 'text',
            label: 'Texte',
            value: L(
              'Pour une question sur le programme, un projet, un partenariat ou ce site, écrivez-nous. L’équipe EU4Youth Tunisie relit chaque demande et vous répond dans les meilleurs délais.',
              'For a question about the programme, a project, a partnership or this site, write to us. The EU4Youth Tunisia team reads every request and replies as soon as possible.',
              'لأي سؤال حول البرنامج أو مشروع أو شراكة أو هذا الموقع، راسلونا. يقرأ فريق EU4Youth تونس كل طلب ويرد في أقرب أجل.',
            ),
          },
        ],
      },
      {
        slug: 'form',
        title: 'Formulaire',
        pattern: 'form_band',
        fields: [
          {
            key: 'labels',
            type: 'json',
            label: 'Libellés des champs',
            value: {
              fr: [
                { key: 'lastName', text: 'Nom' },
                { key: 'firstName', text: 'Prénom' },
                { key: 'organisation', text: 'Organisation / Structure' },
                { key: 'role', text: 'Fonction' },
                { key: 'email', text: 'Adresse e-mail' },
                { key: 'phone', text: 'Téléphone' },
                { key: 'profile', text: 'Vous êtes...' },
                { key: 'project', text: 'Projet concerné' },
                { key: 'location', text: 'Zone géographique concernée' },
                { key: 'requestType', text: 'Objet de la demande' },
                { key: 'subject', text: 'Objet' },
                { key: 'message', text: 'Message' },
                { key: 'subjectHint', text: '100 caractères maximum' },
                { key: 'messageHint', text: '2 000 caractères maximum' },
              ],
            },
          },
          {
            key: 'profiles',
            type: 'json',
            label: 'Liste « Vous êtes »',
            value: {
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
              ].map((label) => ({ label })),
            },
          },
          {
            key: 'projects',
            type: 'json',
            label: 'Liste projets',
            value: {
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
              ].map((label) => ({ label })),
            },
          },
          {
            key: 'locations',
            type: 'json',
            label: 'Liste zones',
            value: {
              fr: [
                'Nationale',
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
                'Internationale',
                'Non concerné',
              ].map((label) => ({ label })),
            },
          },
          {
            key: 'requestTypes',
            type: 'json',
            label: 'Liste objets',
            value: {
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
              ].map((label) => ({ label })),
            },
          },
          {
            key: 'consent',
            type: 'text',
            label: 'Texte de consentement',
            value: L(
              'J’accepte que les informations renseignées dans ce formulaire soient utilisées uniquement pour le traitement de ma demande, conformément à la',
              'I agree that the information in this form is used only to handle my request, in line with the site privacy policy.',
              'أوافق على استخدام المعلومات الواردة في هذا النموذج فقط لمعالجة طلبي، وفق سياسة الخصوصية.',
            ),
          },
          {
            key: 'reset',
            type: 'text',
            label: 'Bouton réinitialiser',
            value: L('Réinitialiser', 'Reset', 'إعادة التعيين'),
          },
          {
            key: 'submit',
            type: 'text',
            label: 'Bouton envoyer',
            value: L('Envoyer la demande', 'Send the request', 'إرسال الطلب'),
          },
          {
            key: 'successTitle',
            type: 'text',
            label: 'Titre de confirmation',
            value: L('MERCI !', 'THANK YOU!', 'شكرًا!'),
          },
          {
            key: 'successBody',
            type: 'text',
            label: 'Message de confirmation',
            value: L(
              'Votre demande a bien été envoyée. Notre équipe vous répondra dans les meilleurs délais.',
              'Your request has been sent. Our team will reply as soon as possible.',
              'تم إرسال طلبكم. سيجيب فريقنا في أقرب أجل.',
            ),
          },
        ],
      },
    ],
  )
  add(
    pageMeta({
      slug: 'agenda',
      path: '/agenda',
      title: 'Agenda',
      group: 'Media',
      sort_order: 15,
      meta_description: 'Calendrier des événements, ateliers et rendez-vous publics de l’écosystème EU4Youth.',
    }),
    [
      {
        slug: 'hero',
        title: 'En-tête',
        pattern: 'hero',
        fields: [
          { key: 'badge', type: 'text', label: 'Sur-titre', value: L('ÉVÉNEMENTS', 'EVENTS', 'فعاليات') },
          { key: 'title', type: 'text', label: 'Titre', value: L('AGENDA', 'AGENDA', 'الأجندة') },
          { key: 'mark', type: 'text', label: 'Filigrane', value: L('EU\n4Y', 'EU\n4Y', 'EU\n4Y') },
          {
            key: 'body',
            type: 'text',
            label: 'Chapô',
            value: L(
              'Retrouvez les rendez-vous, ateliers, rencontres publiques et temps forts portés par l’écosystème EU4Youth. Le calendrier rassemble les événements à venir et conserve l’historique des échanges déjà tenus sur les territoires.',
              'Find the meetings, workshops, public gatherings and highlights led by the EU4Youth ecosystem. The calendar gathers upcoming events and keeps a record of exchanges already held across the territories.',
              'اعثروا على المواعيد والورشات واللقاءات العامة والمحطات التي يقودها منظومة EU4Youth. يجمع التقويم الفعاليات القادمة ويحفظ أرشيف اللقاءات التي عُقدت في الجهات.',
            ),
          },
        ],
      },
      {
        slug: 'browser',
        title: 'Calendrier',
        pattern: 'cards_grid',
        fields: [
          { key: 'upcoming', type: 'text', label: 'Onglet à venir', value: L('À venir', 'Upcoming', 'قادم') },
          { key: 'past', type: 'text', label: 'Onglet passés', value: L('Événements passés', 'Past events', 'فعاليات سابقة') },
          {
            key: 'notice',
            type: 'text',
            label: 'Note calendrier',
            value: L(
              'Le calendrier à venir est prêt à recevoir les prochains rendez-vous confirmés. L’historique documenté reste accessible dans l’onglet « Événements passés ».',
              'The upcoming calendar is ready for the next confirmed dates. Documented history remains available in the “Past events” tab.',
              'تقويم المواعيد القادمة جاهز لاستقبال التواريخ المؤكدة. يبقى الأرشيف الموثّق متاحًا في تبويب «فعاليات سابقة».',
            ),
          },
          { key: 'search', type: 'text', label: 'Recherche', value: L('Recherche', 'Search', 'بحث') },
          { key: 'placeholder', type: 'text', label: 'Placeholder', value: L('Titre, projet, lieu…', 'Title, project, place…', 'العنوان، المشروع، المكان…') },
          { key: 'filtersTitle', type: 'text', label: 'Titre filtres', value: L('Filtrer par', 'Filter by', 'تصفية حسب') },
          { key: 'reset', type: 'text', label: 'Réinitialiser', value: L('Réinitialiser', 'Reset', 'إعادة الضبط') },
          { key: 'period', type: 'text', label: 'Période', value: L('Période', 'Period', 'الفترة') },
          { key: 'project', type: 'text', label: 'Filtre projet', value: L('Projet associé', 'Related project', 'المشروع المرتبط') },
          { key: 'allM', type: 'text', label: 'Tous', value: L('Tous', 'All', 'الكل') },
          { key: 'one', type: 'text', label: 'Singulier', value: L('événement', 'event', 'فعالية') },
          { key: 'many', type: 'text', label: 'Pluriel', value: L('événements', 'events', 'فعاليات') },
          {
            key: 'sortUpcoming',
            type: 'text',
            label: 'Tri à venir',
            value: L('Du plus proche au plus lointain', 'Nearest first', 'من الأقرب إلى الأبعد'),
          },
          {
            key: 'sortPast',
            type: 'text',
            label: 'Tri passés',
            value: L('Du plus récent au plus ancien', 'Most recent first', 'من الأحدث إلى الأقدم'),
          },
          { key: 'cardDetail', type: 'text', label: 'Lien fiche', value: L('Voir la fiche', 'View the page', 'عرض البطاقة') },
          { key: 'cardProject', type: 'text', label: 'Lien projet', value: L('Découvrir le projet', 'Discover the project', 'اكتشاف المشروع') },
          { key: 'emptyReady', type: 'text', label: 'Sur-titre vide', value: L('CALENDRIER PRÊT', 'CALENDAR READY', 'التقويم جاهز') },
          {
            key: 'emptyUpcomingTitle',
            type: 'text',
            label: 'Titre vide à venir',
            value: L(
              'Aucun événement à venir n’est confirmé pour le moment.',
              'No upcoming event is confirmed yet.',
              'لا توجد فعالية قادمة مؤكدة حاليًا.',
            ),
          },
          {
            key: 'emptyUpcomingBody',
            type: 'text',
            label: 'Texte vide à venir',
            value: L(
              'Les rendez-vous seront publiés ici dès qu’une date, un lieu et un porteur auront été confirmés.',
              'Dates will appear here once a date, a place and a host have been confirmed.',
              'ستُنشر المواعيد هنا فور تأكيد التاريخ والمكان والجهة المنظّمة.',
            ),
          },
          {
            key: 'emptyPastCta',
            type: 'text',
            label: 'Lien passés',
            value: L('Consulter les événements passés', 'See past events', 'عرض الفعاليات السابقة'),
          },
          {
            key: 'emptyFiltered',
            type: 'text',
            label: 'Texte vide filtres',
            value: L(
              'Aucun événement ne correspond à ces critères.',
              'No event matches these filters.',
              'لا توجد فعالية مطابقة لهذه المعايير.',
            ),
          },
          { key: 'emptyReset', type: 'text', label: 'Réinitialiser vide', value: L('Réinitialiser les filtres', 'Reset filters', 'إعادة ضبط التصفية') },
          { key: 'ctaNews', type: 'text', label: 'Lien actualités', value: L('Actualités', 'News', 'الأخبار') },
          { key: 'ctaOpportunities', type: 'text', label: 'Lien opportunités', value: L('Opportunités', 'Opportunities', 'الفرص') },
        ],
      },
    ],
  )
  add(
    pageMeta({
      slug: 'evenement',
      path: '/agenda/go4youth-tre-decembre-2025',
      title: 'Fiche événement',
      group: 'Media',
      sort_order: 84,
      is_system: true,
      meta_description: 'Gabarit des pages agenda : date, lieu, source et événements liés.',
    }),
    [
      {
        slug: 'fiche',
        title: 'Fiche événement',
        pattern: 'article',
        fields: [
          { key: 'back', type: 'text', label: 'Retour', value: L('← Tout l’agenda', '← All events', '→ كل الأجندة') },
          { key: 'dtDate', type: 'text', label: 'Date', value: L('Date', 'Date', 'التاريخ') },
          { key: 'dtLocation', type: 'text', label: 'Lieu', value: L('Lieu', 'Place', 'المكان') },
          { key: 'dtFormat', type: 'text', label: 'Format', value: L('Format', 'Format', 'الصيغة') },
          { key: 'dtProject', type: 'text', label: 'Projet', value: L('Projet associé', 'Related project', 'المشروع المرتبط') },
          { key: 'sourceTitle', type: 'text', label: 'Titre source', value: L('Source vérifiée', 'Verified source', 'مصدر موثّق') },
          {
            key: 'sourceLead',
            type: 'text',
            label: 'Texte source',
            value: L(
              'Cette fiche reprend uniquement la date, le lieu et le résumé explicitement documentés dans',
              'This page only restates the date, place and summary explicitly documented in',
              'تستعيد هذه البطاقة فقط التاريخ والمكان والملخص الموثّق صراحة في',
            ),
          },
          { key: 'sourceCta', type: 'text', label: 'Bouton source', value: L('Ouvrir le document source', 'Open the source document', 'فتح الوثيقة المصدر') },
          {
            key: 'noticePast',
            type: 'text',
            label: 'Note passé',
            value: L(
              'Cet événement est terminé et reste publié à titre d’archive.',
              'This event has ended and remains published as an archive.',
              'انتهت هذه الفعالية وتبقى منشورة كأرشيف.',
            ),
          },
          {
            key: 'noticeUpcoming',
            type: 'text',
            label: 'Note à venir',
            value: L(
              'Les inscriptions seront publiées ici dès qu’un lien officiel sera disponible.',
              'Registration details will appear here as soon as an official link is available.',
              'ستُنشر معلومات التسجيل هنا فور توفر رابط رسمي.',
            ),
          },
          { key: 'related', type: 'text', label: 'Événements liés', value: L('Événements liés', 'Related events', 'فعاليات مرتبطة') },
          { key: 'projectCta', type: 'text', label: 'Lien projet', value: L('Découvrir le projet', 'Discover the project', 'اكتشاف المشروع') },
        ],
      },
    ],
  )
  add(
    pageMeta({
      slug: 'plan-du-site',
      path: '/plan-du-site',
      title: 'Plan du site',
      group: 'Public',
      sort_order: 21,
      status: 'published',
      meta_description:
        'Toutes les pages publiques du site EU4Youth Tunisie, regroupées par rubrique.',
    }),
    [
      {
        slug: 'hero',
        title: 'En-tête',
        pattern: 'hero',
        fields: [
          { key: 'badge', type: 'text', label: 'Sur-titre', value: L('NAVIGATION', 'NAVIGATION', 'تصفح') },
          { key: 'title', type: 'text', label: 'Titre', value: L('PLAN DU SITE', 'SITE MAP', 'خريطة الموقع') },
          { key: 'mark', type: 'text', label: 'Filigrane', value: L('EU4Y', 'EU4Y', 'EU4Y') },
          {
            key: 'body',
            type: 'text',
            label: 'Chapô',
            value: L(
              'Toutes les pages publiques du site, regroupées par rubrique. Chaque page reste accessible depuis le menu principal ou le pied de page ; cette vue d’ensemble permet d’y accéder directement.',
              'All public pages of the site, grouped by section. Each page remains reachable from the main menu or the footer; this overview lets you open them directly.',
              'كل الصفحات العمومية للموقع مجمّعة حسب المحور. تبقى كل صفحة متاحة من القائمة الرئيسية أو التذييل؛ تتيح هذه النظرة فتحها مباشرة.',
            ),
          },
        ],
      },
      {
        slug: 'index',
        title: 'Rubriques',
        pattern: 'simple_list',
        fields: [
          {
            key: 'items',
            type: 'json',
            label: 'Pages du plan',
            value: {
              fr: [
                { group: 'LE PROGRAMME', intro: 'Présentation, cadre financier et pilotage du programme.', label: 'Accueil', to: '/', note: '' },
                { group: 'LE PROGRAMME', intro: '', label: 'À propos d’EU4Youth', to: '/programme/a-propos', note: '' },
                { group: 'LE PROGRAMME', intro: '', label: 'Objectifs et résultats attendus', to: '/programme/objectifs', note: '' },
                { group: 'LE PROGRAMME', intro: '', label: 'Financement Union européenne', to: '/programme/financement', note: '' },
                { group: 'LE PROGRAMME', intro: '', label: 'Gouvernance et pilotage', to: '/programme/gouvernance', note: '' },
                { group: 'LE PROGRAMME', intro: '', label: 'Mécanismes d’appui', to: '/mecanismes-appui', note: '' },
                { group: 'LE PROGRAMME', intro: '', label: 'Partenaires', to: '/partenaires', note: '' },
                { group: 'LE PROGRAMME', intro: '', label: 'L’Union européenne en Tunisie', to: '/eu-en-tunisie', note: '' },
                { group: 'LES PROJETS', intro: 'Les six projets et leurs fiches détaillées.', label: 'Vue d’ensemble des six projets', to: '/projets', note: '' },
                { group: 'LES PROJETS', intro: '', label: "Jeun'ESS", to: '/projets/jeuness', note: '' },
                { group: 'LES PROJETS', intro: '', label: 'GO4Youth', to: '/projets/go4youth', note: '' },
                { group: 'LES PROJETS', intro: '', label: 'SWAFY', to: '/projets/swafy', note: '' },
                { group: 'LES PROJETS', intro: '', label: 'IRADA4YOUTH', to: '/projets/irada4youth', note: '' },
                { group: 'LES PROJETS', intro: '', label: "Maghroum'IN", to: '/projets/maghroumin', note: '' },
                { group: 'LES PROJETS', intro: '', label: 'Fe3il.a', to: '/projets/fe3ila', note: '' },
                { group: 'TERRITOIRES', intro: 'Localisation des interventions du programme.', label: 'Carte des initiatives', to: '/carte', note: '' },
                { group: 'ACTUALITÉS ET OPPORTUNITÉS', intro: 'Informations datées, appels ouverts et rendez-vous du programme.', label: 'Actualités', to: '/actualites', note: '' },
                { group: 'ACTUALITÉS ET OPPORTUNITÉS', intro: '', label: 'Opportunités', to: '/opportunites', note: '' },
                { group: 'ACTUALITÉS ET OPPORTUNITÉS', intro: '', label: 'Agenda des événements', to: '/agenda', note: '' },
                { group: 'MÉDIAS ET RESSOURCES', intro: 'Documents publiés, vocabulaire de référence et espace presse.', label: 'Publications et ressources', to: '/publications', note: '' },
                { group: 'MÉDIAS ET RESSOURCES', intro: '', label: 'Glossaire', to: '/glossaire', note: '' },
                { group: 'MÉDIAS ET RESSOURCES', intro: '', label: 'Coin média', to: '/coin-media', note: '' },
                { group: 'MÉDIAS ET RESSOURCES', intro: '', label: 'Youth Stories', to: '/stories', note: 'Portraits depuis Catalogues CMS' },
                { group: 'CONTACT ET RECHERCHE', intro: 'Joindre l’équipe et parcourir l’ensemble des contenus.', label: 'Contact', to: '/contact', note: '' },
                { group: 'CONTACT ET RECHERCHE', intro: '', label: 'Recherche sur le site', to: '/recherche', note: '' },
                { group: 'INFORMATIONS LÉGALES', intro: 'Mentions obligatoires du site.', label: 'Politique de confidentialité', to: '/confidentialite', note: '' },
                { group: 'INFORMATIONS LÉGALES', intro: '', label: 'Mentions légales', to: '/mentions-legales', note: '' },
                { group: 'INFORMATIONS LÉGALES', intro: '', label: 'Accessibilité', to: '/accessibilite', note: '' },
                { group: 'INFORMATIONS LÉGALES', intro: '', label: 'Gestion des cookies', to: '/cookies', note: '' },
              ],
            },
          },
        ],
      },
    ],
  )
  add(
    pageMeta({
      slug: 'recherche',
      path: '/recherche',
      title: 'Recherche',
      group: 'Public',
      sort_order: 22,
      status: 'published',
      meta_description: 'Rechercher un projet, un terme, une publication ou une page du site EU4Youth Tunisie.',
    }),
    [
      {
        slug: 'hero',
        title: 'En-tête',
        pattern: 'hero',
        fields: [
          { key: 'badge', type: 'text', label: 'Sur-titre', value: L('EU4YOUTH TUNISIE', 'EU4YOUTH TUNISIA', 'EU4YOUTH تونس') },
          { key: 'title', type: 'text', label: 'Titre', value: L('RECHERCHE', 'SEARCH', 'بحث') },
        ],
      },
      {
        slug: 'browser',
        title: 'Formulaire',
        pattern: 'form_band',
        fields: [
          { key: 'search', type: 'text', label: 'Recherche', value: L('Rechercher dans le site', 'Search the site', 'البحث في الموقع') },
          { key: 'placeholder', type: 'text', label: 'Placeholder', value: L('Projet, terme, publication…', 'Project, term, publication…', 'مشروع، مصطلح، منشور…') },
          { key: 'submit', type: 'text', label: 'Bouton', value: L('Rechercher', 'Search', 'بحث') },
          { key: 'type', type: 'text', label: 'Type de contenu', value: L('Type de contenu', 'Content type', 'نوع المحتوى') },
          { key: 'allM', type: 'text', label: 'Tous', value: L('Tous', 'All', 'الكل') },
        ],
      },
      {
        slug: 'results',
        title: 'Résultats',
        pattern: 'simple_list',
        fields: [
          { key: 'one', type: 'text', label: 'Singulier', value: L('résultat', 'result', 'نتيجة') },
          { key: 'many', type: 'text', label: 'Pluriel', value: L('résultats', 'results', 'نتائج') },
          { key: 'forQuery', type: 'text', label: 'Pour', value: L('pour', 'for', 'لـ') },
          {
            key: 'hint',
            type: 'text',
            label: 'Consigne',
            value: L('Saisissez au moins deux caractères.', 'Enter at least two characters.', 'أدخلوا حرفين على الأقل.'),
          },
          {
            key: 'empty',
            type: 'text',
            label: 'Aucun résultat',
            value: L(
              'Aucun résultat. Essayez un projet, un territoire ou un terme plus général.',
              'No results. Try a project, a territory or a broader term.',
              'لا توجد نتائج. جرّبوا مشروعاً أو إقليماً أو مصطلحاً أعم.',
            ),
          },
        ],
      },
    ],
  )
  add(
    pageMeta({
      slug: 'partenaires',
      path: '/partenaires',
      title: 'Partenaires',
      group: 'Programme',
      sort_order: 16,
      meta_description: 'Institutions tunisiennes, Union européenne et partenaires de mise en œuvre.',
    }),
    [
      {
        slug: 'hero',
        title: 'En-tête',
        pattern: 'hero',
        fields: [
          { key: 'title', type: 'text', label: 'Titre', value: L('LES PARTENAIRES', 'PROGRAMME PARTNERS', 'شركاء البرنامج') },
          {
            key: 'body',
            type: 'text',
            label: 'Chapô',
            value: L(
              "EU4Youth Tunisie mobilise un réseau unique de partenaires institutionnels, d'organisations internationales et d'acteurs de terrain. Ce partenariat multidimensionnel est la condition de la réussite et de la durabilité du programme.",
              'EU4Youth Tunisia brings together institutional, international and field partners.',
              'يجمع EU4Youth تونس شبكة فريدة من الشركاء.',
            ),
          },
        ],
      },
      {
        slug: 'figures',
        title: 'Chiffres',
        pattern: 'stats',
        fields: [
          {
            key: 'items',
            type: 'json',
            label: 'Chiffres',
            value: {
              fr: [
                { value: '01', label: 'Délégation de l’Union européenne' },
                { value: '9', label: 'Institutions tunisiennes partenaires' },
                { value: '6', label: 'Organisations de mise en œuvre' },
                { value: '6', label: 'Projets coordonnés' },
              ],
            },
          },
        ],
      },
      {
        slug: 'tabs',
        title: 'Onglets',
        pattern: 'text',
        fields: [
          {
            key: 'items',
            type: 'json',
            label: 'Onglets',
            value: {
              fr: [
                { tab: 'Union européenne', line1: "L'UNION", line2: 'EUROPÉENNE', body: "L'Union européenne finance le programme et l'inscrit dans sa coopération avec la Tunisie. Sa délégation à Tunis assure le pilotage stratégique et le suivi des six projets." },
                { tab: 'Institutions tunisiennes', line1: 'LES INSTITUTIONS', line2: 'TUNISIENNES', body: 'Les ministères et institutions tunisiennes sont des partenaires centraux du programme. Ils président les cadres de concertation, accompagnent la mise en œuvre et portent l’appropriation institutionnelle des acquis.' },
                { tab: 'Mise en œuvre', line1: 'LES PARTENAIRES', line2: 'DE MISE EN OEUVRE', body: 'Agences des Nations unies, agences de coopération européennes et organisations de la société civile mettent en œuvre les six projets aux côtés des institutions tunisiennes et des acteurs des territoires.' },
              ],
            },
          },
        ],
      },
      {
        slug: 'eu',
        title: 'Union européenne',
        pattern: 'text',
        fields: [
          { key: 'title', type: 'text', label: 'Titre', value: L('Délégation de l’Union européenne en Tunisie', 'EU Delegation in Tunisia', 'بعثة الاتحاد الأوروبي في تونس') },
          {
            key: 'body',
            type: 'text',
            label: 'Texte',
            value: L(
              'Elle assure le pilotage stratégique du programme, le suivi de sa mise en œuvre et le dialogue avec les autorités tunisiennes.',
              'It provides strategic steering, implementation follow-up and dialogue with Tunisian authorities.',
              'تتولى التوجيه الاستراتيجي ومتابعة التنفيذ والحوار مع السلطات التونسية.',
            ),
          },
          { key: 'link', type: 'text', label: 'Lien', value: L('Comprendre le financement européen', 'Understand European funding', 'فهم التمويل الأوروبي') },
          { key: 'flags', type: 'image', label: 'Drapeaux', value: '/img/partners-flags.webp' },
        ],
      },
      {
        slug: 'institutions',
        title: 'Institutions tunisiennes',
        pattern: 'text',
        fields: [
          {
            key: 'items',
            type: 'json',
            label: 'Logos',
            value: {
              fr: [
                { src: '/img/org-economie-planification.webp', alt: "Ministère de l'Économie et de la Planification" },
                { src: '/img/org-affaires-culturelles.webp', alt: 'Ministère des Affaires Culturelles' },
                { src: '/img/org-jeunesse-sports.webp', alt: 'Ministère de la Jeunesse et des Sports' },
                { src: '/img/org-aneti.webp', alt: "Agence Nationale pour l'Emploi et le Travail Indépendant" },
                { src: '/img/org-formation-emploi.webp', alt: "Ministère de la Formation Professionnelle et de l'Emploi" },
                { src: '/img/org-cgdr.webp', alt: 'Commissariat Général au Développement Régional' },
                { src: '/img/org-observatoire-jeunesse.webp', alt: 'Observatoire National de la Jeunesse' },
                { src: '/img/org-mesrs.webp', alt: "Ministère de l'Enseignement Supérieur et de la Recherche Scientifique" },
                { src: '/img/org-anpr.webp', alt: 'Agence Nationale de la Promotion de la Recherche scientifique' },
                { src: '', alt: 'Ministère de l’Éducation' },
              ],
              en: [
                { src: '/img/org-economie-planification.webp', alt: 'Ministry of Economy and Planning' },
                { src: '/img/org-affaires-culturelles.webp', alt: 'Ministry of Cultural Affairs' },
                { src: '/img/org-jeunesse-sports.webp', alt: 'Ministry of Youth and Sports' },
                { src: '/img/org-aneti.webp', alt: 'National Agency for Employment and Self-Employment' },
                { src: '/img/org-formation-emploi.webp', alt: 'Ministry of Vocational Training and Employment' },
                { src: '/img/org-cgdr.webp', alt: 'General Commissariat for Regional Development' },
                { src: '/img/org-observatoire-jeunesse.webp', alt: 'National Youth Observatory' },
                { src: '/img/org-mesrs.webp', alt: 'Ministry of Higher Education and Scientific Research' },
                { src: '/img/org-anpr.webp', alt: 'National Agency for the Promotion of Scientific Research' },
                { src: '', alt: 'Ministry of Education' },
              ],
              ar: [
                { src: '/img/org-economie-planification.webp', alt: 'وزارة الاقتصاد والتخطيط' },
                { src: '/img/org-affaires-culturelles.webp', alt: 'وزارة الشؤون الثقافية' },
                { src: '/img/org-jeunesse-sports.webp', alt: 'وزارة الشباب والرياضة' },
                { src: '/img/org-aneti.webp', alt: 'الوكالة الوطنية للتشغيل والعمل المستقل' },
                { src: '/img/org-formation-emploi.webp', alt: 'وزارة التكوين المهني والتشغيل' },
                { src: '/img/org-cgdr.webp', alt: 'المندوبية العامة للتنمية الجهوية' },
                { src: '/img/org-observatoire-jeunesse.webp', alt: 'المرصد الوطني للشباب' },
                { src: '/img/org-mesrs.webp', alt: 'وزارة التعليم العالي والبحث العلمي' },
                { src: '/img/org-anpr.webp', alt: 'الوكالة الوطنية للنهوض بالبحث العلمي' },
                { src: '', alt: 'وزارة التربية' },
              ],
            },
          },
        ],
      },
      {
        slug: 'implementers',
        title: 'Mise en œuvre',
        pattern: 'text',
        fields: [
          {
            key: 'items',
            type: 'json',
            label: 'Partenaires',
            value: {
              fr: [
                { slug: 'jeuness', acronym: "Jeun'ESS", partner: 'Organisation internationale du Travail (OIT)', tagline: "L'économie sociale et solidaire, un levier pour l'emploi décent des jeunes tunisiens.", logo: '/img/logo-jeuness.png' },
                { slug: 'go4youth', acronym: 'GO4Youth', partner: 'Banque mondiale et ANETI', tagline: 'Renforcer les services d’emploi pour améliorer l’accès des jeunes à des opportunités professionnelles décentes.', logo: '/img/logo-go4youth.png' },
                { slug: 'swafy', acronym: 'SWAFY', partner: 'Agence Nationale de la Promotion de la Recherche Scientifique (ANPR)', tagline: 'Renforcer la contribution de la recherche et de l’innovation au développement économique et social avec et pour les jeunes.', logo: '/img/logo-swafy.png' },
                { slug: 'irada4youth', acronym: 'IRADA4YOUTH', partner: 'CGDR avec ODNO, ODCO et ODS', tagline: 'Améliorer l’inclusion économique et sociale des jeunes par une approche conçue localement.', logo: '/img/logo-irada4youth.png' },
                { slug: 'maghroumin', acronym: "Maghroum'IN", partner: 'AECID – British Council – FIIAPP', tagline: 'Renforcer l’inclusion et la participation des jeunes tunisien.ne.s en situation de vulnérabilité à travers la création, la culture et le sport.', logo: '/img/logo-maghroumin.png' },
                { slug: 'fe3ila', acronym: 'Fe3il.a', partner: 'CILG-VNG International · Ministère de la Jeunesse et des Sports', tagline: 'Faire des jeunes des acteurs du changement dans leurs territoires.', logo: '/img/logo-fe3ila.png' },
              ],
            },
          },
          { key: 'link', type: 'text', label: 'Lien projet', value: L('Découvrir le projet', 'Discover the project', 'اكتشف المشروع') },
        ],
      },
      {
        slug: 'cta',
        title: 'Aller plus loin',
        pattern: 'text',
        fields: [
          { key: 'eyebrow', type: 'text', label: 'Sur-titre', value: L('ALLER PLUS LOIN', 'GO FURTHER', 'للمزيد') },
          { key: 'title', type: 'text', label: 'Titre', value: L('COMPRENDRE LE PARTENARIAT', 'UNDERSTAND THE PARTNERSHIP', 'فهم الشراكة') },
          { key: 'governance', type: 'text', label: 'Bouton gouvernance', value: L('Gouvernance et pilotage', 'Governance and steering', 'الحوكمة والتسيير') },
          { key: 'funding', type: 'text', label: 'Bouton financement', value: L('Financement européen', 'European funding', 'التمويل الأوروبي') },
          { key: 'projects', type: 'text', label: 'Bouton projets', value: L('Les six projets', 'The six projects', 'المشاريع الستة') },
        ],
      },
    ],
  )
  add(
    pageMeta({
      slug: 'mecanismes-appui',
      path: '/mecanismes-appui',
      title: 'Mécanismes d’appui',
      group: 'Programme',
      sort_order: 6,
      meta_description:
        'Dispositifs et composantes des six projets EU4Youth : clubs, fonds, incubateurs et mécanismes territoriaux.',
    }),
    [
      {
        slug: 'hero',
        title: 'En-tête',
        pattern: 'hero',
        fields: [
          { key: 'title', type: 'text', label: 'Titre', value: L("MÉCANISMES\nD’APPUI", 'SUPPORT\nMECHANISMS', 'آليات\nالدعم') },
        ],
      },
      {
        slug: 'browser',
        title: 'Dispositifs',
        pattern: 'text',
        fields: [
          {
            key: 'intro',
            type: 'text',
            label: 'Introduction',
            value: L(
              'Les dispositifs et composantes ci-dessous sont ceux décrits dans les fiches des six projets EU4Youth.',
              'The schemes and components below are those described in the six EU4Youth project sheets.',
              'الآليات والمكوّنات أدناه هي الواردة في بطاقات المشاريع الستة.',
            ),
          },
          { key: 'countLabel', type: 'text', label: 'Libellé du compteur', value: L('dispositifs et composantes documentés', 'documented schemes and components', 'آليات ومكوّنات موثّقة') },
          { key: 'all', type: 'text', label: 'Tous les projets', value: L('Tous les projets', 'All projects', 'كل المشاريع') },
          { key: 'search', type: 'text', label: 'Recherche', value: L('Recherche', 'Search', 'بحث') },
          { key: 'placeholder', type: 'text', label: 'Placeholder', value: L('Mécanisme, résultat, secteur…', 'Scheme, result, sector…', 'آلية، نتيجة، قطاع…') },
          { key: 'project', type: 'text', label: 'Filtre projet', value: L('Projet', 'Project', 'المشروع') },
          { key: 'sector', type: 'text', label: 'Filtre secteur', value: L('Secteur', 'Sector', 'القطاع') },
          { key: 'reset', type: 'text', label: 'Réinitialiser', value: L('Réinitialiser', 'Reset', 'إعادة ضبط') },
          { key: 'more', type: 'text', label: 'Bouton plus', value: L('Afficher 9 dispositifs supplémentaires', 'Show 9 more schemes', 'عرض 9 آليات إضافية') },
          { key: 'empty', type: 'text', label: 'Aucun résultat', value: L('Aucun dispositif ne correspond à ces critères.', 'No scheme matches these filters.', 'لا توجد آلية تطابق هذه المعايير.') },
          { key: 'cardLink', type: 'text', label: 'Lien carte', value: L('Voir le projet', 'See the project', 'اطلع على المشروع') },
          {
            key: 'items',
            type: 'json',
            label: 'Dispositifs',
            value: {
              fr: [
                { id: 'jeuness-0', projectSlug: 'jeuness', name: 'Community Fund' },
                { id: 'jeuness-1', projectSlug: 'jeuness', name: "LIMITL'ESS Clubs – Enactus" },
                { id: 'jeuness-2', projectSlug: 'jeuness', name: 'Social Innovation Fund' },
                { id: 'jeuness-3', projectSlug: 'jeuness', name: 'Re-Fund Challenge' },
                { id: 'jeuness-4', projectSlug: 'jeuness', name: 'Market Fund' },
                { id: 'jeuness-5', projectSlug: 'jeuness', name: "LIMITL'ESS Génération" },
                { id: 'go4youth-0', projectSlug: 'go4youth', name: 'Services aux chercheurs d’emploi' },
                { id: 'go4youth-1', projectSlug: 'go4youth', name: 'Services aux entreprises' },
                { id: 'go4youth-2', projectSlug: 'go4youth', name: 'Transformation digitale ANETI' },
                { id: 'go4youth-3', projectSlug: 'go4youth', name: "Écosystème d'employabilité" },
                { id: 'swafy-0', projectSlug: 'swafy', name: 'MOBIDOC' },
                { id: 'swafy-1', projectSlug: 'swafy', name: 'Jeunesse Créative' },
                { id: 'swafy-2', projectSlug: 'swafy', name: 'Débat Jeunesse et Science' },
                { id: 'irada4youth-0', projectSlug: 'irada4youth', name: 'Appels à propositions régionaux' },
                { id: 'irada4youth-1', projectSlug: 'irada4youth', name: 'Sélection et suivi' },
                { id: 'irada4youth-2', projectSlug: 'irada4youth', name: 'Renforcement de l’écosystème' },
                { id: 'maghroumin-0', projectSlug: 'maghroumin', name: 'Services publics' },
                { id: 'maghroumin-1', projectSlug: 'maghroumin', name: 'Dynamiques communautaires' },
                { id: 'maghroumin-2', projectSlug: 'maghroumin', name: 'Inclusion économique' },
                { id: 'fe3ila-0', projectSlug: 'fe3ila', name: 'Gouvernance locale avec les jeunes' },
                { id: 'fe3ila-1', projectSlug: 'fe3ila', name: 'Entrepreneuriat et initiatives jeunes' },
                { id: 'fe3ila-2', projectSlug: 'fe3ila', name: 'Engagement citoyen et associations' },
                { id: 'fe3ila-3', projectSlug: 'fe3ila', name: 'Espaces adaptés aux jeunes' },
              ],
            },
          },
        ],
      },
      {
        slug: 'cta',
        title: 'Explorer',
        pattern: 'text',
        fields: [
          { key: 'eyebrow', type: 'text', label: 'Sur-titre', value: L('ÉCOSYSTÈME EU4YOUTH', 'EU4YOUTH ECOSYSTEM', 'منظومة EU4YOUTH') },
          { key: 'title', type: 'text', label: 'Titre', value: L('DU DISPOSITIF AU PROJET', 'FROM SCHEME TO PROJECT', 'من الآلية إلى المشروع') },
          {
            key: 'body',
            type: 'text',
            label: 'Texte',
            value: L(
              'Retrouvez les objectifs, résultats et partenaires de chacun des six projets.',
              'See the objectives, results and partners of each of the six projects.',
              'اطلع على أهداف ونتائج وشركاء كل مشروع من المشاريع الستة.',
            ),
          },
          { key: 'projects', type: 'text', label: 'Bouton projets', value: L('Voir les projets', 'See the projects', 'اطلع على المشاريع') },
          { key: 'partners', type: 'text', label: 'Bouton partenaires', value: L('Voir les partenaires', 'See the partners', 'اطلع على الشركاء') },
        ],
      },
    ],
  )
  add(
    pageMeta({
      slug: 'eu-en-tunisie',
      path: '/eu-en-tunisie',
      title: 'UE en Tunisie',
      group: 'Programme',
      sort_order: 18,
      meta_description: 'Le rôle de l’UE dans le financement et le partenariat du programme.',
    }),
    [
      {
        slug: 'hero',
        title: 'En-tête',
        pattern: 'hero',
        fields: [
          {
            key: 'badge',
            type: 'text',
            label: 'Badge',
            value: L(
              'COOPÉRATION UNION EUROPÉENNE — TUNISIE',
              'EUROPEAN UNION COOPERATION — TUNISIA',
              'التعاون بين الاتحاد الأوروبي وتونس',
            ),
          },
          {
            key: 'title',
            type: 'text',
            label: 'Titre',
            value: L("L’UNION\nEUROPÉENNE\nDANS EU4YOUTH", 'THE EUROPEAN\nUNION\nIN EU4YOUTH', 'الاتحاد الأوروبي\nفي EU4YOUTH'),
          },
        ],
      },
      {
        slug: 'intro',
        title: 'Introduction',
        pattern: 'text',
        fields: [
          { key: 'eyebrow', type: 'text', label: 'Sur-titre', value: L('LE PROGRAMME EU4YOUTH', 'THE EU4YOUTH PROGRAMME', 'برنامج EU4YOUTH') },
          { key: 'title', type: 'text', label: 'Titre', value: L('UN APPUI À LA JEUNESSE TUNISIENNE', 'SUPPORT FOR TUNISIAN YOUTH', 'دعم للشباب التونسي') },
          {
            key: 'body',
            type: 'text',
            label: 'Texte',
            value: L(
              'EU4Youth est le programme de l’Union européenne d’appui à la jeunesse tunisienne. Il est mis en œuvre en partenariat avec les institutions tunisiennes et les acteurs nationaux et internationaux engagés en faveur des jeunes.',
              'EU4Youth is the European Union programme supporting Tunisian youth, implemented with Tunisian institutions and national and international partners.',
              'EU4Youth هو برنامج الاتحاد الأوروبي لدعم الشباب التونسي، ويُنفَّذ بشراكة مع المؤسسات التونسية والفاعلين الوطنيين والدوليين.',
            ),
          },
        ],
      },
      {
        slug: 'facts',
        title: 'Chiffres',
        pattern: 'stats',
        fields: [
          {
            key: 'items',
            type: 'json',
            label: 'Chiffres',
            value: {
              fr: [
                { value: '60 M€', label: "financés par l'Union européenne" },
                { value: '2019–2027', label: 'période du programme' },
                { value: '6', label: 'projets complémentaires' },
                { value: '24', label: 'gouvernorats concernés' },
              ],
            },
          },
        ],
      },
      {
        slug: 'role',
        title: 'Rôle de l’UE',
        pattern: 'text',
        fields: [
          { key: 'eyebrow', type: 'text', label: 'Sur-titre', value: L('LE RÔLE DE L’UNION EUROPÉENNE', 'THE ROLE OF THE EUROPEAN UNION', 'دور الاتحاد الأوروبي') },
          { key: 'title', type: 'text', label: 'Titre', value: L('FINANCER, SUPERVISER, DIALOGUER', 'FUND, SUPERVISE, DIALOGUE', 'تمويل وإشراف وحوار') },
          {
            key: 'items',
            type: 'json',
            label: 'Rôles',
            value: {
              fr: [
                { number: '01', title: 'FINANCEMENT', body: "L'Union européenne finance EU4Youth et inscrit le programme dans sa coopération avec la Tunisie." },
                { number: '02', title: 'SUPERVISION STRATÉGIQUE', body: "La Délégation de l'Union européenne en Tunisie supervise les six projets, veille à leur cohérence et assure leur suivi." },
                { number: '03', title: 'DIALOGUE INSTITUTIONNEL', body: 'La Délégation participe au cadre de concertation interministériel aux côtés des institutions tunisiennes et des équipes des projets.' },
              ],
            },
          },
        ],
      },
      {
        slug: 'projects',
        title: 'Six projets',
        pattern: 'text',
        fields: [
          { key: 'eyebrow', type: 'text', label: 'Sur-titre', value: L('UNE VISION COMMUNE', 'A SHARED VISION', 'رؤية مشتركة') },
          { key: 'title', type: 'text', label: 'Titre', value: L('SIX PROJETS COORDONNÉS', 'SIX COORDINATED PROJECTS', 'ستة مشاريع منسّقة') },
          {
            key: 'body',
            type: 'text',
            label: 'Texte',
            value: L(
              'Les projets couvrent l’emploi et l’entrepreneuriat, la recherche, la culture, le sport et la participation des jeunes.',
              'The projects cover employment and entrepreneurship, research, culture, sport and youth participation.',
              'تغطي المشاريع التشغيل وريادة الأعمال والبحث والثقافة والرياضة ومشاركة الشباب.',
            ),
          },
          {
            key: 'items',
            type: 'json',
            label: 'Projets',
            value: {
              fr: [
                { slug: 'jeuness', acronym: "Jeun'ESS", budget: "9 millions d'euros" },
                { slug: 'go4youth', acronym: 'GO4Youth', budget: "10 millions d'euros" },
                { slug: 'swafy', acronym: 'SWAFY', budget: "9 millions d'euros" },
                { slug: 'irada4youth', acronym: 'IRADA4YOUTH', budget: "5 millions d'euros" },
                { slug: 'maghroumin', acronym: "Maghroum'IN", budget: "15,46 millions d'euros" },
                { slug: 'fe3ila', acronym: 'Fe3il.a', budget: "9,1 millions d'euros" },
              ],
            },
          },
        ],
      },
      {
        slug: 'cta',
        title: 'Aller plus loin',
        pattern: 'text',
        fields: [
          { key: 'eyebrow', type: 'text', label: 'Sur-titre', value: L('ALLER PLUS LOIN', 'GO FURTHER', 'للمزيد') },
          { key: 'title', type: 'text', label: 'Titre', value: L('COMPRENDRE LE PROGRAMME', 'UNDERSTAND THE PROGRAMME', 'فهم البرنامج') },
          { key: 'funding', type: 'text', label: 'Bouton financement', value: L('Voir le financement', 'See the funding', 'اطلع على التمويل') },
          { key: 'governance', type: 'text', label: 'Bouton gouvernance', value: L('Voir la gouvernance', 'See the governance', 'اطلع على الحوكمة') },
        ],
      },
    ],
  )

  const legalKicker = L('DOCUMENT LÉGAL', 'LEGAL DOCUMENT', 'وثيقة قانونية')
  const legalToc = L('SOMMAIRE', 'CONTENTS', 'الفهرس')
  const legalHome = L('Retour à l’accueil', 'Back to home', 'العودة إلى الاستقبال')
  const legalContact = L('Nous contacter', 'Contact us', 'اتصلوا بنا')

  for (const legal of legalDocuments(L)) {
    add(
      pageMeta({
        slug: legal.slug,
        path: legal.path,
        title: legal.title,
        group: 'Legal',
        status: 'published',
        sort_order: 40,
      }),
      [
        {
          slug: 'hero',
          title: 'En-tête',
          pattern: 'hero',
          fields: [
            { key: 'badge', type: 'text', label: 'Sur-titre', value: legal.badge },
            { key: 'title', type: 'text', label: 'Titre', value: legal.heading },
            { key: 'mark', type: 'text', label: 'Filigrane', value: legal.mark },
          ],
        },
        {
          slug: 'intro',
          title: 'Introduction',
          pattern: 'text',
          fields: [
            { key: 'kicker', type: 'text', label: 'Sur-titre', value: legalKicker },
            { key: 'title', type: 'text', label: 'Titre', value: legal.introTitle },
            { key: 'body', type: 'text', label: 'Chapô', value: legal.intro },
            { key: 'toc', type: 'text', label: 'Sommaire', value: legalToc },
            { key: 'nav', type: 'text', label: 'Intitulé du sommaire', value: legal.nav },
          ],
        },
        {
          slug: 'chapters',
          title: 'Rubriques',
          pattern: 'simple_list',
          fields: [{ key: 'items', type: 'json', label: 'Rubriques', value: legalChapterJson(legal) }],
        },
        {
          slug: 'actions',
          title: 'Actions',
          pattern: 'cta_banner',
          fields: [
            { key: 'home', type: 'text', label: 'Accueil', value: legalHome },
            { key: 'contact', type: 'text', label: 'Contact', value: legalContact },
          ],
        },
      ],
    )
  }

  const stubLinks = {
    fr: [
      { label: 'Plan du site', to: '/plan-du-site' },
      { label: 'Recherche', to: '/recherche' },
      { label: 'Les six projets', to: '/projets' },
      { label: 'Actualités', to: '/actualites' },
      { label: 'Agenda', to: '/agenda' },
      { label: 'Contact', to: '/contact' },
    ],
    en: [
      { label: 'Site map', to: '/plan-du-site' },
      { label: 'Search', to: '/recherche' },
      { label: 'The six projects', to: '/projets' },
      { label: 'News', to: '/actualites' },
      { label: 'Agenda', to: '/agenda' },
      { label: 'Contact', to: '/contact' },
    ],
    ar: [
      { label: 'خريطة الموقع', to: '/plan-du-site' },
      { label: 'بحث', to: '/recherche' },
      { label: 'المشاريع الستة', to: '/projets' },
      { label: 'الأخبار', to: '/actualites' },
      { label: 'الأجندة', to: '/agenda' },
      { label: 'اتصل بنا', to: '/contact' },
    ],
  }

  add(
    pageMeta({
      slug: 'introuvable',
      path: '/page-introuvable',
      title: 'Page introuvable',
      group: 'Public',
      status: 'published',
      sort_order: 23,
      meta_description:
        'La page demandée n’existe pas. Retrouvez le contenu depuis le plan du site ou la recherche.',
    }),
    [
      {
        slug: 'hero',
        title: 'En-tête',
        pattern: 'hero',
        fields: [
          {
            key: 'title',
            type: 'text',
            label: 'Titre',
            value: L('PAGE INTROUVABLE', 'PAGE NOT FOUND', 'الصفحة غير موجودة'),
          },
          {
            key: 'body',
            type: 'text',
            label: 'Texte',
            value: L(
              'La page demandée n’existe pas ou a été déplacée. Utilisez le plan du site ou la recherche pour retrouver le contenu.',
              'The requested page does not exist or has been moved. Use the site map or search to find the content.',
              'الصفحة المطلوبة غير موجودة أو نُقلت. استخدموا خريطة الموقع أو البحث للعثور على المحتوى.',
            ),
          },
        ],
      },
      {
        slug: 'links',
        title: 'Liens utiles',
        pattern: 'simple_list',
        fields: [{ key: 'items', type: 'json', label: 'Liens', value: stubLinks }],
      },
      {
        slug: 'actions',
        title: 'Actions',
        pattern: 'cta_banner',
        fields: [
          {
            key: 'home',
            type: 'text',
            label: 'Accueil',
            value: L('Retour à l’accueil', 'Back to home', 'العودة إلى الاستقبال'),
          },
        ],
      },
    ],
  )

  add(
    pageMeta({
      slug: 'global',
      path: '',
      title: 'Paramètres du site',
      group: 'Système',
      template: 'global',
      is_system: true,
      sort_order: 0,
      meta_title: 'Paramètres globaux | EU4Youth',
      meta_description: 'Identité, menu et pied de page du site public.',
    }),
    [
      {
        slug: 'settings',
        title: 'Identité du site',
        pattern: 'heading',
        fields: [
          { key: 'logo', type: 'image', label: 'Logo', value: '/img/footer-logo-v2.webp' },
          {
            key: 'site_name',
            type: 'text',
            label: 'Nom du site',
            value: L('EU4Youth Tunisie', 'EU4Youth Tunisia', 'EU4Youth تونس'),
          },
          {
            key: 'tagline',
            type: 'text',
            label: 'Sous-titre',
            value: L(
              'Programme d’appui à la jeunesse tunisienne',
              'Support programme for Tunisian youth',
              'برنامج دعم الشباب التونسي',
            ),
          },
          {
            key: 'email',
            type: 'text',
            label: 'E-mail',
            value: L('contact@eu4youth.org', 'contact@eu4youth.org', 'contact@eu4youth.org'),
          },
        ],
      },
      {
        slug: 'header',
        title: 'En-tête (toutes les pages)',
        pattern: 'heading',
        fields: [
          { key: 'logo', type: 'image', label: 'Logo EU4Youth', value: '/img/logo-eu4youth.png' },
          { key: 'flags', type: 'image', label: 'Drapeaux Tunisie / UE', value: '/img/flags.png' },
          { key: 'mailIcon', type: 'image', label: 'Icône contact', value: '/img/nav-mail.png' },
          { key: 'searchIcon', type: 'image', label: 'Icône recherche', value: '/img/nav-search.png' },
        ],
      },
      {
        slug: 'footer',
        title: 'Pied de page',
        pattern: 'simple_list',
        fields: [
          {
            key: 'about',
            type: 'text',
            label: 'Texte',
            value: L(
              'EU4Youth Tunisie — programme financé par l’Union européenne.',
              'EU4Youth Tunisia — programme funded by the European Union.',
              'EU4Youth تونس — برنامج يموّله الاتحاد الأوروبي.',
            ),
          },
          { key: 'logo', type: 'image', label: 'Logo pied de page', value: '/img/footer-logo-v2.webp' },
          { key: 'flags', type: 'image', label: 'Drapeaux', value: '/img/footer-flags-v2.webp' },
          {
            key: 'disclaimer',
            type: 'text',
            label: 'Disclaimer UE',
            value: L(
              'Ce site a été produit avec le soutien financier de l’Union européenne. Son contenu relève de la seule responsabilité du programme EU4Youth Tunisie et ne reflète pas nécessairement les opinions de l’Union européenne.',
              'This website was produced with the financial support of the European Union.',
              'أُنجز هذا الموقع بدعم مالي من الاتحاد الأوروبي.',
            ),
          },
          {
            key: 'col1',
            type: 'text',
            label: 'Colonne 1',
            value: L('LE PROGRAMME', 'THE PROGRAMME', 'البرنامج'),
          },
          {
            key: 'col2',
            type: 'text',
            label: 'Colonne 2',
            value: L('EXPLORER', 'EXPLORE', 'استكشف'),
          },
          {
            key: 'col3',
            type: 'text',
            label: 'Colonne 3',
            value: L('INFORMATIONS LÉGALES', 'LEGAL', 'معلومات قانونية'),
          },
          {
            key: 'programme',
            type: 'json',
            label: 'Liens Programme',
            value: {
              fr: [
                { label: 'À propos EU4Youth', to: '/programme/a-propos' },
                { label: 'Gouvernance et pilotage', to: '/programme/gouvernance' },
                { label: 'Financement Union européenne', to: '/programme/financement' },
                { label: 'Partenaires', to: '/partenaires' },
                { label: 'Contact', to: '/contact' },
              ],
              en: [
                { label: 'About EU4Youth', to: '/programme/a-propos' },
                { label: 'Governance and steering', to: '/programme/gouvernance' },
                { label: 'European Union funding', to: '/programme/financement' },
                { label: 'Partners', to: '/partenaires' },
                { label: 'Contact', to: '/contact' },
              ],
              ar: [
                { label: 'حول EU4Youth', to: '/programme/a-propos' },
                { label: 'الحوكمة والقيادة', to: '/programme/gouvernance' },
                { label: 'تمويل الاتحاد الأوروبي', to: '/programme/financement' },
                { label: 'الشركاء', to: '/partenaires' },
                { label: 'اتصل بنا', to: '/contact' },
              ],
            },
          },
          {
            key: 'explorer',
            type: 'json',
            label: 'Liens Explorer',
            value: {
              fr: [
                { label: 'Les projets', to: '/projets' },
                { label: 'Carte des initiatives', to: '/carte' },
                { label: 'Opportunités', to: '/opportunites' },
                { label: 'Publications et ressources', to: '/publications' },
                { label: 'Stories', to: '/stories' },
                { label: 'Actualités et Agenda', to: '/actualites' },
                { label: 'Glossaire', to: '/glossaire' },
              ],
              en: [
                { label: 'The projects', to: '/projets' },
                { label: 'Map of initiatives', to: '/carte' },
                { label: 'Opportunities', to: '/opportunites' },
                { label: 'Publications and resources', to: '/publications' },
                { label: 'Stories', to: '/stories' },
                { label: 'News and agenda', to: '/actualites' },
                { label: 'Glossary', to: '/glossaire' },
              ],
              ar: [
                { label: 'المشاريع', to: '/projets' },
                { label: 'خريطة المبادرات', to: '/carte' },
                { label: 'الفرص', to: '/opportunites' },
                { label: 'المنشورات والموارد', to: '/publications' },
                { label: 'قصص', to: '/stories' },
                { label: 'الأخبار والأجندة', to: '/actualites' },
                { label: 'المعجم', to: '/glossaire' },
              ],
            },
          },
          {
            key: 'legal',
            type: 'json',
            label: 'Liens Légal',
            value: {
              fr: [
                { label: 'Politique de confidentialité', to: '/confidentialite' },
                { label: 'Mentions légales', to: '/mentions-legales' },
                { label: 'Accessibilité', to: '/accessibilite' },
                { label: 'Gestion des cookies', to: '/cookies' },
              ],
              en: [
                { label: 'Privacy policy', to: '/confidentialite' },
                { label: 'Legal notice', to: '/mentions-legales' },
                { label: 'Accessibility', to: '/accessibilite' },
                { label: 'Cookie settings', to: '/cookies' },
              ],
              ar: [
                { label: 'سياسة الخصوصية', to: '/confidentialite' },
                { label: 'إشعارات قانونية', to: '/mentions-legales' },
                { label: 'النفاذ', to: '/accessibilite' },
                { label: 'إدارة الكوكيز', to: '/cookies' },
              ],
            },
          },
          { key: 'youtube', type: 'text', label: 'YouTube', value: L('', '', '') },
          { key: 'facebook', type: 'text', label: 'Facebook', value: L('', '', '') },
          { key: 'linkedin', type: 'text', label: 'LinkedIn', value: L('', '', '') },
          { key: 'instagram', type: 'text', label: 'Instagram', value: L('', '', '') },
        ],
      },
      {
        slug: 'legal',
        title: 'Cookies',
        pattern: 'text',
        fields: [
          {
            key: 'cookieBanner',
            type: 'text',
            label: 'Bandeau cookies',
            value: L(
              'Ce site enregistre votre langue et votre choix cookies. Les traceurs non indispensables restent désactivés tant que vous refusez.',
              'This site stores your language and cookie choice. Non-essential trackers stay off unless you accept.',
              'يحفظ هذا الموقع لغتكم واختيار الكوكيز. تبقى المتعقّبات غير الضرورية معطّلة ما لم تقبلوا.',
            ),
          },
          { key: 'more', type: 'text', label: 'En savoir plus', value: L('En savoir plus', 'Learn more', 'المزيد') },
          { key: 'accept', type: 'text', label: 'Accepter', value: L('Accepter', 'Accept', 'قبول') },
          { key: 'reject', type: 'text', label: 'Refuser', value: L('Refuser', 'Reject', 'رفض') },
        ],
      },
    ],
  )

  const n = (id, parent_id, label_fr, label_en, label_ar, url, sort_order) => ({
    id,
    parent_id,
    label_fr,
    label_en,
    label_ar,
    url,
    sort_order,
    is_active: true,
    open_in_new_tab: false,
  })
  const siteNav = [
    n(1, null, 'Programme', 'Programme', 'البرنامج', '/programme/a-propos', 1),
    n(8, null, 'Projets', 'Projects', 'المشاريع', '/projets', 2),
    n(9, 8, "Jeun'ESS", "Jeun'ESS", "Jeun'ESS", '/projets/jeuness', 1),
    n(10, 8, 'GO4Youth', 'GO4Youth', 'GO4Youth', '/projets/go4youth', 2),
    n(11, 8, 'SWAFY', 'SWAFY', 'SWAFY', '/projets/swafy', 3),
    n(12, 8, 'Irada 4 Youth', 'Irada 4 Youth', 'Irada 4 Youth', '/projets/irada4youth', 4),
    n(13, 8, "Maghroum'IN", "Maghroum'IN", "Maghroum'IN", '/projets/maghroumin', 5),
    n(14, 8, 'Fe3il.a', 'Fe3il.a', 'Fe3il.a', '/projets/fe3ila', 6),
    n(15, null, 'Carte', 'Map', 'الخريطة', '/carte', 3),
    n(16, null, 'Actualités et opportunités', 'News and opportunities', 'الأخبار والفرص', '/actualites', 4),
    n(17, 16, 'Actualités', 'News', 'الأخبار', '/actualites', 1),
    n(18, 16, 'Opportunités', 'Opportunities', 'الفرص', '/opportunites', 2),
    n(19, 16, 'Événements', 'Events', 'الفعاليات', '/agenda', 3),
    n(20, null, 'Youth Stories', 'Youth Stories', 'قصص الشباب', '/stories', 5),
    n(21, null, 'Médias et ressources', 'Media and resources', 'الإعلام والموارد', '/publications', 6),
    n(22, 21, 'Publications', 'Publications', 'المنشورات', '/publications', 1),
    n(23, 21, 'Glossaire', 'Glossary', 'المعجم', '/glossaire', 2),
    n(24, 21, 'Médias', 'Media', 'الإعلام', '/coin-media', 3),
    n(25, null, 'EU en Tunisie', 'EU in Tunisia', 'الاتحاد الأوروبي في تونس', '/eu-en-tunisie', 7),
  ]

  return { pages, sections, blocks, siteNav, nextBlockId: blockId, nextNavId: 26 }
}

export function ensureContent(store) {
  const seed = createContentState()
  if (!store.content || !Array.isArray(store.content.pages) || store.content.pages.length === 0) {
    store.content = {
      pages: seed.pages,
      sections: seed.sections,
      blocks: seed.blocks,
      nextBlockId: seed.nextBlockId,
    }
  } else {
    for (const page of seed.pages) {
      if (!store.content.pages.some((item) => item.slug === page.slug)) {
        store.content.pages.push(page)
        store.content.sections.push(...seed.sections.filter((item) => item.page === page.slug))
        store.content.blocks.push(...seed.blocks.filter((item) => item.page === page.slug))
      }
    }
    const ficheHomes = [
      ['opportunites', 'opportunite'],
      ['actualites', 'actualite'],
      ['publications', 'publication'],
      ['agenda', 'evenement'],
    ]
    for (const [fromPage, toPage] of ficheHomes) {
      if (!store.content.pages.some((item) => item.slug === toPage)) continue
      for (const block of store.content.blocks) {
        if (block.page !== fromPage || block.section !== 'fiche') continue
        const dest = store.content.blocks.find(
          (item) =>
            item.page === toPage &&
            item.section === 'fiche' &&
            item.key === block.key &&
            item.locale === block.locale,
        )
        if (dest) dest.value = block.value
        else block.page = toPage
      }
      store.content.sections = store.content.sections.filter(
        (item) => !(item.page === fromPage && item.slug === 'fiche'),
      )
      store.content.blocks = store.content.blocks.filter(
        (item) => !(item.page === fromPage && item.section === 'fiche'),
      )
    }
    const haveSection = new Set(
      (store.content.sections || []).map((item) => `${item.page}::${item.slug}`),
    )
    for (const section of seed.sections) {
      const id = `${section.page}::${section.slug}`
      if (!haveSection.has(id)) {
        store.content.sections.push(section)
        haveSection.add(id)
      } else {
        const current = store.content.sections.find(
          (item) => item.page === section.page && item.slug === section.slug,
        )
        if (current) {
          current.sort_order = section.sort_order
          current.title = section.title
          current.pattern = section.pattern
        }
      }
    }
    store.content.nextBlockId = Math.max(
      store.content.nextBlockId || 1,
      ...store.content.blocks.map((item) => Number(item.id) || 0),
      seed.nextBlockId,
    )
    const haveBlock = new Set(
      (store.content.blocks || []).map(
        (item) => `${item.page}::${item.section}::${item.key}::${item.locale}`,
      ),
    )
    for (const block of seed.blocks) {
      const id = `${block.page}::${block.section}::${block.key}::${block.locale}`
      if (!haveBlock.has(id)) {
        store.content.blocks.push({ ...block, id: store.content.nextBlockId++ })
        haveBlock.add(id)
      }
    }
    const staleAproposTitles = [
      { section: 'impact', from: 'IMPACT', to: "L'IMPACT DU PROGRAMME" },
      { section: 'partners', from: 'PARTENAIRES', to: 'LES PARTENAIRES' },
      { section: 'avenir', from: 'ET MAINTENANT ?', to: "REGARDER VERS\nL'AVENIR" },
      { section: 'territoires', from: 'PARTOUT EN TUNISIE', to: 'UNE ACTION DANS LES TERRITOIRES' },
    ]
    for (const rule of staleAproposTitles) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'a-propos' &&
          item.section === rule.section &&
          item.key === 'title' &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    const staleFinancement = [
      {
        key: 'badge',
        from: 'UNION EUROPÉENNE',
        to: 'LE PROGRAMME EU4YOUTH',
      },
      {
        key: 'title',
        from: 'Financement Union européenne',
        to: 'FINANCEMENT\nUNION EUROPÉENNE',
      },
      {
        key: 'body',
        from: 'EU4Youth est financé par l’Union européenne. Cette page présente le cadre financier et les volumes d’appui du programme.',
        to: 'EU4Youth est le programme d’appui à la jeunesse tunisienne financé par l’Union européenne et mis en œuvre en partenariat avec les institutions tunisiennes et les acteurs nationaux et internationaux engagés en faveur des jeunes.',
      },
    ]
    for (const rule of staleFinancement) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'financement' &&
          item.section === 'hero' &&
          item.key === rule.key &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    const financementHeroLocaleFix = [
      { locale: 'en', key: 'badge', to: 'THE EU4YOUTH PROGRAMME' },
      { locale: 'en', key: 'title', to: 'EUROPEAN UNION\nFUNDING' },
      { locale: 'ar', key: 'badge', to: 'برنامج EU4YOUTH' },
      { locale: 'ar', key: 'title', to: 'تمويل\nالاتحاد الأوروبي' },
    ]
    for (const rule of financementHeroLocaleFix) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'financement' &&
          item.section === 'hero' &&
          item.key === rule.key &&
          item.locale === rule.locale,
      )
      if (block) block.value = rule.to
    }
    const financementArCopyFix = [
      {
        section: 'hero',
        key: 'body',
        to: 'EU4Youth برنامج لدعم الشباب التونسي، بتمويل من الاتحاد الأوروبي وبالشراكة مع المؤسسات التونسية والفاعلين الوطنيين والدوليين المنخرطين لفائدة الشباب.',
      },
      { section: 'hero', key: 'unit', to: 'M€' },
      { section: 'cta', key: 'eyebrow', to: 'لمعرفة المزيد' },
      { section: 'cta', key: 'title', to: 'اكتشفوا الأنشطة المموّلة' },
    ]
    for (const rule of financementArCopyFix) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'financement' &&
          item.section === rule.section &&
          item.key === rule.key &&
          item.locale === 'ar',
      )
      if (block) block.value = rule.to
    }
    const factsAr = store.content.blocks.find(
      (item) =>
        item.page === 'financement' &&
        item.section === 'facts' &&
        item.key === 'items' &&
        item.locale === 'ar',
    )
    if (factsAr) {
      try {
        const rows = typeof factsAr.value === 'string' ? JSON.parse(factsAr.value) : factsAr.value
        if (Array.isArray(rows) && rows[0] && /مليون\s*€|M[€£]/.test(String(rows[0].value || ''))) {
          rows[0].value = '60 M€'
          factsAr.value = JSON.stringify(rows, null, 2)
        }
      } catch {
        /* keep existing */
      }
    }
    const partenairesTitleEn = store.content.blocks.find(
      (item) =>
        item.page === 'partenaires' &&
        item.section === 'hero' &&
        item.key === 'title' &&
        item.locale === 'en',
    )
    if (partenairesTitleEn) partenairesTitleEn.value = 'PROGRAMME PARTNERS'
    const partenairesTitleAr = store.content.blocks.find(
      (item) =>
        item.page === 'partenaires' &&
        item.section === 'hero' &&
        item.key === 'title' &&
        item.locale === 'ar',
    )
    if (partenairesTitleAr && (partenairesTitleAr.value === 'الشركاء' || !partenairesTitleAr.value)) {
      partenairesTitleAr.value = 'شركاء البرنامج'
    }
    const educationByLocale = {
      fr: { src: '', alt: 'Ministère de l’Éducation' },
      en: { src: '', alt: 'Ministry of Education' },
      ar: { src: '', alt: 'وزارة التربية' },
    }
    for (const locale of ['fr', 'en', 'ar']) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'partenaires' &&
          item.section === 'institutions' &&
          item.key === 'items' &&
          item.locale === locale,
      )
      if (!block) continue
      let rows
      try {
        rows = typeof block.value === 'string' ? JSON.parse(block.value) : block.value
      } catch {
        continue
      }
      if (!Array.isArray(rows)) continue
      const hasEducation = rows.some((row) => {
        const alt = String(row?.alt || '')
        return (
          /^Ministry of Education$/i.test(alt) ||
          /Ministère de l[’']Éducation/i.test(alt) ||
          alt === 'وزارة التربية'
        )
      })
      if (!hasEducation) {
        rows.push(educationByLocale[locale])
        block.value = JSON.stringify(rows, null, 2)
      }
    }
    const financementProjectMeta = {
      fr: {
        jeuness: { partner: 'Organisation internationale du Travail (OIT)', period: 'Septembre 2019 – Août 2024' },
        go4youth: { partner: 'Banque mondiale / ANETI', period: 'Septembre 2021 – Juin 2027' },
        swafy: { partner: 'Agence Nationale de Promotion de la Recherche (ANPR)', period: 'Juin 2022 – Juin 2027' },
        irada4youth: { partner: 'CGDR + Offices de Développement Régional', period: '2022 – 2027' },
        maghroumin: {
          partner: 'Consortium EUNIC : AECID (Espagne) · FIIAPP (Espagne) · British Council (Royaume-Uni)',
          period: 'Janvier 2022 – Décembre 2026',
        },
        fe3ila: { partner: 'CILG-VNG International (Pays-Bas)', period: '2021 – 2026' },
      },
      en: {
        jeuness: { partner: 'International Labour Organization (ILO)', period: 'September 2019 – August 2024' },
        go4youth: { partner: 'World Bank / ANETI', period: 'September 2021 – June 2027' },
        swafy: { partner: 'National Agency for Research Promotion (ANPR)', period: 'June 2022 – June 2027' },
        irada4youth: { partner: 'CGDR + Regional Development Offices', period: '2022 – 2027' },
        maghroumin: {
          partner: 'EUNIC Consortium: AECID (Spain) · FIIAPP (Spain) · British Council (United Kingdom)',
          period: 'January 2022 – December 2026',
        },
        fe3ila: { partner: 'CILG-VNG International (Netherlands)', period: '2021 – 2026' },
      },
      ar: {
        jeuness: { partner: 'منظمة العمل الدولية (OIT)', period: 'سبتمبر 2019 – أغسطس 2024' },
        go4youth: { partner: 'البنك الدولي / الوكالة الوطنية للتشغيل', period: 'سبتمبر 2021 – يونيو 2027' },
        swafy: { partner: 'الوكالة الوطنية لترقية البحث (ANPR)', period: 'يونيو 2022 – يونيو 2027' },
        irada4youth: { partner: 'المندوبية العامة للتنمية الجهوية + مكاتب التنمية الجهوية', period: '2022 – 2027' },
        maghroumin: {
          partner: 'كونسورتيوم EUNIC: AECID (إسبانيا) · FIIAPP (إسبانيا) · المجلس البريطاني (المملكة المتحدة)',
          period: 'يناير 2022 – ديسمبر 2026',
        },
        fe3ila: { partner: 'CILG-VNG International (هولندا)', period: '2021 – 2026' },
      },
    }
    for (const locale of ['fr', 'en', 'ar']) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'financement' &&
          item.section === 'projects' &&
          item.key === 'items' &&
          item.locale === locale,
      )
      if (!block) continue
      let rows
      try {
        rows = typeof block.value === 'string' ? JSON.parse(block.value) : block.value
      } catch {
        continue
      }
      if (!Array.isArray(rows)) continue
      const metaBag = financementProjectMeta[locale]
      let changed = false
      for (const row of rows) {
        const meta = metaBag[row?.slug]
        if (!meta) continue
        if (!String(row.partner || '').trim()) {
          row.partner = meta.partner
          changed = true
        }
        if (!String(row.period || '').trim()) {
          row.period = meta.period
          changed = true
        }
      }
      if (changed) block.value = JSON.stringify(rows, null, 2)
    }
    const staleObjectifs = [
      {
        section: 'hero',
        key: 'body',
        from: 'Renforcer l’inclusion économique, sociale et civique des jeunes tunisiennes et tunisiens de 18 à 35 ans, dans les 24 gouvernorats.',
        to: 'EU4Youth part d’une conviction fondamentale : les jeunes Tunisiennes et Tunisiens sont des acteurs à part entière du changement.',
      },
      {
        section: 'projets',
        key: 'title',
        from: 'LES SIX PROJETS',
        to: 'SIX PROJETS',
      },
      {
        section: 'projets',
        key: 'subtitle',
        from: 'UNE VISION COMMUNE',
        to: 'UNE VISION COMMUNE.',
      },
      {
        section: 'projets',
        key: 'body',
        from: 'Six projets complémentaires couvrent l’emploi, l’ESS, la culture, le sport, les sciences et la participation des jeunes.',
        to: 'EU4Youth Tunisie s’organise en trois composantes thématiques portées par six projets complémentaires. Chaque projet intervient sur une dimension spécifique de l’inclusion des jeunes tunisiennes et tunisiens.',
      },
    ]
    for (const rule of staleObjectifs) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'objectifs' &&
          item.section === rule.section &&
          item.key === rule.key &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    const staleGouvernance = [
      { key: 'badge', from: 'PILOTAGE', to: 'LE PROGRAMME EU4YOUTH' },
      { key: 'title', from: 'Gouvernance et pilotage', to: 'GOUVERNANCE\nET PILOTAGE' },
      {
        key: 'body',
        from: 'Le programme s’appuie sur une gouvernance partagée entre l’Union européenne, les institutions tunisiennes et les partenaires de mise en œuvre.',
        to: 'EU4Youth repose sur une gouvernance partenariale qui relie l’Union européenne, les institutions tunisiennes, les partenaires de mise en œuvre et les acteurs des territoires autour d’une vision commune pour la jeunesse.',
      },
    ]
    for (const rule of staleGouvernance) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'gouvernance' &&
          item.section === 'hero' &&
          item.key === rule.key &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    const staleMecanismes = [
      { key: 'title', from: 'Mécanismes d’appui', to: "MÉCANISMES\nD’APPUI" },
    ]
    for (const rule of staleMecanismes) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'mecanismes-appui' &&
          item.section === 'hero' &&
          item.key === rule.key &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    const stalePartenaires = [
      { key: 'title', from: 'Partenaires du programme', to: 'LES PARTENAIRES' },
      {
        key: 'body',
        from: 'Institutions tunisiennes, Union européenne et partenaires de mise en œuvre.',
        to: "EU4Youth Tunisie mobilise un réseau unique de partenaires institutionnels, d'organisations internationales et d'acteurs de terrain. Ce partenariat multidimensionnel est la condition de la réussite et de la durabilité du programme.",
      },
    ]
    for (const rule of stalePartenaires) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'partenaires' &&
          item.section === 'hero' &&
          item.key === rule.key &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    const staleEuTunisie = [
      { key: 'badge', from: 'UNION EUROPÉENNE', to: 'COOPÉRATION UNION EUROPÉENNE — TUNISIE' },
      {
        key: 'title',
        from: 'L’Union européenne dans EU4Youth',
        to: "L’UNION\nEUROPÉENNE\nDANS EU4YOUTH",
      },
    ]
    for (const rule of staleEuTunisie) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'eu-en-tunisie' &&
          item.section === 'hero' &&
          item.key === rule.key &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    const staleProjets = [
      {
        key: 'body',
        from: "Jeun'ESS, Fe3il.a, Maghroum'IN, SWAFY, GO4Youth et IRADA4YOUTH couvrent l’emploi, l’ESS, la culture, le sport, les sciences et la résilience.",
        to: 'EU4Youth met en œuvre six projets complémentaires, portés par des partenaires internationaux et des institutions tunisiennes, autour de l’emploi, de la culture et du sport, et de la participation des jeunes aux politiques publiques.',
      },
    ]
    for (const rule of staleProjets) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'projets' &&
          item.section === 'hero' &&
          item.key === rule.key &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    store.content.blocks = store.content.blocks.filter(
      (item) => !(item.page === 'projets' && item.section === 'empty'),
    )
    store.content.sections = store.content.sections.filter(
      (item) => !(item.page === 'projets' && item.slug === 'empty'),
    )
    const staleCarte = [
      {
        key: 'badge',
        from: 'TERRITOIRES',
        to: 'CARTOGRAPHIE\nDES INTERVENTIONS TERRITORIALES',
      },
      {
        key: 'title',
        from: 'Carte des initiatives',
        to: 'EU4YOUTH',
      },
      {
        key: 'body',
        from: 'Explorez les fiches EU4Youth recensées dans les 24 gouvernorats.',
        to: 'De Bizerte à Ben Guerdane, de Jendouba à Tataouine, EU4Youth accompagne les jeunes Tunisiennes et Tunisiens dans les 24 gouvernorats de la Tunisie.',
      },
    ]
    for (const rule of staleCarte) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'carte' &&
          item.section === 'hero' &&
          item.key === rule.key &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    store.content.blocks = store.content.blocks.filter(
      (item) =>
        !(
          item.page === 'carte' &&
          (item.section === 'dashboard' ||
            (item.section === 'filters' &&
              ['statCovered', 'statProjects', 'statSectors', 'statStructures', 'statTotal'].includes(
                item.key,
              )) ||
            (item.section === 'map' && ['legendHigh', 'legendLow', 'legendMedium'].includes(item.key)))
        ),
    )
    store.content.sections = store.content.sections.filter(
      (item) => !(item.page === 'carte' && item.slug === 'dashboard'),
    )
    const browser = store.content.sections.find(
      (item) => item.page === 'opportunites' && item.slug === 'browser',
    )
    if (browser) {
      browser.pattern = 'cards_grid'
      browser.title = 'Filtres et résultats'
    }
    const staleOpportunites = [
      {
        key: 'title',
        from: 'Opportunités ouvertes aux jeunes',
        to: 'OPPORTUNITÉS',
      },
      {
        key: 'body',
        from: 'Appels à projets, formations, bourses et stages portés par les six projets.',
        to: 'Cette rubrique rassemble les appels à projets, appels à candidatures, offres de stage ou d’emploi, bourses et formations ouverts par les projets de l’écosystème EU4Youth. Chaque opportunité précise son porteur, son public cible et sa date limite, pour permettre aux jeunes, aux associations et aux structures partenaires d’identifier rapidement les dispositifs auxquels ils peuvent prétendre.',
      },
    ]
    for (const rule of staleOpportunites) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'opportunites' &&
          item.section === 'hero' &&
          item.key === rule.key &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    store.content.blocks = store.content.blocks.filter(
      (item) => !(item.page === 'opportunites' && item.section === 'hero' && item.key === 'badge'),
    )
    const newsBrowser = store.content.sections.find(
      (item) => item.page === 'actualites' && item.slug === 'browser',
    )
    if (newsBrowser) {
      newsBrowser.pattern = 'cards_grid'
      newsBrowser.title = 'Filtres et résultats'
    }
    const staleActualites = [
      { key: 'title', from: 'Actualités du programme', to: 'ACTUALITÉS' },
      {
        key: 'body',
        from: 'Résultats, événements et avancées vérifiés des projets EU4Youth.',
        to: 'Cette rubrique retrace les avancées, les temps forts et les résultats des projets de l’écosystème EU4Youth. Communiqués, comptes rendus d’événements, partenariats noués et succès de terrain y sont rassemblés au fil de la mise en œuvre du programme, pour donner à voir une coopération en mouvement plutôt qu’un simple flux d’annonces.',
      },
    ]
    for (const rule of staleActualites) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'actualites' &&
          item.section === 'hero' &&
          item.key === rule.key &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    store.content.blocks = store.content.blocks.filter(
      (item) => !(item.page === 'actualites' && item.section === 'hero' && item.key === 'badge'),
    )
    const pubBrowser = store.content.sections.find(
      (item) => item.page === 'publications' && item.slug === 'browser',
    )
    if (pubBrowser) {
      pubBrowser.pattern = 'cards_grid'
      pubBrowser.title = 'Filtres et résultats'
    }
    const stalePublications = [
      { key: 'title', from: 'PUBLICATIONS\n& RESSOURCES', to: 'PUBLICATIONS\nET RESSOURCES' },
      {
        key: 'body',
        from: 'Rapports, guides et outils du programme en accès libre.',
        to: 'Cette rubrique valorise la production documentaire des projets de l’écosystème EU4Youth : études, guides méthodologiques, fiches techniques, rapports et outils élaborés au fil de la mise en œuvre du programme. Elle donne accès aux enseignements et aux méthodes capitalisés par les équipes, dans une logique de transmission plutôt que d’archivage exhaustif.',
      },
    ]
    for (const rule of stalePublications) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'publications' &&
          item.section === 'hero' &&
          item.key === rule.key &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    store.content.blocks = store.content.blocks.filter(
      (item) => !(item.page === 'publications' && item.section === 'hero' && item.key === 'badge'),
    )
    const slots = store.content.sections.find((item) => item.page === 'stories' && item.slug === 'slots')
    if (slots) {
      slots.pattern = 'cards_grid'
      slots.title = 'Formats prévus'
    }
    const staleStories = [
      { key: 'badge', from: 'VOIX', to: 'PAROLES, PARCOURS, INITIATIVES' },
      { key: 'title', from: 'Youth Stories', to: 'YOUTH STORIES' },
    ]
    for (const rule of staleStories) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'stories' &&
          item.section === 'hero' &&
          item.key === rule.key &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    store.content.blocks = store.content.blocks.filter(
      (item) => !(item.page === 'stories' && item.section === 'hero' && item.key === 'body'),
    )
    const newsBand = store.content.sections.find(
      (item) => item.page === 'coin-media' && item.slug === 'news',
    )
    if (newsBand) {
      newsBand.pattern = 'cards_grid'
      newsBand.title = 'À la une'
    }
    const staleCoinMedia = [
      { key: 'badge', from: 'MÉDIAS', to: 'INFORMATIONS ET RESSOURCES' },
      { key: 'title', from: 'Coin média', to: 'COIN\nMÉDIA' },
    ]
    for (const rule of staleCoinMedia) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'coin-media' &&
          item.section === 'hero' &&
          item.key === rule.key &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    // Keep coin-media hero.body (trilingual press-review chapeau). Only drop
    // mis-filed contact-form copy that used to live under hero.body.
    store.content.blocks = store.content.blocks.filter(
      (item) =>
        !(
          item.page === 'coin-media' &&
          item.section === 'hero' &&
          item.key === 'body' &&
          /formulaire de contact|contact form|نموذج الاتصال/i.test(String(item.value || ''))
        ),
    )
    const glossBrowser = store.content.sections.find(
      (item) => item.page === 'glossaire' && item.slug === 'browser',
    )
    if (glossBrowser) {
      glossBrowser.pattern = 'cards_grid'
      glossBrowser.title = 'Recherche et index'
    }
    const staleGlossaire = [
      { key: 'title', from: 'Glossaire EU4Youth', to: 'GLOSSAIRE' },
      {
        key: 'body',
        from: 'Comprendre les termes, dispositifs et acteurs de l’écosystème.',
        to: 'Ce glossaire réunit les termes techniques et institutionnels mobilisés par les projets de l’écosystème EU4Youth — dispositifs de coopération internationale, mécanismes de financement, notions propres aux politiques de jeunesse. Il vise à faciliter la lecture des contenus du site pour des publics qui n’évoluent pas nécessairement dans l’univers de la coopération internationale.',
      },
    ]
    for (const rule of staleGlossaire) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'glossaire' &&
          item.section === 'hero' &&
          item.key === rule.key &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    const agendaBrowser = store.content.sections.find(
      (item) => item.page === 'agenda' && item.slug === 'browser',
    )
    if (agendaBrowser) {
      agendaBrowser.pattern = 'cards_grid'
      agendaBrowser.title = 'Calendrier'
    }
    const agendaFiche = store.content.sections.find(
      (item) => item.page === 'agenda' && item.slug === 'fiche',
    )
    if (agendaFiche) {
      agendaFiche.pattern = 'article'
      agendaFiche.title = 'Fiche événement'
    }
    const staleAgenda = [
      { key: 'title', from: 'Agenda du programme', to: 'AGENDA' },
      {
        key: 'body',
        from: 'Formations, forums et rendez-vous publics des six projets.',
        to: 'Retrouvez les rendez-vous, ateliers, rencontres publiques et temps forts portés par l’écosystème EU4Youth. Le calendrier rassemble les événements à venir et conserve l’historique des échanges déjà tenus sur les territoires.',
      },
    ]
    for (const rule of staleAgenda) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'agenda' &&
          item.section === 'hero' &&
          item.key === rule.key &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    const planIndex = store.content.sections.find(
      (item) => item.page === 'plan-du-site' && item.slug === 'index',
    )
    if (planIndex) {
      planIndex.pattern = 'simple_list'
      planIndex.title = 'Rubriques'
    }
    const searchBrowser = store.content.sections.find(
      (item) => item.page === 'recherche' && item.slug === 'browser',
    )
    if (searchBrowser) {
      searchBrowser.pattern = 'form_band'
      searchBrowser.title = 'Formulaire'
    }
    const searchResults = store.content.sections.find(
      (item) => item.page === 'recherche' && item.slug === 'results',
    )
    if (searchResults) {
      searchResults.pattern = 'simple_list'
      searchResults.title = 'Résultats'
    }
    store.content.blocks = store.content.blocks.filter(
      (item) => !(item.page === 'recherche' && item.section === 'hero' && item.key === 'body'),
    )
    const legalSlugs = ['confidentialite', 'mentions-legales', 'accessibilite', 'cookies']
    store.content.blocks = store.content.blocks.filter(
      (item) => !(legalSlugs.includes(item.page) && item.section === 'hero' && item.key === 'body'),
    )
    for (const slug of legalSlugs) {
      const intro = store.content.sections.find((item) => item.page === slug && item.slug === 'intro')
      if (intro) {
        intro.pattern = 'text'
        intro.title = 'Introduction'
      }
      const chapters = store.content.sections.find((item) => item.page === slug && item.slug === 'chapters')
      if (chapters) {
        chapters.pattern = 'simple_list'
        chapters.title = 'Rubriques'
      }
      const actions = store.content.sections.find((item) => item.page === slug && item.slug === 'actions')
      if (actions) {
        actions.pattern = 'cta_banner'
        actions.title = 'Actions'
      }
      const hero = store.content.sections.find((item) => item.page === slug && item.slug === 'hero')
      if (hero) {
        hero.pattern = 'hero'
        hero.title = 'En-tête'
      }
    }
    const staleLegalTitles = [
      { page: 'confidentialite', from: 'Politique de confidentialité', to: 'POLITIQUE DE CONFIDENTIALITÉ' },
      { page: 'mentions-legales', from: 'Mentions légales', to: 'MENTIONS LÉGALES' },
      { page: 'accessibilite', from: 'Accessibilité', to: 'ACCESSIBILITÉ' },
      { page: 'cookies', from: 'Gestion des cookies', to: 'GESTION DES COOKIES' },
    ]
    for (const rule of staleLegalTitles) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === rule.page &&
          item.section === 'hero' &&
          item.key === 'title' &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    const legalPlaceholder =
      /Zone réservée|Reserved for copy|مساحة مخصصة|sera renseigné|structure prête|ready for the validated|هيكل جاهز/i
    for (const slug of legalSlugs) {
      const page = store.content.pages.find((item) => item.slug === slug)
      if (page) page.status = 'published'
      for (const block of store.content.blocks) {
        if (block.page !== slug) continue
        const seedBlock = seed.blocks.find(
          (item) =>
            item.page === slug &&
            item.section === block.section &&
            item.key === block.key &&
            item.locale === block.locale,
        )
        if (!seedBlock) continue
        if (legalPlaceholder.test(String(block.value))) block.value = seedBlock.value
      }
    }
    const staleCookieFr = store.content.blocks.find(
      (item) =>
        item.page === 'global' &&
        item.section === 'legal' &&
        item.key === 'cookieBanner' &&
        item.locale === 'fr' &&
        item.value === 'Ce site utilise des cookies nécessaires au fonctionnement.',
    )
    if (staleCookieFr) {
      for (const locale of ['fr', 'en', 'ar']) {
        const from = store.content.blocks.find(
          (item) =>
            item.page === 'global' &&
            item.section === 'legal' &&
            item.key === 'cookieBanner' &&
            item.locale === locale,
        )
        const to = seed.blocks.find(
          (item) =>
            item.page === 'global' &&
            item.section === 'legal' &&
            item.key === 'cookieBanner' &&
            item.locale === locale,
        )
        if (from && to) from.value = to.value
      }
    }
    for (const block of store.content.blocks) {
      if (block.page !== 'plan-du-site' || block.key !== 'items') continue
      const next = String(block.value).replace(/"note": "Contenu à renseigner"/g, '"note": ""')
      if (next !== block.value) block.value = next
    }
    store.content.blocks = store.content.blocks.filter(
      (item) =>
        !(
          item.page === 'contact' &&
          ((item.section === 'hero' && item.key === 'badge') ||
            (item.section === 'form' &&
              [
                'lastName',
                'firstName',
                'organisation',
                'role',
                'email',
                'phone',
                'profile',
                'project',
                'location',
                'requestType',
                'subject',
                'subjectHint',
                'message',
                'messageHint',
              ].includes(item.key)))
        ),
    )
    const contactForm = store.content.sections.find((item) => item.page === 'contact' && item.slug === 'form')
    if (contactForm) {
      contactForm.pattern = 'form_band'
      contactForm.title = 'Formulaire'
    }
    const contactHero = store.content.sections.find((item) => item.page === 'contact' && item.slug === 'hero')
    if (contactHero) {
      contactHero.pattern = 'hero'
      contactHero.title = 'En-tête'
    }
    const staleContact = [
      { key: 'title', from: 'Contacter EU4Youth Tunisie', to: 'CONTACT' },
      { key: 'title', locale: 'en', from: 'Contact EU4Youth Tunisia', to: 'CONTACT' },
      {
        key: 'body',
        from: 'Une question, une demande média, un partenariat : écrivez à l’équipe du programme.',
        to: 'Pour une question sur le programme, un projet, un partenariat ou ce site, écrivez-nous. L’équipe EU4Youth Tunisie relit chaque demande et vous répond dans les meilleurs délais.',
      },
    ]
    for (const rule of staleContact) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'contact' &&
          item.section === 'hero' &&
          item.key === rule.key &&
          item.locale === (rule.locale || 'fr') &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    const contactTitleAr = store.content.blocks.find(
      (item) =>
        item.page === 'contact' &&
        item.section === 'hero' &&
        item.key === 'title' &&
        item.locale === 'ar',
    )
    if (contactTitleAr) contactTitleAr.value = 'الاتصال'
    const introuvableHero = store.content.sections.find(
      (item) => item.page === 'introuvable' && item.slug === 'hero',
    )
    if (introuvableHero) {
      introuvableHero.pattern = 'hero'
      introuvableHero.title = 'En-tête'
    }
    const introuvableLinks = store.content.sections.find(
      (item) => item.page === 'introuvable' && item.slug === 'links',
    )
    if (introuvableLinks) {
      introuvableLinks.pattern = 'simple_list'
      introuvableLinks.title = 'Liens utiles'
    }
    const introuvableActions = store.content.sections.find(
      (item) => item.page === 'introuvable' && item.slug === 'actions',
    )
    if (introuvableActions) {
      introuvableActions.pattern = 'cta_banner'
      introuvableActions.title = 'Actions'
    }
    const globalHeader = store.content.sections.find((item) => item.page === 'global' && item.slug === 'header')
    if (globalHeader) {
      globalHeader.pattern = 'heading'
      globalHeader.title = 'En-tête'
      globalHeader.sort_order = 0
    }
    const globalFooter = store.content.sections.find((item) => item.page === 'global' && item.slug === 'footer')
    if (globalFooter) {
      globalFooter.pattern = 'simple_list'
      globalFooter.title = 'Pied de page'
      globalFooter.sort_order = 1
    }
    const globalLegal = store.content.sections.find((item) => item.page === 'global' && item.slug === 'legal')
    if (globalLegal) {
      globalLegal.pattern = 'text'
      globalLegal.title = 'Cookies'
      globalLegal.sort_order = 2
    }
    const globalSettings = store.content.sections.find((item) => item.page === 'global' && item.slug === 'settings')
    if (globalSettings) {
      globalSettings.pattern = 'heading'
      globalSettings.title = 'Identité du site'
      globalSettings.sort_order = 3
    }
    const globalPage = store.content.pages.find((item) => item.slug === 'global')
    if (globalPage) {
      if (globalPage.title === 'Global') globalPage.title = 'Paramètres du site'
      globalPage.group = 'Système'
    }
    const homePage = store.content.pages.find((item) => item.slug === 'home')
    if (homePage && homePage.title === 'Accueil') {
      homePage.group = 'Public'
    }
  }
  const navUrls = (store.siteNav || []).map((row) => String(row.url || '')).join('\n')
  const hasProgrammeChildren = (store.siteNav || []).some(
    (row) => Number(row.parent_id) === 1 || String(row.parent_id) === '1',
  )
  const legacyNav =
    !Array.isArray(store.siteNav) ||
    store.siteNav.length === 0 ||
    hasProgrammeChildren ||
    navUrls.includes('/programme/objectifs') ||
    (!navUrls.includes('/stories') && navUrls.includes('/contact'))
  if (legacyNav) {
    store.siteNav = seed.siteNav
    store.nextNavId = seed.nextNavId
  }
  if (!Array.isArray(store.translations)) store.translations = []
  const haveKey = new Set(store.translations.map((row) => row.key))
  for (const row of TRANSLATIONS) {
    if (!haveKey.has(row.key)) {
      store.translations.push({ ...row })
      haveKey.add(row.key)
    }
  }
  const previousFr = {
    'nav.programme': 'Le programme',
    'nav.projects': 'Les projets',
    'nav.map': 'Carte',
    'nav.media': 'Coin media',
  }
  for (const row of store.translations) {
    const seed = TRANSLATIONS.find((item) => item.key === row.key)
    if (seed && previousFr[row.key] && row.fr === previousFr[row.key]) {
      Object.assign(row, seed)
    }
  }
  if (!store.rolePermissions || typeof store.rolePermissions !== 'object') {
    store.rolePermissions = JSON.parse(JSON.stringify(ROLE_PERMISSIONS))
  } else {
    for (const [role, perms] of Object.entries(ROLE_PERMISSIONS)) {
      store.rolePermissions[role] = { ...perms, ...(store.rolePermissions[role] || {}) }
    }
  }
  const bySlug = new Map(store.content.pages.map((page) => [page.slug, page]))
  store.pages = store.content.pages
    .filter((page) => page.slug !== 'global')
    .map((page) => ({
      slug: page.slug,
      path: page.path,
      title: page.title,
      group: page.group || 'Public',
      status: page.status,
    }))
  for (const page of store.pages) {
    const cms = bySlug.get(page.slug)
    if (cms) {
      page.path = cms.path || page.path
      page.title = cms.title || page.title
      page.status = cms.status || page.status
    }
  }
  const chiffresKpiLinks = [
    { to: '/projets', cx: '200' },
    { to: '/mecanismes-appui', cx: '520' },
    { to: '/projets', cx: '840' },
    { to: '/carte', cx: '1160' },
    { to: '/carte', cx: '1480' },
  ]
  const isBudgetKpi = (row) => {
    const label = String(row?.label || '').replace(/\s+/g, ' ').trim()
    return /^(BUDGET(\s+TOTAL|\s+GLOBAL)?|TOTAL\s+BUDGET|الميزانية(\s*الإجمالية)?)$/i.test(label)
  }
  for (const block of store.content.blocks || []) {
    if (block.page !== 'home' || block.section !== 'chiffres' || block.key !== 'items') continue
    let rows
    try {
      rows = typeof block.value === 'string' ? JSON.parse(block.value) : block.value
    } catch {
      continue
    }
    if (!Array.isArray(rows) || rows.length === 0) continue
    const filtered = rows.filter((row) => !isBudgetKpi(row))
    block.value = JSON.stringify(
      filtered.map((row, index) => ({
        ...row,
        to: row.to || chiffresKpiLinks[index]?.to || '/',
        cx: row.cx != null ? String(row.cx) : chiffresKpiLinks[index]?.cx || '200',
      })),
      null,
      2,
    )
  }
  for (const block of store.content.blocks || []) {
    if (typeof block.value === 'string' && block.value.includes('Au premier visit')) {
      block.value = block.value.replaceAll('Au premier visit', 'Au premier passage')
    }
  }
  const legendFr = store.content.blocks.find(
    (item) =>
      item.page === 'carte' &&
      item.section === 'map' &&
      item.key === 'legend' &&
      item.locale === 'fr',
  )
  const legendText = JSON.stringify(legendFr?.value ?? '')
  if (legendFr && (legendText.includes('Forte intensité') || legendText.includes('"high"'))) {
    legendFr.value = [
      { id: 'none', label: '0 intervention' },
      { id: 't1', label: '0 à 20' },
      { id: 't2', label: '20 à 40' },
      { id: 't3', label: '40 à 60' },
      { id: 't4', label: 'Plus de 60' },
    ]
  }
  const legendByLocale = {
    en: [
      { id: 'none', label: '0 interventions' },
      { id: 't1', label: '0 to 20' },
      { id: 't2', label: '20 to 40' },
      { id: 't3', label: '40 to 60' },
      { id: 't4', label: 'More than 60' },
    ],
    ar: [
      { id: 'none', label: '0 تدخل' },
      { id: 't1', label: '0 إلى 20' },
      { id: 't2', label: '20 إلى 40' },
      { id: 't3', label: '40 إلى 60' },
      { id: 't4', label: 'أكثر من 60' },
    ],
  }
  for (const locale of ['en', 'ar']) {
    const block = (store.content.blocks || []).find(
      (item) =>
        item.page === 'carte' &&
        item.section === 'map' &&
        item.key === 'legend' &&
        item.locale === locale,
    )
    if (!block) continue
    const text = JSON.stringify(block.value ?? '')
    if (
      text.includes('Forte intensité') ||
      text.includes('"high"') ||
      text.includes('Intensité') ||
      !text.includes('"t1"')
    ) {
      block.value = legendByLocale[locale]
      block.type = 'json'
    }
  }
  const staleStoryCollages = new Set([
    '/img/WEB.png',
    '/img/home-stories-v2.webp',
    '/img/home-stories-v2.jpg',
    '/img/home-stories-collage.png',
    '/img/home-stories-collage.webp',
    '/img/stories-collage-cutout.png',
    '/img/map-art-shape.png',
  ])
  for (const block of store.content.blocks || []) {
    if (block.page !== 'home' || block.section !== 'stories') continue
    if (block.type !== 'image') continue
    if (!['collage', 'image', 'portrait', 'graffiti'].includes(block.key)) continue
    const value = String(block.value || '').trim()
    if (!value || staleStoryCollages.has(value) || value.includes('WEB')) {
      block.value =
        block.key === 'collage' || block.key === 'image'
          ? '/img/stories-collage-transparent.png'
          : ''
    }
  }
  store.content.seedRev = Math.max(Number(store.content.seedRev) || 0, 19)
  return store
}
    const financementHeroLocaleFix = [
      { locale: 'en', key: 'badge', to: 'THE EU4YOUTH PROGRAMME' },
      { locale: 'en', key: 'title', to: 'EUROPEAN UNION\nFUNDING' },
      { locale: 'ar', key: 'badge', to: 'برنامج EU4YOUTH' },
      { locale: 'ar', key: 'title', to: 'تمويل\nالاتحاد الأوروبي' },
    ]
    for (const rule of financementHeroLocaleFix) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'financement' &&
          item.section === 'hero' &&
          item.key === rule.key &&
          item.locale === rule.locale,
      )
      if (block) block.value = rule.to
    }
    const financementArCopyFix = [
      {
        section: 'hero',
        key: 'body',
        to: 'EU4Youth برنامج لدعم الشباب التونسي، بتمويل من الاتحاد الأوروبي وبالشراكة مع المؤسسات التونسية والفاعلين الوطنيين والدوليين المنخرطين لفائدة الشباب.',
      },
      { section: 'hero', key: 'unit', to: 'M€' },
      { section: 'cta', key: 'eyebrow', to: 'لمعرفة المزيد' },
      { section: 'cta', key: 'title', to: 'اكتشفوا الأنشطة المموّلة' },
    ]
    for (const rule of financementArCopyFix) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'financement' &&
          item.section === rule.section &&
          item.key === rule.key &&
          item.locale === 'ar',
      )
      if (block) block.value = rule.to
    }
    const factsAr = store.content.blocks.find(
      (item) =>
        item.page === 'financement' &&
        item.section === 'facts' &&
        item.key === 'items' &&
        item.locale === 'ar',
    )
    if (factsAr) {
      try {
        const rows = typeof factsAr.value === 'string' ? JSON.parse(factsAr.value) : factsAr.value
        if (Array.isArray(rows) && rows[0] && /مليون\s*€|M[€£]/.test(String(rows[0].value || ''))) {
          rows[0].value = '60 M€'
          factsAr.value = JSON.stringify(rows, null, 2)
        }
      } catch {
        /* keep existing */
      }
    }
    const partenairesTitleEn = store.content.blocks.find(
      (item) =>
        item.page === 'partenaires' &&
        item.section === 'hero' &&
        item.key === 'title' &&
        item.locale === 'en',
    )
    if (partenairesTitleEn) partenairesTitleEn.value = 'PROGRAMME PARTNERS'
    const partenairesTitleAr = store.content.blocks.find(
      (item) =>
        item.page === 'partenaires' &&
        item.section === 'hero' &&
        item.key === 'title' &&
        item.locale === 'ar',
    )
    if (partenairesTitleAr && (partenairesTitleAr.value === 'الشركاء' || !partenairesTitleAr.value)) {
      partenairesTitleAr.value = 'شركاء البرنامج'
    }
    const educationByLocale = {
      fr: { src: '', alt: 'Ministère de l’Éducation' },
      en: { src: '', alt: 'Ministry of Education' },
      ar: { src: '', alt: 'وزارة التربية' },
    }
    for (const locale of ['fr', 'en', 'ar']) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'partenaires' &&
          item.section === 'institutions' &&
          item.key === 'items' &&
          item.locale === locale,
      )
      if (!block) continue
      let rows
      try {
        rows = typeof block.value === 'string' ? JSON.parse(block.value) : block.value
      } catch {
        continue
      }
      if (!Array.isArray(rows)) continue
      const hasEducation = rows.some((row) => {
        const alt = String(row?.alt || '')
        return (
          /^Ministry of Education$/i.test(alt) ||
          /Ministère de l[’']Éducation/i.test(alt) ||
          alt === 'وزارة التربية'
        )
      })
      if (!hasEducation) {
        rows.push(educationByLocale[locale])
        block.value = JSON.stringify(rows, null, 2)
      }
    }
    const financementProjectMeta = {
      fr: {
        jeuness: { partner: 'Organisation internationale du Travail (OIT)', period: 'Septembre 2019 – Août 2024' },
        go4youth: { partner: 'Banque mondiale / ANETI', period: 'Septembre 2021 – Juin 2027' },
        swafy: { partner: 'Agence Nationale de Promotion de la Recherche (ANPR)', period: 'Juin 2022 – Juin 2027' },
        irada4youth: { partner: 'CGDR + Offices de Développement Régional', period: '2022 – 2027' },
        maghroumin: {
          partner: 'Consortium EUNIC : AECID (Espagne) · FIIAPP (Espagne) · British Council (Royaume-Uni)',
          period: 'Janvier 2022 – Décembre 2026',
        },
        fe3ila: { partner: 'CILG-VNG International (Pays-Bas)', period: '2021 – 2026' },
      },
      en: {
        jeuness: { partner: 'International Labour Organization (ILO)', period: 'September 2019 – August 2024' },
        go4youth: { partner: 'World Bank / ANETI', period: 'September 2021 – June 2027' },
        swafy: { partner: 'National Agency for Research Promotion (ANPR)', period: 'June 2022 – June 2027' },
        irada4youth: { partner: 'CGDR + Regional Development Offices', period: '2022 – 2027' },
        maghroumin: {
          partner: 'EUNIC Consortium: AECID (Spain) · FIIAPP (Spain) · British Council (United Kingdom)',
          period: 'January 2022 – December 2026',
        },
        fe3ila: { partner: 'CILG-VNG International (Netherlands)', period: '2021 – 2026' },
      },
      ar: {
        jeuness: { partner: 'منظمة العمل الدولية (OIT)', period: 'سبتمبر 2019 – أغسطس 2024' },
        go4youth: { partner: 'البنك الدولي / الوكالة الوطنية للتشغيل', period: 'سبتمبر 2021 – يونيو 2027' },
        swafy: { partner: 'الوكالة الوطنية لترقية البحث (ANPR)', period: 'يونيو 2022 – يونيو 2027' },
        irada4youth: { partner: 'المندوبية العامة للتنمية الجهوية + مكاتب التنمية الجهوية', period: '2022 – 2027' },
        maghroumin: {
          partner: 'كونسورتيوم EUNIC: AECID (إسبانيا) · FIIAPP (إسبانيا) · المجلس البريطاني (المملكة المتحدة)',
          period: 'يناير 2022 – ديسمبر 2026',
        },
        fe3ila: { partner: 'CILG-VNG International (هولندا)', period: '2021 – 2026' },
      },
    }
    for (const locale of ['fr', 'en', 'ar']) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'financement' &&
          item.section === 'projects' &&
          item.key === 'items' &&
          item.locale === locale,
      )
      if (!block) continue
      let rows
      try {
        rows = typeof block.value === 'string' ? JSON.parse(block.value) : block.value
      } catch {
        continue
      }
      if (!Array.isArray(rows)) continue
      const metaBag = financementProjectMeta[locale]
      let changed = false
      for (const row of rows) {
        const meta = metaBag[row?.slug]
        if (!meta) continue
        if (!String(row.partner || '').trim()) {
          row.partner = meta.partner
          changed = true
        }
        if (!String(row.period || '').trim()) {
          row.period = meta.period
          changed = true
        }
      }
      if (changed) block.value = JSON.stringify(rows, null, 2)
    }
    const staleObjectifs = [
      {
        section: 'hero',
        key: 'body',
        from: 'Renforcer l’inclusion économique, sociale et civique des jeunes tunisiennes et tunisiens de 18 à 35 ans, dans les 24 gouvernorats.',
        to: 'EU4Youth part d’une conviction fondamentale : les jeunes Tunisiennes et Tunisiens sont des acteurs à part entière du changement.',
      },
      {
        section: 'projets',
        key: 'title',
        from: 'LES SIX PROJETS',
        to: 'SIX PROJETS',
      },
      {
        section: 'projets',
        key: 'subtitle',
        from: 'UNE VISION COMMUNE',
        to: 'UNE VISION COMMUNE.',
      },
      {
        section: 'projets',
        key: 'body',
        from: 'Six projets complémentaires couvrent l’emploi, l’ESS, la culture, le sport, les sciences et la participation des jeunes.',
        to: 'EU4Youth Tunisie s’organise en trois composantes thématiques portées par six projets complémentaires. Chaque projet intervient sur une dimension spécifique de l’inclusion des jeunes tunisiennes et tunisiens.',
      },
    ]
    for (const rule of staleObjectifs) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'objectifs' &&
          item.section === rule.section &&
          item.key === rule.key &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    const staleGouvernance = [
      { key: 'badge', from: 'PILOTAGE', to: 'LE PROGRAMME EU4YOUTH' },
      { key: 'title', from: 'Gouvernance et pilotage', to: 'GOUVERNANCE\nET PILOTAGE' },
      {
        key: 'body',
        from: 'Le programme s’appuie sur une gouvernance partagée entre l’Union européenne, les institutions tunisiennes et les partenaires de mise en œuvre.',
        to: 'EU4Youth repose sur une gouvernance partenariale qui relie l’Union européenne, les institutions tunisiennes, les partenaires de mise en œuvre et les acteurs des territoires autour d’une vision commune pour la jeunesse.',
      },
    ]
    for (const rule of staleGouvernance) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'gouvernance' &&
          item.section === 'hero' &&
          item.key === rule.key &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    const staleMecanismes = [
      { key: 'title', from: 'Mécanismes d’appui', to: "MÉCANISMES\nD’APPUI" },
    ]
    for (const rule of staleMecanismes) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'mecanismes-appui' &&
          item.section === 'hero' &&
          item.key === rule.key &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    const stalePartenaires = [
      { key: 'title', from: 'Partenaires du programme', to: 'LES PARTENAIRES' },
      {
        key: 'body',
        from: 'Institutions tunisiennes, Union européenne et partenaires de mise en œuvre.',
        to: "EU4Youth Tunisie mobilise un réseau unique de partenaires institutionnels, d'organisations internationales et d'acteurs de terrain. Ce partenariat multidimensionnel est la condition de la réussite et de la durabilité du programme.",
      },
    ]
    for (const rule of stalePartenaires) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'partenaires' &&
          item.section === 'hero' &&
          item.key === rule.key &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    const staleEuTunisie = [
      { key: 'badge', from: 'UNION EUROPÉENNE', to: 'COOPÉRATION UNION EUROPÉENNE — TUNISIE' },
      {
        key: 'title',
        from: 'L’Union européenne dans EU4Youth',
        to: "L’UNION\nEUROPÉENNE\nDANS EU4YOUTH",
      },
    ]
    for (const rule of staleEuTunisie) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'eu-en-tunisie' &&
          item.section === 'hero' &&
          item.key === rule.key &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    const staleProjets = [
      {
        key: 'body',
        from: "Jeun'ESS, Fe3il.a, Maghroum'IN, SWAFY, GO4Youth et IRADA4YOUTH couvrent l’emploi, l’ESS, la culture, le sport, les sciences et la résilience.",
        to: 'EU4Youth met en œuvre six projets complémentaires, portés par des partenaires internationaux et des institutions tunisiennes, autour de l’emploi, de la culture et du sport, et de la participation des jeunes aux politiques publiques.',
      },
    ]
    for (const rule of staleProjets) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'projets' &&
          item.section === 'hero' &&
          item.key === rule.key &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    store.content.blocks = store.content.blocks.filter(
      (item) => !(item.page === 'projets' && item.section === 'empty'),
    )
    store.content.sections = store.content.sections.filter(
      (item) => !(item.page === 'projets' && item.slug === 'empty'),
    )
    const staleCarte = [
      {
        key: 'badge',
        from: 'TERRITOIRES',
        to: 'CARTOGRAPHIE\nDES INTERVENTIONS TERRITORIALES',
      },
      {
        key: 'title',
        from: 'Carte des initiatives',
        to: 'EU4YOUTH',
      },
      {
        key: 'body',
        from: 'Explorez les fiches EU4Youth recensées dans les 24 gouvernorats.',
        to: 'De Bizerte à Ben Guerdane, de Jendouba à Tataouine, EU4Youth accompagne les jeunes Tunisiennes et Tunisiens dans les 24 gouvernorats de la Tunisie.',
      },
    ]
    for (const rule of staleCarte) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'carte' &&
          item.section === 'hero' &&
          item.key === rule.key &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    store.content.blocks = store.content.blocks.filter(
      (item) =>
        !(
          item.page === 'carte' &&
          (item.section === 'dashboard' ||
            (item.section === 'filters' &&
              ['statCovered', 'statProjects', 'statSectors', 'statStructures', 'statTotal'].includes(
                item.key,
              )) ||
            (item.section === 'map' && ['legendHigh', 'legendLow', 'legendMedium'].includes(item.key)))
        ),
    )
    store.content.sections = store.content.sections.filter(
      (item) => !(item.page === 'carte' && item.slug === 'dashboard'),
    )
    const browser = store.content.sections.find(
      (item) => item.page === 'opportunites' && item.slug === 'browser',
    )
    if (browser) {
      browser.pattern = 'cards_grid'
      browser.title = 'Filtres et résultats'
    }
    const staleOpportunites = [
      {
        key: 'title',
        from: 'Opportunités ouvertes aux jeunes',
        to: 'OPPORTUNITÉS',
      },
      {
        key: 'body',
        from: 'Appels à projets, formations, bourses et stages portés par les six projets.',
        to: 'Cette rubrique rassemble les appels à projets, appels à candidatures, offres de stage ou d’emploi, bourses et formations ouverts par les projets de l’écosystème EU4Youth. Chaque opportunité précise son porteur, son public cible et sa date limite, pour permettre aux jeunes, aux associations et aux structures partenaires d’identifier rapidement les dispositifs auxquels ils peuvent prétendre.',
      },
    ]
    for (const rule of staleOpportunites) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'opportunites' &&
          item.section === 'hero' &&
          item.key === rule.key &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    store.content.blocks = store.content.blocks.filter(
      (item) => !(item.page === 'opportunites' && item.section === 'hero' && item.key === 'badge'),
    )
    const newsBrowser = store.content.sections.find(
      (item) => item.page === 'actualites' && item.slug === 'browser',
    )
    if (newsBrowser) {
      newsBrowser.pattern = 'cards_grid'
      newsBrowser.title = 'Filtres et résultats'
    }
    const staleActualites = [
      { key: 'title', from: 'Actualités du programme', to: 'ACTUALITÉS' },
      {
        key: 'body',
        from: 'Résultats, événements et avancées vérifiés des projets EU4Youth.',
        to: 'Cette rubrique retrace les avancées, les temps forts et les résultats des projets de l’écosystème EU4Youth. Communiqués, comptes rendus d’événements, partenariats noués et succès de terrain y sont rassemblés au fil de la mise en œuvre du programme, pour donner à voir une coopération en mouvement plutôt qu’un simple flux d’annonces.',
      },
    ]
    for (const rule of staleActualites) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'actualites' &&
          item.section === 'hero' &&
          item.key === rule.key &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    store.content.blocks = store.content.blocks.filter(
      (item) => !(item.page === 'actualites' && item.section === 'hero' && item.key === 'badge'),
    )
    const pubBrowser = store.content.sections.find(
      (item) => item.page === 'publications' && item.slug === 'browser',
    )
    if (pubBrowser) {
      pubBrowser.pattern = 'cards_grid'
      pubBrowser.title = 'Filtres et résultats'
    }
    const stalePublications = [
      { key: 'title', from: 'PUBLICATIONS\n& RESSOURCES', to: 'PUBLICATIONS\nET RESSOURCES' },
      {
        key: 'body',
        from: 'Rapports, guides et outils du programme en accès libre.',
        to: 'Cette rubrique valorise la production documentaire des projets de l’écosystème EU4Youth : études, guides méthodologiques, fiches techniques, rapports et outils élaborés au fil de la mise en œuvre du programme. Elle donne accès aux enseignements et aux méthodes capitalisés par les équipes, dans une logique de transmission plutôt que d’archivage exhaustif.',
      },
    ]
    for (const rule of stalePublications) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'publications' &&
          item.section === 'hero' &&
          item.key === rule.key &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    store.content.blocks = store.content.blocks.filter(
      (item) => !(item.page === 'publications' && item.section === 'hero' && item.key === 'badge'),
    )
    const slots = store.content.sections.find((item) => item.page === 'stories' && item.slug === 'slots')
    if (slots) {
      slots.pattern = 'cards_grid'
      slots.title = 'Formats prévus'
    }
    const staleStories = [
      { key: 'badge', from: 'VOIX', to: 'PAROLES, PARCOURS, INITIATIVES' },
      { key: 'title', from: 'Youth Stories', to: 'YOUTH STORIES' },
    ]
    for (const rule of staleStories) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'stories' &&
          item.section === 'hero' &&
          item.key === rule.key &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    store.content.blocks = store.content.blocks.filter(
      (item) => !(item.page === 'stories' && item.section === 'hero' && item.key === 'body'),
    )
    const newsBand = store.content.sections.find(
      (item) => item.page === 'coin-media' && item.slug === 'news',
    )
    if (newsBand) {
      newsBand.pattern = 'cards_grid'
      newsBand.title = 'À la une'
    }
    const staleCoinMedia = [
      { key: 'badge', from: 'MÉDIAS', to: 'INFORMATIONS ET RESSOURCES' },
      { key: 'title', from: 'Coin média', to: 'COIN\nMÉDIA' },
    ]
    for (const rule of staleCoinMedia) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'coin-media' &&
          item.section === 'hero' &&
          item.key === rule.key &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    // Keep coin-media hero.body (trilingual press-review chapeau). Only drop
    // mis-filed contact-form copy that used to live under hero.body.
    store.content.blocks = store.content.blocks.filter(
      (item) =>
        !(
          item.page === 'coin-media' &&
          item.section === 'hero' &&
          item.key === 'body' &&
          /formulaire de contact|contact form|نموذج الاتصال/i.test(String(item.value || ''))
        ),
    )
    const glossBrowser = store.content.sections.find(
      (item) => item.page === 'glossaire' && item.slug === 'browser',
    )
    if (glossBrowser) {
      glossBrowser.pattern = 'cards_grid'
      glossBrowser.title = 'Recherche et index'
    }
    const staleGlossaire = [
      { key: 'title', from: 'Glossaire EU4Youth', to: 'GLOSSAIRE' },
      {
        key: 'body',
        from: 'Comprendre les termes, dispositifs et acteurs de l’écosystème.',
        to: 'Ce glossaire réunit les termes techniques et institutionnels mobilisés par les projets de l’écosystème EU4Youth — dispositifs de coopération internationale, mécanismes de financement, notions propres aux politiques de jeunesse. Il vise à faciliter la lecture des contenus du site pour des publics qui n’évoluent pas nécessairement dans l’univers de la coopération internationale.',
      },
    ]
    for (const rule of staleGlossaire) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'glossaire' &&
          item.section === 'hero' &&
          item.key === rule.key &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    const agendaBrowser = store.content.sections.find(
      (item) => item.page === 'agenda' && item.slug === 'browser',
    )
    if (agendaBrowser) {
      agendaBrowser.pattern = 'cards_grid'
      agendaBrowser.title = 'Calendrier'
    }
    const agendaFiche = store.content.sections.find(
      (item) => item.page === 'agenda' && item.slug === 'fiche',
    )
    if (agendaFiche) {
      agendaFiche.pattern = 'article'
      agendaFiche.title = 'Fiche événement'
    }
    const staleAgenda = [
      { key: 'title', from: 'Agenda du programme', to: 'AGENDA' },
      {
        key: 'body',
        from: 'Formations, forums et rendez-vous publics des six projets.',
        to: 'Retrouvez les rendez-vous, ateliers, rencontres publiques et temps forts portés par l’écosystème EU4Youth. Le calendrier rassemble les événements à venir et conserve l’historique des échanges déjà tenus sur les territoires.',
      },
    ]
    for (const rule of staleAgenda) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'agenda' &&
          item.section === 'hero' &&
          item.key === rule.key &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    const planIndex = store.content.sections.find(
      (item) => item.page === 'plan-du-site' && item.slug === 'index',
    )
    if (planIndex) {
      planIndex.pattern = 'simple_list'
      planIndex.title = 'Rubriques'
    }
    const searchBrowser = store.content.sections.find(
      (item) => item.page === 'recherche' && item.slug === 'browser',
    )
    if (searchBrowser) {
      searchBrowser.pattern = 'form_band'
      searchBrowser.title = 'Formulaire'
    }
    const searchResults = store.content.sections.find(
      (item) => item.page === 'recherche' && item.slug === 'results',
    )
    if (searchResults) {
      searchResults.pattern = 'simple_list'
      searchResults.title = 'Résultats'
    }
    store.content.blocks = store.content.blocks.filter(
      (item) => !(item.page === 'recherche' && item.section === 'hero' && item.key === 'body'),
    )
    const legalSlugs = ['confidentialite', 'mentions-legales', 'accessibilite', 'cookies']
    store.content.blocks = store.content.blocks.filter(
      (item) => !(legalSlugs.includes(item.page) && item.section === 'hero' && item.key === 'body'),
    )
    for (const slug of legalSlugs) {
      const intro = store.content.sections.find((item) => item.page === slug && item.slug === 'intro')
      if (intro) {
        intro.pattern = 'text'
        intro.title = 'Introduction'
      }
      const chapters = store.content.sections.find((item) => item.page === slug && item.slug === 'chapters')
      if (chapters) {
        chapters.pattern = 'simple_list'
        chapters.title = 'Rubriques'
      }
      const actions = store.content.sections.find((item) => item.page === slug && item.slug === 'actions')
      if (actions) {
        actions.pattern = 'cta_banner'
        actions.title = 'Actions'
      }
      const hero = store.content.sections.find((item) => item.page === slug && item.slug === 'hero')
      if (hero) {
        hero.pattern = 'hero'
        hero.title = 'En-tête'
      }
    }
    const staleLegalTitles = [
      { page: 'confidentialite', from: 'Politique de confidentialité', to: 'POLITIQUE DE CONFIDENTIALITÉ' },
      { page: 'mentions-legales', from: 'Mentions légales', to: 'MENTIONS LÉGALES' },
      { page: 'accessibilite', from: 'Accessibilité', to: 'ACCESSIBILITÉ' },
      { page: 'cookies', from: 'Gestion des cookies', to: 'GESTION DES COOKIES' },
    ]
    for (const rule of staleLegalTitles) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === rule.page &&
          item.section === 'hero' &&
          item.key === 'title' &&
          item.locale === 'fr' &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    const legalPlaceholder =
      /Zone réservée|Reserved for copy|مساحة مخصصة|sera renseigné|structure prête|ready for the validated|هيكل جاهز/i
    for (const slug of legalSlugs) {
      const page = store.content.pages.find((item) => item.slug === slug)
      if (page) page.status = 'published'
      for (const block of store.content.blocks) {
        if (block.page !== slug) continue
        const seedBlock = seed.blocks.find(
          (item) =>
            item.page === slug &&
            item.section === block.section &&
            item.key === block.key &&
            item.locale === block.locale,
        )
        if (!seedBlock) continue
        if (legalPlaceholder.test(String(block.value))) block.value = seedBlock.value
      }
    }
    const staleCookieFr = store.content.blocks.find(
      (item) =>
        item.page === 'global' &&
        item.section === 'legal' &&
        item.key === 'cookieBanner' &&
        item.locale === 'fr' &&
        item.value === 'Ce site utilise des cookies nécessaires au fonctionnement.',
    )
    if (staleCookieFr) {
      for (const locale of ['fr', 'en', 'ar']) {
        const from = store.content.blocks.find(
          (item) =>
            item.page === 'global' &&
            item.section === 'legal' &&
            item.key === 'cookieBanner' &&
            item.locale === locale,
        )
        const to = seed.blocks.find(
          (item) =>
            item.page === 'global' &&
            item.section === 'legal' &&
            item.key === 'cookieBanner' &&
            item.locale === locale,
        )
        if (from && to) from.value = to.value
      }
    }
    for (const block of store.content.blocks) {
      if (block.page !== 'plan-du-site' || block.key !== 'items') continue
      const next = String(block.value).replace(/"note": "Contenu à renseigner"/g, '"note": ""')
      if (next !== block.value) block.value = next
    }
    store.content.blocks = store.content.blocks.filter(
      (item) =>
        !(
          item.page === 'contact' &&
          ((item.section === 'hero' && item.key === 'badge') ||
            (item.section === 'form' &&
              [
                'lastName',
                'firstName',
                'organisation',
                'role',
                'email',
                'phone',
                'profile',
                'project',
                'location',
                'requestType',
                'subject',
                'subjectHint',
                'message',
                'messageHint',
              ].includes(item.key)))
        ),
    )
    const contactForm = store.content.sections.find((item) => item.page === 'contact' && item.slug === 'form')
    if (contactForm) {
      contactForm.pattern = 'form_band'
      contactForm.title = 'Formulaire'
    }
    const contactHero = store.content.sections.find((item) => item.page === 'contact' && item.slug === 'hero')
    if (contactHero) {
      contactHero.pattern = 'hero'
      contactHero.title = 'En-tête'
    }
    const staleContact = [
      { key: 'title', from: 'Contacter EU4Youth Tunisie', to: 'CONTACT' },
      { key: 'title', locale: 'en', from: 'Contact EU4Youth Tunisia', to: 'CONTACT' },
      {
        key: 'body',
        from: 'Une question, une demande média, un partenariat : écrivez à l’équipe du programme.',
        to: 'Pour une question sur le programme, un projet, un partenariat ou ce site, écrivez-nous. L’équipe EU4Youth Tunisie relit chaque demande et vous répond dans les meilleurs délais.',
      },
    ]
    for (const rule of staleContact) {
      const block = store.content.blocks.find(
        (item) =>
          item.page === 'contact' &&
          item.section === 'hero' &&
          item.key === rule.key &&
          item.locale === (rule.locale || 'fr') &&
          item.value === rule.from,
      )
      if (block) block.value = rule.to
    }
    const contactTitleAr = store.content.blocks.find(
      (item) =>
        item.page === 'contact' &&
        item.section === 'hero' &&
        item.key === 'title' &&
        item.locale === 'ar',
    )
    if (contactTitleAr) contactTitleAr.value = 'الاتصال'
    const introuvableHero = store.content.sections.find(
      (item) => item.page === 'introuvable' && item.slug === 'hero',
    )
    if (introuvableHero) {
      introuvableHero.pattern = 'hero'
      introuvableHero.title = 'En-tête'
    }
    const introuvableLinks = store.content.sections.find(
      (item) => item.page === 'introuvable' && item.slug === 'links',
    )
    if (introuvableLinks) {
      introuvableLinks.pattern = 'simple_list'
      introuvableLinks.title = 'Liens utiles'
    }
    const introuvableActions = store.content.sections.find(
      (item) => item.page === 'introuvable' && item.slug === 'actions',
    )
    if (introuvableActions) {
      introuvableActions.pattern = 'cta_banner'
      introuvableActions.title = 'Actions'
    }
    const globalHeader = store.content.sections.find((item) => item.page === 'global' && item.slug === 'header')
    if (globalHeader) {
      globalHeader.pattern = 'heading'
      globalHeader.title = 'En-tête'
      globalHeader.sort_order = 0
    }
    const globalFooter = store.content.sections.find((item) => item.page === 'global' && item.slug === 'footer')
    if (globalFooter) {
      globalFooter.pattern = 'simple_list'
      globalFooter.title = 'Pied de page'
      globalFooter.sort_order = 1
    }
    const globalLegal = store.content.sections.find((item) => item.page === 'global' && item.slug === 'legal')
    if (globalLegal) {
      globalLegal.pattern = 'text'
      globalLegal.title = 'Cookies'
      globalLegal.sort_order = 2
    }
    const globalSettings = store.content.sections.find((item) => item.page === 'global' && item.slug === 'settings')
    if (globalSettings) {
      globalSettings.pattern = 'heading'
      globalSettings.title = 'Identité du site'
      globalSettings.sort_order = 3
    }
    const globalPage = store.content.pages.find((item) => item.slug === 'global')
    if (globalPage) {
      if (globalPage.title === 'Global') globalPage.title = 'Paramètres du site'
      globalPage.group = 'Système'
    }
    const homePage = store.content.pages.find((item) => item.slug === 'home')
    if (homePage && homePage.title === 'Accueil') {
      homePage.group = 'Public'
    }
  }
  const navUrls = (store.siteNav || []).map((row) => String(row.url || '')).join('\n')
  const hasProgrammeChildren = (store.siteNav || []).some(
    (row) => Number(row.parent_id) === 1 || String(row.parent_id) === '1',
  )
  const legacyNav =
    !Array.isArray(store.siteNav) ||
    store.siteNav.length === 0 ||
    hasProgrammeChildren ||
    navUrls.includes('/programme/objectifs') ||
    (!navUrls.includes('/stories') && navUrls.includes('/contact'))
  if (legacyNav) {
    store.siteNav = seed.siteNav
    store.nextNavId = seed.nextNavId
  }
  if (!Array.isArray(store.translations)) store.translations = []
  const haveKey = new Set(store.translations.map((row) => row.key))
  for (const row of TRANSLATIONS) {
    if (!haveKey.has(row.key)) {
      store.translations.push({ ...row })
      haveKey.add(row.key)
    }
  }
  const previousFr = {
    'nav.programme': 'Le programme',
    'nav.projects': 'Les projets',
    'nav.map': 'Carte',
    'nav.media': 'Coin media',
  }
  for (const row of store.translations) {
    const seed = TRANSLATIONS.find((item) => item.key === row.key)
    if (seed && previousFr[row.key] && row.fr === previousFr[row.key]) {
      Object.assign(row, seed)
    }
  }
  if (!store.rolePermissions || typeof store.rolePermissions !== 'object') {
    store.rolePermissions = JSON.parse(JSON.stringify(ROLE_PERMISSIONS))
  } else {
    for (const [role, perms] of Object.entries(ROLE_PERMISSIONS)) {
      store.rolePermissions[role] = { ...perms, ...(store.rolePermissions[role] || {}) }
    }
  }
  const bySlug = new Map(store.content.pages.map((page) => [page.slug, page]))
  store.pages = store.content.pages
    .filter((page) => page.slug !== 'global')
    .map((page) => ({
      slug: page.slug,
      path: page.path,
      title: page.title,
      group: page.group || 'Public',
      status: page.status,
    }))
  for (const page of store.pages) {
    const cms = bySlug.get(page.slug)
    if (cms) {
      page.path = cms.path || page.path
      page.title = cms.title || page.title
      page.status = cms.status || page.status
    }
  }
  const chiffresKpiLinks = [
    { to: '/projets', cx: '200' },
    { to: '/mecanismes-appui', cx: '520' },
    { to: '/projets', cx: '840' },
    { to: '/carte', cx: '1160' },
    { to: '/carte', cx: '1480' },
  ]
  const isBudgetKpi = (row) => {
    const label = String(row?.label || '').replace(/\s+/g, ' ').trim()
    return /^(BUDGET(\s+TOTAL|\s+GLOBAL)?|TOTAL\s+BUDGET|الميزانية(\s*الإجمالية)?)$/i.test(label)
  }
  for (const block of store.content.blocks || []) {
    if (block.page !== 'home' || block.section !== 'chiffres' || block.key !== 'items') continue
    let rows
    try {
      rows = typeof block.value === 'string' ? JSON.parse(block.value) : block.value
    } catch {
      continue
    }
    if (!Array.isArray(rows) || rows.length === 0) continue
    const filtered = rows.filter((row) => !isBudgetKpi(row))
    block.value = JSON.stringify(
      filtered.map((row, index) => ({
        ...row,
        to: row.to || chiffresKpiLinks[index]?.to || '/',
        cx: row.cx != null ? String(row.cx) : chiffresKpiLinks[index]?.cx || '200',
      })),
      null,
      2,
    )
  }
  for (const block of store.content.blocks || []) {
    if (typeof block.value === 'string' && block.value.includes('Au premier visit')) {
      block.value = block.value.replaceAll('Au premier visit', 'Au premier passage')
    }
  }
  const legendFr = store.content.blocks.find(
    (item) =>
      item.page === 'carte' &&
      item.section === 'map' &&
      item.key === 'legend' &&
      item.locale === 'fr',
  )
  const legendText = JSON.stringify(legendFr?.value ?? '')
  if (legendFr && (legendText.includes('Forte intensité') || legendText.includes('"high"'))) {
    legendFr.value = [
      { id: 'none', label: '0 intervention' },
      { id: 't1', label: '0 à 20' },
      { id: 't2', label: '20 à 40' },
      { id: 't3', label: '40 à 60' },
      { id: 't4', label: 'Plus de 60' },
    ]
  }
  const legendByLocale = {
    en: [
      { id: 'none', label: '0 interventions' },
      { id: 't1', label: '0 to 20' },
      { id: 't2', label: '20 to 40' },
      { id: 't3', label: '40 to 60' },
      { id: 't4', label: 'More than 60' },
    ],
    ar: [
      { id: 'none', label: '0 تدخل' },
      { id: 't1', label: '0 إلى 20' },
      { id: 't2', label: '20 إلى 40' },
      { id: 't3', label: '40 إلى 60' },
      { id: 't4', label: 'أكثر من 60' },
    ],
  }
  for (const locale of ['en', 'ar']) {
    const block = (store.content.blocks || []).find(
      (item) =>
        item.page === 'carte' &&
        item.section === 'map' &&
        item.key === 'legend' &&
        item.locale === locale,
    )
    if (!block) continue
    const text = JSON.stringify(block.value ?? '')
    if (
      text.includes('Forte intensité') ||
      text.includes('"high"') ||
      text.includes('Intensité') ||
      !text.includes('"t1"')
    ) {
      block.value = legendByLocale[locale]
      block.type = 'json'
    }
  }
  const staleStoryCollages = new Set([
    '/img/WEB.png',
    '/img/home-stories-v2.webp',
    '/img/home-stories-v2.jpg',
    '/img/home-stories-collage.png',
    '/img/home-stories-collage.webp',
    '/img/stories-collage-cutout.png',
    '/img/map-art-shape.png',
  ])
  for (const block of store.content.blocks || []) {
    if (block.page !== 'home' || block.section !== 'stories') continue
    if (block.type !== 'image') continue
    if (!['collage', 'image', 'portrait', 'graffiti'].includes(block.key)) continue
    const value = String(block.value || '').trim()
    if (!value || staleStoryCollages.has(value) || value.includes('WEB')) {
      block.value =
        block.key === 'collage' || block.key === 'image'
          ? '/img/stories-collage-transparent.png'
          : ''
    }
  }
  store.content.seedRev = Math.max(Number(store.content.seedRev) || 0, 19)
  return store
}
