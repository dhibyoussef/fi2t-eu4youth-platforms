/** EU4Youth CMS seed - programme content, not FI2T/tourism. */

export const PROJECTS = [
  {
    slug: 'jeuness',
    acronym: "Jeun'ESS",
    color: '#e34171',
    partner: 'Organisation internationale du Travail (OIT)',
    budget: '9 millions EUR',
    period: 'Septembre 2019 - Aout 2024',
    status: 'published',
    name: {
      fr: "Jeun'ESS - economie sociale et solidaire",
      en: "Jeun'ESS - social and solidarity economy",
      ar: "Jeun'ESS - social and solidarity economy",
    },
    tagline: {
      fr: "L economie sociale et solidaire, un levier pour l emploi decent.",
      en: 'Social and solidarity economy as a lever for decent work.',
      ar: 'Social and solidarity economy as a lever for decent work.',
    },
  },
  {
    slug: 'fe3ila',
    acronym: 'Fe3il.a',
    color: '#050b86',
    partner: 'Expertise France',
    budget: '9 millions EUR',
    period: '2021 - 2026',
    status: 'published',
    name: {
      fr: 'Fe3il.a - employabilite et insertion',
      en: 'Fe3il.a - employability and inclusion',
      ar: 'Fe3il.a - employability and inclusion',
    },
    tagline: {
      fr: 'Renforcer l employabilite des jeunes et des femmes.',
      en: 'Strengthening youth and women employability.',
      ar: 'Strengthening youth and women employability.',
    },
  },
  {
    slug: 'maghroumin',
    acronym: "Maghroum'IN",
    color: '#54b84f',
    partner: 'Agence tunisienne',
    budget: 'A confirmer',
    period: '2021 - 2026',
    status: 'published',
    name: {
      fr: "Maghroum'IN - culture, sport et engagement",
      en: "Maghroum'IN - culture, sport and engagement",
      ar: "Maghroum'IN - culture, sport and engagement",
    },
    tagline: {
      fr: 'La culture et le sport comme espaces d expression.',
      en: 'Culture and sport as spaces of expression.',
      ar: 'Culture and sport as spaces of expression.',
    },
  },
  {
    slug: 'swafy',
    acronym: 'SWAFY',
    color: '#705fa7',
    partner: 'A confirmer',
    budget: 'A confirmer',
    period: '2021 - 2026',
    status: 'published',
    name: {
      fr: 'SWAFY - sciences et politiques publiques',
      en: 'SWAFY - science and public policy',
      ar: 'SWAFY - science and public policy',
    },
    tagline: {
      fr: 'Associer les jeunes a la science et au debat public.',
      en: 'Connecting young people to science and public debate.',
      ar: 'Connecting young people to science and public debate.',
    },
  },
  {
    slug: 'go4youth',
    acronym: 'GO4Youth',
    color: '#23b5e5',
    partner: 'A confirmer',
    budget: '10 millions EUR',
    period: 'Aout 2021 - 2026',
    status: 'published',
    name: {
      fr: 'GO4Youth - engagement civique et mobilite',
      en: 'GO4Youth - civic engagement and mobility',
      ar: 'GO4Youth - civic engagement and mobility',
    },
    tagline: {
      fr: 'Leadership jeune, benevolat et mobilite nationale.',
      en: 'Youth leadership, volunteering and nationwide mobility.',
      ar: 'Youth leadership, volunteering and nationwide mobility.',
    },
  },
  {
    slug: 'irada4youth',
    acronym: 'IRADA4YOUTH',
    color: '#f2a849',
    partner: 'A confirmer',
    budget: 'A confirmer',
    period: '2021 - 2026',
    status: 'published',
    name: {
      fr: 'IRADA4YOUTH - resilience et accompagnement',
      en: 'IRADA4YOUTH - resilience and support',
      ar: 'IRADA4YOUTH - resilience and support',
    },
    tagline: {
      fr: 'Accompagnement psychosocial et prevention de la marginalisation.',
      en: 'Psychosocial support and prevention of marginalisation.',
      ar: 'Psychosocial support and prevention of marginalisation.',
    },
  },
]

export const PAGES = [
  { slug: 'home', path: '/', title: 'Accueil', group: 'Public', status: 'published' },
  { slug: 'a-propos', path: '/programme/a-propos', title: 'A propos', group: 'Programme', status: 'published' },
  { slug: 'objectifs', path: '/programme/objectifs', title: 'Objectifs', group: 'Programme', status: 'published' },
  { slug: 'financement', path: '/programme/financement', title: 'Financement', group: 'Programme', status: 'published' },
  { slug: 'gouvernance', path: '/programme/gouvernance', title: 'Gouvernance', group: 'Programme', status: 'published' },
  { slug: 'projets', path: '/projets', title: 'Les six projets', group: 'Projets', status: 'published' },
  { slug: 'carte', path: '/carte', title: 'Carte des initiatives', group: 'Mapping', status: 'published' },
  { slug: 'opportunites', path: '/opportunites', title: 'Opportunites', group: 'Jeunes', status: 'published' },
  { slug: 'actualites', path: '/actualites', title: 'Actualites', group: 'Media', status: 'published' },
  { slug: 'publications', path: '/publications', title: 'Publications', group: 'Media', status: 'published' },
  { slug: 'stories', path: '/stories', title: 'Youth Stories', group: 'Jeunes', status: 'published' },
  { slug: 'coin-media', path: '/coin-media', title: 'Coin media', group: 'Media', status: 'published' },
  { slug: 'glossaire', path: '/glossaire', title: 'Glossaire', group: 'Ressources', status: 'published' },
  { slug: 'contact', path: '/contact', title: 'Contact', group: 'Public', status: 'published' },
  { slug: 'confidentialite', path: '/confidentialite', title: 'Confidentialite', group: 'Legal', status: 'published' },
  { slug: 'mentions-legales', path: '/mentions-legales', title: 'Mentions legales', group: 'Legal', status: 'published' },
  { slug: 'accessibilite', path: '/accessibilite', title: 'Accessibilite', group: 'Legal', status: 'published' },
  { slug: 'cookies', path: '/cookies', title: 'Cookies', group: 'Legal', status: 'published' },
]

export const LIVE = {
  home: {
    badge: {
      fr: 'LA JEUNESSE TUNISIENNE PORTE LES SOLUTIONS DE DEMAIN.',
      en: 'TUNISIAN YOUTH CARRIES TOMORROWS SOLUTIONS.',
      ar: '\u0627\u0644\u0634\u0628\u0627\u0628 \u0627\u0644\u062a\u0648\u0646\u0633\u064a \u064a\u062d\u0645\u0644 \u062d\u0644\u0648\u0644 \u0627\u0644\u063a\u062f.',
    },
    headline: {
      fr: 'EU4Youth accompagne les jeunes dans leurs parcours, leurs projets et leur engagement.',
      en: 'EU4Youth supports young people in their paths, their projects and their engagement.',
      ar: 'EU4Youth \u064a\u0631\u0627\u0641\u0642 \u0627\u0644\u0634\u0628\u0627\u0628 \u0641\u064a \u0645\u0633\u0627\u0631\u0627\u062a\u0647\u0645 \u0648\u0645\u0634\u0627\u0631\u064a\u0639\u0647\u0645 \u0648\u0627\u0646\u062e\u0631\u0627\u0637\u0647\u0645.',
    },
    body: {
      fr: 'Vous avez entre 18 et 35 ans. EU4Youth Tunisie vous accompagne.',
      en: 'You are between 18 and 35. EU4Youth Tunisia is with you.',
      ar: '\u0639\u0645\u0631\u0643 \u0628\u064a\u0646 18 \u0648 35 \u0633\u0646\u0629. \u0628\u0631\u0646\u0627\u0645\u062c EU4Youth \u062a\u0648\u0646\u0633 \u064a\u0631\u0627\u0641\u0642\u0643.',
    },
    ctaProjects: { fr: 'Decouvrir les projets', en: 'Discover the projects', ar: '\u0627\u0643\u062a\u0634\u0641 \u0627\u0644\u0645\u0634\u0627\u0631\u064a\u0639' },
    ctaOpportunities: { fr: 'Voir les opportunites ouvertes', en: 'See open opportunities', ar: '\u0639\u0631\u0636 \u0627\u0644\u0641\u0631\u0635' },
    ctaMap: { fr: 'Explorer la carte des initiatives', en: 'Explore the initiatives map', ar: '\u0627\u0633\u062a\u0643\u0634\u0641 \u0627\u0644\u062e\u0631\u064a\u0637\u0629' },
    kpiBudget: { fr: '60 M EUR', en: 'EUR 60M', ar: '60 M EUR' },
    kpiProjects: { fr: '6 projets', en: '6 projects', ar: '6 \u0645\u0634\u0627\u0631\u064a\u0639' },
    kpiGovernorates: { fr: '24 gouvernorats', en: '24 governorates', ar: '24 \u0648\u0644\u0627\u064a\u0629' },
  },
  stories: {
    eyebrow: { fr: 'PAROLES, PARCOURS, INITIATIVES', en: 'VOICES, PATHS, INITIATIVES', ar: '\u0623\u0635\u0648\u0627\u062a' },
    title: { fr: 'YOUTH STORIES', en: 'YOUTH STORIES', ar: '\u0642\u0635\u0635 \u0627\u0644\u0634\u0628\u0627\u0628' },
    intro: {
      fr: 'Portraits de beneficiaires et voix d engagement.',
      en: 'Beneficiary portraits and voices of engagement.',
      ar: '\u0635\u0648\u0631 \u0645\u0633\u062a\u0641\u064a\u062f\u064a\u0646.',
    },
  },
  media: {
    title: { fr: 'COIN MEDIA', en: 'MEDIA HUB', ar: '\u0631\u0643\u0646 \u0627\u0644\u0625\u0639\u0644\u0627\u0645' },
    intro: {
      fr: 'Videotheque YouTube du programme.',
      en: 'Programme YouTube library.',
      ar: '\u0645\u0643\u062a\u0628\u0629 \u0641\u064a\u062f\u064a\u0648.',
    },
  },
  legal: {
    privacyTitle: { fr: 'Politique de confidentialite', en: 'Privacy policy', ar: '\u0633\u064a\u0627\u0633\u0629 \u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629' },
    cookiesTitle: { fr: 'Gestion des cookies', en: 'Cookie settings', ar: '\u0627\u0644\u0643\u0648\u0643\u064a\u0632' },
    cookieBanner: {
      fr: 'Ce site utilise des cookies necessaires au fonctionnement.',
      en: 'This site uses necessary cookies.',
      ar: '\u064a\u0633\u062a\u062e\u062f\u0645 \u0647\u0630\u0627 \u0627\u0644\u0645\u0648\u0642\u0639 \u0643\u0648\u0643\u064a\u0632.',
    },
    accept: { fr: 'Accepter', en: 'Accept', ar: '\u0642\u0628\u0648\u0644' },
    reject: { fr: 'Refuser', en: 'Reject', ar: '\u0631\u0641\u0636' },
    privacyBody: {
      fr: 'Texte a valider par l editeur programme.',
      en: 'Copy to be validated by the programme editor.',
      ar: '\u0646\u0635 \u0628\u0627\u0646\u062a\u0638\u0627\u0631 \u0627\u0644\u0645\u0635\u0627\u062f\u0642\u0629.',
    },
  },
}

export const INITIATIVES = [
  { id: 1, name: 'Club LIMITLESS Jendouba', projectSlug: 'jeuness', governorate: 'Jendouba', locality: 'Jendouba', lat: 36.5011, lng: 8.7802, type: 'Club', sector: 'ESS', status: 'published' },
  { id: 2, name: 'Incubateur Fe3il.a Kairouan', projectSlug: 'fe3ila', governorate: 'Kairouan', locality: 'Kairouan', lat: 35.6781, lng: 10.0963, type: 'Formation', sector: 'Employabilite', status: 'published' },
  { id: 3, name: 'Maison des jeunes Maghroum IN Sfax', projectSlug: 'maghroumin', governorate: 'Sfax', locality: 'Sfax', lat: 34.7398, lng: 10.76, type: 'Espace culturel', sector: 'Culture', status: 'published' },
  { id: 4, name: 'Forum science-societe SWAFY Tunis', projectSlug: 'swafy', governorate: 'Tunis', locality: 'Tunis', lat: 36.8065, lng: 10.1815, type: 'Evenement', sector: 'Sciences', status: 'draft' },
  { id: 5, name: 'Volontariat GO4Youth Medenine', projectSlug: 'go4youth', governorate: 'Medenine', locality: 'Medenine', lat: 33.3549, lng: 10.5055, type: 'Benevolat', sector: 'Engagement civique', status: 'published' },
  { id: 6, name: 'Cellule d ecoute IRADA4YOUTH Kasserine', projectSlug: 'irada4youth', governorate: 'Kasserine', locality: 'Kasserine', lat: 35.1676, lng: 8.8365, type: 'Accompagnement', sector: 'Resilience', status: 'published' },
]

export const STORIES = []

export const VIDEOS = []

export const OPPORTUNITIES = [
  { id: 1, type: 'Appel a candidatures', projectSlug: 'fe3ila', status: 'Ouverte', deadline: '2026-09-30', title: { fr: 'Parcours d insertion Fe3il.a', en: 'Fe3il.a inclusion pathway', ar: 'Fe3il.a inclusion pathway' } },
  { id: 2, type: 'Formation', projectSlug: 'jeuness', status: 'A venir', deadline: '2026-10-15', title: { fr: 'Formation accompagnateurs ESS', en: 'SSE mentors training', ar: 'SSE mentors training' } },
  { id: 3, type: 'Bourse', projectSlug: 'go4youth', status: 'Ouverte', deadline: '2026-08-31', title: { fr: 'Bourse de mobilite jeune', en: 'Youth mobility grant', ar: 'Youth mobility grant' } },
]

export const INBOX = []

export const USERS = []

export { TRANSLATIONS } from './uiTranslations.mjs'

export const ROLE_PERMISSIONS = {
  administrateur: {
    content: true,
    catalogues: true,
    translations: true,
    inbox: true,
    users: true,
    roles: true,
    settings: true,
  },
  editeur: {
    content: true,
    catalogues: true,
    translations: true,
    inbox: true,
    users: false,
    roles: false,
    settings: true,
  },
  contributeur: {
    content: true,
    catalogues: true,
    translations: false,
    inbox: false,
    users: false,
    roles: false,
    settings: false,
  },
  communication: {
    content: true,
    catalogues: true,
    translations: true,
    inbox: true,
    users: false,
    roles: false,
    settings: false,
  },
}

export function createStore() {
  return {
    projects: PROJECTS,
    pages: PAGES,
    live: LIVE,
    initiatives: INITIATIVES,
    stories: STORIES,
    videos: VIDEOS,
    opportunities: OPPORTUNITIES,
    inbox: INBOX,
    users: USERS,
    translations: TRANSLATIONS,
    rolePermissions: JSON.parse(JSON.stringify(ROLE_PERMISSIONS)),
    settings: {
      locales: ['fr', 'en', 'ar'],
      defaultLocale: 'fr',
      cookieBannerEnabled: true,
      youtubeApiConfigured: false,
      contactEndpointConfigured: false,
      newsletterEndpointConfigured: false,
      publicSiteUrl: 'http://localhost:3030',
    },
  }
}
