import { api } from './client'

/** Public website origin. On preprod/prod use VITE_PUBLIC_SITE; locally default to Vite site. */
export const PUBLIC_SITE = (
  import.meta.env.VITE_PUBLIC_SITE ||
  (typeof window !== 'undefined' && /prodexo\.agency$/i.test(window.location.hostname)
    ? `${window.location.origin}/eu4youth`
    : 'http://localhost:3030')
).replace(/\/$/, '')

export const PAGE_PATHS: Record<string, string> = {
  home: '/',
  'a-propos': '/programme/a-propos',
  objectifs: '/programme/objectifs',
  financement: '/programme/financement',
  gouvernance: '/programme/gouvernance',
  projets: '/projets',
  projet: '/projets/jeuness',
  carte: '/carte',
  opportunites: '/opportunites',
  opportunite: '/opportunites/irada-2e-appel-a-propositions-2026',
  actualites: '/actualites',
  actualite: '/actualites/go4youth-avancees-transformation-digitale-aneti-avril-2026',
  publications: '/publications',
  publication: '/publications/go4youth-newsletter-11',
  agenda: '/agenda',
  evenement: '/agenda/go4youth-tre-decembre-2025',
  stories: '/stories',
  'coin-media': '/coin-media',
  glossaire: '/glossaire',
  contact: '/contact',
  partenaires: '/partenaires',
  'mecanismes-appui': '/mecanismes-appui',
  'eu-en-tunisie': '/eu-en-tunisie',
  confidentialite: '/confidentialite',
  'mentions-legales': '/mentions-legales',
  accessibilite: '/accessibilite',
  cookies: '/cookies',
  introuvable: '/page-introuvable',
}

export function websiteOrigin() {
  return PUBLIC_SITE
}

export function pagePublicPath(slug: string, fallbackPath?: string) {
  if (fallbackPath) return fallbackPath
  if (PAGE_PATHS[slug]) return PAGE_PATHS[slug]
  if (slug === 'global' || !slug) return '/'
  return `/${slug}`
}

export async function createEditSessionToken() {
  const { data } = await api.post('/admin/edit-session')
  return String(data.token)
}

export async function buildLiveEditorUrl(path = '/', extra: Record<string, string> = {}) {
  const { data } = await api.post('/admin/edit-session')
  // Prefer Vite/publicSite base; never use URL(path, base) with an absolute "/" path —
  // that drops a subdirectory base like …/eu4youth.
  const origin = String(data.website || data.publicSiteUrl || PUBLIC_SITE).replace(/\/$/, '')
  const suffix = !path || path === '/' ? '' : path.startsWith('/') ? path : `/${path}`
  const url = new URL(`${origin}${suffix}`)
  url.searchParams.set('edit_token', data.token)
  for (const [key, value] of Object.entries(extra)) url.searchParams.set(key, value)
  return url.toString()
}
