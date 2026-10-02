import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import {
  Bell,
  BookOpen,
  CalendarDays,
  Clapperboard,
  CheckCircle,
  Clock,
  ExternalLink,
  FileText,
  Globe,
  Inbox,
  Languages,
  LayoutDashboard,
  LayoutTemplate,
  MapPinned,
  Newspaper,
  PenLine,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { api, ROLE_LABEL } from '../../api/client'
import { buildLiveEditorUrl } from '../../api/editSession'
import { useAuth } from '../../auth/AuthProvider'

type NavItem = {
  to: string
  icon: typeof LayoutDashboard
  label: string
  end?: boolean
  perm?: string
}

const groups: { label: string; items: NavItem[] }[] = [
  {
    label: 'Principal',
    items: [{ to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord', end: true }],
  },
  {
    label: 'Site web',
    items: [
      { to: '/pages', icon: LayoutTemplate, label: 'Contenu du site', perm: 'content' },
      { to: '/live-editor', icon: PenLine, label: 'Aperçu live', perm: 'content' },
      { to: '/traductions', icon: Languages, label: 'Traductions', perm: 'translations' },
    ],
  },
  {
    label: 'Programme',
    items: [
      { to: '/projets', icon: Sparkles, label: 'Six projets', perm: 'catalogues' },
      { to: '/actualites', icon: Newspaper, label: 'Actualités', perm: 'catalogues' },
      { to: '/publications', icon: FileText, label: 'Publications', perm: 'catalogues' },
      { to: '/agenda', icon: CalendarDays, label: 'Agenda', perm: 'catalogues' },
      { to: '/initiatives', icon: MapPinned, label: 'Initiatives / carte', perm: 'catalogues' },
      { to: '/stories', icon: Globe, label: 'Youth Stories', perm: 'catalogues' },
      { to: '/videos', icon: Clapperboard, label: 'Vidéothèque', perm: 'catalogues' },
      { to: '/opportunites', icon: FileText, label: 'Opportunités', perm: 'catalogues' },
      { to: '/glossaire', icon: BookOpen, label: 'Glossaire', perm: 'catalogues' },
    ],
  },
  {
    label: 'Administration',
    items: [
      { to: '/inbox', icon: Inbox, label: 'Formulaires', perm: 'inbox' },
      { to: '/validation', icon: CheckCircle, label: 'À valider', perm: 'catalogues' },
      { to: '/activite', icon: Clock, label: 'Historique', perm: 'content' },
      { to: '/equipe', icon: Users, label: 'Utilisateurs', perm: 'users' },
      { to: '/roles', icon: ShieldCheck, label: 'Rôles et permissions', perm: 'roles' },
      { to: '/pages?page=global&tab=cookies', icon: Scale, label: 'Cookies & légal', perm: 'settings' },
    ],
  },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const { token, user, logout } = useAuth()
  const [unread, setUnread] = useState(0)
  const [pendingReview, setPendingReview] = useState(0)
  const allowed = (perm?: string) => {
    if (!perm) return true
    if (user?.role === 'administrateur') return true
    return Boolean(user?.permissions?.[perm])
  }
  useEffect(() => {
    if (!token) return
    api
      .get('/admin/overview')
      .then((res) => {
        setUnread(Number(res.data.unread || 0))
        setPendingReview(Number(res.data.pendingReview || 0))
      })
      .catch(() => undefined)
  }, [token])

  const openSite = async () => {
    try {
      window.open(await buildLiveEditorUrl('/'), '_blank', 'noopener,noreferrer')
    } catch {
      toast.error('Impossible d ouvrir le site live. API 8040 et site 3030 doivent tourner.')
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <strong>EU4YOUTH</strong>
        <span>CMS Live Editor</span>
      </div>
      <nav>
        {groups.map((group) => (
          <div key={group.label}>
            <p className="nav-label">{group.label}</p>
            {group.items.filter((item) => allowed(item.perm)).map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={Boolean(item.end)}
                  className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                  {item.to === '/inbox' && unread > 0 && <span className="nav-badge">{unread}</span>}
                  {item.to === '/validation' && pendingReview > 0 && <span className="nav-badge">{pendingReview}</span>}
                </NavLink>
              )
            })}
          </div>
        ))}
        <button type="button" className="nav-item nav-item--external" onClick={() => void openSite()}>
          <ExternalLink size={16} />
          <span>Modifier le site</span>
        </button>
      </nav>
      {user ? (
        <footer className="sidebar__foot">
          <div className="sidebar__user">
            <span className="avatar sidebar__avatar" aria-hidden="true">
              {`${user.firstName?.[0] || 'A'}${user.lastName?.[0] || ''}`.toUpperCase()}
            </span>
            <div className="sidebar__user-meta">
              <strong>{user.firstName} {user.lastName}</strong>
              <span>{ROLE_LABEL[user.role] ?? user.role}</span>
            </div>
          </div>
          <button
            type="button"
            className="sidebar__logout"
            onClick={() => {
              logout()
              navigate('/login')
            }}
          >
            <LogOut size={14} />
            Déconnexion
          </button>
        </footer>
      ) : null}
    </aside>
  )
}

export function TopBar({ title, subtitle }: { title: string; subtitle: string }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [unread, setUnread] = useState(0)
  useEffect(() => {
    api
      .get('/admin/overview')
      .then((res) => setUnread(Number(res.data.unread || 0)))
      .catch(() => undefined)
  }, [])
  const initials = `${user?.firstName?.[0] || 'A'}${user?.lastName?.[0] || ''}`.toUpperCase()
  return (
    <header className="topbar">
      <div className="topbar__meta">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="topbar__user">
        <button type="button" className="icon-btn" onClick={() => navigate('/inbox')} aria-label="Formulaires reçus">
          <Bell size={16} />
          {unread > 0 ? <i>{unread}</i> : null}
        </button>
        <div className="topbar__profile">
          <span className="avatar" aria-hidden="true">{initials}</span>
          <span className="topbar__name">{user?.firstName} {user?.lastName}</span>
        </div>
        <button
          type="button"
          className="btn btn--ghost btn--sm topbar__logout"
          onClick={() => {
            logout()
            navigate('/login')
          }}
        >
          Déconnexion
        </button>
      </div>
    </header>
  )
}
