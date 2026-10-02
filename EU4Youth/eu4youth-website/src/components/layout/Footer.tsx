import { Link } from 'react-router-dom'
import { CmsSection } from '../../cms/EditableImage'
import { useContent } from '../../cms/ContentProvider'
import { useEditMode } from '../../cms/EditModeProvider'
import ProjectLogos from '../ProjectLogos'
import FunderFlags from '../FunderFlags'
import SocialIcon, { type Network } from './SocialIcon'
import { FOOTER_LOGOS } from '../../data/logos'
import { assetUrl } from '../../lib/assetUrl'
import './footer.css'

type FooterLink = { label: string; to: string }

/** Exact labels from « footer trinlingue.docx » (FR fallbacks). EN/AR come from CMS. */
const COLUMNS: {
  title: string
  titleField: string
  listField: string
  x: number
  links: FooterLink[]
}[] = [
  {
    title: 'Explorer',
    titleField: 'col1',
    listField: 'explore',
    x: 7.63,
    links: [
      { label: 'Programme', to: '/programme/a-propos' },
      { label: 'Projets', to: '/projets' },
      { label: 'Carte', to: '/carte' },
      { label: 'Opportunités', to: '/opportunites' },
      { label: 'Youth stories', to: '/stories' },
    ],
  },
  {
    title: 'Restez informé.es',
    titleField: 'col2',
    listField: 'informed',
    x: 75.51,
    links: [
      { label: 'Actualités', to: '/actualites' },
      { label: 'Publication', to: '/publications' },
      { label: 'Glossaire', to: '/glossaire' },
      { label: 'Revue de presse', to: '/coin-media' },
    ],
  },
  {
    title: 'Informations légales',
    titleField: 'col3',
    listField: 'legal',
    x: 138.32,
    links: [
      { label: 'Politique de confidentialité', to: '/confidentialite' },
      { label: 'Mentions légales', to: '/mentions-legales' },
      { label: 'Accessibilité', to: '/accessibilite' },
      { label: 'Gestion de cookies', to: '/cookies' },
    ],
  },
]

const SOCIALS: {
  network: Network
  label: string
  field: string
  /** Official programme profile used until the CMS URL is filled. */
  defaultHref: string
}[] = [
  {
    network: 'youtube',
    label: 'YouTube',
    field: 'youtube',
    defaultHref: 'https://www.youtube.com/@EU4YouthTunisie',
  },
  {
    network: 'facebook',
    label: 'Facebook',
    field: 'facebook',
    defaultHref: 'https://www.facebook.com/eu4youth.tn',
  },
  {
    network: 'linkedin',
    label: 'LinkedIn',
    field: 'linkedin',
    defaultHref: 'https://www.linkedin.com/company/eu4youth-tunisia',
  },
  {
    network: 'instagram',
    label: 'Instagram',
    field: 'instagram',
    defaultHref: 'https://www.instagram.com/eu4youth.tn',
  },
]

const LOCALES = [
  { code: 'FR', label: 'Français' },
  { code: 'عربي', label: 'العربية' },
  { code: 'EN', label: 'English' },
]

function parseLinks(raw: string, fallback: FooterLink[]) {
  try {
    const parsed = JSON.parse(raw)
    const list = Array.isArray(parsed) ? parsed : parsed?.fr
    if (!Array.isArray(list)) return fallback
    const links = list
      .map((row: { label?: string; to?: string }) => ({
        label: String(row.label || '').trim(),
        to: String(row.to || '').trim(),
      }))
      .filter((row: FooterLink) => row.label && row.to)
    return links.length ? links : fallback
  } catch {
    return fallback
  }
}

export default function Footer() {
  const { get, t } = useContent()
  const { locale, setLocale, isEditMode } = useEditMode()
  return (
    <CmsSection id="footer" as="div" className="band footer">
      <div className="band__inner">
        <Link to="/" className="footer__home" aria-label={t('header.home_aria', 'EU4Youth Tunisie — accueil')} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src={assetUrl(get('footer.logo', '/img/footer-logo-v2.webp'))} alt="" />
        </Link>
        <FunderFlags
          className="footer__funders"
          variant="footer"
        />

        <div className="footer__nav">
          {COLUMNS.map((column, columnIndex) => {
            const links = parseLinks(
              get(`footer.${column.listField}`, JSON.stringify(column.links)),
              column.links,
            )
            return (
              <nav
                key={column.titleField}
                className={`footer__col${columnIndex === 0 ? ' footer__col--programme' : ''}${columnIndex === 2 ? ' footer__col--legal' : ''}`}
                style={{ insetInlineStart: `${column.x}rem` }}
                aria-label={get(`footer.${column.titleField}`, column.title)}
              >
                <h2>{get(`footer.${column.titleField}`, column.title)}</h2>
                <ul>
                  {links.map((link) => (
                    <li key={`${link.to}-${link.label}`}>
                      <Link to={link.to}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
                {columnIndex === 2 ? (
                  <div className="footer__meta">
                    <ul className="footer__social" aria-label={t('footer.social_aria', 'Réseaux sociaux')}>
                      {SOCIALS.map((social) => {
                        const cmsHref = get(`footer.${social.field}`, '').trim()
                        const href = cmsHref || social.defaultHref
                        return (
                          <li key={social.label}>
                            <a
                              className="footer__social-btn"
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={social.label}
                              title={
                                cmsHref || !isEditMode
                                  ? social.label
                                  : `${social.label} — URL CMS vide, profil par défaut`
                              }
                            >
                              <SocialIcon network={social.network} />
                            </a>
                          </li>
                        )
                      })}
                    </ul>

                    <ul className="footer__locales" aria-label={t('footer.locales_aria', 'Langues du site')}>
                      {LOCALES.map((item, index) => {
                        const code = index === 0 ? 'fr' : index === 1 ? 'ar' : 'en'
                        return (
                          <li key={item.code}>
                            {index > 0 && <span aria-hidden="true">|</span>}
                            <button
                              type="button"
                              className={`footer__locale${locale === code ? ' footer__locale--current' : ''}`}
                              lang={code}
                              aria-pressed={locale === code}
                              onClick={() => setLocale(code as 'fr' | 'en' | 'ar')}
                              title={item.label}
                            >
                              <span aria-hidden="true">{item.code}</span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ) : null}
              </nav>
            )
          })}
        </div>

        <ProjectLogos cells={FOOTER_LOGOS} variant="footer" rest="white" />

        <p className="footer__disclaimer">
          {get(
            'footer.disclaimer',
            'Ce site a été produit avec le soutien financier de l’Union européenne. Son contenu relève de la seule responsabilité du programme EU4Youth Tunisie et ne reflète pas nécessairement les opinions de l’Union européenne.',
          )}
        </p>
      </div>
    </CmsSection>
  )
}
