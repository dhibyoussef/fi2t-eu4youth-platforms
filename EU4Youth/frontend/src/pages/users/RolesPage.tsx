import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { api, ROLE_LABEL, type Role } from '../../api/client'

const PERMISSIONS: { key: string; label: string }[] = [
  { key: 'content', label: 'Contenu du site' },
  { key: 'catalogues', label: 'Catalogues (projets, stories…)' },
  { key: 'translations', label: 'Traductions' },
  { key: 'inbox', label: 'Inbox formulaires' },
  { key: 'users', label: 'Comptes équipe' },
  { key: 'roles', label: 'Rôles et permissions' },
  { key: 'settings', label: 'Paramètres globaux' },
]

type Matrix = Record<string, Record<string, boolean>>

export default function RolesPage() {
  const qc = useQueryClient()
  const { data: matrix } = useQuery<Matrix>({
    queryKey: ['roles'],
    queryFn: () => api.get('/admin/roles').then((res) => res.data),
  })

  const save = useMutation({
    mutationFn: (next: Matrix) => api.patch('/admin/roles', next),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['roles'] })
      toast.success('Permissions enregistrées')
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Réservé à l’administrateur')
    },
  })

  const roles = Object.keys(ROLE_LABEL) as Role[]

  if (!matrix) {
    return (
      <div className="catalog-studio">
        <p className="table-empty">Chargement des rôles…</p>
      </div>
    )
  }

  return (
    <div className="catalog-studio">
      <div className="catalog-list__hero">
        <div>
          <h2 className="catalog-list__title">Rôles et permissions</h2>
          <p className="catalog-list__desc">
            Matrice des droits. L’administrateur conserve toujours la gestion des comptes et des
            rôles. Les contributeurs restent liés à un projet dans Équipe.
          </p>
        </div>
        <p className="catalog-list__count">{PERMISSIONS.length} permissions</p>
      </div>

      <div className="table-wrap catalog-list__table">
        <table className="roles-matrix">
          <thead>
            <tr>
              <th>Permission</th>
              {roles.map((role) => (
                <th key={role}>{ROLE_LABEL[role]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERMISSIONS.map((permission) => (
              <tr key={permission.key}>
                <td>{permission.label}</td>
                {roles.map((role) => {
                  const locked =
                    role === 'administrateur' &&
                    (permission.key === 'users' || permission.key === 'roles')
                  return (
                    <td key={role}>
                      <input
                        type="checkbox"
                        checked={Boolean(matrix[role]?.[permission.key]) || locked}
                        disabled={locked}
                        onChange={(event) => {
                          const next = {
                            ...matrix,
                            [role]: {
                              ...matrix[role],
                              [permission.key]: event.target.checked,
                            },
                          }
                          save.mutate(next)
                        }}
                      />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
