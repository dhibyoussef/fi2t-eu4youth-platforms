import { api } from '../api/client'

export const PROJECT_SLUG_BY_LABEL: Record<string, string> = {
  "Jeun'ESS": 'jeuness',
  'Fe3il.a': 'fe3ila',
  "Maghroum'IN": 'maghroumin',
  SWAFY: 'swafy',
  GO4Youth: 'go4youth',
  IRADA4YOUTH: 'irada4youth',
}

/** Approximate map centers when governorate is chosen (initiatives). */
export const GOVERNORATE_COORDS: Record<string, { lat: number; lng: number }> = {
  Tunis: { lat: 36.8065, lng: 10.1815 },
  Ariana: { lat: 36.8625, lng: 10.1956 },
  'Ben Arous': { lat: 36.7533, lng: 10.2282 },
  Manouba: { lat: 36.8101, lng: 10.0971 },
  Nabeul: { lat: 36.4561, lng: 10.7376 },
  Zaghouan: { lat: 36.402, lng: 10.1429 },
  Bizerte: { lat: 37.2744, lng: 9.8739 },
  Béja: { lat: 36.7256, lng: 9.1817 },
  Jendouba: { lat: 36.5011, lng: 8.7802 },
  'Le Kef': { lat: 36.1749, lng: 8.7049 },
  Siliana: { lat: 36.0849, lng: 9.3708 },
  Sousse: { lat: 35.8256, lng: 10.6369 },
  Monastir: { lat: 35.7643, lng: 10.8113 },
  Mahdia: { lat: 35.5047, lng: 11.0622 },
  Sfax: { lat: 34.7406, lng: 10.7603 },
  Kairouan: { lat: 35.6781, lng: 10.0963 },
  Kasserine: { lat: 35.1676, lng: 8.8365 },
  'Sidi Bouzid': { lat: 35.0382, lng: 9.4849 },
  Gabès: { lat: 33.8815, lng: 10.0982 },
  Médenine: { lat: 33.3549, lng: 10.5055 },
  Tataouine: { lat: 32.9297, lng: 10.4518 },
  Gafsa: { lat: 34.425, lng: 8.7842 },
  Tozeur: { lat: 33.9197, lng: 8.1335 },
  Kébili: { lat: 33.7044, lng: 8.969 },
}

export function slugify(text: string): string {
  return (
    text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06ff]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'fiche'
  )
}

export function locFr(value: unknown): string {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return String((value as Record<string, unknown>).fr ?? '').trim()
  }
  return String(value ?? '').trim()
}

export function youtubeIdFromUrl(raw: string): string {
  const value = raw.trim()
  if (!value) return ''
  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return value
  try {
    const url = new URL(value.startsWith('http') ? value : `https://${value}`)
    if (url.hostname.includes('youtu.be')) return url.pathname.slice(1).slice(0, 11)
    const v = url.searchParams.get('v')
    if (v) return v.slice(0, 11)
    const embed = url.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/)
    if (embed) return embed[1]
  } catch {
    /* plain id */
  }
  return value.slice(0, 11)
}

export function prepareCatalogDraft(draft: Record<string, unknown>): Record<string, unknown> {
  const next = { ...draft }

  if (typeof next.project === 'string' && PROJECT_SLUG_BY_LABEL[next.project]) {
    next.projectSlug = PROJECT_SLUG_BY_LABEL[next.project]
  }

  if ('slug' in next) {
    const fromTitle = slugify(locFr(next.title) || locFr(next.name) || String(next.firstName ?? ''))
    if (fromTitle && fromTitle !== 'fiche') next.slug = fromTitle
    else if (!String(next.slug ?? '').trim()) next.slug = `fiche-${Date.now().toString(36)}`
  }

  if (next.youtubeId != null) {
    next.youtubeId = youtubeIdFromUrl(String(next.youtubeId))
  }

  if (typeof next.governorate === 'string' && GOVERNORATE_COORDS[next.governorate]) {
    const coords = GOVERNORATE_COORDS[next.governorate]
    if (next.lat == null || next.lat === '' || Number(next.lat) === 0) next.lat = coords.lat
    if (next.lng == null || next.lng === '' || Number(next.lng) === 0) next.lng = coords.lng
  }

  return next
}

export async function uploadCatalogImage(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
  const res = await api.post('/admin/content/upload-image', { dataUrl, filename: file.name })
  return String(res.data.url ?? res.data.path ?? '')
}

type CatalogKind = 'news' | 'publications' | 'events' | 'opportunities' | 'stories' | 'videos' | 'initiatives'

export function catalogPublicPreviewUrl(
  kind: CatalogKind,
  row: Record<string, unknown>,
  publicSite = 'http://localhost:3030',
): string | null {
  const slug = String(row.slug ?? '').trim()
  const id = String(row.id ?? '').trim()
  const base = publicSite.replace(/\/$/, '')

  switch (kind) {
    case 'news':
      return slug ? `${base}/actualites/${slug}` : null
    case 'opportunities':
      return slug ? `${base}/opportunites/${slug}` : null
    case 'publications':
      return id ? `${base}/publications/${id}` : null
    case 'events':
      return id ? `${base}/agenda/${id}` : null
    case 'stories':
      return `${base}/stories`
    case 'videos':
      return `${base}/coin-media`
    case 'initiatives':
      return `${base}/carte`
    default:
      return null
  }
}
