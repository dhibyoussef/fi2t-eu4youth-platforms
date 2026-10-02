import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

const ROUTE_PERMISSION: Record<string, string> = {
  '/pages': 'content',
  '/live-editor': 'content',
  '/traductions': 'translations',
  '/projets': 'catalogues',
  '/actualites': 'catalogues',
  '/publications': 'catalogues',
  '/agenda': 'catalogues',
  '/initiatives': 'catalogues',
  '/stories': 'catalogues',
  '/videos': 'catalogues',
  '/opportunites': 'catalogues',
  '/glossaire': 'catalogues',
  '/inbox': 'inbox',
  '/activite': 'content',
  '/validation': 'catalogues',
  '/equipe': 'users',
  '/roles': 'roles',
  '/legal': 'settings',
}

export default function PermissionGuard() {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const perm = ROUTE_PERMISSION[pathname]
  if (!perm) return <Outlet />
  if (user?.role === 'administrateur') return <Outlet />
  if (user?.permissions?.[perm]) return <Outlet />
  return <Navigate to="/dashboard" replace state={{ denied: pathname }} />
}
