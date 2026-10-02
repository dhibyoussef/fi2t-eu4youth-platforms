import { GripVertical } from 'lucide-react'
import type { DragEvent } from 'react'
import type { BuilderSection } from './PageBuilder'
import { TYPE_LABEL } from './typeLabels'

interface Props {
  section: BuilderSection
  selected: boolean
  getValue: (key: string, locale?: string) => string
  onClick: () => void
  draggable?: boolean
  onDragStart?: () => void
  onDragOver?: (event: DragEvent) => void
  onDrop?: () => void
}

function parseItems(raw: string) {
  try {
    const data = JSON.parse(raw)
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.fr)
        ? data.fr
        : Array.isArray(data?.en)
          ? data.en
          : []
    return list.slice(0, 6)
  } catch {
    return []
  }
}

export default function BuilderSectionPreview({
  section,
  selected,
  getValue,
  onClick,
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
}: Props) {
  const pattern = section.pattern || section.name
  const title = getValue('title') || getValue('headline') || getValue('badge') || section.title || section.name
  const body = getValue('body') || getValue('subtitle') || getValue('period')
  const image = getValue('image') || getValue('portrait')
  const items = parseItems(getValue('items'))

  return (
    <article
      className={`pb-section${selected ? ' pb-section--selected' : ''}`}
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="pb-section__toolbar">
        <GripVertical size={14} className="pb-section__grip" />
        <span className="pb-section__type">
          {section.name} · {TYPE_LABEL[pattern] || pattern}
        </span>
        <span className="pb-section__name">{section.title || section.name}</span>
        <span className="pb-section__edit">Cliquer pour modifier →</span>
      </div>
      <div className={`pb-preview pb-preview--${pattern}`}>
        {pattern === 'map_band' ? (
          <>
            <h2 className="pb-preview__heading">{title || 'Territoires'}</h2>
            <p className="pb-preview__sub">{body || 'Carte interactive des 24 gouvernorats'}</p>
            <div className="pb-preview__cards">
              <div className="pb-preview__card">
                <strong>Carte</strong>
                <span>{getValue('legendTitle') || 'Gouvernorats ciblés'}</span>
              </div>
            </div>
          </>
        ) : pattern === 'projects_band' ? (
          <>
            <h2 className="pb-preview__heading">{title}</h2>
            {getValue('subtitle') ? <p className="pb-preview__sub">{getValue('subtitle')}</p> : null}
            {body ? <p className="pb-preview__sub">{body}</p> : null}
            <div className="pb-preview__cards">
              {(parseItems(getValue('logos')).length
                ? parseItems(getValue('logos'))
                : [
                    { name: 'IRADA4YOUTH' },
                    { name: 'SWAFY' },
                    { name: "Jeun'ESS" },
                    { name: 'Fe3il.a' },
                    { name: "Maghroum'IN" },
                    { name: 'GO4Youth' },
                  ]
              ).map((item: { name?: string; slug?: string }, index: number) => (
                <div key={item.slug || item.name || index} className="pb-preview__card">
                  <strong>{item.name || item.slug || '•'}</strong>
                </div>
              ))}
            </div>
          </>
        ) : pattern === 'cta_banner' ? (
          <>
            {getValue('title') ? <h2 className="pb-preview__heading">{getValue('title')}</h2> : null}
            {getValue('body') ? <p className="pb-preview__sub">{getValue('body')}</p> : null}
            <div className="pb-preview__cards">
              <div className="pb-preview__card">
                <strong>{getValue('home') || getValue('cta') || getValue('contact') || 'Bouton'}</strong>
                <span>{section.title || 'Action'}</span>
              </div>
            </div>
          </>
        ) : pattern === 'hero' || pattern === 'stories_band' ? (
          <div
            className="pb-preview--hero-img"
            style={image ? { backgroundImage: `url(${image.startsWith('http') || image.startsWith('/') ? image : image})` } : undefined}
          >
            <div className="pb-preview--hero__shade" />
            <div className="pb-preview--hero__body">
              <p className="pb-preview__kicker">{getValue('badge') || getValue('eyebrow')}</p>
              <h2>{title}</h2>
              {body ? <p>{body}</p> : null}
            </div>
          </div>
        ) : pattern === 'form_band' ? (
          <>
            <h2 className="pb-preview__heading">{section.title || 'Formulaire'}</h2>
            <div className="pb-preview__cards">
              <div className="pb-preview__card">
                <strong>Champs</strong>
                <span>Libellés, listes et boutons</span>
              </div>
            </div>
          </>
        ) : pattern === 'cards_grid' ? (
          <>
            <h2 className="pb-preview__heading">{section.title || title || 'Cartes'}</h2>
            <div className="pb-preview__cards">
              {(items.length
                ? items
                : ['opportunitiesTitle', 'newsTitle', 'eventsTitle']
                    .map((key) => ({ title: getValue(key).replace(/\n/g, ' ') || '' }))
                    .filter((item) => item.title)
              ).map((item: { value?: string; label?: string; title?: string; type?: string }, index: number) => (
                <div key={index} className="pb-preview__card">
                  <strong>{item.title || item.value || '•'}</strong>
                  <span>{item.type || item.label || ''}</span>
                </div>
              ))}
            </div>
          </>
        ) : pattern === 'stats' || items.length > 0 ? (
          <>
            {title ? <h2 className="pb-preview__heading">{title}</h2> : null}
            <div className="pb-preview__cards">
              {(items.length ? items : [{ value: '—', label: 'indicateur' }]).map(
                (item: { value?: string; label?: string; title?: string; to?: string }, index: number) => (
                <div key={index} className="pb-preview__card">
                  <strong>{item.label || item.value || item.title || '•'}</strong>
                  <span>{item.to || item.title || item.label || ''}</span>
                </div>
              ),
              )}
            </div>
          </>
        ) : (
          <>
            {image ? <img src={image} alt="" className="pb-preview__fill-img" /> : null}
            {title ? <h2 className="pb-preview__heading">{title}</h2> : null}
            {body ? <p className="pb-preview__sub">{body}</p> : null}
          </>
        )}
      </div>
    </article>
  )
}
