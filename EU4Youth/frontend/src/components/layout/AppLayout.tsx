import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Sidebar, { TopBar } from './Sidebar'
const META: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': {
    title: 'Tableau de bord',
    subtitle: 'Pilotage editorial du programme EU4Youth Tunisie',
  },
  '/live-editor': {
    title: 'Aperçu live',
    subtitle: 'Le site public réel (localhost:3030) avec Live Editor',
  },
  '/pages': {
    title: 'Contenu du site',
    subtitle: 'Structure de chaque page, aperçu live, composants et textes FR / EN / AR',
  },
  '/website-content': {
    title: 'Contenu du site',
    subtitle: 'Structure de chaque page, aperçu live, composants et textes FR / EN / AR',
  },
  '/projets': {
    title: 'Six projets',
    subtitle: "Fiches Jeun'ESS, Fe3il.a, Maghroum'IN, SWAFY, GO4Youth, IRADA4YOUTH",
  },
  '/initiatives': {
    title: 'Initiatives',
    subtitle: 'CRUD mapping - gouvernorat, GPS, projet, secteur',
  },
  '/stories': {
    title: 'Youth Stories',
    subtitle: 'Portraits, initiatives et voix - consentement obligatoire',
  },
  '/videos': {
    title: 'Vidéothèque',
    subtitle: 'YouTube Data API — identifiants, thèmes, projets',
  },
  '/opportunites': {
    title: 'Opportunités',
    subtitle: 'Appels, formations, bourses et stages pour les 18-35 ans',
  },
  '/legal': {
    title: 'Legal et cookies',
    subtitle: 'Mentions, confidentialité, accessibilité et bandeau RGPD',
  },
  '/inbox': {
    title: 'Boîte de réception',
    subtitle: 'Formulaire de contact et inscriptions newsletter',
  },
  '/activite': {
    title: 'Historique',
    subtitle: 'Journal des modifications — catalogues, menu, contenu et comptes',
  },
  '/validation': {
    title: 'À valider',
    subtitle: 'Fiches catalogue soumises par les contributeurs',
  },
  '/traductions': {
    title: 'Traductions',
    subtitle: 'Menu, recherche et libellés FR / EN / AR du site public',
  },
  '/equipe': {
    title: 'Équipe et rôles',
    subtitle: 'Administrateur, éditeur, contributeur projet, communication',
  },
  '/roles': {
    title: 'Rôles et permissions',
    subtitle: 'Même modèle que FI2T, contenu EU4Youth',
  },
  '/actualites': {
    title: 'Actualités',
    subtitle: 'Communiqués et résultats de terrain — source de /actualites',
  },
  '/publications': {
    title: 'Publications',
    subtitle: 'Rapports, newsletters et ressources — source de /publications',
  },
  '/agenda': {
    title: 'Agenda',
    subtitle: 'Événements datés — source de /agenda',
  },
  '/glossaire': {
    title: 'Glossaire',
    subtitle: 'Catégories et définitions du glossaire public',
  },
}

/** Routes with their own in-page hero — no duplicate CMS top bar. */
const SELF_HEADER_PATHS = new Set([
  '/dashboard',
  '/projets',
  '/initiatives',
  '/stories',
  '/videos',
  '/opportunites',
  '/legal',
  '/inbox',
  '/activite',
  '/validation',
  '/traductions',
  '/equipe',
  '/roles',
  '/actualites',
  '/publications',
  '/agenda',
  '/glossaire',
])

export function AppLayout() {
  const location = useLocation()
  const meta = META[location.pathname] ?? { title: 'EU4Youth CMS', subtitle: 'Back-office' }
  const flush =
    location.pathname === '/live-editor' ||
    location.pathname === '/pages' ||
    location.pathname === '/website-content'
  const live = location.pathname === '/live-editor'
  const builder = flush && !live
  const hideTopBar = live || builder || SELF_HEADER_PATHS.has(location.pathname)

  useEffect(() => {
    document.title = live ? 'Aperçu live — EU4Youth CMS' : `${meta.title} — EU4Youth CMS`
  }, [live, meta.title])

  return (
    <div className={`shell${live ? ' shell--live' : ''}${builder ? ' shell--builder' : ''}`}>
      <Sidebar />
      <div className="main">
        {hideTopBar ? null : <TopBar title={meta.title} subtitle={meta.subtitle} />}
        <main className={flush ? 'page page--flush page--builder' : 'page'}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
