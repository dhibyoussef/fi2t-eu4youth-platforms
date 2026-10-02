import { useQuery } from '@tanstack/react-query'
import {
  Camera,
  Heading,
  Image as ImageIcon,
  Layers,
  LayoutTemplate,
  Mail,
  MapPinned,
  Sparkles,
  Star,
  Type,
} from 'lucide-react'
import { api } from '../../../api/client'

interface Pattern {
  id: string
  title: string
  description: string
  category: string
  block_count: number
}

const CATEGORY_LABELS: Record<string, string> = {
  texte: 'Texte',
  media: 'Médias',
  mise_en_page: 'Mise en page',
  sections: 'Sections EU4Youth',
  listes: 'Listes & cartes',
}

const PATTERN_ICONS: Record<string, typeof Type> = {
  heading: Heading,
  text: Type,
  image: ImageIcon,
  text_image: LayoutTemplate,
  hero: Star,
  stats: Layers,
  cards_grid: LayoutTemplate,
  cta_banner: Sparkles,
  projects_band: Sparkles,
  map_band: MapPinned,
  stories_band: Camera,
  newsletter: Mail,
  form_band: Mail,
  simple_list: Layers,
}

interface Props {
  active: boolean
  onPick: (patternId: string) => void
  loading?: boolean
  current?: { title: string; type: string }[]
}

export default function ComponentPalette({ active, onPick, loading, current = [] }: Props) {
  const { data: patterns = [] } = useQuery<Pattern[]>({
    queryKey: ['content-patterns'],
    queryFn: () => api.get('/admin/content/patterns').then((r) => r.data),
  })

  const grouped = patterns.reduce<Record<string, Pattern[]>>((acc, p) => {
    const cat = p.category || 'autre'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(p)
    return acc
  }, {})

  return (
    <aside className={`pb-palette${active ? ' pb-palette--active' : ''}`}>
      <div className="pb-palette__head">
        <h3>Composants</h3>
        {active ? (
          <p className="pb-palette__hint pb-palette__hint--active">Choisissez un composant à insérer ici</p>
        ) : (
          <p className="pb-palette__hint">
            Liste actuelle du portail public (même ordre que Structure). Cliquez sur{' '}
            <strong>+ Ajouter une zone</strong> pour afficher les modèles à insérer.
          </p>
        )}
      </div>
      <div className="pb-palette__scroll">
        {current.length > 0 ? (
          <div className="pb-palette__group">
            <h4>Sur cette page</h4>
            <div className="pb-palette__list">
              {current.map((zone) => (
                <div key={`${zone.title}-${zone.type}`} className="pb-palette__item pb-palette__item--current">
                  <span className="pb-palette__item-icon">
                    <LayoutTemplate size={18} />
                  </span>
                  <span className="pb-palette__item-text">
                    <strong>{zone.title}</strong>
                    <small>{zone.type}</small>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        {active
          ? Object.entries(grouped).map(([cat, items]) => (
              <div key={cat} className="pb-palette__group">
                <h4>{CATEGORY_LABELS[cat] ?? cat}</h4>
                <div className="pb-palette__list">
                  {items.map((p) => {
                    const Icon = PATTERN_ICONS[p.id] ?? Layers
                    return (
                      <button
                        key={p.id}
                        type="button"
                        className="pb-palette__item"
                        disabled={loading}
                        onClick={() => onPick(p.id)}
                      >
                        <span className="pb-palette__item-icon">
                          <Icon size={18} />
                        </span>
                        <span className="pb-palette__item-text">
                          <strong>{p.title}</strong>
                          <small>{p.description}</small>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))
          : null}
      </div>
    </aside>
  )
}
