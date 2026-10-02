import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, ExternalLink, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api } from '../../api/client'
import { useAuth } from '../../auth/AuthProvider'
import ContextualHelp from '../../components/ContextualHelp'
import { catalogRoute } from '../../lib/catalogLabels'
import { PUBLIC_SITE } from '../../api/editSession'
import { catalogPublicPreviewUrl } from '../../lib/catalogUtils'

type QueueItem = {
  collection: string
  collectionLabel: string
  id: string | number
  label: string
  project: string
  submittedAt: string
}

function canApprove(role?: string) {
  return role === 'administrateur' || role === 'editeur'
}

export default function ValidationQueuePage() {
  const qc = useQueryClient()
  const { user } = useAuth()
  const approvePerm = canApprove(user?.role)

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['validation-queue'],
    queryFn: () => api.get('/admin/validation-queue').then((res) => res.data as { total: number; items: QueueItem[] }),
    enabled: approvePerm,
  })

  const approve = useMutation({
    mutationFn: ({ collection, id }: { collection: string; id: string | number }) =>
      api.post(`/admin/${collection}/${id}/approve`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['validation-queue'] })
      qc.invalidateQueries({ queryKey: ['activity'] })
      toast.success('Fiche publiée')
    },
    onError: () => toast.error('Validation impossible'),
  })

  const rows = data?.items ?? []

  if (!approvePerm) {
    return (
      <div className="validation-queue">
        <h2>À valider</h2>
        <p className="muted">Réservé aux éditeurs et administrateurs.</p>
      </div>
    )
  }

  return (
    <div className="validation-queue">
      <div className="validation-queue__hero">
        <div>
          <h2 className="validation-queue__title">Fiches à valider</h2>
          <p className="validation-queue__desc">
            Contributeurs — soumissions en attente de publication sur le site public.
          </p>
        </div>
        <div className="validation-queue__actions">
          <ContextualHelp screen="validation" />
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => void refetch()} disabled={isFetching}>
            {isFetching ? <Loader2 size={14} className="spin" /> : null}
            Actualiser
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="validation-queue__empty"><Loader2 size={18} className="spin" /> Chargement…</p>
      ) : rows.length === 0 ? (
        <div className="validation-queue__empty validation-queue__empty--ok">
          <p>Aucune fiche en attente — tout est à jour.</p>
        </div>
      ) : (
        <ul className="validation-queue__list">
          {rows.map((row) => {
            const editTo = catalogRoute(row.collection)
            const preview = catalogPublicPreviewUrl(
              row.collection as 'news',
              { slug: row.id, id: row.id, status: 'pending_review' },
              PUBLIC_SITE,
            )
            return (
              <li key={`${row.collection}-${row.id}`} className="validation-queue__item">
                <div className="validation-queue__body">
                  <p className="validation-queue__kind">{row.collectionLabel}</p>
                  <p className="validation-queue__label">{row.label}</p>
                  <p className="validation-queue__meta">
                    {row.project ? `${row.project} · ` : ''}
                    {row.submittedAt ? String(row.submittedAt).slice(0, 10) : 'Date non renseignée'}
                  </p>
                </div>
                <div className="validation-queue__btns">
                  <Link className="btn btn--ghost btn--sm" to={editTo}>
                    Ouvrir
                  </Link>
                  {preview ? (
                    <a className="btn btn--ghost btn--sm" href={preview} target="_blank" rel="noreferrer">
                      <ExternalLink size={14} /> Aperçu
                    </a>
                  ) : null}
                  <button
                    type="button"
                    className="btn btn--primary btn--sm"
                    disabled={approve.isPending}
                    onClick={() => {
                      if (!confirm(`Publier « ${row.label} » sur le site public ?`)) return
                      approve.mutate({ collection: row.collection, id: row.id })
                    }}
                  >
                    <Check size={14} /> Valider et publier
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
