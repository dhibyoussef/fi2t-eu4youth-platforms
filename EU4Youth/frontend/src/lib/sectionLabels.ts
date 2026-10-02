/** French labels for live-editor section ids (data-cms-section). */
export const SECTION_LABELS: Record<string, string> = {
  hero: 'Bannière principale',
  kpis: 'Chiffres clés EU4Youth',
  streams: 'Flux contenus (actus, opps…)',
  newsletter: 'Newsletter',
  partners: 'Partenaires',
  projects: 'Six projets',
  stories: 'Youth Stories',
  resources: 'Ressources & publications',
  pourquoi: 'Pourquoi EU4Youth',
  vision: 'Vision',
  objectifs: 'Objectifs',
  comment: 'Comment ça marche',
  territoires: 'Territoires',
  impact: 'Impact',
  avenir: 'Perspectives',
  header: 'En-tête',
  footer: 'Pied de page',
  legal: 'Mentions légales',
  contact: 'Formulaire contact',
  intro: 'Introduction',
  themes: 'Thématiques',
  explore: 'Explorer',
  facts: 'Faits clés',
  cta: 'Appel à action',
  filters: 'Filtres',
  grid: 'Grille',
  presentation: 'Présentation',
  fiche: 'Fiche détaillée',
}

export function sectionDisplayLabel(id: string, fallback?: string): string {
  return SECTION_LABELS[id] || fallback || id.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
