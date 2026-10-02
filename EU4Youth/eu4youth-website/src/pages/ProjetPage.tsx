import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { Link, Navigate, useParams } from 'react-router-dom'
import { PROJECTS as PROJECTS_FALLBACK } from '../data/projects'
import { EVENTS as EVENTS_FALLBACK } from '../data/events'
import { NEWS as NEWS_FALLBACK } from '../data/news'
import { OPPORTUNITIES as OPPORTUNITIES_FALLBACK } from '../data/opportunities'
import { MAP_SHAPES, MAP_VIEWBOX } from '../data/tunisia'
import { useCatalogQuery } from '../cms/useCatalog'
import { useContent } from '../cms/ContentProvider'
import { useEditMode } from '../cms/EditModeProvider'
import { EditableText } from '../cms/EditableText'
import { CmsSection } from '../cms/EditableImage'
import ComposanteMark from '../components/ComposanteMark'
import { ProjectBannerStrip } from '../components/ProjectBannerStrip'
import { ProjectFeedCard } from '../components/ProjectFeedCard'
import { ProjectHero } from '../components/ProjectHero'
import { hasComposanteMark } from '../components/composanteMarkSvg'
import {
  pickProjectEventFeed,
  pickProjectNewsFeed,
  pickProjectOpportunityFeed,
} from '../utils/projectFeeds'
import './projet.css'

const [, , MAP_W, MAP_H] = MAP_VIEWBOX.split(' ').map(Number)

function Pencil({
  section,
  field,
  fallback,
  label,
  className = 'pj-pencil',
}: {
  section: string
  field: string
  fallback: string
  label?: string
  className?: string
}) {
  return (
    <EditableText
      chipOnly
      className={className}
      section={section}
      field={field}
      fallback={fallback}
      label={label}
    />
  )
}

type ComponentDetail = (typeof PROJECTS_FALLBACK)[number]['components'][number]
type LocaleKey = 'fr' | 'en' | 'ar'

const COMPOSANTE_UI = {
  fr: {
    results: 'RÉSULTATS CLÉS',
    sectors: 'SECTEURS D’ACTIVITÉS',
    close: 'Fermer',
  },
  en: {
    results: 'KEY RESULTS',
    sectors: 'ACTIVITY SECTORS',
    close: 'Close',
  },
  ar: {
    results: 'النتائج الرئيسية',
    sectors: 'قطاعات النشاط',
    close: 'إغلاق',
  },
} as const

function asDisplayText(value: unknown, locale = 'fr'): string {
  if (value == null) return ''
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'object' && !Array.isArray(value)) {
    const rec = value as Record<string, unknown>
    const picked = rec[locale] ?? rec.fr ?? rec.en ?? rec.ar ?? ''
    return typeof picked === 'string' ? picked.trim() : String(picked || '').trim()
  }
  return String(value).trim()
}

/** A result line: big figure (project colour) plus wording. */
const splitResult = (line: string) => {
  const match = line.match(/^([\d\s.,]+)\s+(.*)$/)
  return match ? { figure: match[1].trim(), rest: match[2] } : { figure: '', rest: line }
}

function ComposanteCard({
  detail,
  locale = 'fr',
}: {
  detail: ComponentDetail
  locale?: LocaleKey
}) {
  const ui = COMPOSANTE_UI[locale] || COMPOSANTE_UI.fr
  return (
    <article className="pj-card">
      {detail.mark ? (
        <img className="pj-card__mark" src={detail.mark} alt="" aria-hidden="true" />
      ) : null}
      <h3>{detail.name}</h3>
      <p className="pj-card__tagline">{detail.tagline}</p>
      <p>{detail.description}</p>

      {detail.results.length > 0 && (
        <>
          <h4>{ui.results}</h4>
          <ul className="pj-card__results">
            {detail.results.map((line) => {
              const { figure, rest: wording } = splitResult(line)
              return (
                <li key={line}>
                  {figure && <b>{figure}</b>}
                  <span>{wording}</span>
                </li>
              )
            })}
          </ul>
        </>
      )}

      {detail.sectors.length > 0 && (
        <>
          <h4>{ui.sectors}</h4>
          <ul className="pj-card__sectors">
            {detail.sectors.map((sector) => (
              <li key={sector}>{sector}</li>
            ))}
          </ul>
        </>
      )}
    </article>
  )
}

function ComposanteSheet({
  detail,
  onClose,
  style,
  locale = 'fr',
}: {
  detail: ComponentDetail
  onClose: () => void
  style?: React.CSSProperties
  locale?: LocaleKey
}) {
  const ui = COMPOSANTE_UI[locale] || COMPOSANTE_UI.fr
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    const previousOverflow = document.body.style.overflow
    const previousPadding = document.body.style.paddingRight
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${scrollbar}px`
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPadding
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return createPortal(
    <div
      className="pj-sheet"
      style={style}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="pj-sheet__card" role="dialog" aria-modal="true" aria-labelledby="pj-sheet-title">
        <button type="button" className="pj-sheet__close" onClick={onClose} aria-label={ui.close}>
          ×
        </button>
        <div id="pj-sheet-title" className="sr-only">
          {detail.name}
        </div>
        <div key={detail.name} className="pj-card-stage">
          <ComposanteCard detail={detail} locale={locale} />
        </div>
      </div>
    </div>,
    document.body,
  )
}

const desktopLayout = () =>
  typeof window !== 'undefined' && window.matchMedia('(min-width: 1100px)').matches

/** Jeun'ESS projet.pdf — five marked mechanisms only; other projects keep all.
 *  CMS catalog often omits `mark` paths — restore them from the static fallback. */
function visibleComponentsFor(
  slug: string | undefined,
  components: ComponentDetail[],
): ComponentDetail[] {
  const fallback = PROJECTS_FALLBACK.find((item) => item.slug === slug)?.components || []
  const withMarks = components.map((item) => {
    if (item.mark) return item
    const key = item.name.toLowerCase()
    const exact = fallback.find((f) => f.name.toLowerCase() === key && f.mark)
    if (exact?.mark) return { ...item, mark: exact.mark }
    const loose = fallback.find(
      (f) =>
        f.mark &&
        (key.includes(f.name.toLowerCase()) ||
          f.name.toLowerCase().includes(key) ||
          key.replace(/[^a-z0-9]/g, '').includes(f.name.toLowerCase().replace(/[^a-z0-9]/g, ''))),
    )
    return loose?.mark ? { ...item, mark: loose.mark } : item
  })
  if (slug !== 'jeuness') return withMarks
  const marked = withMarks.filter((item) => Boolean(item.mark))
  return marked.length > 0 ? marked : withMarks
}

function defaultComposanteIndex(components: ComponentDetail[]) {
  const limitl = components.findIndex((item) => /LIMITL/i.test(item.name))
  return limitl >= 0 ? limitl : 0
}

export default function ProjetPage() {
  const { slug } = useParams()
  const { get } = useContent()
  const { locale: rawLocale } = useEditMode()
  const locale: LocaleKey =
    rawLocale === 'en' || rawLocale === 'ar' ? rawLocale : 'fr'
  const { items: PROJECTS, ready } = useCatalogQuery('projects', PROJECTS_FALLBACK)
  const { items: OPPORTUNITIES } = useCatalogQuery('opportunities', OPPORTUNITIES_FALLBACK)
  const { items: NEWS } = useCatalogQuery('news', NEWS_FALLBACK)
  const { items: EVENTS } = useCatalogQuery('events', EVENTS_FALLBACK)
  const project = PROJECTS.find((item) => item.slug === slug)
  /** Jeun'ESS-style hero (no territory map). Keep for all project pages. */
  const isJeunessLayout = true

  const [openObjectifs, setOpenObjectifs] = useState<'general' | 'specifiques'>('general')
  const [composante, setComposante] = useState(() => {
    const match = PROJECTS_FALLBACK.find((item) => item.slug === slug)
    return defaultComposanteIndex(visibleComponentsFor(slug, match?.components ?? []))
  })
  const [composanteSheetOpen, setComposanteSheetOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(desktopLayout)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1100px)')
    const onChange = () => setIsDesktop(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const match = PROJECTS.find((item) => item.slug === slug)
    setComposante(defaultComposanteIndex(visibleComponentsFor(slug, match?.components ?? [])))
    setComposanteSheetOpen(false)
  }, [PROJECTS, slug])

  const governorates = useMemo(
    () => project?.governorates?.filter((name) => name !== 'Présence nationale') ?? [],
    [project],
  )

  if (!ready && !project) return null
  if (!project) return <Navigate to="/projets" replace />

  const components = visibleComponentsFor(project.slug, project.components || [])
  const national = project.governorates?.includes('Présence nationale')
  const lit = national ? MAP_SHAPES.map((shape) => shape.name) : governorates
  const [lead, ...rest] = project.presentation || []
  const detail = components[composante]
  const showMap = !isJeunessLayout
  /* Show the first follow-up paragraph by default (client copy e.g. Vision ANETI 2030). */
  const visibleRest = expanded ? rest : rest.slice(0, 1)

  const territoryLabel =
    locale === 'ar' ? 'التغطية الجغرافية' : locale === 'en' ? 'Geographic coverage' : 'Couverture géographique'
  const territoryValue =
    asDisplayText(project.territory, locale) ||
    (project.governorates || []).filter((g) => g !== 'Présence nationale').join(locale === 'ar' ? '، ' : ', ')

  const fiche = [
    { key: 'fullName', label: get('fiche.fullName', 'Nom complet'), value: project.fullName },
    { key: 'acronym', label: get('fiche.acronym', 'Acronyme'), value: project.acronym },
    { key: 'period', label: get('fiche.period', 'Durée'), value: project.period },
    {
      key: 'funding',
      label: get('fiche.funding', 'Financement'),
      value:
        asDisplayText(project.fundingNote, locale)?.replace(
          /^(Projet financé par|Project funded by|مشروع ممول من)\s+/i,
          '',
        ) ||
        (locale === 'ar' ? 'الاتحاد الأوروبي' : locale === 'en' ? 'European Union' : 'Union européenne'),
    },
    { key: 'implementer', label: get('fiche.implementer', 'Mise en œuvre'), value: project.partner },
    ...(territoryValue
      ? [{ key: 'territory', label: get('fiche.territory', territoryLabel), value: territoryValue }]
      : []),
    { key: 'sectors', label: get('fiche.sectors', "Secteurs\nd'intervention"), value: project.sectors },
  ]

  const opportunityFeed = pickProjectOpportunityFeed(
    project.slug,
    OPPORTUNITIES as unknown as Parameters<typeof pickProjectOpportunityFeed>[1],
    locale,
  )
  const newsFeed = pickProjectNewsFeed(
    project.slug,
    NEWS as unknown as Parameters<typeof pickProjectNewsFeed>[1],
    locale,
  )
  const eventFeed = pickProjectEventFeed(
    project.slug,
    EVENTS as unknown as Parameters<typeof pickProjectEventFeed>[1],
    locale,
  )
  const impactIntro = asDisplayText(project.impactIntro)

  const ficheBlock = (
    <CmsSection id="fiche" className="pj-fiche" as="div">
      <dl>
        {fiche.map((row) => (
          <div key={row.key}>
            <dt>
              {row.label}
              <Pencil section="fiche" field={row.key} fallback={row.label} label={row.label} />
            </dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </CmsSection>
  )

  const objectifsBlock = (
    <CmsSection id="objectifs" className="pj-objectifs" labelledBy="pj-objectifs-title">
      <div className="pj-objectifs__head">
        <EditableText
          as="h2"
          id="pj-objectifs-title"
          section="objectifs"
          field="title"
          fallback="OBJECTIFS"
        />
        <div className="pj-tabs" role="tablist" aria-label="Objectifs du projet">
          <button
            type="button"
            role="tab"
            id="pj-tab-general"
            aria-selected={openObjectifs === 'general'}
            aria-controls="pj-panel-general"
            className={openObjectifs === 'general' ? 'pj-tab pj-tab--on' : 'pj-tab'}
            onClick={() => setOpenObjectifs('general')}
          >
            <EditableText section="objectifs" field="tabGeneral" fallback="Objectif général" as="span" />
          </button>
          <button
            type="button"
            role="tab"
            id="pj-tab-specifiques"
            aria-selected={openObjectifs === 'specifiques'}
            aria-controls="pj-panel-specifiques"
            className={openObjectifs === 'specifiques' ? 'pj-tab pj-tab--on' : 'pj-tab'}
            onClick={() => setOpenObjectifs('specifiques')}
          >
            <EditableText
              section="objectifs"
              field="tabSpecifiques"
              fallback="Objectifs spécifiques"
              as="span"
            />
          </button>
        </div>
      </div>

      {openObjectifs === 'general' ? (
        <div
          className="pj-panel"
          role="tabpanel"
          id="pj-panel-general"
          aria-labelledby="pj-tab-general"
        >
          <h3>
            <EditableText section="objectifs" field="generalHeading" fallback="OBJECTIF GÉNÉRAL" as="span" />
          </h3>
          <p>{project.generalObjective}</p>
        </div>
      ) : (
        <div
          className="pj-panel"
          role="tabpanel"
          id="pj-panel-specifiques"
          aria-labelledby="pj-tab-specifiques"
        >
          <h3>
            <EditableText
              section="objectifs"
              field="specificHeading"
              fallback="OBJECTIFS SPÉCIFIQUES"
              as="span"
            />
          </h3>
          <ol className="pj-panel__list">
            {project.specificObjectives.map((objective, index) => (
              <li key={objective}>
                <span aria-hidden="true">{`0${index + 1}`}</span>
                {objective}
              </li>
            ))}
          </ol>
        </div>
      )}
    </CmsSection>
  )

  const composantesBlock =
    components.length > 0 && detail ? (
      <CmsSection id="composantes" className="pj-composantes" labelledBy="pj-composantes-title">
        <EditableText
          as="h2"
          id="pj-composantes-title"
          section="composantes"
          field="title"
          fallback="COMPOSANTES"
        />

        <ul
          className={`pj-composantes__picks${
            components.some((item) => hasComposanteMark(project.theme, item.name, item.mark))
              ? ' pj-composantes__picks--marks'
              : ''
          }`}
          aria-label="Composantes du projet"
        >
          {components.map((item, index) => (
            <li key={item.name}>
              <button
                type="button"
                aria-pressed={index === composante}
                aria-haspopup="dialog"
                aria-label={item.name}
                className={`pj-pick${index === composante ? ' pj-pick--on' : ''}`}
                onClick={() => {
                  setComposante(index)
                  /* Jeun'ESS (projet.pdf): detail opens in popup only — no inline card. */
                  setComposanteSheetOpen(isJeunessLayout || !isDesktop)
                }}
              >
                <ComposanteMark theme={project.theme} name={item.name} markUrl={item.mark} />
              </button>
            </li>
          ))}
        </ul>

        {detail && !composanteSheetOpen && !isJeunessLayout ? (
          <div key={detail.name} className="pj-card-stage">
            <ComposanteCard detail={detail} locale={locale} />
          </div>
        ) : null}
      </CmsSection>
    ) : null

  const impactBlock =
    project.kpis.length > 0 ? (
      <CmsSection id="impact" className="pj-impact" labelledBy="pj-impact-title">
        <EditableText
          as="h2"
          id="pj-impact-title"
          section="impact"
          field="title"
          fallback={`IMPACT GLOBAL DU PROJET ${project.acronym.toUpperCase()}`}
        />
        {impactIntro ? <p className="pj-impact__intro">{impactIntro}</p> : null}
        <ul
          className={
            project.kpis.length <= 2 ? 'pj-impact__grid pj-impact__grid--rows' : 'pj-impact__grid'
          }
        >
          {project.kpis.map((kpi) => (
            <li key={kpi.label}>
              <span className="pj-impact__value">{kpi.value}</span>
              <span className="pj-impact__label">{kpi.label}</span>
            </li>
          ))}
        </ul>
      </CmsSection>
    ) : null

  const feedsBlock = (
    <CmsSection id="feeds" className="pj-feeds">
      <article>
        <EditableText
          as="h2"
          section="feeds"
          field="oppsTitle"
          fallback={'OPPORTUNITÉS\nEN COURS'}
        />
        {opportunityFeed ? <ProjectFeedCard {...opportunityFeed} /> : null}
        <Link className="pj-feeds__cta pj-feeds__cta--pink" to="/opportunites">
          <EditableText
            as="span"
            multiline={false}
            section="feeds"
            field="oppsCta"
            fallback="Voir toutes les opportunités"
          />
          <svg className="chev2" viewBox="0 0 28 26" aria-hidden="true" focusable="false"><polyline points="2,2 12,13 2,24" fill="none" stroke="currentColor" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" /><polyline points="15,2 25,13 15,24" fill="none" stroke="currentColor" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
      </article>
      <article>
        <EditableText
          as="h2"
          section="feeds"
          field="newsTitle"
          fallback={'DERNIÈRES\nACTUALITÉS'}
        />
        {newsFeed ? <ProjectFeedCard {...newsFeed} /> : null}
        <Link className="pj-feeds__cta pj-feeds__cta--orange" to="/actualites">
          <EditableText
            as="span"
            multiline={false}
            section="feeds"
            field="newsCta"
            fallback="Voir toutes les actualités"
          />
          <svg className="chev2" viewBox="0 0 28 26" aria-hidden="true" focusable="false"><polyline points="2,2 12,13 2,24" fill="none" stroke="currentColor" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" /><polyline points="15,2 25,13 15,24" fill="none" stroke="currentColor" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
      </article>
      <article>
        <EditableText
          as="h2"
          section="feeds"
          field="eventsTitle"
          fallback={'PROCHAINS\nÉVÉNEMENTS'}
        />
        {eventFeed ? <ProjectFeedCard {...eventFeed} /> : null}
        <Link className="pj-feeds__cta pj-feeds__cta--teal" to="/agenda">
          <EditableText
            as="span"
            multiline={false}
            section="feeds"
            field="eventsCta"
            fallback="Voir l’agenda complet"
          />
          <svg className="chev2" viewBox="0 0 28 26" aria-hidden="true" focusable="false"><polyline points="2,2 12,13 2,24" fill="none" stroke="currentColor" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" /><polyline points="15,2 25,13 15,24" fill="none" stroke="currentColor" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
      </article>
    </CmsSection>
  )

  const storiesBlock = (
    <CmsSection id="stories" className="pj-stories" labelledBy="pj-stories-title">
      <img className="pj-stories__graffiti" src="/img/art-graffiti.webp" alt="" aria-hidden="true" />
      <div className="pj-stories__copy">
        <EditableText
          as="p"
          className="pj-stories__eyebrow"
          section="stories"
          field="eyebrow"
          fallback="HISTOIRE DU MOIS"
        />
        <EditableText
          as="h2"
          id="pj-stories-title"
          section="stories"
          field="title"
          fallback={'DES JEUNES QUI AGISSENT.\nDES TERRITOIRES QUI\nCHANGENT.'}
        />
        <Link className="btn btn--line-pink" to="/stories">
          <EditableText
            as="span"
            multiline={false}
            section="stories"
            field="cta"
            fallback="Découvrir toutes les stories"
          />
          <svg className="chev2" viewBox="0 0 28 26" aria-hidden="true" focusable="false"><polyline points="2,2 12,13 2,24" fill="none" stroke="currentColor" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" /><polyline points="15,2 25,13 15,24" fill="none" stroke="currentColor" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
      </div>
    </CmsSection>
  )

  const ressourcesBlock = (
    <CmsSection id="ressources" className="pj-ressources" labelledBy="pj-ressources-title">
      <div>
        <EditableText
          as="h2"
          id="pj-ressources-title"
          section="ressources"
          field="title"
          fallback="RESSOURCES"
        />
        <Link className="btn btn--line-white" to="/publications">
          <EditableText
            as="span"
            multiline={false}
            section="ressources"
            field="cta"
            fallback="Accéder à toutes les publications"
          />
          <svg className="chev2" viewBox="0 0 28 26" aria-hidden="true" focusable="false"><polyline points="2,2 12,13 2,24" fill="none" stroke="currentColor" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" /><polyline points="15,2 25,13 15,24" fill="none" stroke="currentColor" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
      </div>
      <img src="/img/art-pile-livres.webp" alt="" aria-hidden="true" />
    </CmsSection>
  )

  return (
    <div
      className="page page--projet page--projet-jeuness"
      data-theme={project.theme}
      style={{
        '--project-colour': `var(--p-${project.theme})`,
        '--project-soft': `var(--p-${project.theme}-soft, #f7e7c8)`,
        '--project-text': `var(--p-${project.theme}-text, var(--p-${project.theme}))`,
        '--project-on': `var(--p-${project.theme}-on, var(--white))`,
      } as CSSProperties}
    >
      <ProjectBannerStrip project={project} />
      <ProjectHero project={project} />

      <CmsSection id="intro" className="pj-intro" labelledBy="pj-intro-title">
        <div className={`pj-intro__grid${showMap ? '' : ' pj-intro__grid--copy-only'}`}>
          <div className="pj-intro__copy">
            <p id="pj-intro-title">{lead}</p>
            {visibleRest.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {rest.length > 1 && (
              <button type="button" className="pj-more" onClick={() => setExpanded(!expanded)}>
                {expanded
                  ? get(
                      'intro.collapse',
                      locale === 'ar' ? 'تقليص' : locale === 'en' ? 'Show less' : 'Réduire',
                    )
                  : get(
                      'intro.readMore',
                      locale === 'ar' ? 'اقرأ المزيد' : locale === 'en' ? 'Read more' : 'Lire la suite',
                    )}
              </button>
            )}
          </div>

          {showMap ? (
            <div className="pj-map">
              <div className="pj-map__plate" role="presentation">
                <svg
                  viewBox={MAP_VIEWBOX}
                  preserveAspectRatio="xMidYMid meet"
                  role="img"
                  aria-label={
                    national
                      ? `${project.acronym} : présence sur l'ensemble du territoire`
                      : `Gouvernorats ciblés : ${governorates.join(', ')}`
                  }
                >
                  {MAP_SHAPES.map((shape, index) => {
                    const isLit = lit.includes(shape.name)
                    return (
                      <path
                        key={`${shape.name}-${index}`}
                        className={`pj-map__gov${isLit ? ' pj-map__gov--on' : ''}`}
                        d={shape.d}
                      />
                    )
                  })}
                </svg>

                {!national &&
                  MAP_SHAPES.filter((shape) => shape.label && governorates.includes(shape.name)).map(
                    (shape) => (
                      <span
                        key={shape.name}
                        className="pj-map__label"
                        style={{
                          left: `${(shape.cx / MAP_W) * 100}%`,
                          top: `${(shape.cy / MAP_H) * 100}%`,
                        }}
                      >
                        {shape.name.toUpperCase()}
                      </span>
                    ),
                  )}
              </div>
              <p className="pj-map__readout">{asDisplayText(project.territory, locale)}</p>
            </div>
          ) : null}
        </div>

        {isJeunessLayout ? ficheBlock : null}
      </CmsSection>

      {!isJeunessLayout ? (
        <CmsSection id="presentation" className="pj-presentation" labelledBy="pj-presentation-title">
          <EditableText
            as="h2"
            id="pj-presentation-title"
            section="presentation"
            field="title"
            fallback={'PRÉSENTATION\nDU PROJET'}
          />
          {ficheBlock}
        </CmsSection>
      ) : null}

      {/* projet.pdf order for Jeun'ESS: impact → objectifs → composantes → stories → feeds → ressources */}
      {isJeunessLayout ? (
        <>
          {impactBlock}
          {objectifsBlock}
          {composantesBlock}
          {composanteSheetOpen && detail ? (
            <ComposanteSheet
              detail={detail}
              locale={locale}
              onClose={() => setComposanteSheetOpen(false)}
              style={{
              '--project-colour': `var(--p-${project.theme})`,
              '--project-soft': `var(--p-${project.theme}-soft, #f7e7c8)`,
              '--project-text': `var(--p-${project.theme}-text, var(--p-${project.theme}))`,
              '--project-on': `var(--p-${project.theme}-on, var(--white))`,
            } as CSSProperties} />
          ) : null}
          {storiesBlock}
          {feedsBlock}
          {ressourcesBlock}
        </>
      ) : (
        <>
          {objectifsBlock}
          {composantesBlock}
          {composanteSheetOpen && detail ? (
            <ComposanteSheet
              detail={detail}
              locale={locale}
              onClose={() => setComposanteSheetOpen(false)}
              style={{
              '--project-colour': `var(--p-${project.theme})`,
              '--project-soft': `var(--p-${project.theme}-soft, #f7e7c8)`,
              '--project-text': `var(--p-${project.theme}-text, var(--p-${project.theme}))`,
              '--project-on': `var(--p-${project.theme}-on, var(--white))`,
            } as CSSProperties} />
          ) : null}
          {impactBlock}
          {feedsBlock}
          {storiesBlock}
          {ressourcesBlock}
        </>
      )}
    </div>
  )
}
