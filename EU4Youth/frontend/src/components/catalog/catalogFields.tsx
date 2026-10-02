import { ImageIcon, Loader2, Upload, X } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import { useRef, useState } from 'react'
import { PUBLIC_SITE } from '../../api/editSession'
import {
  GOVERNORATE_COORDS,
  PROJECT_SLUG_BY_LABEL,
  uploadCatalogImage,
  youtubeIdFromUrl,
} from '../../lib/catalogUtils'
import { LocalizedControl } from './CatalogEditorShell'
import type { Locale } from '../../api/client'

function assetPreview(src: string) {
  if (!src) return ''
  if (/^https?:\/\//i.test(src)) return src
  return `${PUBLIC_SITE}${src.startsWith('/') ? src : `/${src}`}`
}

export type CatalogFieldDef = {
  key: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'date' | 'number' | 'localized' | 'list' | 'image' | 'boolean' | 'youtube' | 'geo'
  options?: string[]
  wide?: boolean
  hint?: string
  hidden?: boolean
}

function locBag(value: unknown): Record<string, string> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const rec = value as Record<string, unknown>
    const asText = (v: unknown) => {
      if (v == null) return ''
      if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return String(v)
      if (typeof v === 'object' && !Array.isArray(v)) {
        const nested = v as Record<string, unknown>
        const picked = nested.fr ?? nested.en ?? nested.ar ?? ''
        return typeof picked === 'string' || typeof picked === 'number' ? String(picked) : ''
      }
      return ''
    }
    return { fr: asText(rec.fr), en: asText(rec.en), ar: asText(rec.ar) }
  }
  return { fr: String(value ?? ''), en: '', ar: '' }
}

/** Plain string for selects / text inputs that may still hold a FR/EN/AR bag. */
function plainText(value: unknown, locale: Locale = 'fr'): string {
  if (value == null) return ''
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) return value.map((item) => plainText(item, locale)).filter(Boolean).join(', ')
  if (typeof value === 'object') {
    const bag = locBag(value)
    return bag[locale] || bag.fr || bag.en || bag.ar || ''
  }
  return String(value)
}

function listToString(value: unknown): string {
  if (Array.isArray(value)) return value.map((item) => plainText(item)).filter(Boolean).join(', ')
  if (typeof value === 'string') return value
  if (value && typeof value === 'object') {
    const bag = value as Record<string, unknown>
    const picked = bag.fr ?? bag.en ?? bag.ar
    if (Array.isArray(picked)) return picked.map((item) => plainText(item)).filter(Boolean).join(', ')
    return plainText(value)
  }
  return ''
}

export function localeMissingFlags(draft: Record<string, unknown>, fields: CatalogFieldDef[]) {
  const missing: Partial<Record<Locale, boolean>> = {}
  for (const locale of ['en', 'ar'] as const) {
    missing[locale] = fields.some((field) => {
      if (field.type !== 'localized') return false
      const bag = locBag(draft[field.key])
      return Boolean(bag.fr.trim()) && !bag[locale]?.trim()
    })
  }
  return missing
}

export function renderLocalizedField(
  field: CatalogFieldDef,
  draft: Record<string, unknown>,
  setDraft: Dispatch<SetStateAction<Record<string, unknown> | null>>,
  locale: Locale,
) {
  const bag = locBag(draft[field.key])
  const isLong = field.key === 'body' || field.key === 'summary' || field.key === 'quote' || field.key === 'description'
  return (
    <LocalizedControl
      key={field.key}
      label={field.label}
      locale={locale}
      value={bag[locale]}
      multiline={isLong}
      rows={field.key === 'body' ? 12 : isLong ? 5 : undefined}
      onChange={(value) => setDraft((prev) => (prev ? { ...prev, [field.key]: { ...bag, [locale]: value } } : prev))}
    />
  )
}

function CatalogImageField({
  field,
  draft,
  setDraft,
}: {
  field: CatalogFieldDef
  draft: Record<string, unknown>
  setDraft: Dispatch<SetStateAction<Record<string, unknown> | null>>
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const src = plainText(draft[field.key])
  const preview = assetPreview(src)

  const pick = async (file: File) => {
    setUploading(true)
    try {
      const url = await uploadCatalogImage(file)
      setDraft((prev) => (prev ? { ...prev, [field.key]: url } : prev))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div key={field.key} className="field field--catalog field--wide catalog-image-field">
      <span>{field.label}</span>
      <div className="catalog-image-field__box">
        <button type="button" className="catalog-image-field__visual" onClick={() => inputRef.current?.click()}>
          {preview ? <img src={preview} alt="" /> : <ImageIcon size={28} strokeWidth={1.5} />}
          <span className="catalog-image-field__overlay">
            {uploading ? <Loader2 size={16} className="spin" /> : <Upload size={14} />}
            {uploading ? 'Envoi…' : 'Changer'}
          </span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) void pick(file)
            event.target.value = ''
          }}
        />
        <div className="catalog-image-field__meta">
          <p>{src ? 'Image sélectionnée' : 'Cliquez pour ajouter une photo'}</p>
          <div className="catalog-image-field__actions">
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => inputRef.current?.click()}>
              Parcourir
            </button>
            {src ? (
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => setDraft((prev) => (prev ? { ...prev, [field.key]: '' } : prev))}
              >
                <X size={13} /> Retirer
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export function renderMetaField(
  field: CatalogFieldDef,
  draft: Record<string, unknown>,
  setDraft: Dispatch<SetStateAction<Record<string, unknown> | null>>,
) {
  if (field.hidden) return null

  if (field.type === 'select') {
    const current = plainText(draft[field.key])
    const options = [...(field.options || [])]
    if (current && !options.includes(current)) options.unshift(current)
    return (
      <label key={field.key} className="field field--catalog">
        <span>{field.label}</span>
        <select
          value={current}
          onChange={(e) => {
            const value = e.target.value
            if (field.key === 'project') {
              const slug = PROJECT_SLUG_BY_LABEL[value]
              setDraft((prev) =>
                prev
                  ? {
                      ...prev,
                      project: value,
                      ...(slug ? { projectSlug: slug } : {}),
                    }
                  : prev,
              )
              return
            }
            if (field.key === 'governorate') {
              const coords = GOVERNORATE_COORDS[value]
              setDraft((prev) =>
                prev
                  ? {
                      ...prev,
                      governorate: value,
                      ...(coords ? { lat: coords.lat, lng: coords.lng } : {}),
                    }
                  : prev,
              )
              return
            }
            setDraft((prev) => (prev ? { ...prev, [field.key]: value } : prev))
          }}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt === 'draft' ? 'Brouillon' : opt === 'published' ? 'Publié' : opt}
            </option>
          ))}
        </select>
      </label>
    )
  }

  if (field.type === 'boolean') {
    return (
      <label key={field.key} className="field field--catalog">
        <span>{field.label}</span>
        <select
          value={draft[field.key] ? 'true' : 'false'}
          onChange={(e) => setDraft((prev) => (prev ? { ...prev, [field.key]: e.target.value === 'true' } : prev))}
        >
          <option value="false">Non</option>
          <option value="true">Oui — consentement obtenu</option>
        </select>
      </label>
    )
  }

  if (field.type === 'list') {
    return (
      <label key={field.key} className="field field--catalog">
        <span>
          {field.label}{' '}
          {field.hint ? <small className="field__hint">({field.hint})</small> : null}
        </span>
        <input
          value={listToString(draft[field.key])}
          onChange={(e) => setDraft((prev) => (prev ? { ...prev, [field.key]: e.target.value } : prev))}
          placeholder="ex: Emploi, Formation"
        />
      </label>
    )
  }

  if (field.type === 'image') {
    return <CatalogImageField key={field.key} field={field} draft={draft} setDraft={setDraft} />
  }

  if (field.type === 'youtube') {
    const ytId = youtubeIdFromUrl(plainText(draft[field.key]))
    return (
      <div key={field.key} className="field field--catalog field--wide">
        <span>{field.label}</span>
        <input
          value={plainText(draft[field.key])}
          onChange={(e) => setDraft((prev) => (prev ? { ...prev, [field.key]: e.target.value } : prev))}
          onBlur={(e) =>
            setDraft((prev) => (prev ? { ...prev, [field.key]: youtubeIdFromUrl(e.target.value) } : prev))
          }
          placeholder="Collez le lien YouTube ou l'identifiant"
        />
        {ytId.length >= 11 ? (
          <iframe
            title="Aperçu YouTube"
            src={`https://www.youtube-nocookie.com/embed/${ytId}`}
            className="catalog-editor__yt"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : null}
      </div>
    )
  }

  if (field.type === 'geo') {
    return (
      <div key={field.key} className="field field--catalog catalog-geo-field">
        <span>{field.label}</span>
        <p className="catalog-geo-field__hint">Position sur la carte — remplie automatiquement selon le gouvernorat. Ajustez si besoin.</p>
        <div className="catalog-geo-field__grid">
          <label>
            <span>Latitude</span>
            <input
              type="number"
              step="any"
              value={String(draft.lat ?? '')}
              onChange={(e) => setDraft((prev) => (prev ? { ...prev, lat: e.target.value } : prev))}
            />
          </label>
          <label>
            <span>Longitude</span>
            <input
              type="number"
              step="any"
              value={String(draft.lng ?? '')}
              onChange={(e) => setDraft((prev) => (prev ? { ...prev, lng: e.target.value } : prev))}
            />
          </label>
        </div>
      </div>
    )
  }

  if (field.type === 'date') {
    return (
      <label key={field.key} className="field field--catalog">
        <span>{field.label}</span>
        <input
          type="date"
          value={plainText(draft[field.key]).slice(0, 10)}
          onChange={(e) => setDraft((prev) => (prev ? { ...prev, [field.key]: e.target.value } : prev))}
        />
      </label>
    )
  }

  if (field.type === 'number') {
    return (
      <label key={field.key} className="field field--catalog">
        <span>{field.label}</span>
        <input
          type="number"
          step="any"
          value={plainText(draft[field.key])}
          onChange={(e) => setDraft((prev) => (prev ? { ...prev, [field.key]: e.target.value } : prev))}
        />
      </label>
    )
  }

  if (field.type === 'textarea') {
    return (
      <label key={field.key} className="field field--catalog field--wide">
        <span>{field.label}</span>
        <textarea
          rows={4}
          value={plainText(draft[field.key])}
          onChange={(e) => setDraft((prev) => (prev ? { ...prev, [field.key]: e.target.value } : prev))}
        />
      </label>
    )
  }

  return (
    <label key={field.key} className="field field--catalog">
      <span>{field.label}</span>
      <input
        value={plainText(draft[field.key])}
        onChange={(e) => setDraft((prev) => (prev ? { ...prev, [field.key]: e.target.value } : prev))}
      />
    </label>
  )
}
