const ACTION_LABELS: Record<string, string> = {
  'content.save': 'Contenu enregistré',
  'catalog.create': 'Fiche créée',
  'catalog.update': 'Fiche modifiée',
  'catalog.delete': 'Fiche supprimée',
    'catalog.approve': 'Fiche publiée (validation)',
    'catalog.duplicate': 'Fiche dupliquée',
  'nav.create': 'Lien menu ajouté',
  'nav.update': 'Lien menu modifié',
  'nav.delete': 'Lien menu supprimé',
  'nav.reorder': 'Menu réorganisé',
  'user.create': 'Compte créé',
  'user.update': 'Compte modifié',
  'page.update': 'Page mise à jour',
}

const TARGET_LABELS: Record<string, string> = {
  news: 'Actualités',
  publications: 'Publications',
  events: 'Agenda',
  opportunities: 'Opportunités',
  stories: 'Youth Stories',
  videos: 'Vidéothèque',
  initiatives: 'Initiatives',
  'site-nav': 'Menu',
  users: 'Utilisateurs',
  pages: 'Pages',
}

export function auditActionLabel(action: string) {
  return ACTION_LABELS[action] || action
}

export function auditTargetLabel(target: string) {
  return TARGET_LABELS[target] || target
}

export const AUDIT_FILTER_OPTIONS = [
  { value: '', label: 'Toutes les actions' },
  { value: 'catalog', label: 'Catalogues' },
  { value: 'nav', label: 'Menu' },
  { value: 'content.save', label: 'Contenu' },
  { value: 'user', label: 'Utilisateurs' },
]
