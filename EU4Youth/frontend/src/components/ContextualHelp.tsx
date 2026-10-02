import { HelpCircle, X } from 'lucide-react'
import { useState } from 'react'

const TIPS: Record<string, { title: string; lines: string[] }> = {
  dashboard: {
    title: 'Tableau de bord',
    lines: [
      'Les tâches « À traiter » indiquent ce qui demande votre attention.',
      'Utilisez les raccourcis pour accéder directement aux catalogues et à l’aperçu live.',
      'Relancez le guide de démarrage depuis le bouton sur la page d’accueil du CMS.',
    ],
  },
  'live-editor': {
    title: 'Aperçu live',
    lines: [
      'Cliquez sur un crayon orange pour modifier un texte ou une image.',
      'Bouton panneau : masquer la liste des pages. Bouton CMS : masquer le menu latéral.',
      'Enregistrez avec le bouton orange ou Ctrl+S avant de quitter.',
    ],
  },
  catalog: {
    title: 'Catalogues',
    lines: [
      'Rédigez en français — EN / AR se complètent à l’enregistrement si l’option est cochée.',
      'Brouillon → soumettre à validation → un éditeur publie.',
      'Dupliquer une fiche pour repartir d’un modèle existant.',
    ],
  },
  validation: {
    title: 'À valider',
    lines: [
      'Liste de toutes les fiches soumises par les contributeurs.',
      'Cliquez « Valider et publier » pour les rendre visibles sur le site.',
      'Consultez l’historique pour voir qui a modifié quoi.',
    ],
  },
  inbox: {
    title: 'Formulaires',
    lines: [
      'Messages contact et inscriptions newsletter reçus du site public.',
      'Marquez comme lu ou archivez après traitement.',
    ],
  },
  menu: {
    title: 'Menu du site',
    lines: [
      'Glissez la poignée ⋮⋮ pour réorganiser les liens.',
      'Choisissez la page dans la liste — pas besoin de taper l’URL.',
    ],
  },
}

export default function ContextualHelp({ screen }: { screen: keyof typeof TIPS | string }) {
  const [open, setOpen] = useState(false)
  const tips = TIPS[screen]
  if (!tips) return null

  return (
    <div className="context-help">
      <button
        type="button"
        className="context-help__btn"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        title="Aide pour cette page"
      >
        <HelpCircle size={16} />
        Aide
      </button>
      {open ? (
        <div className="context-help__panel" role="dialog" aria-label={tips.title}>
          <div className="context-help__head">
            <strong>{tips.title}</strong>
            <button type="button" className="context-help__close" aria-label="Fermer" onClick={() => setOpen(false)}>
              <X size={14} />
            </button>
          </div>
          <ul>
            {tips.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
