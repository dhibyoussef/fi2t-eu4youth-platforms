import { useEditMode } from '../cms/EditModeProvider'
import { PROJECT_BANNERS, projectHeroMarkSrc } from '../data/projectBanners'
import type { Project } from '../data/types'
import { assetUrl } from '../lib/assetUrl'

/** Coloured hero field — title lines + large acronym (projet.pdf / projet banner.pdf). */
export function ProjectHero({ project }: { project: Project }) {
  const { locale } = useEditMode()
  const config = PROJECT_BANNERS[project.slug]
  // FR keeps designed multi-line comps from banners; EN/AR use CMS-localized fullName.
  const lines =
    locale === 'fr' && config.heroTitleLines?.length
      ? config.heroTitleLines
      : [project.fullName].filter(Boolean)
  const acronymRaw =
    locale === 'fr' && config.heroAcronym
      ? config.heroAcronym
      : project.acronym || config.heroAcronym || ''
  const acronym = locale === 'ar' ? acronymRaw : String(acronymRaw).toUpperCase()
  const watermark = assetUrl(projectHeroMarkSrc(project.slug, config.heroMark))
  return (
    <section
      className="pj-hero pj-hero--centered"
      aria-labelledby="pj-title"
    >
      <img className="pj-hero__watermark" src={watermark} alt="" aria-hidden="true" />
      <div className="pj-hero__content">
        <h1 id="pj-title" className="pj-hero__title">
          {lines.map((line) => (
            <span key={line} className="pj-hero__line">
              {line}
            </span>
          ))}
          <span className="pj-hero__acronym">{acronym}</span>
        </h1>
      </div>
    </section>
  )
}
