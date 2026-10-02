/**
 * Prefix root-relative CMS URLs with the app path (`/fi2t` on preprod).
 * Admin BASE_URL is `/fi2t/admin/` so storage must not use BASE_URL alone.
 */
function appPrefix(): string {
  const fromEnv = (import.meta.env.VITE_APP_PREFIX as string | undefined)?.replace(/\/$/, '')
  if (fromEnv) return fromEnv

  const api = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, '')
  if (api?.endsWith('/api')) {
    const fromApi = api.slice(0, -4)
    if (fromApi) return fromApi
  }

  if (typeof window !== 'undefined') {
    const first = window.location.pathname.split('/').filter(Boolean)[0]
    if (first === 'fi2t') return '/fi2t'
  }

  return ''
}

export function publicUrl(path: string | undefined | null): string {
  if (!path?.trim()) return ''
  const url = path.trim()
  if (/^(data:|blob:)/i.test(url)) return url

  const prefix = appPrefix()

  if (/^https?:/i.test(url)) {
    if (!prefix || typeof window === 'undefined') return url
    try {
      const abs = new URL(url)
      if (abs.origin !== window.location.origin) return url
      if (abs.pathname.startsWith(`${prefix}/`)) return url
      return `${prefix}${abs.pathname}${abs.search}${abs.hash}`
    } catch {
      return url
    }
  }

  if (!url.startsWith('/')) return prefix ? `${prefix}/${url}` : url
  if (prefix && url.startsWith(`${prefix}/`)) return url
  return prefix ? `${prefix}${url}` : url
}
