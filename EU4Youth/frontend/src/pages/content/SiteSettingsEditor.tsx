import { useQuery } from '@tanstack/react-query'
import {
  Cookie,
  Facebook,
  Instagram,
  LayoutTemplate,
  Link2,
  Linkedin,
  Loader2,
  PanelBottom,
  Share2,
  Youtube,
} from 'lucide-react'
import { useState } from 'react'
import { api, type Locale } from '../../api/client'
import { LocaleTabs } from '../../components/catalog/CatalogEditorShell'
import CookieBannerPreview from './components/CookieBannerPreview'
import FooterLinksEditor from './components/FooterLinksEditor'
import MediaAssetCard from './components/MediaAssetCard'

type BlockRow = {
  key: string
  type: 'text' | 'image' | 'json'
  label: string | null
  locales: Record<string, { value: string | null }>
}

type SectionGroup = { name: string; title?: string; blocks: BlockRow[] }

type MatrixResponse = { sections: SectionGroup[] }

export type GlobalSettingsTab = 'header' | 'footer' | 'cookies'

interface Props {
  tab: GlobalSettingsTab
  effectiveValue: (section: string, block: BlockRow, locale: string) => string
  setValueChange: (section: string, block: BlockRow, locale: string, value: string) => void
  onUploadImage: (section: string, block: BlockRow, file: File) => void
}

function blockOf(sections: SectionGroup[], section: string, key: string) {
  return sections.find((item) => item.name === section)?.blocks.find((item) => item.key === key)
}

function LocalizedField({
  label,
  locale,
  rows = 2,
  value,
  onChange,
}: {
  label: string
  locale: Locale
  rows?: number
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="field field--catalog site-settings-field">
      <span>{label}</span>
      {rows <= 1 ? (
        <input
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <textarea
          rows={rows}
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  )
}

const SOCIAL_BRANDS: Record<string, string> = {
  youtube: 'youtube',
  facebook: 'facebook',
  linkedin: 'linkedin',
  instagram: 'instagram',
}

function SocialField({
  icon: Icon,
  label,
  brand,
  value,
  onChange,
}: {
  icon: typeof Youtube
  label: string
  brand: string
  value: string
  onChange: (value: string) => void
}) {
  const connected = Boolean(value.trim())
  return (
    <label className={`social-link-card social-link-card--${brand}${connected ? ' is-connected' : ''}`}>
      <span className="social-link-card__icon">
        <Icon size={18} />
      </span>
      <span className="social-link-card__label">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={`https://${brand}.com/…`}
      />
      <span className="social-link-card__status">{connected ? 'Connecté' : 'Non renseigné'}</span>
    </label>
  )
}

export default function SiteSettingsEditor({ tab, effectiveValue, setValueChange, onUploadImage }: Props) {
  const [locale, setLocale] = useState<Locale>('fr')
  const { data, isLoading } = useQuery<MatrixResponse>({
    queryKey: ['content-matrix', 'global'],
    queryFn: () => api.get('/admin/content/matrix', { params: { page: 'global' } }).then((r) => r.data),
  })

  const sections = data?.sections ?? []

  const val = (section: string, key: string, loc: string = locale) => {
    const block = blockOf(sections, section, key)
    if (!block) return ''
    return effectiveValue(section, block, loc)
  }

  const set = (section: string, key: string, loc: string, value: string) => {
    const block = blockOf(sections, section, key)
    if (block) setValueChange(section, block, loc, value)
  }

  if (isLoading) {
    return (
      <div className="wc-global-settings wc-global-settings--loading">
        <Loader2 size={22} className="spin" />
        <p>Chargement…</p>
      </div>
    )
  }

  return (
    <div className="wc-global-settings">
      {tab !== 'header' && (
        <div className="site-settings-locale-bar">
          <LocaleTabs locale={locale} onLocale={setLocale} />
          <p>Langue affichée sur le site public — les champs ci-dessous suivent cet onglet.</p>
        </div>
      )}

      {tab === 'header' && (
        <div className="site-settings-stack">
          <section className="site-settings-card site-settings-card--accent">
            <header className="site-settings-card__head">
              <span className="site-settings-card__icon">
                <LayoutTemplate size={18} />
              </span>
              <div>
                <h3>En-tête du site</h3>
                <p>Logos et icônes visibles sur toutes les pages. Le menu principal se gère dans l&apos;onglet Menu du site.</p>
              </div>
            </header>
            <div className="site-settings-card__body site-settings-card__body--media">
              {(['logo', 'flags', 'mailIcon', 'searchIcon'] as const).map((key) => {
                const block = blockOf(sections, 'header', key)
                if (!block) return null
                const labels: Record<string, { title: string; hint?: string; variant?: 'default' | 'icon' }> = {
                  logo: { title: 'Logo EU4Youth', hint: 'Barre de navigation principale' },
                  flags: { title: 'Drapeaux Tunisie / UE', hint: 'Coin droit de l’en-tête' },
                  mailIcon: { title: 'Icône contact', hint: 'Lien vers la page contact', variant: 'icon' },
                  searchIcon: { title: 'Icône recherche', hint: 'Ouvre la recherche du site', variant: 'icon' },
                }
                const meta = labels[key]
                return (
                  <MediaAssetCard
                    key={key}
                    label={meta.title}
                    hint={meta.hint}
                    variant={meta.variant}
                    value={effectiveValue('header', block, '_all')}
                    onChange={(value) => setValueChange('header', block, '_all', value)}
                    onUpload={(file) => onUploadImage('header', block, file)}
                  />
                )
              })}
            </div>
          </section>
        </div>
      )}

      {tab === 'footer' && (
        <div className="site-settings-stack">
          <section className="site-settings-card">
            <header className="site-settings-card__head">
              <span className="site-settings-card__icon">
                <PanelBottom size={18} />
              </span>
              <div>
                <h3>Visuels du pied de page</h3>
                <p>Logo et drapeaux affichés en bas de chaque page.</p>
              </div>
            </header>
            <div className="site-settings-card__body site-settings-card__body--media site-settings-card__body--media-compact">
              {(['logo', 'flags'] as const).map((key) => {
                const block = blockOf(sections, 'footer', key)
                if (!block) return null
                return (
                  <MediaAssetCard
                    key={key}
                    label={key === 'logo' ? 'Logo pied de page' : 'Drapeaux partenaires'}
                    value={effectiveValue('footer', block, '_all')}
                    onChange={(value) => setValueChange('footer', block, '_all', value)}
                    onUpload={(file) => onUploadImage('footer', block, file)}
                  />
                )
              })}
            </div>
          </section>

          <section className="site-settings-card">
            <header className="site-settings-card__head">
              <span className="site-settings-card__icon site-settings-card__icon--muted">
                <PanelBottom size={18} />
              </span>
              <div>
                <h3>Texte légal UE</h3>
                <p>Disclaimer affiché sous le pied de page.</p>
              </div>
            </header>
            <div className="site-settings-card__body">
              <LocalizedField
                label="Disclaimer Union européenne"
                locale={locale}
                rows={3}
                value={val('footer', 'disclaimer')}
                onChange={(value) => set('footer', 'disclaimer', locale, value)}
              />
            </div>
          </section>

          {(
            [
              { col: 'col1', links: 'programme', title: 'Colonne Programme', desc: 'Liens « Le programme »' },
              { col: 'col2', links: 'explorer', title: 'Colonne Explorer', desc: 'Liens découverte du site' },
              { col: 'col3', links: 'legal', title: 'Informations légales', desc: 'Confidentialité, mentions, cookies…' },
            ] as const
          ).map((group) => {
            const colBlock = blockOf(sections, 'footer', group.col)
            const linksBlock = blockOf(sections, 'footer', group.links)
            if (!colBlock || !linksBlock) return null
            return (
              <section key={group.links} className="site-settings-card site-settings-card--column">
                <header className="site-settings-card__head">
                  <span className="site-settings-card__icon site-settings-card__icon--muted">
                    <Link2 size={18} />
                  </span>
                  <div>
                    <h3>{group.title}</h3>
                    <p>{group.desc}</p>
                  </div>
                </header>
                <div className="site-settings-card__body">
                  <LocalizedField
                    label="Titre de la colonne"
                    locale={locale}
                    value={val('footer', group.col)}
                    onChange={(value) => set('footer', group.col, locale, value)}
                  />
                  <div className="site-settings-links-wrap">
                    <p className="site-settings-links-label">Liens de navigation</p>
                    <FooterLinksEditor
                      values={{
                        fr: effectiveValue('footer', linksBlock, 'fr'),
                        en: effectiveValue('footer', linksBlock, 'en'),
                        ar: effectiveValue('footer', linksBlock, 'ar'),
                      }}
                      onChange={({ fr, en, ar }) => {
                        setValueChange('footer', linksBlock, 'fr', fr)
                        setValueChange('footer', linksBlock, 'en', en)
                        setValueChange('footer', linksBlock, 'ar', ar)
                      }}
                    />
                  </div>
                </div>
              </section>
            )
          })}

          <section className="site-settings-card">
            <header className="site-settings-card__head">
              <span className="site-settings-card__icon">
                <Share2 size={18} />
              </span>
              <div>
                <h3>Réseaux sociaux</h3>
                <p>Pages officielles EU4Youth — laissez vide pour masquer l&apos;icône.</p>
              </div>
            </header>
            <div className="site-settings-card__body site-settings-card__body--social">
              <SocialField
                icon={Youtube}
                brand={SOCIAL_BRANDS.youtube}
                label="YouTube"
                value={val('footer', 'youtube', '_all')}
                onChange={(value) => set('footer', 'youtube', '_all', value)}
              />
              <SocialField
                icon={Facebook}
                brand={SOCIAL_BRANDS.facebook}
                label="Facebook"
                value={val('footer', 'facebook', '_all')}
                onChange={(value) => set('footer', 'facebook', '_all', value)}
              />
              <SocialField
                icon={Linkedin}
                brand={SOCIAL_BRANDS.linkedin}
                label="LinkedIn"
                value={val('footer', 'linkedin', '_all')}
                onChange={(value) => set('footer', 'linkedin', '_all', value)}
              />
              <SocialField
                icon={Instagram}
                brand={SOCIAL_BRANDS.instagram}
                label="Instagram"
                value={val('footer', 'instagram', '_all')}
                onChange={(value) => set('footer', 'instagram', '_all', value)}
              />
            </div>
          </section>
        </div>
      )}

      {tab === 'cookies' && (
        <div className="site-settings-stack site-settings-stack--cookies">
          <section className="site-settings-card site-settings-card--split">
            <header className="site-settings-card__head">
              <span className="site-settings-card__icon">
                <Cookie size={18} />
              </span>
              <div>
                <h3>Bandeau cookies (RGPD)</h3>
                <p>Texte affiché en bas du site lors de la première visite.</p>
              </div>
            </header>
            <div className="site-settings-card__body site-settings-card__body--split">
              <div className="site-settings-split__form">
                <LocalizedField
                  label="Message du bandeau"
                  locale={locale}
                  rows={4}
                  value={val('legal', 'cookieBanner')}
                  onChange={(value) => set('legal', 'cookieBanner', locale, value)}
                />
                <div className="site-settings-button-fields">
                  <LocalizedField
                    label="Bouton accepter"
                    locale={locale}
                    rows={1}
                    value={val('legal', 'accept')}
                    onChange={(value) => set('legal', 'accept', locale, value)}
                  />
                  <LocalizedField
                    label="Bouton refuser"
                    locale={locale}
                    rows={1}
                    value={val('legal', 'reject')}
                    onChange={(value) => set('legal', 'reject', locale, value)}
                  />
                  <LocalizedField
                    label="Lien « En savoir plus »"
                    locale={locale}
                    rows={1}
                    value={val('legal', 'more')}
                    onChange={(value) => set('legal', 'more', locale, value)}
                  />
                </div>
              </div>
              <CookieBannerPreview
                locale={locale}
                message={val('legal', 'cookieBanner')}
                accept={val('legal', 'accept')}
                reject={val('legal', 'reject')}
                more={val('legal', 'more')}
              />
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
