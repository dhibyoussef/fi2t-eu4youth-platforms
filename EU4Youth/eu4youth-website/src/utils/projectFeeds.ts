import { EVENTS } from '../data/events'
import { NEWS } from '../data/news'
import { OPPORTUNITIES, opportunityStatus } from '../data/opportunities'
import type { ProjectFeedCardProps } from '../components/ProjectFeedCard'
import type { ProjectSlug } from '../data/types'

type Locale = 'fr' | 'en' | 'ar'

type FeedItem = {
  title?: string
  _localeOk?: boolean
  projectSlug?: string
  deadline?: string
  type?: unknown
  summary?: unknown
  deadlineLabel?: unknown
  locationLabel?: unknown
  slug?: string
  image?: string
  dateLabel?: unknown
  place?: unknown
  excerpt?: unknown
  cover?: string
  publishedAt?: string
  project?: unknown
  startsAt?: string
  location?: unknown
  id?: string | number
}

const FEED_ACTIONS = {
  fr: {
    call: "Voir l'appel",
    article: "Lire l'article",
    more: 'En savoir plus',
    archives: 'Voir les archives',
  },
  en: {
    call: 'View the call',
    article: 'Read the article',
    more: 'Learn more',
    archives: 'View archives',
  },
  ar: {
    call: 'عرض الدعوة',
    article: 'اقرأ المقال',
    more: 'اعرف المزيد',
    archives: 'عرض الأرشيف',
  },
} as const

function actionsFor(locale: Locale = 'fr') {
  return FEED_ACTIONS[locale] || FEED_ACTIONS.fr
}

/** Flatten CMS locale bags / nested objects so cards never show [object Object]. */
function asFeedText(value: unknown, locale: Locale = 'fr'): string {
  if (value == null) return ''
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  if (typeof value === 'object' && !Array.isArray(value)) {
    const bag = value as Record<string, unknown>
    const picked = bag[locale] ?? bag.fr ?? bag.en ?? bag.ar
    if (picked != null && picked !== value) return asFeedText(picked, locale)
  }
  return ''
}

/**
 * Prefer a locale-ready row when the catalogue mixed FR fallbacks with
 * translated rows; never drop the card entirely — same items in every locale.
 */
function pickLocaleItem(items: FeedItem[], locale: Locale): FeedItem | undefined {
  if (!items.length) return undefined
  if (locale === 'fr') return items[0]
  return items.find((item) => item._localeOk === true) ?? items[0]
}

export function pickProjectOpportunityFeed(
  slug: ProjectSlug,
  catalog: FeedItem[] = OPPORTUNITIES as unknown as FeedItem[],
  locale: Locale = 'fr',
): ProjectFeedCardProps | null {
  const open = catalog
    .filter((item) => item.projectSlug === slug)
    .sort((a, b) => String(b.deadline || '').localeCompare(String(a.deadline || '')))

  const ranked = [
    ...open.filter((entry) => opportunityStatus(entry as never) === 'Ouverte'),
    ...open.filter((entry) => opportunityStatus(entry as never) === 'À venir'),
    ...open,
  ]
  const item = pickLocaleItem(ranked.length ? [ranked[0]] : [], locale) ?? ranked[0]

  if (!item) return null

  const statusRaw = opportunityStatus(item as never)
  const statusLabel =
    locale === 'ar'
      ? statusRaw === 'Ouverte'
        ? 'مفتوحة'
        : statusRaw === 'À venir'
          ? 'قادمة'
          : 'مغلقة'
      : locale === 'en'
        ? statusRaw === 'Ouverte'
          ? 'Open'
          : statusRaw === 'À venir'
            ? 'Upcoming'
            : 'Closed'
        : statusRaw
  const copy = actionsFor(locale)
  const typeLabel = asFeedText(item.type, locale)
  return {
    variant: 'opportunity',
    accent: 'var(--pink)',
    title: asFeedText(item.title, locale),
    meta: `${typeLabel} · ${statusLabel}`,
    body: asFeedText(item.summary, locale),
    date: asFeedText(item.deadlineLabel, locale).toUpperCase(),
    location: asFeedText(item.locationLabel, locale),
    action: copy.call,
    to: `/opportunites/${String(item.slug || '')}`,
    logo: item.projectSlug as ProjectSlug | undefined,
    thumb: typeof item.image === 'string' ? item.image : '/img/home-hero-v2.webp',
  }
}

export function pickProjectNewsFeed(
  slug: ProjectSlug,
  catalog: FeedItem[] = NEWS as unknown as FeedItem[],
  locale: Locale = 'fr',
): ProjectFeedCardProps | null {
  const ranked = catalog
    .filter((entry) => entry.projectSlug === slug)
    .sort((a, b) =>
      String(b.publishedAt || '').localeCompare(String(a.publishedAt || '')),
    )
  const item = pickLocaleItem(ranked, locale)

  if (!item) return null

  const copy = actionsFor(locale)
  return {
    variant: 'news',
    accent: 'var(--orange)',
    title: asFeedText(item.title, locale),
    meta: asFeedText(item.project, locale),
    body: asFeedText(item.summary, locale),
    date: asFeedText(item.dateLabel, locale).toUpperCase(),
    action: copy.article,
    to: `/actualites/${String(item.slug || '')}`,
    thumb: typeof item.image === 'string' ? item.image : '/img/home-hero-v2.webp',
  }
}

export function pickProjectEventFeed(
  slug: ProjectSlug,
  catalog: FeedItem[] = EVENTS as unknown as FeedItem[],
  locale: Locale = 'fr',
): ProjectFeedCardProps | null {
  const today = new Date().toISOString().slice(0, 10)
  const forProject = catalog.filter((entry) => entry.projectSlug === slug)
  const upcoming = forProject
    .filter((entry) => String(entry.startsAt || '') >= today)
    .sort((a, b) => String(a.startsAt || '').localeCompare(String(b.startsAt || '')))

  const past = forProject
    .slice()
    .sort((a, b) => String(b.startsAt || '').localeCompare(String(a.startsAt || '')))

  const item = pickLocaleItem(upcoming.length ? upcoming : past, locale)

  if (!item) return null

  const copy = actionsFor(locale)
  const startsAt = String(item.startsAt || '')
  return {
    variant: 'event',
    accent: 'var(--teal)',
    title: asFeedText(item.title, locale),
    meta: asFeedText(item.project, locale),
    body: asFeedText(item.summary, locale),
    date: asFeedText(item.dateLabel, locale).toUpperCase(),
    location: asFeedText(item.location, locale),
    action: startsAt >= today ? copy.more : copy.archives,
    to: `/agenda/${String(item.id ?? '')}`,
    thumb: typeof item.image === 'string' ? item.image : '/img/home-hero-v2.webp',
  }
}
