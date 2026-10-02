import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronDown, ChevronRight, Plus, Search, Trash2 } from 'lucide-react'
import { useAuth } from '../../auth/AuthProvider'
import { api, LOCALES, type Locale, type Localized } from '../../api/client'
import { LocaleTabs } from '../../components/catalog/CatalogEditorShell'

/** Store schema is trilingual: label / term / tag / def / ctx are { fr, en, ar }. */
interface GlossaryEntry {
  term: Localized
  tag: Localized
  def: Localized
  ctx: Localized
}

interface GlossaryCategory {
  id: string
  label: Localized
  color: string
  entries: GlossaryEntry[]
}

function emptyLoc(fr = ''): Localized {
  return { fr, en: '', ar: '' }
}

function toLoc(value: unknown): Localized {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const rec = value as Record<string, unknown>
    return {
      fr: String(rec.fr ?? ''),
      en: String(rec.en ?? ''),
      ar: String(rec.ar ?? ''),
    }
  }
  if (typeof value === 'string') return emptyLoc(value)
  return emptyLoc()
}

function locText(value: Localized | string | undefined, locale: Locale): string {
  if (value == null) return ''
  if (typeof value === 'string') return value
  return value[locale] || value.fr || value.en || value.ar || ''
}

function normalizeEntry(raw: Record<string, unknown>): GlossaryEntry {
  return {
    term: toLoc(raw.term),
    tag: toLoc(raw.tag),
    def: toLoc(raw.def ?? raw.definition),
    ctx: toLoc(raw.ctx),
  }
}

function normalizeCategories(list: unknown): GlossaryCategory[] {
  if (!Array.isArray(list)) return []
  return list.map((row) => {
    const cat = row as Record<string, unknown>
    const entries = Array.isArray(cat.entries)
      ? cat.entries.map((e) => normalizeEntry((e || {}) as Record<string, unknown>))
      : []
    return {
      id: String(cat.id || `cat-${Date.now().toString(36)}`),
      label: toLoc(cat.label),
      color: String(cat.color || '#074ea2'),
      entries,
    }
  })
}

function setLocField(map: Localized, locale: Locale, value: string): Localized {
  return { ...map, [locale]: value }
}

export default function GlossaryAdminPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'administrateur'
  const qc = useQueryClient()
  const { data: categories = [] } = useQuery<GlossaryCategory[]>({
    queryKey: ['glossary'],
    queryFn: async () => normalizeCategories((await api.get('/admin/glossary')).data),
  })
  const [draft, setDraft] = useState<GlossaryCategory[] | null>(null)
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({})
  const [jsonMode, setJsonMode] = useState(false)
  const [jsonText, setJsonText] = useState('')
  const [query, setQuery] = useState('')
  const [locale, setLocale] = useState<Locale>('fr')

  const working = draft ?? categories
  const totalTerms = working.reduce((n, c) => n + c.entries.length, 0)

  const filteredCategories = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('fr')
    if (!needle) return working
    return working.filter((cat) => {
      if (locText(cat.label, locale).toLocaleLowerCase('fr').includes(needle)) return true
      return cat.entries.some((entry) => {
        const hay = [entry.term, entry.tag, entry.def, entry.ctx]
          .map((v) => locText(v, locale).toLocaleLowerCase('fr'))
          .join(' ')
        return hay.includes(needle)
      })
    })
  }, [working, query, locale])

  const save = useMutation({
    mutationFn: () => {
      const payload = jsonMode
        ? normalizeCategories(JSON.parse(jsonText || '[]'))
        : working.map((cat) => ({
            id: cat.id,
            label: toLoc(cat.label),
            color: cat.color,
            entries: cat.entries.map((entry) => ({
              term: toLoc(entry.term),
              tag: toLoc(entry.tag),
              def: toLoc(entry.def),
              ctx: toLoc(entry.ctx),
            })),
          }))
      return api.put('/admin/glossary', payload)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['glossary'] })
      setDraft(null)
      toast.success('Glossaire enregistré')
    },
    onError: () => toast.error('Erreur — vérifiez le format JSON si mode avancé'),
  })

  const updateCat = (index: number, patch: Partial<GlossaryCategory>) => {
    const next = [...working]
    next[index] = { ...next[index], ...patch }
    setDraft(next)
  }

  const updateEntry = (catIdx: number, entryIdx: number, patch: Partial<GlossaryEntry>) => {
    const next = [...working]
    const entries = [...next[catIdx].entries]
    entries[entryIdx] = { ...entries[entryIdx], ...patch }
    next[catIdx] = { ...next[catIdx], entries }
    setDraft(next)
  }

  const addEntry = (catIdx: number) => {
    const next = [...working]
    next[catIdx] = {
      ...next[catIdx],
      entries: [...next[catIdx].entries, { term: emptyLoc(), tag: emptyLoc(), def: emptyLoc(), ctx: emptyLoc() }],
    }
    setDraft(next)
  }

  const removeEntry = (catIdx: number, entryIdx: number) => {
    const next = [...working]
    const entries = [...next[catIdx].entries]
    entries.splice(entryIdx, 1)
    next[catIdx] = { ...next[catIdx], entries }
    setDraft(next)
  }

  const addCategory = () => {
    const id = `cat-${Date.now().toString(36)}`
    setDraft([...working, { id, label: emptyLoc('Nouvelle catégorie'), color: '#074ea2', entries: [] }])
  }

  const removeCategory = (index: number) => {
    const name = locText(working[index].label, locale) || working[index].id
    if (!confirm(`Supprimer "${name}" et ses ${working[index].entries.length} termes ?`)) return
    const next = [...working]
    next.splice(index, 1)
    setDraft(next)
  }

  const toggleCat = (id: string) => setOpenCats((prev) => ({ ...prev, [id]: !prev[id] }))

  if (jsonMode) {
    return (
      <div className="catalog-studio">
        <div className="catalog-list__hero">
          <div>
            <h2 className="catalog-list__title">Glossaire — mode JSON</h2>
            <p className="catalog-list__desc">Édition avancée — champs trilingues : term, tag, def, ctx (fr / en / ar)</p>
          </div>
          <div className="admin-toolbar">
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => { setJsonMode(false); setJsonText('') }}>
              Mode visuel
            </button>
            <button type="button" className="btn btn--primary btn--sm" onClick={() => save.mutate()} disabled={save.isPending}>
              Enregistrer
            </button>
          </div>
        </div>
        <div className="json-editor-wrap">
          <textarea
            className="json-editor"
            value={jsonText || JSON.stringify(working, null, 2)}
            onChange={(e) => setJsonText(e.target.value)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="catalog-studio">
      <div className="catalog-list__hero">
        <div>
          <h2 className="catalog-list__title">Glossaire</h2>
          <p className="catalog-list__desc">
            {working.length} catégories · {totalTerms} termes publiés sur /glossaire — édition FR / EN / AR
          </p>
        </div>
        <div className="admin-toolbar">
          <LocaleTabs locale={locale} onLocale={setLocale} />
          {isAdmin ? (
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => { setJsonMode(true); setJsonText(JSON.stringify(working, null, 2)) }}>
              Mode JSON (admin)
            </button>
          ) : null}
          <button type="button" className="btn btn--ghost btn--sm" onClick={addCategory}>
            <Plus size={14} /> Catégorie
          </button>
          <button type="button" className="btn btn--primary btn--sm" onClick={() => save.mutate()} disabled={save.isPending || !draft}>
            Enregistrer
          </button>
        </div>
      </div>

      <div className="catalog-list__toolbar">
        <label className="search-field">
          <Search size={14} aria-hidden="true" />
          <input
            type="search"
            placeholder={`Rechercher (${LOCALES.find((c) => c === locale) || 'fr'})…`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        {query ? (
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => setQuery('')}>
            Effacer
          </button>
        ) : null}
      </div>

      {filteredCategories.length === 0 ? (
        <p className="table-empty">Aucun terme ne correspond à votre recherche.</p>
      ) : null}

      {filteredCategories.map((cat, catIdx) => {
        const realCatIdx = working.findIndex((row) => row.id === cat.id)
        const index = realCatIdx >= 0 ? realCatIdx : catIdx
        const isOpen = openCats[cat.id] !== false
        return (
          <div key={cat.id} className="glossary-panel">
            <div
              className={`glossary-panel__head${isOpen ? ' is-open' : ''}`}
              onClick={() => toggleCat(cat.id)}
            >
              {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <input
                type="color"
                className="glossary-panel__color"
                value={cat.color}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => updateCat(index, { color: e.target.value })}
              />
              <input
                className="glossary-panel__label"
                value={locText(cat.label, locale)}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => updateCat(index, { label: setLocField(toLoc(cat.label), locale, e.target.value) })}
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
              />
              <span className="glossary-panel__count">{cat.entries.length} termes</span>
              <button
                type="button"
                className="icon-action icon-action--danger"
                onClick={(e) => { e.stopPropagation(); removeCategory(index) }}
                title="Supprimer la catégorie"
              >
                <Trash2 size={14} />
              </button>
            </div>
            {isOpen ? (
              <div className="glossary-panel__body">
                <table className="glossary-table">
                  <thead>
                    <tr>
                      <th className="col-term">Terme ({locale.toUpperCase()})</th>
                      <th className="col-tag">Tag</th>
                      <th className="col-def">Définition</th>
                      <th>Contexte</th>
                      <th className="col-action" />
                    </tr>
                  </thead>
                  <tbody>
                    {cat.entries.map((entry, entryIdx) => (
                      <tr key={entryIdx}>
                        <td>
                          <input
                            value={locText(entry.term, locale)}
                            onChange={(e) =>
                              updateEntry(index, entryIdx, {
                                term: setLocField(toLoc(entry.term), locale, e.target.value),
                              })
                            }
                            placeholder="Terme"
                            dir={locale === 'ar' ? 'rtl' : 'ltr'}
                          />
                        </td>
                        <td>
                          <input
                            value={locText(entry.tag, locale)}
                            onChange={(e) =>
                              updateEntry(index, entryIdx, {
                                tag: setLocField(toLoc(entry.tag), locale, e.target.value),
                              })
                            }
                            placeholder="Tag"
                            dir={locale === 'ar' ? 'rtl' : 'ltr'}
                          />
                        </td>
                        <td>
                          <textarea
                            value={locText(entry.def, locale)}
                            onChange={(e) =>
                              updateEntry(index, entryIdx, {
                                def: setLocField(toLoc(entry.def), locale, e.target.value),
                              })
                            }
                            placeholder="Définition"
                            rows={2}
                            dir={locale === 'ar' ? 'rtl' : 'ltr'}
                          />
                        </td>
                        <td>
                          <textarea
                            value={locText(entry.ctx, locale)}
                            onChange={(e) =>
                              updateEntry(index, entryIdx, {
                                ctx: setLocField(toLoc(entry.ctx), locale, e.target.value),
                              })
                            }
                            placeholder="Contexte EU4Youth"
                            rows={2}
                            dir={locale === 'ar' ? 'rtl' : 'ltr'}
                          />
                        </td>
                        <td className="col-action">
                          <button
                            type="button"
                            className="icon-action icon-action--danger"
                            onClick={() => removeEntry(index, entryIdx)}
                            aria-label="Supprimer le terme"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => addEntry(index)}
                >
                  <Plus size={12} /> Ajouter un terme
                </button>
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
