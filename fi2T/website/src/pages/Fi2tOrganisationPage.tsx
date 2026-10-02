import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ContentProvider, useContent } from '../cms/ContentProvider'
import EditableText from '../cms/EditableText'
import EditableHeroBackground from '../cms/EditableHeroBackground'
import EditToolbar from '../cms/EditToolbar'
import { useEditMode } from '../cms/EditModeProvider'
import { GROUPEMENTS, type GroupementItem } from '../lib/groupements'
import { ORGANISATION_DEFAULTS } from '../cms/defaults/organisation'
import {
  groupementsJsonSafe,
  parseJsonArray,
  REGION_FALLBACK,
  type RegionItem,
} from './organisation/sections'

const OVERVIEW_LINKS = [
  {
    to: '/organisation/conseil-administration',
    navKey: 'board',
    label: 'Le Conseil d’administration',
    blurb: 'Composition actuelle et bureau sortant.',
  },
  {
    to: '/organisation/bureaux-regionaux',
    navKey: 'regional',
    label: 'Les Bureaux Régionaux',
    blurb: 'Présence Fi2T sur l’ensemble du territoire.',
  },
  {
    to: '/organisation/groupements-professionnels',
    navKey: 'groupements',
    label: 'Les Groupements Professionnels',
    blurb: 'Les spécialités qui structurent le tourisme tunisien.',
  },
  {
    to: '/organisation/siege',
    navKey: 'headquarters',
    label: 'Le Siège',
    blurb: 'L’équipe permanente au service des adhérents.',
  },
] as const

function OrganisationInner() {
  const { get } = useContent()
  const { isEditMode } = useEditMode()

  const groupements = parseJsonArray<GroupementItem>(
    get('groupements.items', groupementsJsonSafe()),
    GROUPEMENTS,
  )
  const regions = parseJsonArray<RegionItem>(
    get('regional.items', ORGANISATION_DEFAULTS['regional.items']),
    REGION_FALLBACK,
  )
  /* Auto-calculated KPIs — not editable (avoids stale/fake numbers). */
  const autoGroupements = String(Math.max(groupements.length, 1)).padStart(2, '0')
  const autoRegions = String(Math.max(regions.length, 1)).padStart(2, '0')
  const autoYears = String(Math.max(1, new Date().getFullYear() - 2016)).padStart(2, '0')

  const stats = useMemo(() => ([
    {
      value: autoGroupements,
      labelKey: 'stats.label_groupements',
      label: get('stats.label_groupements', 'GROUPEMENTS'),
    },
    {
      value: autoRegions,
      labelKey: 'stats.label_regions',
      label: get('stats.label_regions', 'RÉGIONS'),
    },
    {
      value: autoYears,
      labelKey: 'stats.label_mandate',
      label: get('stats.label_mandate', 'ANS'),
    },
  ]), [autoGroupements, autoRegions, autoYears, get])

  return (
    <div className="fi2t-org-page">
      <section className="fi2t-page-hero fi2t-page-hero--org" data-cms-section="hero">
        <EditableHeroBackground
          page="organisation"
          fallback="/images/qui-sommes-nous-banner.png?v=8"
        />
        <div className="fi2t-page-hero__overlay" aria-hidden="true" />
        <div className="fi2t-page-hero__content">
          <EditableText
            page="organisation"
            blockKey="hero.title"
            as="h1"
            className="fi2t-page-hero__title"
            fallback="Organisation"
          />
          <span className="fi2t-page-hero__accent" aria-hidden="true" />
        </div>
      </section>

      <section className="fi2t-org-intro" data-cms-section="intro">
        <div className="fi2t-org-intro__inner">
          <EditableText
            page="organisation"
            blockKey="intro.title"
            as="h2"
            className="fi2t-org-intro__title"
            fallback="Organisation"
          />
          <EditableText
            page="organisation"
            blockKey="intro.body"
            as="div"
            multiline
            className="fi2t-org-intro__body"
            fallback={ORGANISATION_DEFAULTS['intro.body']}
          />
        </div>
      </section>

      <section className="fi2t-org-stats" data-cms-section="stats">
        {stats.map((item) => (
          <article key={item.labelKey} className="fi2t-org-stat">
            <span className="fi2t-org-stat__value" title="Calculé automatiquement">
              {item.value}
            </span>
            <EditableText
              page="organisation"
              blockKey={item.labelKey}
              as="span"
              className="fi2t-org-stat__label"
              fallback={item.label}
            />
          </article>
        ))}
      </section>

      <section className="fi2t-org-links" data-cms-section="overview">
        <div className="fi2t-org-links__grid">
          {OVERVIEW_LINKS.map((item, index) => (
            <Link
              key={item.to}
              to={item.to}
              className="fi2t-org-links__card"
              onClick={(e) => {
                if (isEditMode) e.preventDefault()
              }}
            >
              <span className="fi2t-org-links__index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="fi2t-org-links__copy">
                <EditableText
                  page="global"
                  blockKey={`nav.${item.navKey}`}
                  as="span"
                  className="fi2t-org-links__label"
                  label={`Navigation — ${item.label}`}
                  fallback={item.label}
                />
                <span className="fi2t-org-links__blurb">{item.blurb}</span>
              </span>
              <span className="fi2t-org-links__arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default function Fi2tOrganisationPage() {
  return (
    <ContentProvider page="organisation">
      <OrganisationInner />
      <EditToolbar />
    </ContentProvider>
  )
}
