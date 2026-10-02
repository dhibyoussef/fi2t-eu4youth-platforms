import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  withCredentials: true,
})

function writeTokenCookie(token: string | null) {
  if (typeof document === 'undefined') return
  if (!token) {
    document.cookie = 'eu4y_token=; Path=/eu4youth; SameSite=Lax; Max-Age=0'
    return
  }
  document.cookie = `eu4y_token=${encodeURIComponent(token)}; Path=/eu4youth; SameSite=Lax; Max-Age=${8 * 3600}`
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('eu4y_token')
  if (token) {
    // Do not set Authorization: Bearer — on Prodexo that overrides nginx Basic Auth
    // and causes the browser login popup to loop. Token goes in a dedicated header.
    config.headers['X-EU4Y-Token'] = token
    if (config.headers.Authorization) delete config.headers.Authorization
    writeTokenCookie(token)
  }
  return config
})

export type Role = 'administrateur' | 'editeur' | 'contributeur' | 'communication'
export type CmsUser = {
  id: number
  email: string
  firstName: string
  lastName: string
  role: Role
  projectSlug: string | null
  permissions?: Record<string, boolean>
}
export type Locale = 'fr' | 'en' | 'ar'
export type Localized = Record<Locale, string>
export const LOCALES: Locale[] = ['fr', 'en', 'ar']
export const ROLE_LABEL: Record<Role, string> = {
  administrateur: 'Administrateur',
  editeur: 'Éditeur programme',
  contributeur: 'Contributeur projet',
  communication: 'Communication',
}
