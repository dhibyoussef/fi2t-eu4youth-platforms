/** Parse a CMS JSON list that may be a bare array or `{ fr, en, ar }` bags. */
export function parseLocaleJsonList(
  raw: string,
  locale = 'fr',
): Record<string, unknown>[] | null {
  try {
    const parsed = JSON.parse(raw) as unknown
    const bag = parsed as { fr?: unknown[]; en?: unknown[]; ar?: unknown[] }
    const key = locale === 'en' || locale === 'ar' ? locale : 'fr'
    const list = Array.isArray(parsed)
      ? parsed
      : Array.isArray(bag?.[key])
        ? bag[key]
        : Array.isArray(bag?.fr)
          ? bag.fr
          : null
    return list as Record<string, unknown>[] | null
  } catch {
    return null
  }
}

export function parseLocaleJsonItems<T extends Record<string, string>>(
  raw: string,
  fallback: T[],
  locale = 'fr',
): T[] {
  const list = parseLocaleJsonList(raw, locale)
  if (!list?.length) return fallback
  return list.map(
    (row) =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => [key, value == null ? '' : String(value)]),
      ) as T,
  )
}
