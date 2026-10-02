import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ContentProvider, useContent } from '../cms/ContentProvider'
import EditableText from '../cms/EditableText'
import EditableImage, { useEditableImageSrc, useEditableImageAlt } from '../cms/EditableImage'
import EditableJsonList from '../cms/EditableJsonList'
import EditablePositioned from '../cms/EditablePositioned'
import EditToolbar from '../cms/EditToolbar'
import { useEditMode } from '../cms/EditModeProvider'
import { GROUPEMENTS, type GroupementItem } from '../lib/groupements'
import { HOME_DEFAULTS } from '../cms/defaults/home'
import { publicUrl } from '../lib/publicUrl'

const OBJECTIFS_PER_PAGE = 4

/** Objectives are numbered from their position, so editors never type it. */
const objectifNumber = (index: number) => String(index + 1).padStart(2, '0')

function ObjectifsDots({
  itemCount,
  page,
  onPage,
  editMode,
}: {
  itemCount: number
  page: number
  onPage: (page: number) => void
  editMode: boolean
}) {
  const pageCount = Math.ceil(itemCount / OBJECTIFS_PER_PAGE)

  useEffect(() => {
    if (pageCount === 0) return
    if (page > pageCount - 1) onPage(pageCount - 1)
  }, [page, pageCount, onPage])

  // Only when there is another page to reach — no decorative spare dots.
  if (pageCount <= 1) return null

  return (
    <div className="fi2t-dots" role="tablist" aria-label="Pages des objectifs">
      {Array.from({ length: pageCount }, (_, i) => {
        const active = i === page
        return (
          <button
            key={i}
            type="button"
            className={active ? 'is-active' : undefined}
            aria-label={`Page ${i + 1}`}
            aria-current={active ? 'true' : undefined}
            onClick={() => {
              if (!editMode) onPage(i)
            }}
          />
        )
      })}
    </div>
  )
}

function ChevronIcon({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={dir === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'}
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function NewsArrowIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2 6h7M6.5 2.5L10 6l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CtaLeadIcon() {
  return (
    <svg className="fi2t-cta__btn-icon" width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path
        d="M2.25 7.5h8.5M7.5 3.75 11.25 7.5 7.5 11.25"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type ObjectifItem = { title: string; desc: string }
type ReasonItem = { title: string; desc: string }
type NewsItem = { slug: string; title: string; desc: string; date: string; img: string }
type PartnerItem = { name: string; logo: string; url: string }

function parseJsonArray<T>(raw: string, fallback: T[]): T[] {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as T[]) : fallback
  } catch {
    return fallback
  }
}

const OBJECTIFS_FALLBACK = parseJsonArray<ObjectifItem>(HOME_DEFAULTS['objectifs.items'], [])
const REASONS_FALLBACK = parseJsonArray<ReasonItem>(HOME_DEFAULTS['adherer.reasons'], [])
const NEWS_FALLBACK = parseJsonArray<NewsItem>(HOME_DEFAULTS['actualites.items'], [])
const PARTNERS_FALLBACK = parseJsonArray<PartnerItem>(HOME_DEFAULTS['partners.items'], [])

/** Preprod CMS sometimes still has only 4 objectifs — append missing brief items. */
function ensureBriefObjectifs(items: ObjectifItem[]): ObjectifItem[] {
  if (!items.length) return OBJECTIFS_FALLBACK
  if (items.length >= OBJECTIFS_FALLBACK.length) return items
  const seen = new Set(items.map((i) => (i.title || '').trim().toLowerCase()))
  const missing = OBJECTIFS_FALLBACK.filter((f) => !seen.has(f.title.trim().toLowerCase()))
  return missing.length ? [...items, ...missing] : items
}

function HomeInner() {
  const { t } = useTranslation()
  const { isEditMode } = useEditMode()
  const { get } = useContent()
  const [objectifsPage, setObjectifsPage] = useState(0)
  const heroImgSrc = useEditableImageSrc('home', 'hero.image', '/hero.jpg')
  const heroImgAlt = useEditableImageAlt('home', 'hero.image', 'FI2T')
  const aboutImgSrc = useEditableImageSrc('home', 'about.image', '/images/qui-sommes-nous-card.jpg?v=home5')
  const groupementsBgSrc = useEditableImageSrc('home', 'groupements.bg', '/images/bg 1.png')
  const ctaBgSrc = useEditableImageSrc('home', 'cta.bg', '/images/bg--1.png')
  const facebookUrl = get('actualites.facebook_url', HOME_DEFAULTS['actualites.facebook_url'])

  return (
    <div className="fi2t-home">
      <section className="fi2t-hero" data-cms-section="hero">
        {/* Plain <img> keeps absolute full-bleed CSS; pencil opens the image panel. */}
        <img
          src={heroImgSrc}
          alt={heroImgAlt}
          className="fi2t-hero__bg"
          data-cms-page="home"
          data-cms-block="hero.image"
          data-cms-type="image"
        />
        {isEditMode && (
          <EditableImage
            page="home"
            blockKey="hero.image"
            variant="chip"
            label="Image hero"
            alt="FI2T"
            className="fi2t-hero__edit-chip"
            fallback="/hero.jpg"
          />
        )}
        <div className="fi2t-hero__overlay" aria-hidden="true" />
        <div className="fi2t-hero__content">
          <EditableText
            page="home"
            blockKey="hero.title"
            as="h1"
            className="fi2t-hero__title"
            fallback="Le futur du tourisme tunisien se construit ici !"
          />
          <EditableText
            page="home"
            blockKey="hero.subtitle"
            as="p"
            className="fi2t-hero__subtitle"
            fallback="Unir, innover et valoriser le tourisme tunisien"
          />
          <div className="fi2t-hero__actions">
            <Link to="/qui-sommes-nous" className="fi2t-btn fi2t-btn--light">
              <EditableText page="home" blockKey="hero.cta_primary" as="span" fallback="Découvrir la Fédération" />
            </Link>
            <Link to="/fiche-adhesion" className="fi2t-btn fi2t-btn--ghost">
              <EditableText page="home" blockKey="hero.cta_secondary" as="span" fallback="Adhérer maintenant" />
            </Link>
          </div>
        </div>
      </section>

      <section className="fi2t-section fi2t-about" id="about" data-cms-section="about">
        <div className="fi2t-about__text">
          <EditableText page="home" blockKey="about.title" as="h2" fallback="Qui sommes-nous ?" />
          <EditableText
            page="home"
            blockKey="about.body"
            as="p"
            multiline
            fallback={HOME_DEFAULTS['about.body']}
            preferFallbackWhen={(v) => !/ouverte à tous/i.test(v)}
          />
          <Link to="/qui-sommes-nous" className="fi2t-btn fi2t-btn--primary">
            <EditableText page="home" blockKey="about.cta" as="span" fallback="Voir plus" />
          </Link>
        </div>
        <div className="fi2t-about__media">
          <img
            src={aboutImgSrc}
            alt="Qui sommes-nous"
            className="fi2t-about__image"
            data-cms-page="home"
            data-cms-block="about.image"
            data-cms-type="image"
          />
          {isEditMode && (
            <EditableImage
              page="home"
              blockKey="about.image"
              variant="chip"
              label="Image à propos"
              className="fi2t-about__edit-chip"
              fallback="/images/qui-sommes-nous-card.jpg?v=home5"
            />
          )}
          <EditablePositioned
            page="home"
            blockKey="about.badge_pos"
            label="Badge 10+ — Position"
            className="fi2t-about__badge"
            fallback={{ left: -29, bottom: -43 }}
          >
            <EditableText
              page="home"
              blockKey="about.badge"
              as="p"
              className="fi2t-stat-badge"
              multiline
              fallback={"10+\nANNÉES D'ENGAGEMENT"}
            />
          </EditablePositioned>
        </div>
      </section>

      <section className="fi2t-objectifs-wrap" id="objectifs" data-cms-section="objectifs">
        <div className="fi2t-section fi2t-objectifs-section">
          <EditableText
            page="home"
            blockKey="objectifs.title"
            as="h2"
            className="fi2t-objectifs-section__title"
            fallback="Objectifs"
            preferFallbackWhen={(v) => /^nos\s+objectifs$/i.test(v.trim())}
          />
          <EditableText
            page="home"
            blockKey="objectifs.intro"
            as="p"
            className="fi2t-objectifs-section__intro"
            multiline
            fallback={HOME_DEFAULTS['objectifs.intro']}
            preferFallbackWhen={(v) => !/patronal,\s*en vue/i.test(v)}
          />
          <EditableJsonList<ObjectifItem>
            page="home"
            blockKey="objectifs.items"
            label="Objectifs — Liste"
            className="fi2t-objectifs"
            itemClassName={( _item, index) => {
              const base = 'fi2t-objectif-card'
              if (isEditMode) return base
              const start = objectifsPage * OBJECTIFS_PER_PAGE
              if (index < start || index >= start + OBJECTIFS_PER_PAGE) {
                return `${base} is-page-hidden`
              }
              return base
            }}
            fallback={OBJECTIFS_FALLBACK}
            transform={ensureBriefObjectifs}
            emptyItem={() => ({ title: 'Nouvel objectif', desc: 'Description…' })}
            addLabel="Ajouter un objectif"
            fields={[
              { key: 'title', label: 'Titre' },
              { key: 'desc', label: 'Description', multiline: true },
            ]}
            renderItem={(_item, index, { editField }) => (
              <>
                {/* Numbered by position: reordering or deleting can't leave a gap. */}
                <span className="fi2t-objectif-card__num">{objectifNumber(index)}</span>
                {editField('title', 'h3')}
                {editField('desc', 'p')}
              </>
            )}
            renderAfter={(items) => (
              <ObjectifsDots
                itemCount={items.length}
                page={objectifsPage}
                onPage={setObjectifsPage}
                editMode={isEditMode}
              />
            )}
          />
        </div>
      </section>

      <section className="fi2t-groupements" id="groupements" data-cms-section="groupements">
        <img
          src={groupementsBgSrc}
          alt=""
          className="fi2t-groupements__bg"
          data-cms-page="home"
          data-cms-block="groupements.bg"
          data-cms-type="image"
        />
        {isEditMode && (
          <EditableImage
            page="home"
            blockKey="groupements.bg"
            variant="chip"
            label="Fond groupements"
            className="fi2t-groupements__edit-chip"
            fallback="/images/bg 1.png"
          />
        )}
        <div className="fi2t-groupements__overlay" />
        <div className="fi2t-groupements__inner">
          <EditableText page="home" blockKey="groupements.title" as="h2" fallback="Les Groupements Professionnels" />
          {/* Public: no intro text — icons + labels only */}
          {isEditMode ? (
            <EditableText
              page="home"
              blockKey="groupements.intro"
              as="p"
              multiline
              className="fi2t-groupements__intro"
              fallback={HOME_DEFAULTS['groupements.intro']}
            />
          ) : null}
          <EditableJsonList<GroupementItem>
            page="home"
            blockKey="groupements.items"
            label="Groupements — Cartes"
            className="fi2t-groupements__grid"
            shared={false}
            fallback={GROUPEMENTS}
            emptyItem={{ label: 'Nouveau groupement', slug: '', icon: '/images/icon1.png?v=5' }}
            addLabel="Ajouter un groupement"
            fields={[
              { key: 'label', label: 'Nom' },
              { key: 'slug', label: 'Slug (URL)' },
              { key: 'icon', label: 'Icône', image: true, iconPick: true },
            ]}
            renderItem={(item, _index, { editable, editField, editImage }) => {
              const card = (
                <>
                  <div className="fi2t-group-card__icon">
                    {editImage('icon', undefined, item.label)}
                  </div>
                  {editField('label', 'p')}
                </>
              )

              if (editable || !item.slug) {
                return <div className="fi2t-group-card">{card}</div>
              }

              return (
                <Link to={`/${item.slug}`} className="fi2t-group-card">
                  {card}
                </Link>
              )
            }}
          />
        </div>
      </section>

      <section className="fi2t-section fi2t-adherer" id="adherer" data-cms-section="adherer">
        <div className="fi2t-adherer__media">
          <EditableImage
            page="home"
            blockKey="adherer.image"
            className="fi2t-adherer__image"
            alt="Adhésion"
            fallback="/images/Rectangle 27.png"
          />
          <EditablePositioned
            page="home"
            blockKey="adherer.badge_pos"
            label="Badge 50+ — Position"
            className="fi2t-adherer__badge"
            fallback={{ right: -26, bottom: -49 }}
          >
            <EditableText
              page="home"
              blockKey="adherer.badge"
              as="p"
              className="fi2t-stat-badge"
              multiline
              fallback={"50+\nMEMBRES ACTIFS"}
            />
          </EditablePositioned>
        </div>
        <div className="fi2t-adherer__content">
          <EditableText page="home" blockKey="adherer.title" as="h2" fallback="Pourquoi adhérer à la Fi2T ?" />
          <EditableJsonList<ReasonItem>
            page="home"
            blockKey="adherer.reasons"
            label="Adhérer — Raisons"
            className="fi2t-reasons"
            itemClassName="fi2t-reasons__item"
            fallback={REASONS_FALLBACK}
            emptyItem={{ title: 'Nouveau bénéfice', desc: 'Description…' }}
            addLabel="Ajouter un bénéfice"
            fields={[
              { key: 'title', label: 'Titre' },
              { key: 'desc', label: 'Description', multiline: true },
            ]}
            renderItem={(_item, _index, { editField }) => (
              <>
                <img
                  src={publicUrl('/images/adherer-check.svg')}
                  alt=""
                  className="fi2t-reasons__check"
                  width={20}
                  height={20}
                  aria-hidden="true"
                />
                <div>
                  {editField('title', 'strong')}
                  {editField('desc', 'span')}
                </div>
              </>
            )}
          />
          <Link to="/fiche-adhesion" className="fi2t-btn fi2t-btn--primary">
            <EditableText page="home" blockKey="adherer.cta" as="span" fallback="Adhérer maintenant" />
          </Link>
        </div>
      </section>

      <section className="fi2t-news" id="actualites" data-cms-section="actualites">
        <div className="fi2t-section">
          <div className="fi2t-news__head">
            <EditableText page="home" blockKey="actualites.title" as="h2" fallback="Dernières Actualités" />
            <Link to="/actualites" className="fi2t-btn fi2t-btn--primary">
              <EditableText page="home" blockKey="actualites.cta" as="span" fallback="Voir plus" />
            </Link>
          </div>
          <div className="fi2t-news__facebook">
            <EditableText
              page="home"
              blockKey="actualites.facebook_note"
              as="p"
              fallback={HOME_DEFAULTS['actualites.facebook_note']}
            />
            <a
              href={facebookUrl}
              className="fi2t-btn fi2t-btn--ghost fi2t-news__facebook-cta"
              target="_blank"
              rel="noopener noreferrer"
            >
              <EditableText
                page="home"
                blockKey="actualites.facebook_cta"
                as="span"
                fallback={HOME_DEFAULTS['actualites.facebook_cta']}
              />
            </a>
          </div>
          <div className="fi2t-news__carousel">
            <button type="button" className="fi2t-news__arrow fi2t-news__arrow--prev" aria-label={t('fi2t.ui.prev_article')}>
              <ChevronIcon dir="left" />
            </button>
            <EditableJsonList<NewsItem>
              page="home"
              blockKey="actualites.items"
              label="Actualités — Cartes"
              className="fi2t-news__grid"
              itemClassName="fi2t-news-card"
              fallback={NEWS_FALLBACK}
              emptyItem={{
                slug: '',
                title: 'Nouveau titre',
                desc: 'Extrait…',
                date: '1 Janvier 2026',
                img: '/images/act1.jpg',
              }}
              addLabel="Ajouter une actualité"
              fields={[
                { key: 'title', label: 'Titre', multiline: true },
                { key: 'desc', label: 'Extrait', multiline: true },
                { key: 'date', label: 'Date' },
                { key: 'img', label: 'Image', image: true },
                { key: 'slug', label: 'Slug article' },
              ]}
              renderItem={(item, index, { editable, editField, editImage }) => (
                <>
                  {editable ? (
                    editImage('img', 'fi2t-news-card__media', item.title)
                  ) : (
                    <img
                      src={publicUrl(
                        index < 3
                          ? `/images/act${index + 1}-home.jpg?v=1`
                          : item.img || '/images/act1.jpg',
                      )}
                      alt={item.title}
                      className="fi2t-news-card__media"
                    />
                  )}
                  <div className="fi2t-news-card__body">
                    {editField('title', 'h3')}
                    {editField('desc', 'p')}
                    <footer>
                      {editField('date', 'time')}
                      {!editable && item.slug ? (
                        <Link
                          to={`/actualites/${item.slug}`}
                          className="fi2t-news-card__link"
                          aria-label={t('fi2t.ui.read_more')}
                        >
                          <NewsArrowIcon />
                        </Link>
                      ) : (
                        <span className="fi2t-news-card__link" aria-hidden="true">
                          <NewsArrowIcon />
                        </span>
                      )}
                    </footer>
                  </div>
                </>
              )}
            />
            <button type="button" className="fi2t-news__arrow fi2t-news__arrow--next" aria-label={t('fi2t.ui.next_article')}>
              <ChevronIcon dir="right" />
            </button>
          </div>
        </div>
      </section>

      <section className="fi2t-partners" id="partenaires" data-cms-section="partners">
        <div className="fi2t-section">
          <EditableText
            page="home"
            blockKey="partners.title"
            as="h2"
            className="fi2t-partners__title"
            fallback="Partenaires"
          />
          <EditableJsonList<PartnerItem>
            page="home"
            blockKey="partners.items"
            label="Partenaires — Logos"
            className="fi2t-partners__grid"
            fallback={PARTNERS_FALLBACK}
            emptyItem={{ name: 'Nouveau partenaire', logo: '', url: '' }}
            addLabel="Ajouter un partenaire"
            fields={[
              { key: 'name', label: 'Nom' },
              { key: 'logo', label: 'Logo', image: true },
              { key: 'url', label: 'Lien (optionnel)' },
            ]}
            renderItem={(item, _index, { editable, editField, editImage }) => {
              const inner = (
                <>
                  <div className={`fi2t-partners__logo${!item.logo ? ' is-empty' : ''}`}>
                    {item.logo || editable
                      ? editImage('logo', 'fi2t-partners__logo-img', item.name || '')
                      : null}
                    {!item.logo && (
                      <span className="fi2t-partners__name-fallback">{item.name}</span>
                    )}
                  </div>
                  {editable ? editField('name', 'span', 'fi2t-partners__name') : null}
                </>
              )

              if (editable || !item.url) {
                return <div className="fi2t-partners__item" aria-label={item.name}>{inner}</div>
              }

              return (
                <a
                  href={item.url}
                  className="fi2t-partners__item"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                >
                  {inner}
                </a>
              )
            }}
          />
        </div>
      </section>

      <section className="fi2t-cta" data-cms-section="cta">
        <img
          src={ctaBgSrc}
          alt=""
          className="fi2t-cta__bg"
          data-cms-page="home"
          data-cms-block="cta.bg"
          data-cms-type="image"
        />
        {isEditMode && (
          <EditableImage
            page="home"
            blockKey="cta.bg"
            variant="chip"
            label="Fond CTA"
            className="fi2t-cta__edit-chip"
            fallback="/images/bg--1.png"
          />
        )}
        <div className="fi2t-cta__overlay" />
        <div className="fi2t-cta__inner">
          <EditableText page="home" blockKey="cta.title" as="h2" fallback="Rejoignez notre vision pour le futur" />
          <EditableText
            page="home"
            blockKey="cta.body"
            as="p"
            multiline
            fallback="Devenez membre de la Fédération et participez activement à la construction d'un tourisme tunisien d'exception."
          />
          <div className="fi2t-hero__actions">
            <Link to="/fiche-adhesion" className="fi2t-btn fi2t-btn--light">
              <CtaLeadIcon />
              <EditableText page="home" blockKey="cta.primary" as="span" fallback="Rejoindre la fédération" />
            </Link>
            <Link to="/contact" className="fi2t-btn fi2t-btn--ghost">
              <EditableText page="home" blockKey="cta.secondary" as="span" fallback="Contacter le bureau" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function Fi2tHomePage() {
  return (
    <ContentProvider page="home">
      <HomeInner />
      <EditToolbar />
    </ContentProvider>
  )
}
