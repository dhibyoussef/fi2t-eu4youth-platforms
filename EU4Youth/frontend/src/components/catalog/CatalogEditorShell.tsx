import type { ReactNode } from 'react'
import { ChevronLeft, ExternalLink, Loader2, Trash2 } from 'lucide-react'
import type { Locale } from '../../api/client'

const LOCALE_LABEL: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  ar: 'العربية',
}

export function CatalogEditorHeader({
  backLabel,
  onBack,
  translateOnSave,
  onTranslateOnSave,
  onSave,
  saving,
  onDelete,
  previewUrl,
  extraActions,
}: {
  backLabel: string
  onBack: () => void
  translateOnSave: boolean
  onTranslateOnSave: (value: boolean) => void
  onSave: () => void
  saving: boolean
  onDelete?: () => void
  previewUrl?: string | null
  extraActions?: ReactNode
}) {
  return (
    <div className="catalog-editor__head">
      <button type="button" className="btn btn--ghost btn--sm" onClick={onBack}>
        <ChevronLeft size={14} /> {backLabel}
      </button>
      <div className="catalog-editor__actions">
        {extraActions}
        {previewUrl ? (
          <a className="btn btn--ghost btn--sm" href={previewUrl} target="_blank" rel="noreferrer">
            <ExternalLink size={14} /> Aperçu sur le site
          </a>
        ) : null}
        <label className="catalog-editor__toggle">
          <input
            type="checkbox"
            checked={translateOnSave}
            onChange={(event) => onTranslateOnSave(event.target.checked)}
          />
          <span>Traduire EN / AR à l&apos;enregistrement</span>
        </label>
        <button type="button" className="btn btn--primary btn--sm" disabled={saving} onClick={onSave}>
          {saving ? <Loader2 size={14} className="spin" /> : null}
          Enregistrer
        </button>
        {onDelete ? (
          <button type="button" className="btn btn--ghost btn--sm catalog-editor__delete" onClick={onDelete}>
            <Trash2 size={14} />
          </button>
        ) : null}
      </div>
    </div>
  )
}

export function LocaleTabs({
  locale,
  onLocale,
  missing,
}: {
  locale: Locale
  onLocale: (locale: Locale) => void
  missing?: Partial<Record<Locale, boolean>>
}) {
  return (
    <div className="locale-tabs" role="tablist" aria-label="Langue d'édition">
      {(['fr', 'en', 'ar'] as const).map((code) => (
        <button
          key={code}
          type="button"
          role="tab"
          aria-selected={locale === code}
          className={locale === code ? 'active' : ''}
          data-missing={missing?.[code] ? 'true' : undefined}
          onClick={() => onLocale(code)}
        >
          {LOCALE_LABEL[code]}
        </button>
      ))}
    </div>
  )
}

export function CatalogEditorLayout({
  localeTabs,
  main,
  side,
  footer,
}: {
  localeTabs: ReactNode
  main: ReactNode
  side: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="catalog-editor">
      <div className="catalog-editor__main">
        {localeTabs}
        <div className="catalog-editor__fields">{main}</div>
      </div>
      <aside className="catalog-editor__side">
        <h3>Paramètres</h3>
        <div className="catalog-editor__fields">{side}</div>
      </aside>
      {footer ? <div className="catalog-editor__foot">{footer}</div> : null}
    </div>
  )
}

export function LocalizedControl({
  label,
  locale,
  value,
  onChange,
  multiline,
  rows,
}: {
  label: string
  locale: Locale
  value: string
  onChange: (value: string) => void
  multiline?: boolean
  rows?: number
}) {
  const props = {
    dir: locale === 'ar' ? ('rtl' as const) : ('ltr' as const),
    value,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value),
    placeholder: locale === 'fr' ? label : `${label} (${locale.toUpperCase()})`,
  }
  return (
    <label className={`field field--catalog${multiline ? ' field--wide' : ''}`}>
      <span>{label}</span>
      {multiline ? (
        <textarea {...props} className={rows && rows > 6 ? 'field--body' : undefined} rows={rows ?? 4} />
      ) : (
        <input {...props} />
      )}
    </label>
  )
}
