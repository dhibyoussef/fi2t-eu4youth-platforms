import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import i18n from '../../i18n'
import { ContentProvider } from '../../cms/ContentProvider'
import EditableImage from '../../cms/EditableImage'
import EditableText from '../../cms/EditableText'
import { useEditMode } from '../../cms/EditModeProvider'

type NavChild = { to: string; key: string; label: string }
type NavItem =
  | { kind: 'link'; to: string; key: string; label: string; end?: boolean }
  | { kind: 'group'; key: string; label: string; to: string; children: NavChild[] }

const NAV: NavItem[] = [
  { kind: 'link', to: '/', key: 'home', label: 'Accueil', end: true },
  { kind: 'link', to: '/qui-sommes-nous', key: 'about', label: 'Qui sommes-nous ?' },
  {
    kind: 'group',
    key: 'organisation',
    label: 'Organisation',
    to: '/organisation',
    children: [
      {
        to: '/organisation/conseil-administration',
        key: 'board',
        label: 'Le Conseil d’administration',
      },
      {
        to: '/organisation/bureaux-regionaux',
        key: 'regional',
        label: 'Les Bureaux Régionaux',
      },
      {
        to: '/organisation/groupements-professionnels',
        key: 'groupements',
        label: 'Les Groupements Professionnels',
      },
      { to: '/organisation/siege', key: 'headquarters', label: 'Le Siège' },
    ],
  },
  { kind: 'link', to: '/actualites', key: 'news', label: 'Actualités' },
  { kind: 'link', to: '/fiche-adhesion', key: 'membership', label: 'Fiche adhésion' },
  { kind: 'link', to: '/contact', key: 'contact', label: 'Contact' },
]

const LANGS = [
  { code: 'fr', label: 'FR', full: 'Français' },
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'ar', label: 'AR', full: 'العربية' },
] as const

function NavLabel({ blockKey, fallback }: { blockKey: string; fallback: string }) {
  return (
    <EditableText
      page="global"
      blockKey={`nav.${blockKey}`}
      as="span"
      label={`Navigation — ${fallback}`}
      fallback={fallback}
    />
  )
}

function NavDropdown({
  item,
  openKey,
  setOpenKey,
  onNavigate,
}: {
  item: Extract<NavItem, { kind: 'group' }>
  openKey: string | null
  setOpenKey: (key: string | null) => void
  onNavigate: () => void
}) {
  const { isEditMode } = useEditMode()
  const location = useLocation()
  const open = openKey === item.key
  const wrapRef = useRef<HTMLDivElement>(null)
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const groupActive =
    location.pathname === item.to
    || location.pathname.startsWith(`${item.to}/`)

  const clearLeaveTimer = () => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current)
      leaveTimer.current = null
    }
  }

  const openMenu = () => {
    clearLeaveTimer()
    if (!isEditMode) setOpenKey(item.key)
  }

  const scheduleClose = () => {
    if (isEditMode) return
    clearLeaveTimer()
    leaveTimer.current = setTimeout(() => setOpenKey(null), 180)
  }

  useEffect(() => () => clearLeaveTimer(), [])

  useEffect(() => {
    if (!open || isEditMode) return
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpenKey(null)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open, isEditMode, setOpenKey])

  return (
    <div
      className={`fi2t-header__dropdown${open ? ' is-open' : ''}`}
      ref={wrapRef}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <NavLink
        to={item.to}
        className={() =>
          `fi2t-header__link fi2t-header__link--parent${groupActive ? ' is-active' : ''}`
        }
        onClick={(e) => {
          if (isEditMode) {
            e.preventDefault()
            setOpenKey(open ? null : item.key)
            return
          }
          // Mobile: first tap opens the list; desktop hover already shows it.
          if (window.matchMedia('(max-width: 980px)').matches) {
            e.preventDefault()
            setOpenKey(open ? null : item.key)
          } else {
            onNavigate()
          }
        }}
      >
        <NavLabel blockKey={item.key} fallback={item.label} />
        <i className="fa-solid fa-chevron-down" aria-hidden="true" />
      </NavLink>
      <div className={`fi2t-header__submenu${open ? ' is-open' : ''}`} role="menu">
        {item.children.map((child) => (
          <NavLink
            key={child.key}
            to={child.to}
            end
            role="menuitem"
            className={({ isActive }) =>
              `fi2t-header__sublink${isActive ? ' is-active' : ''}`
            }
            onClick={() => {
              if (!isEditMode) {
                clearLeaveTimer()
                setOpenKey(null)
                onNavigate()
              }
            }}
          >
            <NavLabel blockKey={child.key} fallback={child.label} />
          </NavLink>
        ))}
      </div>
    </div>
  )
}

function Fi2tHeaderInner() {
  const [open, setOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [dropdownKey, setDropdownKey] = useState<string | null>(null)
  const langRef = useRef<HTMLDivElement>(null)
  const { t, i18n: i18nHook } = useTranslation()
  const currentLang = (i18nHook.language || 'fr').split('-')[0]
  const current = LANGS.find((l) => l.code === currentLang) ?? LANGS[0]

  const setLang = (code: string) => {
    void i18n.changeLanguage(code)
    localStorage.setItem('fi2t_lang', code)
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = code
    setLangOpen(false)
    setOpen(false)
  }

  useEffect(() => {
    if (!langOpen) return
    const onDoc = (e: MouseEvent) => {
      if (!langRef.current?.contains(e.target as Node)) setLangOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLangOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [langOpen])

  return (
    <header className="fi2t-header">
      <div className="fi2t-header__inner">
        <Link to="/" className="fi2t-header__logo" onClick={() => setOpen(false)}>
          <EditableImage
            page="global"
            blockKey="header.logo"
            label="Logo du site"
            alt="FI2T"
            fallback="/logo.png"
          />
        </Link>

        <nav className={`fi2t-header__nav ${open ? 'is-open' : ''}`}>
          {NAV.map((item) =>
            item.kind === 'link' ? (
              <NavLink
                key={item.key}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `fi2t-header__link${isActive ? ' is-active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <NavLabel blockKey={item.key} fallback={item.label} />
              </NavLink>
            ) : (
              <NavDropdown
                key={item.key}
                item={item}
                openKey={dropdownKey}
                setOpenKey={setDropdownKey}
                onNavigate={() => setOpen(false)}
              />
            ),
          )}

          <div className="fi2t-header__langs" ref={langRef}>
            <button
              type="button"
              className="fi2t-header__lang-btn"
              aria-expanded={langOpen}
              aria-haspopup="listbox"
              aria-label={t('fi2t.nav.language')}
              onClick={() => setLangOpen((v) => !v)}
            >
              <span>{current.label}</span>
              <i className="fa-solid fa-chevron-down" aria-hidden="true" />
            </button>
            {langOpen && (
              <ul className="fi2t-header__lang-menu" role="listbox" aria-label={t('fi2t.nav.language')}>
                {LANGS.map((lang) => (
                  <li key={lang.code} role="option" aria-selected={currentLang === lang.code}>
                    <button
                      type="button"
                      className={`fi2t-header__lang-option${currentLang === lang.code ? ' is-active' : ''}`}
                      onClick={() => setLang(lang.code)}
                    >
                      <span>{lang.full}</span>
                      <span className="fi2t-header__lang-code">{lang.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>

        <button
          type="button"
          className="fi2t-header__burger"
          aria-label={open ? t('nav.closeMenu') : t('nav.menu')}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}

export default function Fi2tHeader() {
  return (
    <ContentProvider page="global">
      <Fi2tHeaderInner />
    </ContentProvider>
  )
}
