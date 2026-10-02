import { useQuery } from '@tanstack/react-query'
import { Clock, Loader2, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { api } from '../../api/client'
import { AUDIT_FILTER_OPTIONS, auditActionLabel, auditTargetLabel } from '../../lib/auditLabels'

type AuditRow = {
  id: number
  at: string
  userName: string
  userRole: string
  action: string
  target: string
  targetId: string
  label: string
  meta?: { status?: string } | null
}

function formatWhen(iso: string) {
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function statusHint(meta?: AuditRow['meta']) {
  if (!meta?.status) return null
  if (meta.status === 'published') return 'Publié'
  if (meta.status === 'pending_review') return 'En validation'
  if (meta.status === 'draft') return 'Brouillon'
  return meta.status
}

export default function ActivityLogPage() {
  const [filter, setFilter] = useState('')
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['activity', filter],
    queryFn: () =>
      api
        .get('/admin/activity', { params: { limit: 100, action: filter || undefined } })
        .then((res) => res.data as { total: number; items: AuditRow[] }),
  })

  const rows = data?.items ?? []

  return (
    <div className="activity-log">
      <div className="activity-log__hero">
        <div>
          <h2 className="activity-log__title">Historique des modifications</h2>
          <p className="activity-log__desc">
            Qui a changé quoi dans le CMS — catalogues, menu, contenu et comptes.
          </p>
        </div>
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => void refetch()} disabled={isFetching}>
          {isFetching ? <Loader2 size={14} className="spin" /> : <RefreshCw size={14} />}
          Actualiser
        </button>
      </div>

      <div className="activity-log__toolbar">
        <label className="activity-log__filter">
          <span>Filtrer</span>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            {AUDIT_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value || 'all'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <p className="activity-log__count">{data?.total ?? 0} entrée{(data?.total ?? 0) !== 1 ? 's' : ''}</p>
      </div>

      {isLoading ? (
        <p className="activity-log__empty">
          <Loader2 size={18} className="spin" /> Chargement…
        </p>
      ) : rows.length === 0 ? (
        <div className="activity-log__empty activity-log__empty--help">
          <p>{filter ? 'Aucune activité pour ce filtre.' : 'Aucune modification enregistrée pour l\u2019instant.'}</p>
          {!filter ? (
            <p className="muted">Enregistrez une fiche catalogue, modifiez le menu ou le contenu — l&apos;historique se remplit automatiquement.</p>
          ) : null}
        </div>
      ) : (
        <ul className="activity-log__list">
          {rows.map((row) => (
            <li key={row.id} className="activity-log__item">
              <div className="activity-log__icon" aria-hidden="true">
                <Clock size={16} />
              </div>
              <div className="activity-log__body">
                <p className="activity-log__action">{auditActionLabel(row.action)}</p>
                <p className="activity-log__detail">
                  {row.label ? (
                    <>
                      <strong>{row.label}</strong>
                      {' · '}
                    </>
                  ) : null}
                  {auditTargetLabel(row.target)}
                  {row.targetId ? ` #${row.targetId}` : ''}
                  {statusHint(row.meta) ? ` · ${statusHint(row.meta)}` : ''}
                </p>
                <p className="activity-log__meta">
                  {row.userName}
                  {row.userRole ? ` (${row.userRole})` : ''}
                  {' · '}
                  {formatWhen(row.at)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
