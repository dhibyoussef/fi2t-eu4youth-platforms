import { type CSSProperties, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../cms/ContentProvider'
import { assetUrl } from '../lib/assetUrl'
import './project-logos.css'

/** One logo's place in a strip, in design px, measured from the ink box of the
 *  watermark the comp prints there. */
export interface LogoCell {
  slug: string
  name: string
  x: number
  y: number
  w: number
  h: number
}

const rem = (designPx: number) => `${designPx / 10}rem`

function logoOverrides(raw: string): Record<string, string> {
  try {
    const parsed = JSON.parse(raw)
    const list = Array.isArray(parsed) ? parsed : []
    return Object.fromEntries(
      list
        .filter((row: { slug?: string; image?: string }) => row.slug && row.image)
        .map((row: { slug: string; image: string }) => [row.slug, row.image]),
    )
  } catch {
    return {}
  }
}

/**
 * The six project logos, as the comp prints them and as they behave.
 *
 * Accueil shows them as grey watermarks with one, Jeun'ESS, in colour — the odd
 * one out because its pictogram is a raster image and so escaped the greying.
 * Read as an instruction rather than an inconsistency, that is the hover state,
 * so each logo greys at rest and comes up in its real colours when pointed at,
 * and each is a link to its own project rather than one blanket hit area.
 *
 * Each cell is exactly the watermark's ink box, which is also the box the grey art
 * is cropped to, so the art fills it and the two strips register on the comp. The
 * cell used to be inflated 8px on every side to cover the printed watermark
 * underneath, with the art inset by the same 8px to pull it back onto the ink —
 * neither is needed now that both bands are drawn in CSS.
 */
export default function ProjectLogos({
  cells,
  onNavigate,
  /* Which resting art to draw. The bands on white print these as grey watermarks; the footer
     prints them in white on its blue, with parts of each mark knocked out for the band to show
     through, so it needs its own art rather than a tint of the grey. Both sets are cropped to
     the same ink boxes, so a cell fits either. */
  rest = 'grey',
  variant = 'default',
}: {
  cells: readonly LogoCell[]
  onNavigate?: () => void
  rest?: 'grey' | 'white'
  variant?: 'default' | 'footer'
}) {
  const { get } = useContent()
  const listRef = useRef<HTMLUListElement>(null)
  const bySlug = logoOverrides(get('projets.logos', '') || get('logos.items', '[]'))
  const restArt = (slug: string) =>
    rest === 'white' ? `/img/logo-${slug}-white.webp` : `/img/logo-${slug}-grey.png`

  const colourArt = (slug: string) =>
    bySlug[slug] || get(`logos.${slug}`, `/img/logo-${slug}.png`)

  const footerArt = (slug: string) => `/img/logo-${slug}-white.webp`
  const footerColourArt = (slug: string) => `/img/logo-${slug}-footer.webp`

  useEffect(() => {
    if (variant !== 'footer') return
    const node = listRef.current
    if (!node) return

    const reveal = () => {
      node.classList.add('logos--inview')
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reveal()
      return
    }

    const isVisible = () => {
      const rect = node.getBoundingClientRect()
      return rect.top < window.innerHeight && rect.bottom > 0
    }

    if (isVisible()) {
      reveal()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        reveal()
        observer.disconnect()
      },
      // Fire as soon as any part enters the viewport (footer logos sit near the page end).
      { threshold: 0.01, rootMargin: '0px 0px 20% 0px' },
    )
    observer.observe(node)

    const onScrollOrResize = () => {
      if (!isVisible()) return
      reveal()
      observer.disconnect()
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
    }
    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [variant])

  return (
    <ul
      ref={listRef}
      className={`logos${variant === 'footer' ? ' logos--footer' : ''}`}
    >
      {cells.map((cell) => (
        <li key={cell.slug}>
          <Link
            to={`/projets/${cell.slug}`}
            className="logos__cell"
            onClick={onNavigate}
            style={
              {
                left: rem(cell.x),
                top: rem(cell.y),
                width: rem(cell.w),
                height: rem(cell.h),
                /* Kept as plain numbers so a strip can also be laid out as a share
                   of the window instead of the canvas — see the nav's logos panel. */
                '--cell-x': cell.x,
                '--cell-w': cell.w,
              } as CSSProperties
            }
          >
            {variant === 'footer' ? (
              <>
                <img
                  className="logos__footer logos__footer--rest"
                  src={assetUrl(footerArt(cell.slug))}
                  alt=""
                  onError={(event) => {
                    const img = event.currentTarget
                    const fallback = assetUrl(`/img/logo-${cell.slug}.png`)
                    if (img.src !== fallback) img.src = fallback
                  }}
                />
                <img
                  className="logos__footer logos__footer--colour"
                  src={assetUrl(footerColourArt(cell.slug))}
                  alt=""
                  onError={(event) => {
                    const img = event.currentTarget
                    const fallback = assetUrl(colourArt(cell.slug))
                    if (img.src !== fallback) img.src = fallback
                  }}
                />
              </>
            ) : (
              <>
                <img className="logos__grey" src={assetUrl(restArt(cell.slug))} alt="" />
                <img className="logos__colour" src={assetUrl(colourArt(cell.slug))} alt="" />
              </>
            )}
            <span className="sr-only">{cell.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
