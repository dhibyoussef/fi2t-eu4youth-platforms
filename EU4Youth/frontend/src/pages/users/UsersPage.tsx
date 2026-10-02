import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PenLine, Trash2 } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { api, ROLE_LABEL, type CmsUser, type Role } from '../../api/client'

type ProjectInfo = { slug: string; acronym?: string; fullName?: string; name?: { fr?: string } }

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  role: 'editeur' as Role,
  projectSlug: 'jeuness',
  password: '',
}

export default function UsersPage() {
  const qc = useQueryClient()
  const { data: users = [] } = useQuery<CmsUser[]>({
    queryKey: ['users'],
    queryFn: () => api.get('/admin/users').then((res) => res.data),
  })
  const { data: projectsRaw = [] } = useQuery<ProjectInfo[]>({
    queryKey: ['projects-list'],
    queryFn: () => api.get('/admin/projects').then((res) => res.data),
  })
  const PROJECTS = projectsRaw.map((p) => ({
    slug: p.slug,
    name: p.acronym || p.name?.fr || p.fullName || p.slug,
  }))
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState<number | null>(null)
  const [draft, setDraft] = useState<CmsUser | null>(null)
  const [editPassword, setEditPassword] = useState('')

  const create = useMutation({
    mutationFn: () => api.post('/admin/users', form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      setForm(emptyForm)
      toast.success('Compte créé')
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Impossible de créer le compte')
    },
  })

  const update = useMutation({
    mutationFn: (user: CmsUser & { password?: string }) =>
      api.patch(`/admin/users/${user.id}`, user),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      setEditing(null)
      setDraft(null)
      setEditPassword('')
      toast.success('Compte mis à jour')
    },
    onError: () => toast.error('Impossible de mettre à jour'),
  })

  const remove = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/users/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('Compte supprimé')
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Impossible de supprimer')
    },
  })

  return (
    <div className="catalog-studio">
      <div className="catalog-list__hero">
        <div>
          <h2 className="catalog-list__title">Équipe</h2>
          <p className="catalog-list__desc">
            Comptes du back-office. Le Super Admin ne peut pas être supprimé. Mot de passe : 8
            caractères minimum, stocké haché.
          </p>
        </div>
        <p className="catalog-list__count">{users.length} compte{users.length !== 1 ? 's' : ''}</p>
      </div>

      <form
        className="user-form"
        onSubmit={(event) => {
          event.preventDefault()
          create.mutate()
        }}
      >
        <p className="user-form__title">Nouveau compte</p>
        <label className="field field--catalog">
          <span>Prénom</span>
          <input
            value={form.firstName}
            onChange={(event) => setForm({ ...form, firstName: event.target.value })}
            required
          />
        </label>
        <label className="field field--catalog">
          <span>Nom</span>
          <input
            value={form.lastName}
            onChange={(event) => setForm({ ...form, lastName: event.target.value })}
            required
          />
        </label>
        <label className="field field--catalog">
          <span>E-mail</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
        </label>
        <label className="field field--catalog">
          <span>Rôle</span>
          <select
            value={form.role}
            onChange={(event) => setForm({ ...form, role: event.target.value as Role })}
          >
            {(Object.keys(ROLE_LABEL) as Role[]).map((role) => (
              <option key={role} value={role}>
                {ROLE_LABEL[role]}
              </option>
            ))}
          </select>
        </label>
        {form.role === 'contributeur' ? (
          <label className="field field--catalog">
            <span>Projet</span>
            <select
              value={form.projectSlug}
              onChange={(event) => setForm({ ...form, projectSlug: event.target.value })}
            >
              {PROJECTS.map((project) => (
                <option key={project.slug} value={project.slug}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <span aria-hidden="true" />
        )}
        <label className="field field--catalog">
          <span>Mot de passe</span>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
        </label>
        <button type="submit" className="btn btn--primary" disabled={create.isPending}>
          Ajouter
        </button>
      </form>

      <div className="table-wrap catalog-list__table">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Projet</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isEditing = editing === user.id && draft
              const row = isEditing ? draft : user
              return (
                <tr key={user.id}>
                  <td className="cell-title">
                    {isEditing ? (
                      <span className="user-inline">
                        <input
                          value={row.firstName}
                          onChange={(event) =>
                            setDraft({ ...row, firstName: event.target.value })
                          }
                        />
                        <input
                          value={row.lastName}
                          onChange={(event) =>
                            setDraft({ ...row, lastName: event.target.value })
                          }
                        />
                      </span>
                    ) : (
                      <strong>{user.firstName} {user.lastName}</strong>
                    )}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    {isEditing ? (
                      <select
                        value={row.role}
                        onChange={(event) =>
                          setDraft({ ...row, role: event.target.value as Role })
                        }
                      >
                        {(Object.keys(ROLE_LABEL) as Role[]).map((role) => (
                          <option key={role} value={role}>
                            {ROLE_LABEL[role]}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="pill pill--role">{ROLE_LABEL[user.role]}</span>
                    )}
                  </td>
                  <td>
                    {isEditing && row.role === 'contributeur' ? (
                      <select
                        value={row.projectSlug ?? 'jeuness'}
                        onChange={(event) =>
                          setDraft({ ...row, projectSlug: event.target.value })
                        }
                      >
                        {PROJECTS.map((project) => (
                          <option key={project.slug} value={project.slug}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      user.projectSlug ?? '—'
                    )}
                  </td>
                  <td className="col-actions">
                    <div className="row-actions">
                      {isEditing ? (
                        <div className="user-edit-actions">
                          <label className="field field--catalog user-edit-password">
                            <span>Nouveau mot de passe (optionnel)</span>
                            <input
                              type="password"
                              minLength={8}
                              autoComplete="new-password"
                              placeholder="Laisser vide pour ne pas changer"
                              value={editPassword}
                              onChange={(event) => setEditPassword(event.target.value)}
                            />
                          </label>
                          <button
                            type="button"
                            className="btn btn--primary btn--sm"
                            onClick={() => {
                              const payload = editPassword.trim()
                                ? { ...row, password: editPassword.trim() }
                                : row
                              update.mutate(payload)
                            }}
                          >
                            Sauver
                          </button>
                          <button
                            type="button"
                            className="btn btn--ghost btn--sm"
                            onClick={() => {
                              setEditing(null)
                              setDraft(null)
                              setEditPassword('')
                            }}
                          >
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="icon-action"
                          aria-label="Modifier"
                          onClick={() => {
                            setEditing(user.id)
                            setDraft({ ...user })
                            setEditPassword('')
                          }}
                        >
                          <PenLine size={15} />
                        </button>
                      )}
                      <button
                        type="button"
                        className="icon-action icon-action--danger"
                        aria-label="Supprimer"
                        onClick={() => {
                          if (confirm(`Supprimer ${user.email} ?`)) remove.mutate(user.id)
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
