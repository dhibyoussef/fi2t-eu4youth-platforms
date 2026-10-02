import { useState } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  onCreate: (payload: { title: string; slug: string; path: string; status: 'draft' | 'published' }) => void
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function AddPageModal({ open, onClose, onCreate }: Props) {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('published')
  if (!open) return null
  return (
    <div className="wc-modal" role="dialog" aria-modal="true" aria-label="Nouvelle page" onClick={onClose}>
      <div className="wc-modal__card" onClick={(event) => event.stopPropagation()}>
        <h3>Nouvelle page</h3>
        <p className="wc-modal__desc">Crée une page dans le site public avec un permalien unique.</p>
        <label className="field field--catalog">
          <span>Titre</span>
          <input
            value={title}
            onChange={(event) => {
              setTitle(event.target.value)
              if (!slug || slug === slugify(title)) setSlug(slugify(event.target.value))
            }}
            autoFocus
          />
        </label>
        <label className="field field--catalog">
          <span>Permalien</span>
          <input value={slug} onChange={(event) => setSlug(slugify(event.target.value))} placeholder="ma-nouvelle-page" />
        </label>
        <label className="field field--catalog">
          <span>Statut</span>
          <select value={status} onChange={(event) => setStatus(event.target.value as 'draft' | 'published')}>
            <option value="published">Publié</option>
            <option value="draft">Brouillon</option>
          </select>
        </label>
        <div className="wc-modal__actions">
          <button type="button" className="btn btn--ghost btn--sm" onClick={onClose}>
            Annuler
          </button>
          <button
            type="button"
            className="btn btn--primary btn--sm"
            disabled={!title.trim()}
            onClick={() => {
              const clean = slugify(slug || title)
              onCreate({ title: title.trim(), slug: clean, path: `/${clean}`, status })
              setTitle('')
              setSlug('')
            }}
          >
            Créer
          </button>
        </div>
      </div>
    </div>
  )
}
