import { useEffect, useRef, useState } from 'react'
import { PROJECT_BANNERS, type BannerPartnerLogo } from '../data/projectBanners'
import { useContent } from '../cms/ContentProvider'
import { useEditMode } from '../cms/EditModeProvider'
import { assetUrl } from '../lib/assetUrl'
import type { Project } from '../data/types'

type PartnerCluster = {
  items: BannerPartnerLogo[]
  caption?: string[]
}

type LocaleKey = 'fr' | 'en' | 'ar'

const CAPTION_KEYS = {
  eu: ['funder.eu_line1', 'funder.eu_line2'] as const,
  tn: ['funder.tn_line1', 'funder.tn_line2'] as const,
}

const SWAFY_DELEGATION = {
  fr: ["Délégation de l'Union européenne", 'en Tunisie'],
  en: ['Delegation of the European Union', 'to Tunisia'],
  ar: ['بعثة الاتحاد الأوروبي', 'في تونس'],
} as const

const FOOTNOTE_PREFIX = {
  fr: 'Projet financé par ',
  en: 'Project funded by ',
  ar: 'مشروع ممول من ',
} as const

function clusterPartners(partners: BannerPartnerLogo[]): PartnerCluster[] {
  const clusters: PartnerCluster[] = []
  for (const logo of partners) {
    const last = clusters.at(-1)
    if (logo.cluster && last?.items[0]?.cluster === logo.cluster) {
      last.items.push(logo)
      continue
    }
    clusters.push({
      items: [logo],
      caption: logo.clusterCaption,
    })
  }
  return clusters
}

function localizeCaption(
  caption: string[] | undefined,
  locale: LocaleKey,
  t: (key: string, fallback: string) => string,
): string[] | undefined {
  if (!caption?.length) return caption

  const joined = caption.join(' ')
  if (/délégation de l'union européenne/i.test(joined)) {
    return [...SWAFY_DELEGATION[locale]]
  }

  const isEu =
    /financé par|funded by|بتمويل من|union européenne|european union|الاتحاد الأوروبي/i.test(
      joined,
    )
  const isTn = /république tunisienne|republic of tunisia|الجمهورية التونسية/i.test(joined)

  if (isEu) {
    const line1 = t(CAPTION_KEYS.eu[0], 'Financé par')
    const line2 = t(CAPTION_KEYS.eu[1], "l'Union européenne")
    return [line1, line2]
  }
  if (isTn) {
    const line1 = t(CAPTION_KEYS.tn[0], 'République')
    const line2 = t(CAPTION_KEYS.tn[1], 'Tunisienne')
    return caption.length === 1 ? [`${line1} ${line2}`] : [line1, line2]
  }
  return caption
}

/** Project strip — sticky under the blue nav on project pages only. */
export function ProjectBannerStrip({ project }: { project: Project }) {
  const config = PROJECT_BANNERS[project.slug]
  const { t } = useContent()
  const { locale: rawLocale } = useEditMode()
  const locale: LocaleKey =
    rawLocale === 'en' || rawLocale === 'ar' ? rawLocale : 'fr'
  const clusters = clusterPartners(config.stripPartners)
  const anchorRef = useRef<HTMLDivElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const [pinned, setPinned] = useState(false)
  const [anchorHeight, setAnchorHeight] = useState(0)

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1100px)')
    const update = () => {
      const anchor = anchorRef.current
      const strip = stripRef.current
      if (!anchor || !strip) return
      if (!desktop.matches) {
        setPinned(false)
        setAnchorHeight(0)
        return
      }
      const nav = document.querySelector('.nav') as HTMLElement | null
      const pinTop = nav?.getBoundingClientRect().height ?? 0
      const shouldPin = anchor.getBoundingClientRect().top <= pinTop + 1
      setPinned(shouldPin)
      setAnchorHeight(shouldPin ? strip.offsetHeight : 0)
      if (shouldPin) {
        strip.style.top = `${Math.round(pinTop)}px`
      } else {
        strip.style.top = ''
      }
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    desktop.addEventListener('change', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      desktop.removeEventListener('change', update)
    }
  }, [project.slug])

  const labelAfter = Math.min(
    Math.max(config.stripLabelAfter ?? clusters.length, 0),
    clusters.length,
  )
  const beforeLabel = clusters.slice(0, labelAfter)
  const afterLabel = clusters.slice(labelAfter)

  const renderLogo = (logo: BannerPartnerLogo) => (
    <img
      key={`${logo.src}-${logo.alt}`}
      className="pj-strip__logo"
      src={assetUrl(logo.src)}
      alt={logo.alt}
      loading="eager"
      decoding="async"
    />
  )

  const renderCluster = (cluster: PartnerCluster, index: number) => {
    const first = cluster.items[0]
    const rawCaption = cluster.caption ?? (cluster.items.length === 1 ? first.caption : undefined)
    const caption = localizeCaption(rawCaption, locale, t)
    const extraWide = cluster.items.some((item) => item.extraWide)
    const wide = cluster.items.some((item) => item.wide)
    const grouped = cluster.items.length > 1
    const className = [
      'pj-strip__partner',
      caption?.length ? 'pj-strip__partner--caption' : '',
      extraWide ? 'pj-strip__partner--extra-wide' : '',
      wide && !extraWide ? 'pj-strip__partner--wide' : '',
      grouped ? 'pj-strip__partner--cluster' : '',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <li key={`${first.src}-${index}`} className={className}>
        {grouped ? (
          <div className="pj-strip__cluster-row">{cluster.items.map(renderLogo)}</div>
        ) : (
          renderLogo(first)
        )}
        {caption?.length ? (
          <span className="pj-strip__caption" dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale}>
            {caption.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </span>
        ) : null}
      </li>
    )
  }

  return (
    <div className="pj-strip-anchor" ref={anchorRef} style={{ height: anchorHeight || undefined }}>
      <div className={pinned ? 'pj-strip pj-strip--pinned' : 'pj-strip'} ref={stripRef}>
        <div className="pj-strip__inner">
          <div className="pj-strip__partners-block">
            <ul className="pj-strip__partners">
              {beforeLabel.map(renderCluster)}
              {config.stripLabel ? (
                <li className="pj-strip__partner pj-strip__partner--label">
                  <p className="pj-strip__label">{config.stripLabel}</p>
                </li>
              ) : null}
              {afterLabel.map((cluster, index) => renderCluster(cluster, index + beforeLabel.length))}
            </ul>
            {config.stripFootnote ? (
              <p className="pj-strip__footnote" dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale}>
                {project.fundingNote
                  ? `${FOOTNOTE_PREFIX[locale]}${String(project.fundingNote).replace(
                      /^(Projet financé par|Project funded by|مشروع ممول من)\s+/i,
                      '',
                    )}`
                  : config.stripFootnote}
              </p>
            ) : null}
          </div>

          <div className="pj-strip__identity">
            <img
              className="pj-strip__mark"
              src={assetUrl(`/img/logo-${project.slug}.png`)}
              alt={project.acronym}
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
