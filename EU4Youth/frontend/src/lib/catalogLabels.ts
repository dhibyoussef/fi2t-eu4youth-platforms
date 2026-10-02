export const CATALOG_LABELS: Record<string, string> = {
  news: 'Actualités',
  publications: 'Publications',
  events: 'Agenda',
  opportunities: 'Opportunités',
  stories: 'Youth Stories',
  videos: 'Vidéothèque',
  initiatives: 'Initiatives',
}

export const CATALOG_ROUTES: Record<string, string> = {
  news: '/actualites',
  publications: '/publications',
  events: '/agenda',
  opportunities: '/opportunites',
  stories: '/stories',
  videos: '/videos',
  initiatives: '/initiatives',
}

export function catalogLabel(name: string) {
  return CATALOG_LABELS[name] || name
}

export function catalogRoute(name: string) {
  return CATALOG_ROUTES[name] || '/actualites'
}
