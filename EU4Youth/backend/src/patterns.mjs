/** EU4Youth component library — patterns inserted from the visual builder. */

export const PATTERNS = [
  {
    id: 'hero',
    title: 'Bannière héro',
    description: 'Photo, badge, titre, texte et boutons',
    category: 'sections',
    blocks: [
      { key: 'image', type: 'image', label: 'Image de fond' },
      { key: 'badge', type: 'text', label: 'Badge' },
      { key: 'title', type: 'text', label: 'Titre' },
      { key: 'body', type: 'text', label: 'Texte' },
      { key: 'cta', type: 'text', label: 'Bouton principal' },
    ],
  },
  {
    id: 'heading',
    title: 'Titre de section',
    description: 'Titre et sous-titre',
    category: 'texte',
    blocks: [
      { key: 'title', type: 'text', label: 'Titre' },
      { key: 'subtitle', type: 'text', label: 'Sous-titre' },
    ],
  },
  {
    id: 'text',
    title: 'Paragraphe',
    description: 'Bloc de texte éditorial',
    category: 'texte',
    blocks: [{ key: 'body', type: 'text', label: 'Texte' }],
  },
  {
    id: 'image',
    title: 'Image',
    description: 'Photographie ou illustration',
    category: 'media',
    blocks: [
      { key: 'image', type: 'image', label: 'Image' },
      { key: 'alt', type: 'text', label: 'Texte alternatif' },
    ],
  },
  {
    id: 'text_image',
    title: 'Texte + image',
    description: 'Colonne texte et visuel',
    category: 'mise_en_page',
    blocks: [
      { key: 'title', type: 'text', label: 'Titre' },
      { key: 'body', type: 'text', label: 'Texte' },
      { key: 'image', type: 'image', label: 'Image' },
    ],
  },
  {
    id: 'stats',
    title: 'Chiffres clés',
    description: 'Indicateurs du programme',
    category: 'listes',
    blocks: [
      { key: 'title', type: 'text', label: 'Titre' },
      { key: 'items', type: 'json', label: 'Indicateurs' },
    ],
  },
  {
    id: 'cards_grid',
    title: 'Grille de cartes',
    description: 'Cartes titre + texte',
    category: 'listes',
    blocks: [
      { key: 'title', type: 'text', label: 'Titre' },
      { key: 'items', type: 'json', label: 'Cartes' },
    ],
  },
  {
    id: 'cta_banner',
    title: 'Bandeau d’action',
    description: 'Appel à l’action coloré',
    category: 'sections',
    blocks: [
      { key: 'title', type: 'text', label: 'Titre' },
      { key: 'body', type: 'text', label: 'Texte' },
      { key: 'cta', type: 'text', label: 'Bouton' },
    ],
  },
  {
    id: 'projects_band',
    title: 'Six projets',
    description: 'Bandeau des six projets EU4Youth',
    category: 'sections',
    blocks: [
      { key: 'title', type: 'text', label: 'Titre' },
      { key: 'subtitle', type: 'text', label: 'Sous-titre' },
      { key: 'body', type: 'text', label: 'Texte' },
    ],
  },
  {
    id: 'map_band',
    title: 'Territoire / carte',
    description: 'Bandeau carte des 24 gouvernorats',
    category: 'sections',
    blocks: [
      { key: 'image', type: 'image', label: 'Visuel' },
      { key: 'title', type: 'text', label: 'Titre' },
      { key: 'subtitle', type: 'text', label: 'Sous-titre' },
      { key: 'body', type: 'text', label: 'Texte' },
      { key: 'cta', type: 'text', label: 'Bouton' },
    ],
  },
  {
    id: 'stories_band',
    title: 'Youth Stories',
    description: 'Portraits et voix des jeunes',
    category: 'sections',
    blocks: [
      { key: 'image', type: 'image', label: 'Image' },
      { key: 'eyebrow', type: 'text', label: 'Sur-titre' },
      { key: 'title', type: 'text', label: 'Titre' },
      { key: 'cta', type: 'text', label: 'Bouton' },
    ],
  },
  {
    id: 'newsletter',
    title: 'Newsletter',
    description: 'Inscription e-mail',
    category: 'sections',
    blocks: [
      { key: 'title', type: 'text', label: 'Titre' },
      { key: 'body', type: 'text', label: 'Texte' },
      { key: 'legal', type: 'text', label: 'Mention légale' },
    ],
  },
  {
    id: 'simple_list',
    title: 'Liste',
    description: 'Liste d’éléments',
    category: 'listes',
    blocks: [
      { key: 'title', type: 'text', label: 'Titre' },
      { key: 'items', type: 'json', label: 'Éléments' },
    ],
  },
  {
    id: 'form_band',
    title: 'Formulaire',
    description: 'Bandeau de formulaire (contact, inscription)',
    category: 'sections',
    blocks: [
      { key: 'title', type: 'text', label: 'Titre' },
      { key: 'body', type: 'text', label: 'Texte' },
    ],
  },
]

export function publicPatterns() {
  return PATTERNS.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    block_count: item.blocks.length,
  }))
}

export function patternById(id) {
  return PATTERNS.find((item) => item.id === id) || null
}
