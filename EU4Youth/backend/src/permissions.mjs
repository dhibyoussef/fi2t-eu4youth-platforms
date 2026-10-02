export const PERMISSIONS = [
  'content',
  'catalogues',
  'translations',
  'inbox',
  'users',
  'roles',
  'settings',
]

export function can(user, store, permission) {
  if (!user) return false
  if (user.role === 'administrateur') return true
  if (permission === 'users' || permission === 'roles') return false
  return Boolean(store.rolePermissions?.[user.role]?.[permission])
}

export function requirePerm(permission) {
  return (req, res, next) => {
    if (!can(req.user, req.store, permission)) {
      res.status(403).json({ message: 'Acces refuse pour ce role.' })
      return
    }
    next()
  }
}

export function requireAnyPerm(...permissions) {
  return (req, res, next) => {
    if (!permissions.some((permission) => can(req.user, req.store, permission))) {
      res.status(403).json({ message: 'Acces refuse pour ce role.' })
      return
    }
    next()
  }
}

export function requireAbility(...abilities) {
  return (req, res, next) => {
    if (!abilities.includes(req.ability || 'cms-admin')) {
      res.status(403).json({ message: 'Cette action demande une session administrateur.' })
      return
    }
    next()
  }
}

export function scopedByProject(list, user, field = 'projectSlug') {
  if (!Array.isArray(list)) return []
  if (user?.role !== 'contributeur') return list
  return list.filter((item) => item[field] === user.projectSlug)
}

export function assertProjectScope(user, body, res) {
  if (user.role !== 'contributeur') return true
  const slug = body?.projectSlug || body?.project_slug
  if (slug && slug !== user.projectSlug) {
    res.status(403).json({ message: 'Contributeur: uniquement votre projet.' })
    return false
  }
  if (body && !slug) body.projectSlug = user.projectSlug
  return true
}
