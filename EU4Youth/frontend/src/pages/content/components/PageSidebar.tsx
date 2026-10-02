import { FileText, Globe, Home, Layout, Plus, Trash2 } from 'lucide-react'

export interface CmsPage {
  slug: string
  title: string
  path?: string
  group?: string
  status: 'draft' | 'published'
  template: 'default' | 'home' | 'landing' | 'global'
  is_system: boolean
  sort_order: number
  meta_title?: string
  meta_description?: string
}

const TEMPLATE_ICON: Record<string, typeof FileText> = {
  home: Home,
  global: Globe,
  landing: Layout,
  default: FileText,
}

export function pageDisplayTitle(page: CmsPage) {
  if (page.slug === 'global') return 'Paramètres du site'
  if (page.slug === 'home') return "Page d'accueil"
  return page.title
}

export function pageDisplayHint(page: CmsPage) {
  if (page.slug === 'global') {
    return 'En-tête, pied de page, cookies et menu — présents sur toutes les pages.'
  }
  if (page.slug === 'home') {
    return 'Contenu propre à / — hero, chiffres, streams, newsletter…'
  }
  return page.path || ''
}

interface Props {
  pages: CmsPage[]
  activeSlug: string
  onSelect: (slug: string) => void
  onAddPage: () => void
  onDeletePage?: (page: CmsPage) => void
}

export default function PageSidebar({ pages, activeSlug, onSelect, onAddPage, onDeletePage }: Props) {
  const groups = pages.reduce<Record<string, CmsPage[]>>((acc, page) => {
    const group = page.slug === 'global' ? 'Système' : page.group || 'Pages'
    if (!acc[group]) acc[group] = []
    acc[group].push(page)
    return acc
  }, {})

  return (
    <aside className="wc-pages-sidebar">
      <div className="wc-pages-sidebar-head">
        <span>Pages du site</span>
        <button type="button" className="wc-pages-add" onClick={onAddPage} title="Ajouter une page">
          <Plus size={14} />
        </button>
      </div>
      <p className="wc-pages-sidebar-hint">
        Chaque page a son contenu. <strong>Paramètres du site</strong> = en-tête, menu et pied de page communs.
      </p>
      <nav className="wc-pages-list">
        {Object.entries(groups).map(([group, items]) => (
          <div key={group}>
            <p className="wc-pages-group">{group}</p>
            {items.map((page) => {
              const Icon = TEMPLATE_ICON[page.template] ?? FileText
              const active = activeSlug === page.slug
              return (
                <div key={page.slug} className={`wc-page-item${active ? ' active' : ''}`}>
                  <button type="button" className="wc-page-item-btn" onClick={() => onSelect(page.slug)}>
                    <Icon size={14} />
                    <span className="wc-page-item-title">{pageDisplayTitle(page)}</span>
                    <span className={`wc-page-status wc-page-status--${page.status}`}>
                      {page.status === 'published' ? 'Publié' : 'Brouillon'}
                    </span>
                  </button>
                  {!page.is_system && onDeletePage && (
                    <button
                      type="button"
                      className="wc-page-item-delete"
                      title="Supprimer la page"
                      onClick={() => onDeletePage(page)}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </nav>
    </aside>
  )
}
