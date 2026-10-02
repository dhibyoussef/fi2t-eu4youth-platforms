const MAX_ENTRIES = 500

const CATALOG_COLLECTIONS = new Set([
  'news',
  'publications',
  'events',
  'opportunities',
  'stories',
  'videos',
  'initiatives',
])

export function ensureAuditLog(store) {
  if (!Array.isArray(store.auditLog)) store.auditLog = []
}

export function appendAudit(store, user, entry) {
  ensureAuditLog(store)
  const id = Math.max(0, ...store.auditLog.map((row) => Number(row.id) || 0)) + 1
  const row = {
    id,
    at: new Date().toISOString(),
    userId: user?.id ?? null,
    userName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'Système',
    userRole: user?.role || '',
    action: entry.action,
    target: entry.target,
    targetId: entry.targetId != null ? String(entry.targetId) : '',
    label: entry.label || '',
    meta: entry.meta || null,
  }
  store.auditLog.unshift(row)
  if (store.auditLog.length > MAX_ENTRIES) store.auditLog.length = MAX_ENTRIES
  return row
}

export function listAuditLog(store, { limit = 80, offset = 0, action = '' } = {}) {
  ensureAuditLog(store)
  let rows = store.auditLog
  if (action) {
    rows = rows.filter(
      (row) =>
        row.action === action ||
        row.target === action ||
        row.action.startsWith(`${action}.`),
    )
  }
  return {
    total: rows.length,
    items: rows.slice(offset, offset + limit),
  }
}

export function gateCatalogStatus(user, status) {
  const value = String(status || 'draft')
  const allowed = ['draft', 'pending_review', 'published']
  if (user?.role === 'administrateur' || user?.role === 'editeur') {
    return allowed.includes(value) ? value : 'draft'
  }
  if (value === 'published') return 'pending_review'
  return value === 'pending_review' ? 'pending_review' : 'draft'
}

export function canApproveCatalog(user) {
  return user?.role === 'administrateur' || user?.role === 'editeur'
}

export function catalogCollection(name) {
  return CATALOG_COLLECTIONS.has(name) ? name : null
}

const CATALOG_LABELS = {
  news: 'Actualités',
  publications: 'Publications',
  events: 'Agenda',
  opportunities: 'Opportunités',
  stories: 'Youth Stories',
  videos: 'Vidéothèque',
  initiatives: 'Initiatives',
}

export function catalogLabel(name) {
  return CATALOG_LABELS[name] || name
}

export function listPendingReview(store, user) {
  const items = []
  for (const name of CATALOG_COLLECTIONS) {
    for (const item of store[name] || []) {
      if (item.status !== 'pending_review') continue
      if (user?.role === 'contributeur' && item.projectSlug && item.projectSlug !== user.projectSlug) continue
      items.push({
        collection: name,
        collectionLabel: catalogLabel(name),
        id: item.id ?? item.slug,
        label: String(item.title?.fr || item.name || item.firstName || item.slug || catalogLabel(name)),
        project: item.project || '',
        submittedAt: item.publishedAt || item.startsAt || item.opensAt || '',
      })
    }
  }
  return items.sort((a, b) => String(b.submittedAt).localeCompare(String(a.submittedAt)))
}

export function countPendingReview(store) {
  let total = 0
  for (const name of CATALOG_COLLECTIONS) {
    total += (store[name] || []).filter((item) => item.status === 'pending_review').length
  }
  return total
}

export function actionLabel(action) {
  const map = {
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
  return map[action] || action
}
