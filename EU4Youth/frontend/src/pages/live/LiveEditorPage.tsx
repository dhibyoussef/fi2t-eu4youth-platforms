import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Globe,
  Loader2,
  Maximize2,
  Monitor,
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw,
  Save,
  Search,
  Smartphone,
  Tablet,
  Undo2,
  X,
} from 'lucide-react'
import { LOCALES, api, type Locale } from '../../api/client'
import { buildLiveEditorUrl } from '../../api/editSession'
import ContextualHelp from '../../components/ContextualHelp'
import { sectionDisplayLabel } from '../../lib/sectionLabels'
import { pageDisplayTitle, type CmsPage } from '../content/components/PageSidebar'

const LOCALE_LABEL: Record<Locale, string> = { fr: '🇫🇷 FR', en: '🇬🇧 EN', ar: '🇹🇳 AR' }

const DETAIL_PAGES: { path: string; label: string }[] = [
  { path: '/projets/jeuness', label: 'Fiche Jeun’ESS' },
  { path: '/opportunites/irada-2e-appel-a-propositions-2026', label: 'Fiche opportunité (exemple)' },
  { path: '/actualites/go4youth-avancees-transformation-digitale-aneti-avril-2026', label: 'Fiche actualité (exemple)' },
  { path: '/publications/go4youth-newsletter-11', label: 'Fiche publication (exemple)' },
  { path: '/agenda/go4youth-tre-decembre-2025', label: 'Fiche événement (exemple)' },
]

function buildPageGroups(pages: CmsPage[]) {
  const grouped = pages
    .filter((page) => page.template !== 'global' && page.slug !== 'global')
    .reduce<Record<string, { path: string; label: string }[]>>((acc, page) => {
      const group = page.group || 'Pages'
      if (!acc[group]) acc[group] = []
      acc[group].push({
        path: page.path || (page.slug === 'home' ? '/' : `/${page.slug}`),
        label: pageDisplayTitle(page),
      })
      return acc
    }, {})

  const groups = Object.entries(grouped).map(([label, groupPages]) => ({
    label,
    pages: groupPages.sort((a, b) => a.label.localeCompare(b.label, 'fr')),
  }))

  if (DETAIL_PAGES.length) {
    groups.push({ label: 'Fiches détail (exemples)', pages: DETAIL_PAGES })
  }

  return groups.length ? groups : FALLBACK_PAGE_GROUPS
}

const FALLBACK_PAGE_GROUPS: { label: string; pages: { path: string; label: string }[] }[] = [
  { label: 'Principal', pages: [{ path: '/', label: 'Accueil' }] },
]

const WIDTH: Record<string, number> = { desktop: 1440, tablet: 768, mobile: 390 }
const DEVICE_LABEL: Record<string, string> = { desktop: 'Bureau', tablet: 'Tablette', mobile: 'Mobile' }

function groupForPath(path: string, groups: { label: string; pages: { path: string; label: string }[] }[]) {
  return groups.find((group) => group.pages.some((page) => page.path === path))?.label ?? 'Principal'
}

export default function LiveEditorPage() {
  const { data: cmsPages = [] } = useQuery<CmsPage[]>({
    queryKey: ['cms-pages-live'],
    queryFn: () => api.get('/admin/content/matrix', { params: { page: 'home' } }).then((res) => res.data.pages ?? []),
    staleTime: 60_000,
  })

  const pageGroups = useMemo(() => buildPageGroups(cmsPages), [cmsPages])
  const allPages = useMemo(() => pageGroups.flatMap((group) => group.pages), [pageGroups])
  const [path, setPath] = useState('/')
  const [src, setSrc] = useState('')
  const [device, setDevice] = useState('desktop')
  const [locale, setLocale] = useState<Locale>('fr')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sections, setSections] = useState<{ id: string; label: string }[]>([])
  const [navOpen, setNavOpen] = useState(true)
  const [mainNavCollapsed, setMainNavCollapsed] = useState(false)
  const [pageQuery, setPageQuery] = useState('')
  const [dirtyCount, setDirtyCount] = useState(0)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [zoomFit, setZoomFit] = useState(true)
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({})
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [frameScale, setFrameScale] = useState(1)
  const [stageHeight, setStageHeight] = useState(900)

  const currentPage = allPages.find((page) => page.path === path)
  const activeGroup = groupForPath(path, pageGroups)

  const filteredGroups = useMemo(() => {
    const needle = pageQuery.trim().toLocaleLowerCase('fr')
    if (!needle) return pageGroups
    return pageGroups
      .map((group) => ({
        ...group,
        pages: group.pages.filter(
          (page) =>
            page.label.toLocaleLowerCase('fr').includes(needle) ||
            page.path.toLocaleLowerCase('fr').includes(needle),
        ),
      }))
      .filter((group) => group.pages.length > 0)
  }, [pageQuery, pageGroups])

  const postToFrame = (payload: Record<string, unknown>) => {
    iframeRef.current?.contentWindow?.postMessage(payload, '*')
  }

  const guardDirty = useCallback(() => {
    if (!dirtyCount) return true
    return confirm(
      `${dirtyCount} modification${dirtyCount !== 1 ? 's' : ''} non enregistrée${dirtyCount !== 1 ? 's' : ''}. Continuer sans enregistrer ?`,
    )
  }, [dirtyCount])

  const load = async (nextPath = path, nextLocale = locale, force = false) => {
    if (!force && nextPath === path && nextLocale === locale && src) return
    try {
      setLoading(true)
      setSections([])
      setActiveSection(null)
      if (force || nextPath !== path || nextLocale !== locale) setDirtyCount(0)
      setSrc(await buildLiveEditorUrl(nextPath, { locale: nextLocale, live_edit: '1' }))
    } catch {
      setLoading(false)
      setSrc('')
      toast.error('API 8040 indisponible. Lancez backend puis le site 3030.')
    }
  }

  const navigateTo = (nextPath: string, nextLocale = locale) => {
    if (nextPath === path && nextLocale === locale) return
    if (!guardDirty()) return
    setPath(nextPath)
    void load(nextPath, nextLocale, true)
  }

  const switchLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) return
    if (!guardDirty()) return
    setLocale(nextLocale)
    postToFrame({ type: 'eu4y-cms-set-locale', locale: nextLocale })
  }

  useEffect(() => {
    void load('/', 'fr', true)
  }, [])

  useEffect(() => {
    document.querySelector('.shell')?.classList.toggle('shell--sidebar-hidden', mainNavCollapsed)
    return () => document.querySelector('.shell')?.classList.remove('shell--sidebar-hidden')
  }, [mainNavCollapsed])

  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const measure = () => {
      const artboardW = WIDTH[device]
      const available = Math.max(320, stage.clientWidth - (device === 'desktop' ? 48 : 80))
      setFrameScale(zoomFit ? Math.min(1, available / artboardW) : 1)
      setStageHeight(Math.max(640, stage.clientHeight - 40))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [device, navOpen, mainNavCollapsed, zoomFit])

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === 'eu4y-cms-saved') {
        setDirtyCount(0)
        setSaving(false)
        toast.success(event.data.wrote === false ? 'Rien à enregistrer' : 'Contenu enregistré')
      }
      if (event.data?.type === 'eu4y-cms-save-error') {
        setSaving(false)
        toast.error('Enregistrement impossible. Vérifiez l’API 8040.')
      }
      if (event.data?.type === 'eu4y-cms-saving') {
        setSaving(Boolean(event.data.saving))
      }
      if (event.data?.type === 'eu4y-cms-dirty') {
        setDirtyCount(Number(event.data.count) || 0)
      }
      if (event.data?.type === 'eu4y-cms-outline' && Array.isArray(event.data.sections)) {
        setSections(
          event.data.sections
            .filter((item: { id: string }) => item.id)
            .map((item: { id: string; label?: string }) => ({
              id: item.id,
              label: sectionDisplayLabel(item.id, item.label),
            })),
        )
      }
      if (event.data?.type === 'eu4y-cms-section-active' && event.data.section) {
        setActiveSection(String(event.data.section))
      }
      if (event.data?.type === 'eu4y-cms-discarded') {
        setDirtyCount(0)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  const triggerSave = useCallback(() => {
    setSaving(true)
    postToFrame({ type: 'eu4y-cms-save' })
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault()
        if (dirtyCount) triggerSave()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dirtyCount, triggerSave])

  const jump = (id: string) => {
    setActiveSection(id)
    postToFrame({ type: 'eu4y-cms-scroll', section: id })
  }

  const triggerDiscard = () => {
    if (dirtyCount > 0 && !confirm('Recharger la page et annuler toutes les modifications non enregistrées ?')) return
    postToFrame({ type: 'eu4y-cms-discard' })
  }

  const toggleGroup = (label: string) => {
    setCollapsedGroups((current) => ({ ...current, [label]: !current[label] }))
  }

  const isGroupOpen = (label: string) => {
    if (pageQuery.trim()) return true
    if (label === activeGroup) return true
    return !collapsedGroups[label]
  }

  const scalePct = Math.round(frameScale * 100)
  const effectiveScale = zoomFit ? frameScale : 1
  const iframeHeight =
    device === 'desktop'
      ? `${100 / effectiveScale}%`
      : `${Math.max(stageHeight, 900) / effectiveScale}px`

  return (
    <div className={`studio studio--live${navOpen ? '' : ' studio--nav-collapsed'}${dirtyCount ? ' studio--dirty' : ''}`}>
      <div className="studio__bar">
        <div className="studio__bar-start">
          <button
            type="button"
            className="studio__toggle"
            title={navOpen ? 'Masquer la liste des pages' : 'Afficher la liste des pages'}
            onClick={() => setNavOpen((open) => !open)}
          >
            {navOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
          </button>
          <button
            type="button"
            className={`studio__toggle${mainNavCollapsed ? '' : ' studio__toggle--active'}`}
            title={mainNavCollapsed ? 'Afficher le menu CMS' : 'Masquer le menu CMS'}
            onClick={() => setMainNavCollapsed((collapsed) => !collapsed)}
          >
            CMS
          </button>
          <ContextualHelp screen="live-editor" />
          <div className="studio__brand">
            <strong>Aperçu live</strong>
            <span className="studio__path">
              {currentPage?.label || path}
              <em>{path}</em>
            </span>
          </div>
        </div>

        <div className="studio__bar-center">
          <div className="live__langs">
            <Globe size={13} aria-hidden="true" />
            {LOCALES.map((code) => (
              <button
                key={code}
                type="button"
                className={locale === code ? 'active' : ''}
                onClick={() => switchLocale(code)}
              >
                {LOCALE_LABEL[code]}
              </button>
            ))}
          </div>
          <div className="studio__devices">
            {([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as const).map(([d, Icon]) => (
              <button
                key={d}
                type="button"
                className={device === d ? 'active' : ''}
                title={DEVICE_LABEL[d]}
                onClick={() => setDevice(d)}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
          <button
            type="button"
            className={`studio__toggle studio__zoom${zoomFit ? ' studio__toggle--active' : ''}`}
            title={zoomFit ? 'Afficher à 100%' : 'Ajuster à la largeur'}
            onClick={() => setZoomFit((fit) => !fit)}
          >
            <Maximize2 size={13} />
            {zoomFit ? `${scalePct}%` : '100%'}
          </button>
        </div>

        <div className="studio__bar-end">
          {dirtyCount > 0 ? (
            <span className="studio__status">{dirtyCount} modif.{dirtyCount !== 1 ? 's' : ''}</span>
          ) : (
            <span className="studio__status studio__status--ok">À jour</span>
          )}
          <button
            type="button"
            className="studio__toggle"
            title="Recharger sans enregistrer"
            disabled={!dirtyCount}
            onClick={triggerDiscard}
          >
            <Undo2 size={14} />
          </button>
          <button
            type="button"
            className="studio__save"
            title="Enregistrer (Ctrl+S)"
            disabled={!dirtyCount || saving}
            onClick={triggerSave}
          >
            {saving ? <Loader2 size={14} className="spin" /> : <Save size={14} />}
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          <button
            type="button"
            className="studio__toggle"
            title="Recharger l’aperçu"
            onClick={() => {
              if (!guardDirty()) return
              void load(path, locale, true)
            }}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
          </button>
          <button
            type="button"
            className="studio__open"
            onClick={() => window.open(src || 'http://localhost:3030/', '_blank')}
          >
            Nouvel onglet <ExternalLink size={12} />
          </button>
        </div>
      </div>

      <aside className={`studio__nav${navOpen ? '' : ' studio__nav--hidden'}`}>
          <div className="studio__nav-search">
            <Search size={14} aria-hidden="true" />
            <input
              type="search"
              placeholder="Filtrer les pages…"
              value={pageQuery}
              onChange={(e) => setPageQuery(e.target.value)}
            />
            {pageQuery ? (
              <button type="button" className="studio__nav-clear" onClick={() => setPageQuery('')} aria-label="Effacer">
                <X size={14} />
              </button>
            ) : null}
          </div>

          <div className="studio__nav-scroll">
            {filteredGroups.map((group) => {
              const open = isGroupOpen(group.label)
              return (
                <div key={group.label} className="studio__nav-group">
                  <button
                    type="button"
                    className="studio__nav-group-toggle"
                    onClick={() => toggleGroup(group.label)}
                  >
                    {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    {group.label}
                    <span>{group.pages.length}</span>
                  </button>
                  {open ? (
                    <div className="studio__nav-group-pages">
                      {group.pages.map((page) => (
                        <button
                          key={page.path}
                          type="button"
                          className={path === page.path ? 'active' : ''}
                          onClick={() => navigateTo(page.path)}
                        >
                          {page.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              )
            })}
            {!filteredGroups.length ? (
              <p className="studio__nav-empty">Aucune page ne correspond.</p>
            ) : null}

            {sections.length > 0 ? (
              <div className="studio__nav-group studio__nav-group--sections">
                <p className="nav-label">Zones de la page</p>
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    className={`studio__nav-section${activeSection === section.id ? ' active' : ''}`}
                    onClick={() => jump(section.id)}
                  >
                    {section.label || section.id}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="studio__help">
            <strong>Comment éditer</strong>
            <p>Crayon orange → modifier le texte. Boutons « Gérer » → listes et images. Enregistrer en haut ou Ctrl+S.</p>
          </div>
        </aside>

      <div className={`studio__stage${device === 'desktop' ? ' studio__stage--desktop' : ''}`} ref={stageRef}>
        {loading ? (
          <div className="studio__loading">
            <Loader2 size={28} className="spin" />
            <p>Chargement de {currentPage?.label || 'la page'}…</p>
          </div>
        ) : null}
        <div className={`studio__device studio__device--${device}`}>
          {device !== 'desktop' ? <div className="studio__device-notch" aria-hidden="true" /> : null}
          <div
            className="studio__frame"
            style={{
              width: Math.round(WIDTH[device] * effectiveScale),
              minWidth: Math.round(WIDTH[device] * effectiveScale),
              height: device === 'desktop' ? '100%' : 'auto',
              minHeight: device === 'desktop' ? undefined : Math.round(Math.max(stageHeight, 900) * effectiveScale),
            }}
          >
            {src ? (
              <iframe
                ref={iframeRef}
                title="Site public EU4Youth"
                src={src}
                width={WIDTH[device]}
                style={{
                  width: WIDTH[device],
                  height: iframeHeight,
                  transform: `scale(${effectiveScale})`,
                  transformOrigin: 'top left',
                }}
                onLoad={() => setLoading(false)}
              />
            ) : (
              !loading ? (
                <p className="studio__error">API indisponible — démarrez le backend (8040) et le site (3030).</p>
              ) : null
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
