import { useState } from 'react'
import { Columns, Eye, LayoutGrid } from 'lucide-react'
import BuilderLivePreview, { type EmbedEditPayload } from './BuilderLivePreview'
import BuilderSectionPreview from './BuilderSectionPreview'
import ComponentPalette from './ComponentPalette'
import InsertionZone from './InsertionZone'
import SectionEditorPanel from './SectionEditorPanel'
import { TYPE_LABEL } from './typeLabels'

export type InsertTarget = '__start__' | string | null
export type CanvasMode = 'structure' | 'preview' | 'split'

interface BlockRow {
  key: string
  type: 'text' | 'image' | 'json'
  label: string | null
  sort_order?: number
  locales: Record<string, { value: string | null }>
}

export interface BuilderSection {
  name: string
  title?: string
  pattern?: string | null
  blocks: BlockRow[]
}

interface PendingChange {
  section: string
  key: string
  locale: string
  value: string
}

interface Props {
  pageSlug: string
  pagePath?: string
  sections: BuilderSection[]
  selectedSection: string | null
  insertTarget: InsertTarget
  insertLoading: boolean
  changes: Record<string, PendingChange>
  onSelectSection: (slug: string | null) => void
  onSetInsertTarget: (target: InsertTarget) => void
  onInsertPattern: (patternId: string) => void
  onDeleteSection: (slug: string) => void
  onReorderSections?: (order: string[]) => void
  effectiveValue: (section: string, block: BlockRow, locale: string) => string
  effectiveLabel: (section: string, block: BlockRow) => string
  setLabelChange: (section: string, block: BlockRow, label: string) => void
  setValueChange: (section: string, block: BlockRow, locale: string, value: string) => void
  onDeleteLocale: (section: string, key: string, locale: string) => void
  onUploadImage: (section: string, block: BlockRow, file: File) => void
  uploadFile?: (file: File) => Promise<string>
  onEmbedEdit?: (edit: EmbedEditPayload) => void
  onEmbedSaved?: (page: string) => void
  allowInsert?: boolean
  structureTitle?: string
  chromeHint?: boolean
}

export default function PageBuilder({
  pageSlug,
  pagePath,
  sections,
  selectedSection,
  insertTarget,
  insertLoading,
  changes,
  onSelectSection,
  onSetInsertTarget,
  onInsertPattern,
  onDeleteSection,
  onReorderSections,
  effectiveValue,
  effectiveLabel,
  setLabelChange,
  setValueChange,
  onUploadImage,
  uploadFile,
  onEmbedEdit,
  onEmbedSaved,
  allowInsert = true,
  structureTitle,
  chromeHint = false,
}: Props) {
  const selected = sections.find((s) => s.name === selectedSection)
  const [canvasMode, setCanvasMode] = useState<CanvasMode>(() => {
    try {
      const saved = sessionStorage.getItem('eu4y-pb-canvas')
      if (saved === 'structure' || saved === 'split' || saved === 'preview') return saved
    } catch {
      /* ignore */
    }
    return 'preview'
  })
  const [previewExpanded, setPreviewExpanded] = useState(false)
  const [previewLocale, setPreviewLocale] = useState<'fr' | 'en' | 'ar'>('fr')
  const [dragSlug, setDragSlug] = useState<string | null>(null)

  const changeCanvasMode = (mode: CanvasMode) => {
    setCanvasMode(mode)
    try {
      sessionStorage.setItem('eu4y-pb-canvas', mode)
    } catch {
      /* ignore */
    }
  }

  const showStructure = canvasMode === 'structure' || canvasMode === 'split'
  const showPreview = canvasMode === 'preview' || canvasMode === 'split'
  const layoutClass = [
    'pb-layout',
    canvasMode === 'split' ? 'pb-layout--split' : '',
    canvasMode === 'preview' ? 'pb-layout--preview-only' : '',
    previewExpanded ? 'pb-layout--preview-expanded' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const moveTo = (target: string) => {
    if (!dragSlug || dragSlug === target || !onReorderSections) return
    const order = sections.map((s) => s.name)
    const from = order.indexOf(dragSlug)
    const to = order.indexOf(target)
    if (from < 0 || to < 0) return
    order.splice(from, 1)
    order.splice(to, 0, dragSlug)
    onReorderSections(order)
  }

  return (
    <div className={layoutClass}>
      {showStructure && (
        <div className="pb-canvas-column">
          <div className="pb-canvas-header">
            <div className="pb-canvas-header__left">
              <span>
                <LayoutGrid size={14} /> {structureTitle || 'Structure de la page'}
              </span>
              <div className="pb-canvas-modes">
                <button
                  type="button"
                  className={canvasMode === 'structure' ? 'active' : ''}
                  onClick={() => changeCanvasMode('structure')}
                  title="Structure seule"
                >
                  <LayoutGrid size={13} />
                </button>
                <button
                  type="button"
                  className={canvasMode === 'split' ? 'active' : ''}
                  onClick={() => changeCanvasMode('split')}
                  title="Structure + aperçu"
                >
                  <Columns size={13} />
                </button>
                <button type="button" onClick={() => changeCanvasMode('preview')} title="Aperçu seul">
                  <Eye size={13} />
                </button>
              </div>
            </div>
          </div>
          <div className="pb-canvas" onClick={() => onSelectSection(null)}>
            {sections.length === 0 && (
              <div className="pb-empty">
                <LayoutGrid size={40} />
                <h3>Page vide — commencez ici</h3>
                <p>
                  Cliquez sur <strong>+ Ajouter une zone</strong>, puis choisissez un composant à droite.
                </p>
              </div>
            )}
            {allowInsert ? (
            <InsertionZone
              active={insertTarget === '__start__'}
              onClick={() => {
                onSelectSection(null)
                onSetInsertTarget(insertTarget === '__start__' ? null : '__start__')
              }}
              label="Ajouter en haut de page"
            />
            ) : null}
            {sections.map((sec) => (
              <div key={sec.name} className="pb-section-wrap">
                <BuilderSectionPreview
                  section={sec}
                  selected={selectedSection === sec.name}
                  draggable
                  onDragStart={() => setDragSlug(sec.name)}
                  onDragOver={(event) => {
                    event.preventDefault()
                  }}
                  onDrop={() => {
                    moveTo(sec.name)
                    setDragSlug(null)
                  }}
                  getValue={(key, locale = 'fr') => {
                    const block = sec.blocks.find((b) => b.key === key)
                    if (!block) return ''
                    if (block.type === 'image') return effectiveValue(sec.name, block, '_all')
                    if (block.type === 'json') {
                      return (
                        effectiveValue(sec.name, block, locale) ||
                        effectiveValue(sec.name, block, 'fr') ||
                        effectiveValue(sec.name, block, '_all')
                      )
                    }
                    return effectiveValue(sec.name, block, locale)
                  }}
                  onClick={() => {
                    onSetInsertTarget(null)
                    onSelectSection(sec.name)
                  }}
                />
                {allowInsert ? (
                <InsertionZone
                  active={insertTarget === sec.name}
                  onClick={() => {
                    onSelectSection(null)
                    onSetInsertTarget(insertTarget === sec.name ? null : sec.name)
                  }}
                />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {showPreview && (
        <div className="pb-preview-column">
          {!showStructure && (
            <div className="pb-canvas-header pb-canvas-header--preview-only">
              <div className="pb-canvas-header__left">
                <span>
                  <Eye size={14} /> Aperçu instantané
                </span>
                <div className="pb-canvas-modes">
                  <button type="button" onClick={() => changeCanvasMode('structure')} title="Structure seule">
                    <LayoutGrid size={13} />
                  </button>
                  <button type="button" onClick={() => changeCanvasMode('split')} title="Structure + aperçu">
                    <Columns size={13} />
                  </button>
                  <button type="button" className="active" title="Aperçu seul">
                    <Eye size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}
          <BuilderLivePreview
            pageSlug={pageSlug}
            pagePath={pagePath}
            sections={sections}
            changes={changes}
            selectedSection={selectedSection}
            expanded={previewExpanded}
            onToggleExpand={() => setPreviewExpanded((e) => !e)}
            showToolbar
            onLocaleChange={setPreviewLocale}
            onEmbedEdit={onEmbedEdit}
            onEmbedSaved={onEmbedSaved}
            chromeHint={chromeHint}
          />
        </div>
      )}

      {!previewExpanded && (
        <div className="pb-side-column">
          {selected ? (
            <SectionEditorPanel
              section={selected}
              preferredLocale={previewLocale}
              onBack={() => onSelectSection(null)}
              onDelete={() => onDeleteSection(selected.name)}
              effectiveValue={effectiveValue}
              effectiveLabel={effectiveLabel}
              setLabelChange={setLabelChange}
              setValueChange={setValueChange}
              changes={changes}
              onUploadImage={(block, file) => onUploadImage(selected.name, block, file)}
              uploadFile={uploadFile}
            />
          ) : allowInsert ? (
            <ComponentPalette
              active={insertTarget !== null}
              loading={insertLoading}
              onPick={onInsertPattern}
              current={sections.map((sec) => ({
                title: sec.title || sec.name,
                type: `${sec.name} · ${TYPE_LABEL[sec.pattern || ''] || sec.pattern || 'zone'}`,
              }))}
            />
          ) : (
            <div className="pb-chrome-help">
              <strong>Chrome du site</strong>
              <p>Sélectionnez une zone à gauche : en-tête, pied de page ou cookies. Le menu principal se gère dans l’onglet <em>Menu du site</em>.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
