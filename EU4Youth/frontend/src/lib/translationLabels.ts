/** Human-readable labels for translation keys — hide technical ids from editors. */
const EXACT: Record<string, string> = {
  'nav.programme': 'Libellé « Programme » (UI)',
  'nav.projets': 'Libellé « Projets » (UI)',
  'nav.actualites': 'Libellé « Actualités » (UI)',
  'search.placeholder': 'Texte du champ recherche',
  'search.submit': 'Bouton lancer la recherche',
  'search.noResults': 'Message aucun résultat',
  'header.searchAria': 'Description accessibilité recherche',
  'header.menuAria': 'Description accessibilité menu',
  'cookie.accept': 'Bouton accepter cookies (UI)',
  'cookie.reject': 'Bouton refuser cookies (UI)',
  'lang.fr': 'Nom de la langue française',
  'lang.en': 'Nom de la langue anglaise',
  'lang.ar': 'Nom de la langue arabe',
}

export function translationLabel(key: string): string {
  if (EXACT[key]) return EXACT[key]
  const parts = key.split('.')
  const last = parts[parts.length - 1] ?? key
  const group = parts[0] ?? ''
  const groupLabel: Record<string, string> = {
    nav: 'Navigation',
    search: 'Recherche',
    header: 'En-tête',
    cookie: 'Cookies',
    legal: 'Légal',
    lang: 'Langues',
    footer: 'Pied de page',
  }
  const prefix = groupLabel[group] ? `${groupLabel[group]} · ` : ''
  const human = last
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
  return `${prefix}${human}`.trim()
}
