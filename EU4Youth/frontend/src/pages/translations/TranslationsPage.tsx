import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { api } from '../../api/client'
import { translationLabel } from '../../lib/translationLabels'

type Row = { key: string; fr: string; en: string; ar: string }

function asText(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object' && !Array.isArray(value)) {
    const rec = value as Record<string, unknown>
    return String(rec.fr ?? rec.en ?? rec.ar ?? '')
  }
  return String(value)
}

function normalizeRow(raw: unknown): Row | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as Record<string, unknown>
  const key = String(row.key ?? '').trim()
  if (!key) return null
  return {
    key,
    fr: asText(row.fr),
    en: asText(row.en),
    ar: asText(row.ar),
  }
}

function groupOf(key: string) {
  if (key.startsWith('nav.')) return 'Navigation (libellés UI — pas le menu principal)'
  if (key.startsWith('search.')) return 'Recherche'
  if (key.startsWith('header.')) return 'En-tête'
  if (key.startsWith('cookie.') || key.startsWith('legal.')) return 'Cookies & légal'
  if (key.startsWith('lang.')) return 'Langues'
  if (key.startsWith('footer.')) return 'Pied de page'
  return 'Général'
}

export default function TranslationsPage() {
  const qc = useQueryClient()
  const { data: rows = [] } = useQuery<Row[]>({
    queryKey: ['translations'],
    queryFn: async () => {
      const raw = (await api.get('/admin/translations')).data
      if (!Array.isArray(raw)) return []
      return raw.map(normalizeRow).filter((row): row is Row => Boolean(row))
    },
  })
  const [drafts, setDrafts] = useState<Record<string, Row>>({})
  const [query, setQuery] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showTechnicalKeys, setShowTechnicalKeys] = useState(false)
  const [busy, setBusy] = useState(false)

  const display = useMemo(
    () => rows.map((row) => drafts[row.key] ?? row),
    [rows, drafts],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('fr')
    if (!needle) return display
    return display.filter(
      (row) =>
        row.key.toLocaleLowerCase('fr').includes(needle) ||
        row.fr.toLocaleLowerCase('fr').includes(needle) ||
        row.en.toLocaleLowerCase('fr').includes(needle) ||
        row.ar.includes(needle),
    )
  }, [display, query])

  const grouped = filtered.reduce<Record<string, Row[]>>((acc, row) => {
    const group = groupOf(row.key)
    if (!acc[group]) acc[group] = []
    acc[group].push(row)
    return acc
  }, {})

  const save = useMutation({
    mutationFn: (row: Row) => api.patch(`/admin/translations/${encodeURIComponent(row.key)}`, row),
    onSuccess: (_, row) => {
      qc.invalidateQueries({ queryKey: ['translations'] })
      setDrafts((current) => {
        const next = { ...current }
        delete next[row.key]
        return next
      })
      toast.success('Enregistré')
    },
  })

  const completion = (locale: 'fr' | 'en' | 'ar') => {
    if (!display.length) return 0
    return Math.round((display.filter((row) => row[locale]?.trim()).length / display.length) * 100)
  }

  const missing = (locale: 'en' | 'ar') =>
    display.filter((row) => row.fr.trim() && !row[locale]?.trim()).length

  const autoFillUi = (overwrite = false) => {
    setBusy(true)
    return api
      .post('/admin/translations/auto-fill', { source: 'fr', overwrite }, { timeout: 120000 })
      .then((res) => {
        qc.invalidateQueries({ queryKey: ['translations'] })
        setDrafts({})
        toast.success(`${res.data.filled ?? 0} libellé(s) mis à jour`)
      })
      .catch(() => toast.error('Traduction indisponible — réessayez dans un instant'))
      .finally(() => setBusy(false))
  }

  const syncCatalogs = () => {
    setBusy(true)
    return api
      .post('/admin/catalog/sync-locales', { source: 'fr', translate: true }, { timeout: 300000 })
      .then((res) => toast.success(`${res.data.count ?? 0} fiches catalogue synchronisées`))
      .catch(() => toast.error('Synchronisation impossible'))
      .finally(() => setBusy(false))
  }

  return (
    <div className="catalog-studio translations-studio">
      <div className="catalog-list__hero">
        <div>
          <h2 className="catalog-list__title">Traductions</h2>
          <p className="catalog-list__desc">
            Libellés d&apos;interface globaux (navigation, recherche, cookies, partage, accessibilité) — FR / EN / AR.
            Les textes des pages (héros, filtres, glossaire, formulaires…) se gèrent dans{' '}
            <strong>Contenu du site</strong> page par page. Le <strong>menu principal</strong> se gère dans Contenu du
            site → Paramètres du site → Menu du site.
          </p>
        </div>
        <p className="catalog-list__count">{display.length} clés</p>
      </div>

      <div className="catalog-list__toolbar">
        <div className="admin-toolbar">
          <button
            type="button"
            className="btn btn--primary btn--sm"
            disabled={busy}
            onClick={() => void autoFillUi(false)}
          >
            {busy ? <Loader2 size={12} className="spin" /> : null}
            Compléter EN / AR depuis le français
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => setShowAdvanced((v) => !v)}>
            {showAdvanced ? 'Masquer les options' : 'Options avancées'}
          </button>
        </div>
      </div>

      {showAdvanced ? (
        <div className="admin-toolbar admin-toolbar--spaced">
          <button type="button" className="btn btn--ghost btn--sm" disabled={busy} onClick={() => void autoFillUi(true)}>
            Tout retraduire (écrase EN / AR)
          </button>
          <button type="button" className="btn btn--ghost btn--sm" disabled={busy} onClick={() => void syncCatalogs()}>
            Synchroniser tous les catalogues
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => setShowTechnicalKeys((v) => !v)}>
            {showTechnicalKeys ? 'Masquer les clés techniques' : 'Afficher les clés techniques'}
          </button>
        </div>
      ) : null}

      <div className="stats">
        <div className="stat">
          <b>{completion('fr')}%</b>
          <span>Français</span>
        </div>
        <div className="stat">
          <b>{completion('en')}%</b>
          <span>English {missing('en') ? `(${missing('en')} manquantes)` : ''}</span>
        </div>
        <div className="stat">
          <b>{completion('ar')}%</b>
          <span>العربية {missing('ar') ? `(${missing('ar')} manquantes)` : ''}</span>
        </div>
      </div>

      <div className="catalog-list__toolbar">
        <div className="search-field">
          <Search size={15} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filtrer une clé ou un libellé…"
          />
        </div>
      </div>

      {Object.entries(grouped).map(([group, items]) => (
        <div key={group} className="translations-group">
          <h3 className="translations-group__title">{group}</h3>
          <div className="table-wrap catalog-list__table">
            <table>
              <thead>
                <tr>
                  <th>{showTechnicalKeys ? 'Clé technique' : 'Libellé'}</th>
                  <th>FR · référence</th>
                  <th>EN</th>
                  <th dir="rtl">AR</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.key}>
                    <td>
                      {showTechnicalKeys ? (
                        <code>{row.key}</code>
                      ) : (
                        <span className="translations-label">{translationLabel(row.key)}</span>
                      )}
                    </td>
                    {(['fr', 'en', 'ar'] as const).map((locale) => (
                      <td key={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                        <input
                          value={row[locale]}
                          onChange={(event) => {
                            setDrafts((current) => ({
                              ...current,
                              [row.key]: { ...row, [locale]: event.target.value },
                            }))
                          }}
                        />
                      </td>
                    ))}
                    <td className="col-actions">
                      <button type="button" className="btn btn--primary btn--sm" onClick={() => save.mutate(row)}>
                        Sauver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {!filtered.length ? (
        <p className="table-empty">Aucune clé ne correspond à votre recherche.</p>
      ) : null}
    </div>
  )
}
