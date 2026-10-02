/**
 * Prefix root-relative URLs so they work when the site is served under `/fi2t/`.
 *
 * Cause of broken images on preprod: Vite was built with BASE `/` while nginx
 * mounts the app at `/fi2t/`. CMS values like `/images/foo.jpg` then hit
 * `https://host/images/foo.jpg` (404) instead of `/fi2t/images/foo.jpg` (200).
 */
function appPrefix(): string {
  const fromEnv = (import.meta.env.VITE_APP_PREFIX as string | undefined)?.replace(/\/$/, '')
  if (fromEnv) return fromEnv

  const api = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, '')
  if (api?.endsWith('/api')) {
    const fromApi = api.slice(0, -4)
    if (fromApi) return fromApi
  }

  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
  if (base && base !== '/' && base !== '.') {
    return base.startsWith('/') ? base : `/${base}`
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
  const prefix = appPrefix()

  if (/^(data:|blob:)/i.test(url)) return url

  if (/^https?:/i.test(url)) {
    if (!prefix || typeof window === 'undefined') return url
    try {
      const abs = new URL(url)
      if (abs.origin !== window.location.origin) return url
      if (prefix && abs.pathname.startsWith(`${prefix}/`)) return url
      return `${prefix}${abs.pathname}${abs.search}${abs.hash}`
    } catch {
      return url
    }
  }

  if (!url.startsWith('/')) {
    return prefix ? `${prefix}/${url}`.replace(/\/{2,}/g, '/') : url
  }
  if (!prefix) return url
  if (url.startsWith(`${prefix}/`)) return url
  return `${prefix}${url}`
}
