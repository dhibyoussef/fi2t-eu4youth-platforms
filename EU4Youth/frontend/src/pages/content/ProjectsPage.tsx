import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Trash2 } from 'lucide-react'
import { api, LOCALES, type Locale, type Localized } from '../../api/client'
import {
  CatalogEditorHeader,
  CatalogEditorLayout,
  LocaleTabs,
  LocalizedControl,
} from '../../components/catalog/CatalogEditorShell'
import { localeMissingFlags } from '../../components/catalog/catalogFields'

type ProjectComponent = {
  name: string
  tagline?: string
  description: string
  results?: string[]
  sectors?: string[]
}

type ProjectKpi = { value: string; label: string }

type LocaleArrayBag<T> = Partial<Record<Locale, T[]>> | T[]

type Project = {
  slug: string
  acronym: string | Localized
  color: string
  partner: string | Localized
  budget: string
  period: string | Localized
  status: string
  fullName?: string | Localized
  tagline?: string | Localized
  composante?: string
  territory?: string | Localized
  sectors?: string | Localized
  presentation?: LocaleArrayBag<string>
  governorates?: string[]
  generalObjective?: string | Localized
  specificObjectives?: LocaleArrayBag<string>
  name?: Localized
  taglineLocalized?: Localized
  beneficiaries?: string[]
  components?: LocaleArrayBag<ProjectComponent>
  kpis?: LocaleArrayBag<ProjectKpi>
}

function locBag(value: unknown): Record<Locale, string> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const rec = value as Record<string, unknown>
    const asText = (v: unknown) => {
      if (v == null) return ''
      if (typeof v === 'string' || typeof v === 'number') return String(v)
      if (typeof v === 'object' && !Array.isArray(v)) {
        const nested = v as Record<string, unknown>
        return String(nested.fr ?? nested.en ?? nested.ar ?? '')
      }
      return String(v)
    }
    return { fr: asText(rec.fr), en: asText(rec.en), ar: asText(rec.ar) }
  }
  return { fr: String(value ?? ''), en: '', ar: '' }
}

/** Pick a display string from either a plain string or a FR/EN/AR map. */
function locText(value: unknown, locale: Locale = 'fr'): string {
  if (value == null) return ''
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  const map = locBag(value)
  return map[locale] || map.fr || map.en || map.ar || ''
}

function setLocText(value: unknown, locale: Locale, next: string): Localized {
  const bag = locBag(value)
  return { ...bag, [locale]: next } as Localized
}

function locArray<T>(value: unknown, locale: Locale = 'fr'): T[] {
  if (Array.isArray(value)) return value as T[]
  if (value && typeof value === 'object') {
    const bag = value as Partial<Record<Locale, T[]>>
    const picked = bag[locale] ?? bag.fr ?? bag.en ?? bag.ar
    return Array.isArray(picked) ? picked : []
  }
  return []
}

function setLocArray<T>(value: unknown, locale: Locale, next: T[]): LocaleArrayBag<T> {
  if (Array.isArray(value) || value == null) {
    return { fr: locale === 'fr' ? next : [], en: locale === 'en' ? next : [], ar: locale === 'ar' ? next : [] }
  }
  const bag = value as Partial<Record<Locale, T[]>>
  return {
    fr: Array.isArray(bag.fr) ? bag.fr : [],
    en: Array.isArray(bag.en) ? bag.en : [],
    ar: Array.isArray(bag.ar) ? bag.ar : [],
    [locale]: next,
  }
}

function linesToList(text: string) {
  return text
    .split(/\n/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export default function ProjectsPage() {
  const qc = useQueryClient()
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => api.get('/admin/projects').then((res) => res.data),
  })
  const [locale, setLocale] = useState<Locale>('fr')
  const [open, setOpen] = useState<string | null>(null)
  const [draft, setDraft] = useState<Project | null>(null)
  const [translateOnSave, setTranslateOnSave] = useState(true)
  const [editLocale, setEditLocale] = useState<Locale>('fr')

  const save = useMutation({
    mutationFn: (project: Project) =>
      api.patch(`/admin/projects/${project.slug}`, { ...project, translate: translateOnSave }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] })
      toast.success(translateOnSave ? 'Fiche projet enregistrée — EN / AR synchronisés' : 'Fiche projet enregistrée')
      setOpen(null)
      setDraft(null)
    },
    onError: () => toast.error("Enregistrement impossible"),
  })

  if (open && draft) {
    const nameBag = locBag(draft.name || draft.fullName)
    const taglineBag = locBag(draft.taglineLocalized || draft.tagline)
    const components = locArray<ProjectComponent>(draft.components, editLocale)
    const kpis = locArray<ProjectKpi>(draft.kpis, editLocale)
    const presentation = locArray<string>(draft.presentation, editLocale)
    const specificObjectives = locArray<string>(draft.specificObjectives, editLocale)

    const missingLocales = localeMissingFlags(
      { name: nameBag, taglineLocalized: taglineBag },
      [
        { key: 'name', label: 'Nom', type: 'localized' },
        { key: 'taglineLocalized', label: 'Accroche', type: 'localized' },
      ],
    )

    return (
      <div className="catalog-studio catalog-studio--editing">
        <CatalogEditorHeader
          backLabel="Retour aux projets"
          onBack={() => {
            setOpen(null)
            setDraft(null)
          }}
          translateOnSave={translateOnSave}
          onTranslateOnSave={setTranslateOnSave}
          saving={save.isPending}
          onSave={() => save.mutate(draft)}
        />

        <div className="project-editor__title">
          <i style={{ background: draft.color }} />
          <h2>{locText(draft.acronym, editLocale)}</h2>
          <span className={`pill ${draft.status === 'published' ? 'pill--on' : 'pill--off'}`}>
            {draft.status === 'published' ? 'Publié' : 'Brouillon'}
          </span>
        </div>

        <CatalogEditorLayout
          localeTabs={<LocaleTabs locale={editLocale} onLocale={setEditLocale} missing={missingLocales} />}
          main={
            <>
              <LocalizedControl
                label="Nom du projet"
                locale={editLocale}
                value={nameBag[editLocale]}
                onChange={(value) =>
                  setDraft({ ...draft, name: { ...nameBag, [editLocale]: value } as Localized })
                }
              />
              <LocalizedControl
                label="Accroche"
                locale={editLocale}
                value={taglineBag[editLocale]}
                multiline
                rows={3}
                onChange={(value) =>
                  setDraft({ ...draft, taglineLocalized: { ...taglineBag, [editLocale]: value } as Localized })
                }
              />
              <label className="field field--catalog field--wide">
                <span>Présentation <small className="field__hint">(un paragraphe par ligne)</small></span>
                <textarea
                  rows={6}
                  value={presentation.join('\n')}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      presentation: setLocArray(draft.presentation, editLocale, linesToList(e.target.value)),
                    })
                  }
                />
              </label>
            </>
          }
          side={
            <>
              <label className="field field--catalog">
                <span>Couleur</span>
                <div className="color-field">
                  <input
                    type="color"
                    value={draft.color || '#074ea2'}
                    onChange={(e) => setDraft({ ...draft, color: e.target.value })}
                  />
                  <input value={draft.color || ''} onChange={(e) => setDraft({ ...draft, color: e.target.value })} />
                </div>
              </label>
              <label className="field field--catalog">
                <span>Partenaire</span>
                <input
                  value={locText(draft.partner, editLocale)}
                  onChange={(e) => setDraft({ ...draft, partner: setLocText(draft.partner, editLocale, e.target.value) })}
                />
              </label>
              <label className="field field--catalog">
                <span>Budget</span>
                <input value={String(draft.budget ?? '')} onChange={(e) => setDraft({ ...draft, budget: e.target.value })} />
              </label>
              <label className="field field--catalog">
                <span>Période</span>
                <input
                  value={locText(draft.period, editLocale)}
                  onChange={(e) => setDraft({ ...draft, period: setLocText(draft.period, editLocale, e.target.value) })}
                />
              </label>
              <label className="field field--catalog">
                <span>Territoire</span>
                <input
                  value={locText(draft.territory, editLocale)}
                  onChange={(e) =>
                    setDraft({ ...draft, territory: setLocText(draft.territory, editLocale, e.target.value) })
                  }
                />
              </label>
              <label className="field field--catalog">
                <span>Composante</span>
                <input
                  value={String(draft.composante || '')}
                  onChange={(e) => setDraft({ ...draft, composante: e.target.value })}
                />
              </label>
              <label className="field field--catalog">
                <span>Secteurs</span>
                <input
                  value={locText(draft.sectors, editLocale)}
                  onChange={(e) => setDraft({ ...draft, sectors: setLocText(draft.sectors, editLocale, e.target.value) })}
                />
              </label>
              <label className="field field--catalog">
                <span>Statut</span>
                <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}>
                  <option value="published">Publié</option>
                  <option value="draft">Brouillon</option>
                </select>
              </label>
            </>
          }
        />

        <div className="catalog-editor__main" style={{ marginTop: 18 }}>
          <h3 className="catalog-editor__section">Objectifs & indicateurs</h3>
          <div className="catalog-editor__fields">
            <label className="field field--catalog">
              <span>Objectif général</span>
              <textarea
                rows={3}
                value={locText(draft.generalObjective, editLocale)}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    generalObjective: setLocText(draft.generalObjective, editLocale, e.target.value),
                  })
                }
              />
            </label>
            <label className="field field--catalog">
              <span>Objectifs spécifiques <small className="field__hint">(un par ligne)</small></span>
              <textarea
                rows={4}
                value={specificObjectives.join('\n')}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    specificObjectives: setLocArray(draft.specificObjectives, editLocale, linesToList(e.target.value)),
                  })
                }
              />
            </label>
            <label className="field field--catalog">
              <span>Bénéficiaires <small className="field__hint">(virgules)</small></span>
              <input
                value={(Array.isArray(draft.beneficiaries) ? draft.beneficiaries : []).join(', ')}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    beneficiaries: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
              />
            </label>
            <label className="field field--catalog">
              <span>Gouvernorats <small className="field__hint">(virgules)</small></span>
              <input
                value={(Array.isArray(draft.governorates) ? draft.governorates : []).join(', ')}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    governorates: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
              />
            </label>
          </div>
        </div>

        <h3 className="admin-section-title">Indicateurs (KPI)</h3>
        <div className="kpi-list">
          {kpis.map((kpi, index) => (
            <div key={index} className="kpi-row">
              <input
                value={kpi.value}
                placeholder="Valeur"
                onChange={(e) => {
                  const next = [...kpis]
                  next[index] = { ...next[index], value: e.target.value }
                  setDraft({ ...draft, kpis: setLocArray(draft.kpis, editLocale, next) })
                }}
              />
              <input
                value={kpi.label}
                placeholder="Libellé"
                onChange={(e) => {
                  const next = [...kpis]
                  next[index] = { ...next[index], label: e.target.value }
                  setDraft({ ...draft, kpis: setLocArray(draft.kpis, editLocale, next) })
                }}
              />
              <button
                type="button"
                className="icon-action icon-action--danger"
                onClick={() =>
                  setDraft({
                    ...draft,
                    kpis: setLocArray(
                      draft.kpis,
                      editLocale,
                      kpis.filter((_, i) => i !== index),
                    ),
                  })
                }
                title="Supprimer"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() =>
              setDraft({
                ...draft,
                kpis: setLocArray(draft.kpis, editLocale, [...kpis, { value: '', label: '' }]),
              })
            }
          >
            <Plus size={14} /> Ajouter un KPI
          </button>
        </div>

        <h3 className="admin-section-title">Composantes</h3>
        <div className="component-list">
          {components.map((comp, index) => (
            <div key={index} className="component-card">
              <div className="component-card__head">
                <strong>Composante {index + 1}</strong>
                <button
                  type="button"
                  className="icon-action icon-action--danger"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      components: setLocArray(
                        draft.components,
                        editLocale,
                        components.filter((_, i) => i !== index),
                      ),
                    })
                  }
                  aria-label="Supprimer la composante"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="component-card__grid">
                <label className="field field--catalog">
                  <span>Nom</span>
                  <input
                    value={comp.name}
                    onChange={(e) => {
                      const next = [...components]
                      next[index] = { ...next[index], name: e.target.value }
                      setDraft({ ...draft, components: setLocArray(draft.components, editLocale, next) })
                    }}
                  />
                </label>
                <label className="field field--catalog">
                  <span>Accroche</span>
                  <input
                    value={comp.tagline || ''}
                    onChange={(e) => {
                      const next = [...components]
                      next[index] = { ...next[index], tagline: e.target.value }
                      setDraft({ ...draft, components: setLocArray(draft.components, editLocale, next) })
                    }}
                  />
                </label>
                <label className="field field--catalog field--wide">
                  <span>Description</span>
                  <textarea
                    rows={3}
                    value={comp.description}
                    onChange={(e) => {
                      const next = [...components]
                      next[index] = { ...next[index], description: e.target.value }
                      setDraft({ ...draft, components: setLocArray(draft.components, editLocale, next) })
                    }}
                  />
                </label>
                <label className="field field--catalog field--wide">
                  <span>Résultats <small className="field__hint">(un par ligne)</small></span>
                  <textarea
                    rows={2}
                    value={(comp.results || []).join('\n')}
                    onChange={(e) => {
                      const next = [...components]
                      next[index] = { ...next[index], results: linesToList(e.target.value) }
                      setDraft({ ...draft, components: setLocArray(draft.components, editLocale, next) })
                    }}
                  />
                </label>
                <label className="field field--catalog field--wide">
                  <span>Secteurs <small className="field__hint">(virgules)</small></span>
                  <input
                    value={(comp.sectors || []).join(', ')}
                    onChange={(e) => {
                      const next = [...components]
                      next[index] = {
                        ...next[index],
                        sectors: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      }
                      setDraft({ ...draft, components: setLocArray(draft.components, editLocale, next) })
                    }}
                  />
                </label>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() =>
              setDraft({
                ...draft,
                components: setLocArray(draft.components, editLocale, [
                  ...components,
                  { name: '', tagline: '', description: '', results: [], sectors: [] },
                ]),
              })
            }
          >
            <Plus size={14} /> Ajouter une composante
          </button>
        </div>

      </div>
    )
  }

  return (
    <div className="catalog-studio">
      <div className="catalog-list__hero">
        <div>
          <h2 className="catalog-list__title">Six projets</h2>
          <p className="catalog-list__desc">Fiches programme visibles sur /projets et chaque fiche projet.</p>
        </div>
        <div className="locale-tabs locale-tabs--compact">
          {LOCALES.map((code) => (
            <button
              key={code}
              type="button"
              className={locale === code ? 'active' : ''}
              onClick={() => setLocale(code)}
            >
              {code === 'fr' ? 'Français' : code === 'en' ? 'English' : 'العربية'}
            </button>
          ))}
        </div>
      </div>
      <div className="cards cards--projects">
        {projects.map((project) => (
          <article
            key={project.slug}
            className="card project-card"
            onClick={() => {
              setOpen(project.slug)
              setDraft({ ...project })
              setEditLocale('fr')
            }}
          >
            <i className="project-card__bar" style={{ background: project.color }} />
            <h3>{locText(project.acronym, locale)}</h3>
            <p className="project-card__tagline">
              {project.name?.[locale] || locText(project.fullName, locale)}
            </p>
            <p className="muted project-card__summary">
              {project.taglineLocalized?.[locale] || locText(project.tagline, locale)}
            </p>
            <p className="project-card__meta">
              {locText(project.partner, locale)} · {locText(project.budget, locale) || String(project.budget ?? '')}
            </p>
            <span className={`pill ${project.status === 'published' ? 'pill--on' : 'pill--off'}`}>
              {project.status === 'published' ? 'Publié' : 'Brouillon'}
            </span>
          </article>
        ))}
      </div>
    </div>
  )
}
