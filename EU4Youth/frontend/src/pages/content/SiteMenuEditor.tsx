import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Eye,
  EyeOff,
  GripVertical,
  Loader2,
  Plus,
  Trash2,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { PUBLIC_SITE } from '../../api/editSession'
import { api } from '../../api/client'
import PageUrlPicker from '../../components/PageUrlPicker'

type NavItem = {
  id: number
  parent_id: number | null
  label_fr: string
  label_en: string
  label_ar: string
  url: string
  sort_order: number
  is_active: boolean
  open_in_new_tab: boolean
}

type SaveState = 'idle' | 'pending' | 'saved' | 'error'

function useDebouncedSave(delay = 450) {
  const timers = useRef<Record<number, ReturnType<typeof setTimeout>>>({})
  const flush = useCallback((id: number, fn: () => void) => {
    window.clearTimeout(timers.current[id])
    timers.current[id] = window.setTimeout(fn, delay)
  }, [delay])
  useEffect(() => () => Object.values(timers.current).forEach(window.clearTimeout), [])
  return flush
}

function previewUrl(url: string) {
  if (!url) return PUBLIC_SITE
  if (/^https?:\/\//i.test(url)) return url
  return `${PUBLIC_SITE}${url.startsWith('/') ? url : `/${url}`}`
}

function MenuCard({
  item,
  depth,
  parentLabel,
  row,
  saveState,
  onPatch,
  onMove,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  dragging,
}: {
  item: NavItem
  depth: number
  parentLabel?: string
  row: NavItem
  saveState: SaveState
  onPatch: (item: NavItem, fields: Partial<NavItem>) => void
  onMove: (item: NavItem, dir: -1 | 1) => void
  onDelete: (item: NavItem, childCount: number) => void
  onDragStart: (item: NavItem) => void
  onDragEnd: () => void
  onDragOver: (event: React.DragEvent, item: NavItem) => void
  onDrop: (item: NavItem) => void
  dragging: boolean
}) {
  return (
    <article
      className={`menu-card${depth ? ' menu-card--child' : ''}${row.is_active ? '' : ' menu-card--hidden'}${dragging ? ' menu-card--dragging' : ''}`}
      onDragOver={(event) => onDragOver(event, item)}
      onDrop={(event) => {
        event.preventDefault()
        onDrop(item)
      }}
    >
      <div className="menu-card__head">
        <div className="menu-card__title-block">
          <button
            type="button"
            className="menu-card__drag"
            draggable
            title="Glisser pour réorganiser"
            aria-label="Glisser pour réorganiser"
            onDragStart={() => onDragStart(item)}
            onDragEnd={onDragEnd}
          >
            <GripVertical size={16} />
          </button>
          <div className="menu-card__title-copy">
            <div className="menu-card__meta">
              <p className="menu-card__kind">{depth ? `Sous-lien · ${parentLabel || 'Menu'}` : 'Entrée principale'}</p>
              {!row.is_active ? <span className="menu-card__badge">Masqué</span> : null}
              {saveState === 'pending' ? (
                <span className="menu-card__badge menu-card__badge--pending">
                  <Loader2 size={10} className="spin" /> Enregistrement…
                </span>
              ) : null}
              {saveState === 'saved' ? (
                <span className="menu-card__badge menu-card__badge--saved">
                  <Check size={10} /> Enregistré
                </span>
              ) : null}
            </div>
            <p className="menu-card__preview">{row.label_fr || 'Sans titre'}</p>
          </div>
        </div>
        <div className="menu-card__actions">
          <button type="button" className="icon-action" title="Monter" onClick={() => void onMove(item, -1)}>
            <ArrowUp size={14} />
          </button>
          <button type="button" className="icon-action" title="Descendre" onClick={() => void onMove(item, 1)}>
            <ArrowDown size={14} />
          </button>
          <a
            className="icon-action"
            title="Aperçu sur le site"
            href={previewUrl(row.url)}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink size={14} />
          </a>
          <button type="button" className="icon-action icon-action--danger" title="Supprimer" onClick={() => onDelete(item, 0)}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="menu-card__locales">
        <label className="menu-card__locale field field--catalog">
          <span className="menu-card__locale-tag">🇫🇷 Français</span>
          <input value={row.label_fr} placeholder="Libellé FR" onChange={(e) => onPatch(item, { label_fr: e.target.value })} />
        </label>
        <label className="menu-card__locale field field--catalog">
          <span className="menu-card__locale-tag">🇬🇧 English</span>
          <input value={row.label_en} placeholder="Label EN" onChange={(e) => onPatch(item, { label_en: e.target.value })} />
        </label>
        <label className="menu-card__locale field field--catalog">
          <span className="menu-card__locale-tag">🇹🇳 العربية</span>
          <input dir="rtl" value={row.label_ar} placeholder="العربية" onChange={(e) => onPatch(item, { label_ar: e.target.value })} />
        </label>
      </div>

      <PageUrlPicker
        label="Page du site"
        value={row.url}
        onChange={(url) => onPatch(item, { url })}
      />

      <div className="menu-card__foot">
        <label className="menu-card__toggle">
          <input
            type="checkbox"
            checked={row.is_active}
            onChange={(e) => onPatch(item, { is_active: e.target.checked })}
          />
          <Eye size={13} aria-hidden="true" />
          <span>Visible dans le menu</span>
        </label>
        <label className="menu-card__toggle">
          <input
            type="checkbox"
            checked={row.open_in_new_tab}
            onChange={(e) => onPatch(item, { open_in_new_tab: e.target.checked })}
          />
          <ExternalLink size={13} aria-hidden="true" />
          <span>Nouvel onglet</span>
        </label>
      </div>
    </article>
  )
}

export default function SiteMenuEditor() {
  const qc = useQueryClient()
  const debouncedSave = useDebouncedSave()
  const groupRefs = useRef<Record<number, HTMLElement | null>>({})
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [activeRootId, setActiveRootId] = useState<number | null>(null)

  const { data: items = [], isLoading } = useQuery<NavItem[]>({
    queryKey: ['site-nav'],
    queryFn: () => api.get('/admin/site-nav').then((r) => r.data),
  })
  const [drafts, setDrafts] = useState<Record<number, Partial<NavItem>>>({})
  const [saveStates, setSaveStates] = useState<Record<number, SaveState>>({})
  const [query, setQuery] = useState('')
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({})
  const [dragId, setDragId] = useState<number | null>(null)

  const reorder = useMutation({
    mutationFn: (payload: { items: { id: number; sort_order: number; parent_id: number | null }[] }) =>
      api.post('/admin/site-nav/reorder', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['site-nav'] })
      toast.success('Ordre du menu mis à jour')
    },
    onError: () => toast.error('Réorganisation impossible'),
  })

  const save = useMutation({
    mutationFn: (item: NavItem) => api.put(`/admin/site-nav/${item.id}`, item),
    onSuccess: (_data, item) => {
      qc.invalidateQueries({ queryKey: ['site-nav'] })
      setSaveStates((current) => ({ ...current, [item.id]: 'saved' }))
      window.setTimeout(() => {
        setSaveStates((current) => (current[item.id] === 'saved' ? { ...current, [item.id]: 'idle' } : current))
      }, 1800)
    },
    onError: (_err, item) => {
      setSaveStates((current) => ({ ...current, [item.id]: 'error' }))
      toast.error('Enregistrement impossible')
    },
  })

  const create = useMutation({
    mutationFn: (body: Partial<NavItem> = {}) =>
      api.post('/admin/site-nav', {
        label_fr: 'Nouveau lien',
        label_en: 'New link',
        label_ar: 'رابط جديد',
        url: '/',
        ...body,
      }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['site-nav'] })
      toast.success(res.data?.parent_id ? 'Sous-lien ajouté' : 'Lien ajouté')
      const parentId = res.data?.parent_id
      if (parentId) {
        setCollapsed((current) => ({ ...current, [parentId]: false }))
        window.setTimeout(() => groupRefs.current[parentId]?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120)
      } else {
        window.setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 120)
      }
    },
  })

  const remove = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/site-nav/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['site-nav'] })
      toast.success('Lien supprimé')
    },
  })

  const roots = useMemo(
    () => items.filter((item) => !item.parent_id).sort((a, b) => a.sort_order - b.sort_order),
    [items],
  )
  const childrenMap = useMemo(() => {
    const map = new Map<number, NavItem[]>()
    for (const item of items) {
      if (!item.parent_id) continue
      const list = map.get(item.parent_id) || []
      list.push(item)
      map.set(item.parent_id, list)
    }
    for (const list of map.values()) list.sort((a, b) => a.sort_order - b.sort_order)
    return map
  }, [items])

  const rowData = useCallback((item: NavItem): NavItem => ({ ...item, ...drafts[item.id] }), [drafts])

  const patch = (item: NavItem, patchFields: Partial<NavItem>) => {
    const next = { ...item, ...drafts[item.id], ...patchFields }
    setDrafts((current) => ({ ...current, [item.id]: { ...current[item.id], ...patchFields } }))
    setSaveStates((current) => ({ ...current, [item.id]: 'pending' }))
    debouncedSave(item.id, () => {
      save.mutate(next, {
        onSuccess: () => {
          setDrafts((current) => {
            const copy = { ...current }
            delete copy[item.id]
            return copy
          })
        },
      })
    })
  }

  const move = async (item: NavItem, dir: -1 | 1) => {
    const siblings = items.filter((row) => row.parent_id === item.parent_id).sort((a, b) => a.sort_order - b.sort_order)
    const index = siblings.findIndex((row) => row.id === item.id)
    const swap = siblings[index + dir]
    if (!swap) return
    await reorder.mutateAsync({
      items: [
        { id: item.id, sort_order: swap.sort_order, parent_id: item.parent_id },
        { id: swap.id, sort_order: item.sort_order, parent_id: swap.parent_id },
      ],
    })
  }

  const dropOn = (target: NavItem) => {
    if (dragId == null || dragId === target.id) return
    const dragged = items.find((row) => row.id === dragId)
    if (!dragged || dragged.parent_id !== target.parent_id) {
      toast.error('Déplacez uniquement entre liens du même niveau')
      setDragId(null)
      return
    }
    const siblings = items
      .filter((row) => row.parent_id === target.parent_id)
      .sort((a, b) => a.sort_order - b.sort_order)
    const fromIdx = siblings.findIndex((row) => row.id === dragId)
    const toIdx = siblings.findIndex((row) => row.id === target.id)
    if (fromIdx < 0 || toIdx < 0) return
    const next = [...siblings]
    const [moved] = next.splice(fromIdx, 1)
    next.splice(toIdx, 0, moved)
    void reorder.mutate({
      items: next.map((row, index) => ({
        id: row.id,
        sort_order: index + 1,
        parent_id: row.parent_id,
      })),
    })
    setDragId(null)
  }

  const handleDragStart = (item: NavItem) => {
    setDragId(item.id)
  }

  const handleDragEnd = () => {
    setDragId(null)
  }

  const handleDragOver = (event: React.DragEvent, item: NavItem) => {
    if (dragId == null) return
    const dragged = items.find((row) => row.id === dragId)
    if (dragged?.parent_id === item.parent_id) event.preventDefault()
  }

  const handleDelete = (item: NavItem, childCount: number) => {
    const row = rowData(item)
    const message =
      childCount > 0
        ? `Supprimer « ${row.label_fr || 'Sans titre'} » et ses ${childCount} sous-lien${childCount > 1 ? 's' : ''} ?`
        : `Supprimer « ${row.label_fr || 'Sans titre'} » ?`
    if (!confirm(message)) return
    remove.mutate(item.id)
  }

  const filteredRoots = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('fr')
    if (!needle) return roots
    return roots.filter((root) => {
      const row = rowData(root)
      const kids = childrenMap.get(root.id) || []
      const matchRoot =
        row.label_fr.toLocaleLowerCase('fr').includes(needle) ||
        row.label_en.toLocaleLowerCase('fr').includes(needle) ||
        row.label_ar.includes(needle) ||
        row.url.toLocaleLowerCase('fr').includes(needle)
      const matchChild = kids.some((child) => {
        const c = rowData(child)
        return (
          c.label_fr.toLocaleLowerCase('fr').includes(needle) ||
          c.label_en.toLocaleLowerCase('fr').includes(needle) ||
          c.label_ar.includes(needle) ||
          c.url.toLocaleLowerCase('fr').includes(needle)
        )
      })
      return matchRoot || matchChild
    })
  }, [query, roots, childrenMap, rowData])

  const stats = useMemo(() => {
    const active = items.filter((item) => item.is_active).length
    const hidden = items.length - active
    return { total: items.length, roots: roots.length, active, hidden }
  }, [items, roots.length])

  const jumpTo = (id: number) => {
    setActiveRootId(id)
    groupRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const toggleCollapsed = (id: number) => {
    setCollapsed((current) => ({ ...current, [id]: !current[id] }))
  }

  const expandAll = () => setCollapsed({})
  const collapseAll = () => {
    const next: Record<number, boolean> = {}
    for (const root of roots) next[root.id] = true
    setCollapsed(next)
  }

  useEffect(() => {
    if (!filteredRoots.length) return
    const root = scrollRef.current
    if (!root) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        const id = Number(visible?.target.getAttribute('data-root-id'))
        if (id) setActiveRootId(id)
      },
      { root, rootMargin: '-20% 0px -60% 0px', threshold: [0.15, 0.4, 0.7] },
    )

    for (const rootItem of filteredRoots) {
      const node = groupRefs.current[rootItem.id]
      if (node) observer.observe(node)
    }
    return () => observer.disconnect()
  }, [filteredRoots])

  return (
    <div className="menu-editor">
      <div className="menu-editor__hero">
        <div>
          <h3 className="menu-editor__title">Menu public</h3>
          <p className="menu-editor__desc">
            Navigation du header en FR, EN et AR. Glissez les poignées pour réorganiser — enregistrement automatique.
          </p>
        </div>
        <button type="button" className="btn btn--primary btn--sm" onClick={() => create.mutate({})}>
          <Plus size={14} /> Nouveau lien
        </button>
      </div>

      <div className="menu-editor__stats">
        <span>{stats.roots} entrées principales</span>
        <span>{stats.total} liens au total</span>
        <span>{stats.active} visibles</span>
        {stats.hidden ? <span>{stats.hidden} masqués</span> : null}
      </div>

      <div className="menu-editor__toolbar">
        <input
          type="search"
          className="menu-editor__search"
          placeholder="Rechercher un libellé ou une URL…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="button" className="btn btn--ghost btn--sm" onClick={expandAll}>
          Tout déplier
        </button>
        <button type="button" className="btn btn--ghost btn--sm" onClick={collapseAll}>
          Tout replier
        </button>
      </div>

      <div className="menu-editor__body">
        <nav className="menu-editor__nav" aria-label="Sections du menu">
          {isLoading ? (
            <p className="menu-editor__nav-empty">Chargement…</p>
          ) : filteredRoots.length === 0 ? (
            <p className="menu-editor__nav-empty">Aucun lien</p>
          ) : (
            filteredRoots.map((root, index) => {
              const row = rowData(root)
              const kids = childrenMap.get(root.id) || []
              return (
                <button
                  key={root.id}
                  type="button"
                  className={`menu-editor__nav-item${activeRootId === root.id ? ' is-active' : ''}${row.is_active ? '' : ' is-hidden'}`}
                  onClick={() => jumpTo(root.id)}
                >
                  <span className="menu-editor__nav-index">{index + 1}</span>
                  <span className="menu-editor__nav-label">{row.label_fr || 'Sans titre'}</span>
                  {kids.length ? <span className="menu-editor__nav-count">{kids.length}</span> : null}
                  {!row.is_active ? <EyeOff size={12} aria-hidden="true" /> : null}
                </button>
              )
            })
          )}
        </nav>

        <div className="menu-editor__scroll" ref={scrollRef}>
          {isLoading ? (
            <p className="menu-editor__empty">Chargement du menu…</p>
          ) : filteredRoots.length === 0 ? (
            <p className="menu-editor__empty">
              {query ? 'Aucun lien ne correspond à votre recherche.' : 'Aucun lien. Cliquez sur « Nouveau lien ».'}
            </p>
          ) : (
            filteredRoots.map((root) => {
              const rootRow = rowData(root)
              const kids = childrenMap.get(root.id) || []
              const isCollapsed = collapsed[root.id]
              return (
                <section
                  key={root.id}
                  className="menu-editor__group"
                  data-root-id={root.id}
                  ref={(node) => {
                    groupRefs.current[root.id] = node
                  }}
                >
                  <div className="menu-editor__group-head">
                    <button type="button" className="menu-editor__group-toggle" onClick={() => toggleCollapsed(root.id)}>
                      {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                      <span>{rootRow.label_fr || 'Sans titre'}</span>
                      {kids.length ? <span className="menu-editor__group-count">{kids.length} sous-lien{kids.length > 1 ? 's' : ''}</span> : null}
                    </button>
                    <button type="button" className="btn btn--ghost btn--sm" onClick={() => create.mutate({ parent_id: root.id, label_fr: 'Nouveau sous-lien' })}>
                      <Plus size={13} /> Sous-lien
                    </button>
                  </div>

                  {!isCollapsed ? (
                    <>
                      <MenuCard
                        item={root}
                        depth={0}
                        row={rootRow}
                        saveState={saveStates[root.id] || 'idle'}
                        onPatch={patch}
                        onMove={move}
                        onDelete={(item) => handleDelete(item, kids.length)}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragOver={handleDragOver}
                        onDrop={dropOn}
                        dragging={dragId === root.id}
                      />
                      {kids.length > 0 ? (
                        <div className="menu-editor__children">
                          {kids.map((child) => (
                            <MenuCard
                              key={child.id}
                              item={child}
                              depth={1}
                              parentLabel={rootRow.label_fr}
                              row={rowData(child)}
                              saveState={saveStates[child.id] || 'idle'}
                              onPatch={patch}
                              onMove={move}
                              onDelete={(item) => handleDelete(item, 0)}
                              onDragStart={handleDragStart}
                              onDragEnd={handleDragEnd}
                              onDragOver={handleDragOver}
                              onDrop={dropOn}
                              dragging={dragId === child.id}
                            />
                          ))}
                        </div>
                      ) : null}
                    </>
                  ) : null}
                </section>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
