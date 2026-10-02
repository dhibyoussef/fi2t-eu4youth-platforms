import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Archive, CheckCheck, Eye, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { api } from '../../api/client'

type Message = {
  id: number
  kind: 'contact' | 'newsletter'
  from: string
  profile: string
  project: string
  subject: string
  unread: boolean
  receivedAt: string
  status?: string
  payload?: Record<string, unknown>
}

function payloadText(payload: Record<string, unknown> | undefined): string {
  if (!payload) return ''
  const preferred = ['message', 'body', 'content', 'text', 'comment', 'notes']
  for (const key of preferred) {
    const value = payload[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  const parts = Object.entries(payload)
    .filter(([, value]) => typeof value === 'string' && String(value).trim())
    .map(([key, value]) => `${key}: ${value}`)
  return parts.join('\n')
}

function payloadRows(payload: Record<string, unknown> | undefined): { label: string; value: string }[] {
  if (!payload) return []
  const labels: Record<string, string> = {
    name: 'Nom',
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'Email',
    phone: 'Téléphone',
    message: 'Message',
    body: 'Message',
    organization: 'Organisation',
    city: 'Ville',
    profile: 'Profil',
    project: 'Projet',
    subject: 'Sujet',
  }
  return Object.entries(payload)
    .filter(([, value]) => value != null && String(value).trim())
    .map(([key, value]) => ({
      label: labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()),
      value: String(value),
    }))
}

function formatReceived(value?: string) {
  if (!value) return '—'
  return value.slice(0, 16).replace('T', ' · ')
}

export default function InboxPage() {
  const qc = useQueryClient()
  const { data: rows = [], isLoading } = useQuery<Message[]>({
    queryKey: ['inbox'],
    queryFn: () => api.get('/admin/inbox').then((res) => res.data),
    refetchInterval: 30_000,
  })
  const [open, setOpen] = useState<Message | null>(null)
  const [kind, setKind] = useState('all')
  const [showArchived, setShowArchived] = useState(false)
  const [showRaw, setShowRaw] = useState(false)
  const [query, setQuery] = useState('')

  const mark = useMutation({
    mutationFn: (row: Message) => api.patch(`/admin/inbox/${row.id}`, { unread: false }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inbox'] }),
  })
  const archive = useMutation({
    mutationFn: (row: Message) => api.patch(`/admin/inbox/${row.id}`, { unread: false, status: 'archived' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inbox'] })
      setOpen(null)
      toast.success('Archivé')
    },
  })
  const remove = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/inbox/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inbox'] })
      setOpen(null)
      toast.success('Supprimé')
    },
  })
  const markAll = useMutation({
    mutationFn: () => api.post('/admin/form-submissions/mark-all-read'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inbox'] })
      toast.success('Tout marqué lu')
    },
  })

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('fr')
    return rows.filter((row) => {
      if (!showArchived && row.status === 'archived') return false
      if (kind !== 'all' && row.kind !== kind) return false
      if (!needle) return true
      const hay = [row.from, row.subject, row.project, row.profile, row.kind]
        .map((v) => String(v || '').toLocaleLowerCase('fr'))
        .join(' ')
      return hay.includes(needle)
    })
  }, [rows, kind, showArchived, query])

  const unreadCount = rows.filter((row) => row.unread && row.status !== 'archived').length

  const openMessage = (row: Message) => {
    setOpen(row)
    setShowRaw(false)
    if (row.unread) mark.mutate(row)
  }

  return (
    <div className="catalog-studio">
      <div className="catalog-list__hero">
        <div>
          <h2 className="catalog-list__title">Formulaires reçus</h2>
          <p className="catalog-list__desc">Messages contact et inscriptions newsletter du site public.</p>
        </div>
        <p className="catalog-list__count">
          {unreadCount} non lu{unreadCount !== 1 ? 's' : ''} · {visible.length} fiche{visible.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="catalog-list__toolbar">
        <div className="search-field">
          <input
            type="search"
            placeholder="Rechercher un message…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query ? (
            <button type="button" className="search-field__clear" onClick={() => setQuery('')} aria-label="Effacer">
              <X size={14} />
            </button>
          ) : null}
        </div>
        <div className="inbox-filters">
          {[
            ['all', 'Tous'],
            ['contact', 'Contact'],
            ['newsletter', 'Newsletter'],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={kind === value ? 'active' : ''}
              onClick={() => setKind(value)}
            >
              {label}
            </button>
          ))}
          <button type="button" className={showArchived ? 'active' : ''} onClick={() => setShowArchived((v) => !v)}>
            <Archive size={14} /> Archivés
          </button>
        </div>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => markAll.mutate()}
          disabled={!unreadCount || markAll.isPending}
        >
          <CheckCheck size={16} /> Tout marquer lu
        </button>
      </div>

      <div className="table-wrap catalog-list__table">
        <table>
          <thead>
            <tr>
              <th>Expéditeur</th>
              <th>Sujet</th>
              <th>Type</th>
              <th>Projet</th>
              <th>Reçu le</th>
              <th>Statut</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="table-empty">
                  Chargement…
                </td>
              </tr>
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={7} className="table-empty">
                  Aucun message{showArchived ? '' : ' actif'}.
                </td>
              </tr>
            ) : (
              visible.map((row) => {
                const active = open?.id === row.id
                const subject =
                  row.subject || (row.kind === 'newsletter' ? 'Inscription newsletter' : 'Message contact')
                return (
                  <tr
                    key={row.id}
                    className={`table-row--click${row.unread ? ' table-row--unread' : ''}${active ? ' table-row--active' : ''}`}
                    onClick={() => openMessage(row)}
                  >
                    <td className="cell-title">
                      <strong>{row.from || 'Sans expéditeur'}</strong>
                    </td>
                    <td>{subject}</td>
                    <td>{row.kind === 'newsletter' ? 'Newsletter' : 'Contact'}</td>
                    <td>{row.project || '—'}</td>
                    <td>{formatReceived(row.receivedAt)}</td>
                    <td>
                      {row.status === 'archived' ? (
                        <span className="pill pill--pending">Archivé</span>
                      ) : row.unread ? (
                        <span className="pill pill--off">Non lu</span>
                      ) : (
                        <span className="pill pill--on">Lu</span>
                      )}
                    </td>
                    <td className="col-actions">
                      <div className="row-actions" onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="icon-action" title="Ouvrir" onClick={() => openMessage(row)}>
                          <Eye size={18} />
                        </button>
                        {row.status !== 'archived' ? (
                          <button
                            type="button"
                            className="icon-action"
                            title="Archiver"
                            onClick={() => archive.mutate(row)}
                          >
                            <Archive size={18} />
                          </button>
                        ) : null}
                        <button
                          type="button"
                          className="icon-action icon-action--danger"
                          title="Supprimer"
                          onClick={() => {
                            if (confirm('Supprimer ce message ?')) remove.mutate(row.id)
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {open ? (
        <div className="inbox-detail">
          <div className="inbox-detail__head">
            <h3>{open.subject || (open.kind === 'newsletter' ? 'Newsletter' : 'Contact')}</h3>
            <div className="inbox-detail__actions">
              {open.status !== 'archived' ? (
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => archive.mutate(open)}>
                  <Archive size={14} /> Archiver
                </button>
              ) : null}
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => remove.mutate(open.id)}>
                <Trash2 size={14} /> Supprimer
              </button>
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setOpen(null)}>
                Fermer
              </button>
            </div>
          </div>
          <div className="inbox-detail__meta">
            <p>
              <strong>De :</strong> {open.from}
            </p>
            {open.profile ? (
              <p>
                <strong>Profil :</strong> {open.profile}
              </p>
            ) : null}
            {open.project ? (
              <p>
                <strong>Projet :</strong> {open.project}
              </p>
            ) : null}
            <p>
              <strong>Type :</strong> {open.kind === 'newsletter' ? 'Newsletter' : 'Contact'}
            </p>
            <p>
              <strong>Reçu le :</strong> {open.receivedAt?.slice(0, 16).replace('T', ' à ')}
            </p>
          </div>
          {payloadRows(open.payload).length > 0 ? (
            <dl className="inbox-detail__fields">
              {payloadRows(open.payload).map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          ) : payloadText(open.payload) ? (
            <p className="inbox-detail__message">{payloadText(open.payload)}</p>
          ) : null}
          <button
            type="button"
            className="btn btn--ghost btn--sm inbox-detail__raw-toggle"
            onClick={() => setShowRaw((v) => !v)}
          >
            {showRaw ? 'Masquer les données brutes' : 'Données techniques (JSON)'}
          </button>
          {showRaw && open.payload ? (
            <pre className="inbox-detail__payload">{JSON.stringify(open.payload, null, 2)}</pre>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
