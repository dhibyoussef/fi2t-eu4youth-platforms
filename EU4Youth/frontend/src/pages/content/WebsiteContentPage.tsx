import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LayoutGrid, List, Loader2, Save, Search, Settings, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider'
import { api } from '../../api/client'
import { notifyContentSaved, onContentUpdated } from '../../lib/contentSync'
import PageBuilder, { type InsertTarget } from './builder/PageBuilder'
import AddPageModal from './components/AddPageModal'
import { FriendlyJsonRows } from './components/FriendlyJsonRows'
import PageSidebar, { type CmsPage, pageDisplayTitle } from './components/PageSidebar'
import SiteMenuEditor from './SiteMenuEditor'
import SiteSettingsEditor, { type GlobalSettingsTab } from './SiteSettingsEditor'

interface LocaleCell {
  id?: number
  value: string | null
}

interface BlockRow {
  key: string
  type: 'text' | 'image' | 'json'
  label: string | null
  sort_order?: number
  locales: Record<string, LocaleCell>
}

interface SectionGroup {
  name: string
  title?: string
  pattern?: string | null
  blocks: BlockRow[]
}

interface MatrixResponse {
  page: string
  page_meta?: CmsPage
  pages: CmsPage[]
  sections: SectionGroup[]
}

interface PendingChange {
  page: string
  section: string
  key: string
  locale: string
  type: 'text' | 'image' | 'json'
  value: string
  label?: string
}

const TEXT_LOCALES = [
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'ar', flag: '🇹🇳', name: 'العربية' },
] as const

function changeId(change: PendingChange) {
  return `${change.section}.${change.key}.${change.locale}`
}

/** Fields the public page actually reads. Extra CMS leftovers are hidden from Structure / Composants. */
const LIVE_FIELDS: Record<string, Record<string, string[]>> = {
  'a-propos': {
    hero: ['image', 'badge', 'title', 'body', 'ctaProjects', 'ctaOpportunities', 'ctaMap'],
    pourquoi: ['photos', 'title', 'body', 'more', 'quote', 'moreBody'],
    vision: ['principles', 'title', 'lead', 'body', 'more', 'closing'],
    objectifs: ['items', 'title'],
    comment: ['items', 'title', 'lead'],
    projets: ['title', 'subtitle', 'body', 'fiches', 'ficheCta'],
    territoires: ['title', 'body', 'legendTitle', 'legendNote'],
    impact: ['title', 'body', 'items', 'chartHint', 'chartTitle', 'chartHeadValue', 'chartHeadLabel', 'secteurs', 'pending', 'pendingNote'],
    partners: ['title', 'body', 'tabs'],
    avenir: ['items', 'title', 'body', 'image'],
  },
  objectifs: {
    hero: ['badge', 'title', 'vision', 'body', 'visionBody', 'principles', 'closing'],
    objectives: ['icon', 'title', 'items'],
    action: ['title', 'items'],
    projets: ['title', 'subtitle', 'body', 'logos', 'composantes', 'cta'],
  },
  financement: {
    hero: ['badge', 'title', 'body', 'amount', 'unit', 'figureLabel', 'flags'],
    facts: ['title', 'intro', 'items'],
    projects: ['eyebrow', 'title', 'body', 'items'],
    purpose: ['title', 'items'],
    structure: ['title', 'items'],
    cta: ['eyebrow', 'title', 'projects', 'publications'],
  },
  gouvernance: {
    hero: ['badge', 'title', 'body'],
    model: ['title', 'intro', 'items'],
    map: ['eyebrow', 'title', 'body', 'layers'],
    eu: ['eyebrow', 'title', 'body', 'flags'],
    framework: ['eyebrow', 'title', 'body', 'members'],
    institutions: ['title', 'body', 'items'],
    implementation: ['eyebrow', 'title', 'body', 'items'],
    accountability: ['title', 'items'],
    youth: ['eyebrow', 'title', 'body'],
    legacy: ['eyebrow', 'title', 'body'],
    cta: ['title', 'about', 'funding'],
  },
  'mecanismes-appui': {
    hero: ['title'],
    browser: [
      'intro',
      'countLabel',
      'all',
      'search',
      'placeholder',
      'project',
      'sector',
      'reset',
      'more',
      'empty',
      'cardLink',
      'items',
    ],
    cta: ['eyebrow', 'title', 'body', 'projects', 'partners'],
  },
  partenaires: {
    hero: ['title', 'body'],
    figures: ['items'],
    tabs: ['items'],
    eu: ['flags', 'title', 'body', 'link'],
    institutions: ['items'],
    implementers: ['items', 'link'],
    cta: ['eyebrow', 'title', 'governance', 'funding', 'projects'],
  },
  'eu-en-tunisie': {
    hero: ['badge', 'title'],
    intro: ['eyebrow', 'title', 'body'],
    themes: ['eyebrow', 'title', 'items'],
    explore: ['eyebrow', 'title', 'body', 'mapCta', 'siteCta'],
  },
  projets: {
    hero: ['badge', 'title', 'body'],
    filters: ['eyebrow', 'title', 'theme', 'governorate', 'beneficiary', 'all', 'reset', 'projectOne', 'projectMany'],
    grid: ['composantes', 'items', 'link', 'partner', 'budget', 'period', 'territory', 'emptyTitle', 'emptyCta'],
    cta: ['title', 'map', 'objectives'],
  },
  projet: {
    presentation: ['title'],
    fiche: ['fullName', 'acronym', 'period', 'funding', 'implementer', 'sectors'],
    objectifs: ['title', 'tabGeneral', 'tabSpecifiques', 'generalHeading', 'specificHeading'],
    composantes: ['title'],
    impact: ['title'],
    stories: ['eyebrow', 'title', 'cta'],
    feeds: [
      'oppsTitle',
      'oppsBody',
      'oppsCta',
      'newsTitle',
      'newsBody',
      'newsCta',
      'eventsTitle',
      'eventsBody',
      'eventsCta',
    ],
    ressources: ['title', 'body', 'cta'],
    siblings: ['title'],
  },
  carte: {
    hero: ['badge', 'title', 'body', 'lead'],
    filters: [
      'eyebrow',
      'title',
      'project',
      'nature',
      'governorate',
      'sector',
      'all',
      'allProjects',
      'allGovernorates',
      'unstated',
      'note',
      'search',
      'placeholder',
      'reset',
      'stats',
    ],
    map: ['aria', 'legend', 'ficheOne', 'ficheMany'],
    results: [
      'eyebrow',
      'interventionOne',
      'interventionMany',
      'visibleOne',
      'visibleMany',
      'export',
      'empty',
      'emptyCta',
      'prev',
      'next',
      'pageOf',
      'detailEyebrow',
      'close',
      'dtProject',
      'dtGovernorate',
      'dtLocality',
      'dtNature',
      'dtSector',
      'link',
    ],
  },
  opportunites: {
    hero: ['title', 'body'],
    browser: [
      'search',
      'placeholder',
      'filtersTitle',
      'reset',
      'type',
      'status',
      'theme',
      'project',
      'location',
      'audience',
      'allF',
      'allM',
      'types',
      'items',
      'statusOpen',
      'statusSoon',
      'statusClosed',
      'one',
      'many',
      'sort',
      'sortDeadline',
      'sortRecent',
      'emptyEyebrow',
      'emptyOpen',
      'empty',
      'emptyHint',
      'emptyArchives',
      'emptyCta',
      'archives',
      'agenda',
      'news',
    ],
  },
  opportunite: {
    fiche: [
      'back',
      'deadline',
      'period',
      'territories',
      'audiences',
      'themes',
      'project',
      'dossierTitle',
      'dossierBody',
      'download',
      'closedNotice',
      'contact',
      'helpTitle',
      'helpBody',
    ],
  },
  home: {
    hero: ['slides', 'badge', 'title', 'body', 'ctaProjects', 'ctaOpportunities', 'ctaMap'],
    chiffres: ['title', 'period', 'items'],
    projets: ['title', 'subtitle', 'body', 'logos'],
    map: ['image', 'title', 'subtitle', 'body', 'cta'],
    streams: [
      'opportunitiesTitle',
      'newsTitle',
      'eventsTitle',
      'opportunityCards',
      'newsCards',
      'eventCards',
      'opportunityCta',
      'newsCta',
      'eventCta',
    ],
    stories: ['portrait', 'graffiti', 'eyebrow', 'title', 'cta'],
    publications: ['image', 'title', 'body', 'cta'],
    newsletter: ['collage', 'title', 'body', 'legal', 'placeholder', 'submit'],
  },
  actualites: {
    hero: ['title', 'body'],
    browser: [
      'search',
      'placeholder',
      'filtersTitle',
      'reset',
      'type',
      'project',
      'theme',
      'period',
      'location',
      'allF',
      'types',
      'items',
      'one',
      'many',
      'sortHint',
      'read',
      'prev',
      'next',
      'empty',
      'emptyHint',
      'emptyCta',
    ],
  },
  actualite: {
    fiche: [
      'back',
      'sourceTitle',
      'sourceLead',
      'sourceCta',
      'dtProject',
      'dtThemes',
      'dtTerritory',
      'dtType',
      'related',
    ],
  },
  publications: {
    hero: ['title', 'body', 'image'],
    browser: [
      'search',
      'placeholder',
      'type',
      'theme',
      'project',
      'year',
      'language',
      'format',
      'sort',
      'allF',
      'types',
      'sorts',
      'items',
      'one',
      'many',
      'reset',
      'download',
      'missingFile',
      'prev',
      'next',
      'empty',
      'emptyHint',
    ],
  },
  publication: {
    fiche: [
      'back',
      'dtType',
      'dtProject',
      'dtDate',
      'dtFormat',
      'dtLanguage',
      'dtThemes',
      'sourceTitle',
      'sourceLead',
      'sourceMissing',
      'download',
      'related',
      'relatedEmpty',
      'projectCta',
    ],
  },
  stories: {
    hero: ['image', 'badge', 'title'],
    archive: [
      'eyebrow',
      'title',
      'emptyNumber',
      'emptyEyebrow',
      'emptyTitle',
      'emptyBody',
      'ctaProjects',
      'ctaContact',
    ],
    slots: ['eyebrow', 'title', 'items', 'badge', 'hint'],
    projects: ['eyebrow', 'title'],
  },
  'coin-media': {
    hero: ['badge', 'title', 'mark'],
    access: ['eyebrow', 'title', 'items'],
    news: ['eyebrow', 'title', 'more', 'empty'],
    videos: ['eyebrow', 'title', 'empty'],
    resources: ['eyebrow', 'title', 'more', 'download', 'missingFile', 'undated', 'empty'],
    press: ['eyebrow', 'title', 'body', 'cta'],
  },
  glossaire: {
    hero: ['badge', 'title', 'mark', 'body'],
    browser: ['search', 'placeholder', 'allF', 'one', 'many', 'reset', 'empty', 'emptyCta'],
  },
  agenda: {
    hero: ['badge', 'title', 'mark', 'body'],
    browser: [
      'upcoming',
      'past',
      'notice',
      'search',
      'placeholder',
      'filtersTitle',
      'reset',
      'period',
      'project',
      'allM',
      'one',
      'many',
      'sortUpcoming',
      'sortPast',
      'cardDetail',
      'cardProject',
      'emptyReady',
      'emptyUpcomingTitle',
      'emptyUpcomingBody',
      'emptyPastCta',
      'emptyFiltered',
      'emptyReset',
      'ctaNews',
      'ctaOpportunities',
    ],
  },
  evenement: {
    fiche: [
      'back',
      'dtDate',
      'dtLocation',
      'dtFormat',
      'dtProject',
      'sourceTitle',
      'sourceLead',
      'sourceCta',
      'noticePast',
      'noticeUpcoming',
      'related',
      'projectCta',
    ],
  },
  recherche: {
    hero: ['badge', 'title'],
    browser: ['search', 'placeholder', 'submit', 'type', 'allM'],
    results: ['one', 'many', 'forQuery', 'hint', 'empty'],
  },
  'plan-du-site': {
    hero: ['badge', 'title', 'mark', 'body'],
    index: ['items'],
  },
  confidentialite: {
    hero: ['badge', 'title', 'mark'],
    intro: ['kicker', 'title', 'body', 'toc', 'nav'],
    chapters: ['items'],
    actions: ['home', 'contact'],
  },
  'mentions-legales': {
    hero: ['badge', 'title', 'mark'],
    intro: ['kicker', 'title', 'body', 'toc', 'nav'],
    chapters: ['items'],
    actions: ['home', 'contact'],
  },
  accessibilite: {
    hero: ['badge', 'title', 'mark'],
    intro: ['kicker', 'title', 'body', 'toc', 'nav'],
    chapters: ['items'],
    actions: ['home', 'contact'],
  },
  cookies: {
    hero: ['badge', 'title', 'mark'],
    intro: ['kicker', 'title', 'body', 'toc', 'nav'],
    chapters: ['items'],
    actions: ['home', 'contact'],
  },
  introuvable: {
    hero: ['title', 'body'],
    links: ['items'],
    actions: ['home'],
  },
  global: {
    header: ['logo', 'flags', 'mailIcon', 'searchIcon'],
    footer: [
      'logo',
      'flags',
      'disclaimer',
      'col1',
      'col2',
      'col3',
      'programme',
      'explorer',
      'legal',
      'youtube',
      'facebook',
      'linkedin',
      'instagram',
    ],
    legal: ['cookieBanner', 'more', 'accept', 'reject'],
  },
  contact: {
    hero: ['portrait', 'title', 'body'],
    form: [
      'labels',
      'profiles',
      'projects',
      'locations',
      'requestTypes',
      'consent',
      'reset',
      'submit',
      'successTitle',
      'successBody',
    ],
  },
}

function isRetiredField(page: string, section: string, key: string) {
  if (page === 'global' && section === 'settings') return true
  if (page === 'global' && section === 'footer' && key === 'about') return true
  if (page === 'home' && /^kpi\d/.test(key)) return true
  if (page === 'home' && section === 'hero' && /^(image|slide[2-5])$/.test(key)) return true
  if (page === 'home' && section === 'streams' && /^(opportunity|news|event)\d/.test(key)) return true
  if (page === 'contact' && section === 'hero' && key === 'badge') return true
  const live = LIVE_FIELDS[page]
  if (!live) return false
  const keys = live[section]
  /* Unknown / newly inserted zones stay visible so Structure matches Aperçu. */
  if (!keys) return false
  return !keys.includes(key)
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export default function WebsiteContentPage() {
  const qc = useQueryClient()
  const { user } = useAuth()
  const isAdmin = user?.role === 'administrateur'
  const [params, setParams] = useSearchParams()
  const [activePage, setActivePage] = useState(params.get('page') || 'home')
  const [search, setSearch] = useState('')
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [changes, setChanges] = useState<Record<string, PendingChange>>({})
  const [viewMode, setViewMode] = useState<'builder' | 'list'>('builder')
  const [listLocale, setListLocale] = useState<(typeof TEXT_LOCALES)[number]['code']>('fr')
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [insertTarget, setInsertTarget] = useState<InsertTarget>(null)
  const [addPageModal, setAddPageModal] = useState(false)
  const [globalTab, setGlobalTab] = useState<GlobalSettingsTab | 'menu'>(() => {
    const tab = params.get('tab')
    if (tab === 'footer' || tab === 'cookies' || tab === 'menu') return tab
    return 'header'
  })
  const [pageSettingsOpen, setPageSettingsOpen] = useState(false)
  const [pageSettings, setPageSettings] = useState({
    status: 'published' as 'draft' | 'published',
    template: 'default',
    meta_title: '',
    meta_description: '',
  })

  const { data, isLoading } = useQuery<MatrixResponse>({
    queryKey: ['content-matrix', activePage],
    queryFn: () => api.get('/admin/content/matrix', { params: { page: activePage } }).then((r) => r.data),
    staleTime: 15_000,
    placeholderData: keepPreviousData,
  })

  const matrixCache = useRef<Record<string, MatrixResponse>>({})
  if (data?.page) matrixCache.current[data.page] = data
  const currentMatrix = matrixCache.current[activePage] ?? (data?.page === activePage ? data : undefined)
  const display = currentMatrix ?? data
  const cmsPages: CmsPage[] = useMemo(() => display?.pages ?? [], [display?.pages])
  const sections = currentMatrix?.sections ?? []
  const activePageMeta = currentMatrix?.page_meta ?? cmsPages.find((p) => p.slug === activePage)

  useEffect(() => {
    const tab = params.get('tab')
    if (activePage === 'global' && tab && ['header', 'footer', 'cookies', 'menu'].includes(tab)) {
      setGlobalTab(tab as GlobalSettingsTab | 'menu')
    }
  }, [params, activePage])

  useEffect(() => {
    if (!isAdmin && viewMode === 'list') setViewMode('builder')
  }, [isAdmin, viewMode])

  const selectGlobalTab = (tab: GlobalSettingsTab | 'menu') => {
    setGlobalTab(tab)
    setInsertTarget(null)
    const next = new URLSearchParams(params)
    next.set('page', 'global')
    next.set('tab', tab)
    setParams(next, { replace: true })
  }

  useEffect(() => {
    const unsub = onContentUpdated((msg) => {
      if (msg.source === 'dashboard') return
      qc.invalidateQueries({ queryKey: ['content-matrix'] })
    })
    return unsub
  }, [qc])

  useEffect(() => {
    if (currentMatrix?.page_meta) {
      setPageSettings({
        status: currentMatrix.page_meta.status ?? 'published',
        template: currentMatrix.page_meta.template ?? 'default',
        meta_title: currentMatrix.page_meta.meta_title ?? '',
        meta_description: currentMatrix.page_meta.meta_description ?? '',
      })
    }
  }, [currentMatrix?.page_meta])

  const effectiveValue = (section: string, block: BlockRow, locale: string) => {
    const id = `${section}.${block.key}.${locale}`
    if (changes[id]) return changes[id].value
    return block.locales[locale]?.value ?? ''
  }

  const effectiveLabel = (section: string, block: BlockRow) => {
    for (const change of Object.values(changes)) {
      if (change.section === section && change.key === block.key && change.label !== undefined) return change.label
    }
    return block.label ?? ''
  }

  const setChange = (change: PendingChange) => {
    setChanges((prev) => ({ ...prev, [changeId(change)]: change }))
  }

  const setValueChange = (section: string, block: BlockRow, locale: string, value: string) => {
    setChange({
      page: activePage,
      section,
      key: block.key,
      locale,
      type: block.type,
      value,
      label: effectiveLabel(section, block),
    })
  }

  const setLabelChange = (section: string, block: BlockRow, label: string) => {
    const locales = block.type === 'text' || block.type === 'json' ? TEXT_LOCALES.map((l) => l.code) : ['_all']
    for (const loc of locales) {
      setChange({
        page: activePage,
        section,
        key: block.key,
        locale: loc,
        type: block.type,
        value: changes[`${section}.${block.key}.${loc}`]?.value ?? block.locales[loc]?.value ?? '',
        label,
      })
    }
  }

  const dirtyCount = Object.keys(changes).length

  const saveMutation = useMutation({
    mutationFn: async () => {
      const blocks = Object.values(changes)
      await api.post('/admin/content/bulk', { blocks, source_locale: 'fr', translate: true })
      if (pageSettingsOpen && activePageMeta) {
        await api.put(`/admin/content/pages/${activePage}`, pageSettings)
      }
    },
    onSuccess: () => {
      setChanges({})
      qc.invalidateQueries({ queryKey: ['content-matrix', activePage] })
      notifyContentSaved(activePage)
      toast.success(activePage === 'global' ? 'Paramètres du site enregistrés' : 'Contenu enregistré')
    },
    onError: () => toast.error('Enregistrement impossible'),
  })

  const insertMutation = useMutation({
    mutationFn: (pattern: string) =>
      api.post('/admin/content/insert-pattern', {
        page: activePage,
        pattern,
        insert_after: insertTarget || '__end__',
      }),
    onSuccess: () => {
      setInsertTarget(null)
      qc.invalidateQueries({ queryKey: ['content-matrix', activePage] })
      toast.success('Zone ajoutée')
    },
  })

  const selectPage = (slug: string) => {
    if (slug === activePage) return
    const pending = Object.keys(changes).length
    if (pending > 0 && !confirm(`${pending} modification${pending !== 1 ? 's' : ''} non enregistrée${pending !== 1 ? 's' : ''}. Changer de page sans enregistrer ?`)) {
      return
    }
    setActivePage(slug)
    setSelectedSection(null)
    setInsertTarget(null)
    setChanges({})
    if (slug === 'global') selectGlobalTab('header')
    setParams({ page: slug })
  }

  const uploadImage = async (section: string, block: BlockRow, file: File) => {
    try {
      const dataUrl = await fileToDataUrl(file)
      const { data: uploaded } = await api.post('/admin/content/upload-image', { dataUrl, filename: file.name })
      setValueChange(section, block, '_all', uploaded.url)
      toast.success('Image téléversée')
    } catch {
      toast.error('Téléversement impossible')
    }
  }

  const uploadFile = async (file: File) => {
    const dataUrl = await fileToDataUrl(file)
    const { data: uploaded } = await api.post('/admin/content/upload-image', { dataUrl, filename: file.name })
    return uploaded.url as string
  }

  const isGlobal = activePage === 'global'
  const pageTitle = activePageMeta ? pageDisplayTitle(activePageMeta) : activePage

  const builderSections = sections
    .map((sec) => ({
      ...sec,
      blocks: sec.blocks.filter((block) => !isRetiredField(activePage, sec.name, block.key)),
    }))
    .filter((sec) => sec.blocks.length > 0)

  const filteredSections = builderSections.filter((sec) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      sec.name.includes(q) ||
      (sec.title || '').toLowerCase().includes(q) ||
      sec.blocks.some(
        (b) =>
          !isRetiredField(activePage, sec.name, b.key) &&
          (b.key.includes(q) || (b.label || '').toLowerCase().includes(q)),
      )
    )
  })

  return (
    <div className="wc-shell">
      <PageSidebar
        pages={cmsPages}
        activeSlug={activePage}
        onSelect={selectPage}
        onAddPage={() => setAddPageModal(true)}
        onDeletePage={async (page) => {
          if (!confirm(`Supprimer ${page.title} ?`)) return
          await api.delete(`/admin/content/pages/${page.slug}`)
          qc.invalidateQueries({ queryKey: ['content-matrix'] })
          if (activePage === page.slug) selectPage('home')
        }}
      />
      <div className={`wc-main${isGlobal && globalTab === 'menu' ? ' wc-main--menu' : ''}`}>
        <div className="wc-toolbar">
          <div>
            <h2>{isGlobal && globalTab === 'menu' ? 'Menu du site' : pageTitle}</h2>
            <p>
              {isGlobal && globalTab === 'menu'
                ? 'Liens du menu principal · FR / EN / AR · enregistrement automatique'
                : isGlobal
                  ? 'En-tête, pied de page et cookies — communs à toutes les pages (pas le contenu de l’accueil)'
                  : `${activePageMeta?.path || ''} · ${builderSections.length} zone${builderSections.length > 1 ? 's' : ''}${
                      dirtyCount ? ` · ${dirtyCount} modification${dirtyCount > 1 ? 's' : ''}` : ''
                    }`}
            </p>
          </div>
          <div className="wc-toolbar__actions">
            {!isGlobal && isAdmin && (
            <div className="wc-view-toggle">
              <button type="button" className={viewMode === 'builder' ? 'active' : ''} onClick={() => setViewMode('builder')}>
                <LayoutGrid size={13} /> Éditeur visuel
              </button>
              <button type="button" className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>
                <List size={13} /> Liste (admin)
              </button>
            </div>
            )}
            {!(isGlobal && globalTab === 'menu') && dirtyCount > 0 && (
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setChanges({})}>
                <X size={13} /> Annuler ({dirtyCount})
              </button>
            )}
            {!(isGlobal && globalTab === 'menu') && (
              <button
                type="button"
                className="btn btn--orange btn--sm"
                disabled={!dirtyCount || saveMutation.isPending}
                onClick={() => saveMutation.mutate()}
              >
                <Save size={13} /> Enregistrer
              </button>
            )}
            {!(isGlobal && globalTab === 'menu') && !isGlobal && (
              <button
                type="button"
                className={`btn btn--ghost btn--sm${pageSettingsOpen ? ' is-on' : ''}`}
                onClick={() => setPageSettingsOpen((v) => !v)}
              >
                <Settings size={13} /> Paramètres
              </button>
            )}
          </div>
        </div>

        {isGlobal && (
          <div className="global-page-tabs">
            {(
              [
                ['header', 'En-tête'],
                ['footer', 'Pied de page'],
                ['cookies', 'Cookies'],
                ['menu', 'Menu du site'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={globalTab === id ? 'active' : ''}
                onClick={() => {
                  selectGlobalTab(id)
                  setSelectedSection(null)
                }}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {pageSettingsOpen && !isGlobal && (
          <div className="wc-page-settings">
            <label className="field field--catalog">
              <span>Statut</span>
              <select
                value={pageSettings.status}
                onChange={(event) => setPageSettings((s) => ({ ...s, status: event.target.value as 'draft' | 'published' }))}
              >
                <option value="published">Publié</option>
                <option value="draft">Brouillon</option>
              </select>
            </label>
            <label className="field field--catalog">
              <span>Titre SEO</span>
              <input
                value={pageSettings.meta_title}
                onChange={(event) => setPageSettings((s) => ({ ...s, meta_title: event.target.value }))}
              />
            </label>
            <label className="field field--catalog">
              <span>Description SEO</span>
              <textarea
                rows={2}
                value={pageSettings.meta_description}
                onChange={(event) => setPageSettings((s) => ({ ...s, meta_description: event.target.value }))}
              />
            </label>
          </div>
        )}

        {isGlobal ? (
          globalTab === 'menu' ? (
            <div className="wc-menu-panel">
              <SiteMenuEditor />
            </div>
          ) : (
            <SiteSettingsEditor
              tab={globalTab}
              effectiveValue={effectiveValue}
              setValueChange={setValueChange}
              onUploadImage={uploadImage}
            />
          )
        ) : viewMode === 'builder' ? (
          isLoading && !builderSections.length ? (
            <div className="wc-loading">
              <Loader2 size={24} className="spin" />
              <p>Chargement de la structure…</p>
            </div>
          ) : (
            <div className="wc-workspace">
              <PageBuilder
                pageSlug={activePage}
                pagePath={activePageMeta?.path}
                sections={builderSections}
                selectedSection={selectedSection}
                insertTarget={insertTarget}
                insertLoading={insertMutation.isPending}
                changes={changes}
                onSelectSection={setSelectedSection}
                onSetInsertTarget={setInsertTarget}
                onInsertPattern={(id) => insertMutation.mutate(id)}
                onDeleteSection={async (slug) => {
                  if (isGlobal && ['header', 'footer', 'legal'].includes(slug)) {
                    toast.error('Cette zone fait partie du chrome du site public.')
                    return
                  }
                  if (!confirm('Supprimer cette zone ?')) return
                  await api.delete('/admin/content/sections', { data: { page: activePage, section: slug } })
                  setSelectedSection(null)
                  qc.invalidateQueries({ queryKey: ['content-matrix', activePage] })
                }}
                onReorderSections={async (order) => {
                  await api.post('/admin/content/reorder-sections', { page: activePage, order })
                  qc.invalidateQueries({ queryKey: ['content-matrix', activePage] })
                }}
                effectiveValue={effectiveValue}
                effectiveLabel={effectiveLabel}
                setLabelChange={setLabelChange}
                setValueChange={setValueChange}
                onDeleteLocale={async (section, key, locale) => {
                  await api.delete('/admin/content/block', { data: { page: activePage, section, key, locale } })
                  qc.invalidateQueries({ queryKey: ['content-matrix', activePage] })
                }}
                onUploadImage={uploadImage}
                uploadFile={uploadFile}
                onEmbedEdit={(edit) => {
                  setChange({
                    page: edit.page,
                    section: edit.section,
                    key: edit.key,
                    locale: edit.locale,
                    type: edit.type,
                    value: edit.value,
                    label: edit.label,
                  })
                }}
                onEmbedSaved={() => {
                  setChanges({})
                  qc.invalidateQueries({ queryKey: ['content-matrix', activePage] })
                }}
              />
            </div>
          )
        ) : (
          <div className="wc-list">
            <div className="wc-list__toolbar catalog-list__toolbar">
              <label className="search-field">
                <Search size={14} aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Rechercher un champ…"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
              <div className="wc-view-toggle" role="tablist" aria-label="Langue à éditer">
                {TEXT_LOCALES.map((loc) => (
                  <button
                    key={loc.code}
                    type="button"
                    className={listLocale === loc.code ? 'active' : ''}
                    onClick={() => setListLocale(loc.code)}
                  >
                    {loc.flag} {loc.code.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            {filteredSections.map((sec, index) => {
              const visibleBlocks = sec.blocks.filter((block) => !isRetiredField(activePage, sec.name, block.key))
              const isOpen = openSections[sec.name] ?? index === 0
              return (
              <details key={sec.name} className="wc-acc" open={isOpen}>
                <summary
                  onClick={(event) => {
                    event.preventDefault()
                    setOpenSections((s) => ({ ...s, [sec.name]: !isOpen }))
                  }}
                >
                  <span className="wc-acc__title">{sec.title || sec.name}</span>
                  <small>
                    {visibleBlocks.length} champ{visibleBlocks.length > 1 ? 's' : ''}
                  </small>
                </summary>
                {visibleBlocks.map((block) => {
                  const localeKey = block.type === 'image' ? '_all' : listLocale
                  const value = effectiveValue(sec.name, block, localeKey)
                  return (
                  <div key={block.key} className="wc-list-block">
                    <div className="wc-list-block__head">
                      <strong>{effectiveLabel(sec.name, block) || block.key}</strong>
                    </div>
                    {block.type === 'image' ? (
                      <div className="wc-image-fields">
                        {value ? <img src={value} alt="" className="wc-image-thumb" /> : null}
                        <input
                          value={value}
                          onChange={(event) => setValueChange(sec.name, block, '_all', event.target.value)}
                        />
                      </div>
                    ) : block.type === 'json' ? (
                      <FriendlyJsonRows
                        value={value}
                        onChange={(next) => setValueChange(sec.name, block, listLocale, next)}
                        onUploadImage={uploadFile}
                      />
                    ) : (
                      <textarea
                        rows={3}
                        dir={listLocale === 'ar' ? 'rtl' : 'ltr'}
                        value={value}
                        onChange={(event) => setValueChange(sec.name, block, listLocale, event.target.value)}
                      />
                    )}
                  </div>
                  )
                })}
              </details>
              )
            })}
          </div>
        )}
      </div>
      <AddPageModal
        open={addPageModal}
        onClose={() => setAddPageModal(false)}
        onCreate={async (payload) => {
          await api.post('/admin/content/pages', payload)
          setAddPageModal(false)
          qc.invalidateQueries({ queryKey: ['content-matrix'] })
          selectPage(payload.slug)
        }}
      />
    </div>
  )
}
