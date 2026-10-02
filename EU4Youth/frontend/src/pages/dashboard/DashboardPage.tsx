import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  CalendarDays,
  CheckCircle,
  Clapperboard,
  Clock,
  ExternalLink,
  FileText,
  Globe,
  Inbox,
  Languages,
  LayoutTemplate,
  MapPinned,
  Newspaper,
  PenLine,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { api, ROLE_LABEL } from '../../api/client'
import { buildLiveEditorUrl, PUBLIC_SITE } from '../../api/editSession'
import { useAuth } from '../../auth/AuthProvider'
import OnboardingGuide, { reopenOnboarding } from '../../components/OnboardingGuide'
import ContextualHelp from '../../components/ContextualHelp'

type Overview = {
  pages: number
  published: number
  drafts: number
  pageDrafts?: number
  catalogDrafts?: number
  projects: number
  initiatives: number
  stories: number
  videos: number
  opportunities: number
  news: number
  publications: number
  events: number
  unread: number
  pendingReview?: number
  publicSiteUrl?: string
}

const shortcuts = [
  { to: '/pages', icon: LayoutTemplate, title: 'Contenu du site', desc: 'Structure de chaque page, composants, textes FR / EN / AR et aperçu live.' },
  { to: '/live-editor', icon: PenLine, title: 'Aperçu live', desc: 'Le vrai site public dans un cadre, clic pour modifier FR / EN / AR.' },
  { to: '/projets', icon: Sparkles, title: 'Six projets', desc: 'Jeun ESS, Fe3il.a, Maghroum IN, SWAFY, GO4Youth, IRADA4YOUTH.' },
  { to: '/actualites', icon: Newspaper, title: 'Actualités', desc: 'Fiches publiées sur /actualites.' },
  { to: '/publications', icon: FileText, title: 'Publications', desc: 'Rapports et ressources de /publications.' },
  { to: '/agenda', icon: CalendarDays, title: 'Agenda', desc: 'Événements datés de /agenda.' },
  { to: '/initiatives', icon: MapPinned, title: 'Carte / initiatives', desc: 'Fiches territoire, gouvernorat et GPS.' },
  { to: '/stories', icon: Globe, title: 'Youth Stories', desc: 'Portraits à valider (consentement + photo).' },
  { to: '/videos', icon: Clapperboard, title: 'Vidéothèque', desc: 'Vidéos YouTube par projet.' },
  { to: '/inbox', icon: Inbox, title: 'Formulaires', desc: 'Contact et newsletter reçus.' },
  { to: '/validation', icon: CheckCircle, title: 'À valider', desc: 'Fiches soumises par les contributeurs — publier en un clic.' },
  { to: '/activite', icon: Clock, title: 'Historique', desc: 'Qui a modifié quoi dans le CMS.' },
  { to: '/traductions', icon: Languages, title: 'Traductions', desc: 'Libellés interface FR / EN / AR.' },
  { to: '/roles', icon: ShieldCheck, title: 'Rôles', desc: 'Permissions : contenu, catalogues, utilisateurs.' },
  { to: '/pages?page=global&tab=cookies', icon: LayoutTemplate, title: 'Cookies & légal', desc: 'Bandeau cookies et paramètres communs.' },
  { to: '/equipe', icon: Users, title: 'Équipe', desc: 'Comptes du back-office.' },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState<Overview | null>(null)
  const [apiOk, setApiOk] = useState<boolean | null>(null)
  useEffect(() => {
    api.get('/admin/overview').then((res) => setData(res.data)).catch(() => undefined)
    api
      .get('/health')
      .then(() => setApiOk(true))
      .catch(() => setApiOk(false))
  }, [])

  const openLive = async () => {
    try {
      window.open(await buildLiveEditorUrl('/'), '_blank', 'noopener,noreferrer')
    } catch {
      toast.error('Lancez l’API (8040) et le site public (3030).')
    }
  }

  const tasks = [
    ...(data?.unread
      ? [{ label: `${data.unread} message${data.unread > 1 ? 's' : ''} non lu${data.unread > 1 ? 's' : ''}`, to: '/inbox', tone: 'alert' as const }]
      : []),
    ...((data?.pendingReview ?? 0) > 0
      ? [{
          label: `${data!.pendingReview} fiche${data!.pendingReview! > 1 ? 's' : ''} à valider`,
          to: '/validation',
          tone: 'alert' as const,
        }]
      : []),
    ...((data?.catalogDrafts ?? 0) > 0
      ? [{ label: `${data!.catalogDrafts} fiche${data!.catalogDrafts! > 1 ? 's' : ''} catalogue en brouillon`, to: '/actualites', tone: 'warn' as const }]
      : []),
    ...((data?.pageDrafts ?? data?.drafts ?? 0) > 0
      ? [{ label: `${data!.pageDrafts ?? data!.drafts} page${(data!.pageDrafts ?? data!.drafts)! > 1 ? 's' : ''} en brouillon`, to: '/pages', tone: 'warn' as const }]
      : []),
  ]

  return (
    <div className="dashboard-studio">
      <OnboardingGuide />

      <div className="dashboard-help-row">
        <ContextualHelp screen="dashboard" />
      </div>

      <section className="hero hero--photo dashboard-hero">
        <img src={`${PUBLIC_SITE}/img/home-hero-v2.webp`} alt="" />
        <div className="hero__veil" />
        <div className="hero__copy">
          <p className="login__pill">EU4Youth Tunisie · CMS Live Editor</p>
          <h2>Bonjour{user?.firstName ? ` ${user.firstName}` : ''}</h2>
          <p>
            {user ? ROLE_LABEL[user.role] : 'Équipe'} — modifiez le site sans coder : textes, images,
            actualités et paramètres communs en FR / EN / AR.
            {apiOk === false
              ? ' API locale hors service — vérifiez le backend et le site public.'
              : apiOk
                ? ' Tout est connecté.'
                : ''}
          </p>
          <div className="hero__actions">
            <button type="button" className="btn btn--orange" onClick={() => void openLive()}>
              Éditer le site live <ExternalLink size={14} />
            </button>
            <Link className="btn btn--ghost btn--on-photo" to="/live-editor">
              <PenLine size={14} /> Aperçu dans le CMS
            </Link>
            <Link className="btn btn--ghost btn--on-photo" to="/pages">
              <LayoutTemplate size={14} /> Contenu du site
            </Link>
            <button type="button" className="btn btn--ghost btn--on-photo" onClick={reopenOnboarding}>
              Guide de démarrage
            </button>
          </div>
        </div>
      </section>

      {tasks.length > 0 ? (
        <section className="dashboard-tasks">
          <h3>À traiter</h3>
          <ul>
            {tasks.map((task) => (
              <li key={task.to + task.label}>
                <Link to={task.to} className={`dashboard-task dashboard-task--${task.tone}`}>
                  {task.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="dashboard-stats">
        <div className="dashboard-stat">
          <b>{data?.projects ?? '—'}</b>
          <span>Projets</span>
        </div>
        <div className="dashboard-stat">
          <b>{data?.news ?? '—'}</b>
          <span>Actualités</span>
        </div>
        <div className="dashboard-stat">
          <b>{data?.publications ?? '—'}</b>
          <span>Publications</span>
        </div>
        <div className="dashboard-stat">
          <b>{data?.events ?? '—'}</b>
          <span>Agenda</span>
        </div>
        <div className="dashboard-stat">
          <b>{data?.initiatives ?? '—'}</b>
          <span>Initiatives</span>
        </div>
        <div className="dashboard-stat">
          <b>{data?.stories ?? '—'}</b>
          <span>Stories</span>
        </div>
        <div className="dashboard-stat dashboard-stat--alert">
          <b>{data?.unread ?? '—'}</b>
          <span>Messages non lus</span>
        </div>
      </div>

      <div className="dashboard-section-head">
        <h3>Raccourcis</h3>
        <p>Tout le contenu du programme EU4Youth, depuis un seul back-office.</p>
      </div>

      <div className="cards dashboard-cards">
        {shortcuts.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.to} className="card dashboard-card" to={item.to}>
              <span className="card__icon"><Icon size={18} /></span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
