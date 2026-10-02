import { ArrowLeft, Image as ImageIcon, Layers, Trash2, Type, Upload } from 'lucide-react'
import { FriendlyJsonRows } from '../components/FriendlyJsonRows'

export const TEXT_LOCALES = [
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'ar', flag: '🇹🇳', name: 'العربية' },
] as const

interface BlockRow {
  key: string
  type: 'text' | 'image' | 'json'
  label: string | null
  sort_order?: number
  locales: Record<string, { value: string | null }>
}

interface Section {
  name: string
  title?: string
  pattern?: string | null
  blocks: BlockRow[]
}

interface Props {
  section: Section
  preferredLocale?: string
  onBack: () => void
  onDelete: () => void
  effectiveValue: (section: string, block: BlockRow, locale: string) => string
  effectiveLabel: (section: string, block: BlockRow) => string
  setLabelChange: (section: string, block: BlockRow, label: string) => void
  setValueChange: (section: string, block: BlockRow, locale: string, value: string) => void
  changes: Record<string, unknown>
  onUploadImage: (block: BlockRow, file: File) => void
  uploadFile?: (file: File) => Promise<string>
}

export default function SectionEditorPanel({
  section,
  preferredLocale = 'fr',
  onBack,
  onDelete,
  effectiveValue,
  effectiveLabel,
  setLabelChange,
  setValueChange,
  changes,
  onUploadImage,
  uploadFile,
}: Props) {
  return (
    <aside className="pb-editor">
      <div className="pb-editor__head">
        <button type="button" className="btn btn--ghost btn--sm pb-editor__back" onClick={onBack}>
          <ArrowLeft size={14} /> Composants
        </button>
        <h3>{section.title ?? section.name}</h3>
        <button type="button" className="icon-action icon-action--danger pb-editor__delete" onClick={onDelete} title="Supprimer la section">
          <Trash2 size={14} />
        </button>
      </div>
      <div className="pb-editor__scroll">
        {section.blocks.map((block) => (
          <div key={block.key} className="pb-editor__block">
            <div className="pb-editor__block-head">
              <span className={`wc-type-badge wc-type-${block.type}`}>
                {block.type === 'text' && <Type size={11} />}
                {block.type === 'image' && <ImageIcon size={11} />}
                {block.type === 'json' && <Layers size={11} />}
                {block.type === 'json' ? 'liste' : block.type === 'image' ? 'image' : 'texte'}
              </span>
            </div>
            <input
              className="wc-block-label"
              value={effectiveLabel(section.name, block)}
              placeholder="Titre du champ"
              onChange={(event) => setLabelChange(section.name, block, event.target.value)}
            />

            {block.type === 'text' && (
              <div className="pb-editor__locales">
                {TEXT_LOCALES.map((loc) => {
                  const exists = !!block.locales[loc.code]
                  const dirty = !!changes[`${section.name}.${block.key}.${loc.code}`]
                  return (
                    <div key={loc.code} className={`wc-locale-cell${!exists ? ' missing' : ''}`}>
                      <div className="wc-locale-head">
                        <span>
                          {loc.flag} {loc.name}
                          {preferredLocale === loc.code ? ' · aperçu' : ''}
                        </span>
                        {!exists && <span className="wc-missing-tag">À ajouter</span>}
                      </div>
                      <textarea
                        className={`wc-locale-input${dirty ? ' dirty' : ''}`}
                        rows={4}
                        value={effectiveValue(section.name, block, loc.code)}
                        dir={loc.code === 'ar' ? 'rtl' : 'ltr'}
                        onChange={(event) => setValueChange(section.name, block, loc.code, event.target.value)}
                      />
                    </div>
                  )
                })}
              </div>
            )}

            {block.type === 'image' && (
              <div className="wc-image-fields">
                {effectiveValue(section.name, block, '_all') ? (
                  <img src={effectiveValue(section.name, block, '_all')} alt="" className="wc-image-thumb" />
                ) : null}
                <input
                  className="wc-locale-input"
                  value={effectiveValue(section.name, block, '_all')}
                  onChange={(event) => setValueChange(section.name, block, '_all', event.target.value)}
                />
                <label className="wc-upload-btn">
                  <Upload size={13} /> Glisser ou téléverser
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) onUploadImage(block, file)
                      event.target.value = ''
                    }}
                  />
                </label>
              </div>
            )}

            {block.type === 'json' && (
              <div className="pb-editor__locales">
                {TEXT_LOCALES.map((loc) => (
                  <div key={loc.code} className="wc-locale-cell">
                    <div className="wc-locale-head">
                      <span>
                        {loc.flag} {loc.name}
                      </span>
                    </div>
                    <FriendlyJsonRows
                      value={effectiveValue(section.name, block, loc.code)}
                      onChange={(next) => setValueChange(section.name, block, loc.code, next)}
                      onUploadImage={uploadFile}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  )
}
