import { ImageIcon, Upload, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { PUBLIC_SITE } from '../../../api/editSession'

function assetPreview(src: string) {
  if (!src) return ''
  if (/^https?:\/\//i.test(src)) return src
  return `${PUBLIC_SITE}${src.startsWith('/') ? src : `/${src}`}`
}

function fileLabel(path: string) {
  if (!path) return ''
  const name = path.split('/').filter(Boolean).pop()
  return name || path
}

export default function MediaAssetCard({
  label,
  hint,
  value,
  onChange,
  onUpload,
  variant = 'default',
}: {
  label: string
  hint?: string
  value: string
  onChange: (value: string) => void
  onUpload: (file: File) => void
  variant?: 'default' | 'icon'
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [showUrl, setShowUrl] = useState(false)
  const preview = assetPreview(value)

  const pick = () => inputRef.current?.click()

  return (
    <article className={`media-asset-card${variant === 'icon' ? ' media-asset-card--icon' : ''}`}>
      <button type="button" className="media-asset-card__visual" onClick={pick} aria-label={`Changer ${label}`}>
        {preview ? (
          <img src={preview} alt="" />
        ) : (
          <span className="media-asset-card__placeholder">
            <ImageIcon size={variant === 'icon' ? 24 : 32} strokeWidth={1.5} />
            <span>Cliquer pour ajouter</span>
          </span>
        )}
        <span className="media-asset-card__hover">
          <Upload size={15} />
          Changer l&apos;image
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onUpload(file)
          event.target.value = ''
        }}
      />

      <div className="media-asset-card__info">
        <div className="media-asset-card__titles">
          <strong>{label}</strong>
          {hint ? <p>{hint}</p> : null}
        </div>
        {value ? (
          <span className="media-asset-card__filename" title={value}>
            {fileLabel(value)}
          </span>
        ) : (
          <span className="media-asset-card__filename media-asset-card__filename--empty">Aucune image</span>
        )}
        <div className="media-asset-card__actions">
          <button type="button" className="media-asset-card__btn" onClick={pick}>
            Parcourir
          </button>
          {value ? (
            <button type="button" className="media-asset-card__btn media-asset-card__btn--muted" onClick={() => onChange('')}>
              <X size={13} /> Retirer
            </button>
          ) : null}
          <button
            type="button"
            className={`media-asset-card__btn media-asset-card__btn--link${showUrl ? ' is-active' : ''}`}
            onClick={() => setShowUrl((open) => !open)}
          >
            URL
          </button>
        </div>
        {showUrl ? (
          <input
            className="media-asset-card__url"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="/img/mon-fichier.png"
            aria-label={`URL de ${label}`}
          />
        ) : null}
      </div>
    </article>
  )
}
