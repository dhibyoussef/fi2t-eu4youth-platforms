import { Link } from 'react-router-dom'
import { ExternalLink, LayoutTemplate, Newspaper, PenLine, Settings, X } from 'lucide-react'
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'eu4y_cms_onboarding_v1'

const STEPS = [
  {
    icon: PenLine,
    title: '1 · Modifier le site en direct',
    body: 'Ouvrez l’Aperçu live, cliquez sur un texte ou une image (crayon orange), puis Enregistrer. Aucun code requis.',
    to: '/live-editor',
    cta: 'Ouvrir l’aperçu live',
  },
  {
    icon: Newspaper,
    title: '2 · Publier une actualité',
    body: 'Créez une fiche, rédigez en français, ajoutez une photo (Parcourir), choisissez Publié — EN / AR se complètent automatiquement.',
    to: '/actualites',
    cta: 'Gérer les actualités',
  },
  {
    icon: Settings,
    title: '3 · En-tête, menu & cookies',
    body: 'Paramètres du site : logos, pied de page, bandeau cookies et menu principal — communs à toutes les pages.',
    to: '/pages?page=global&tab=header',
    cta: 'Paramètres du site',
  },
  {
    icon: LayoutTemplate,
    title: '4 · Contenu des pages',
    body: 'Page d’accueil, À propos, Contact… : éditeur visuel avec aperçu intégré. Utilisez Enregistrer après vos changements.',
    to: '/pages?page=home',
    cta: 'Page d’accueil',
  },
] as const

export default function OnboardingGuide() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === '1') return
    setOpen(true)
  }, [])

  const close = (persist = true) => {
    if (persist) localStorage.setItem(STORAGE_KEY, '1')
    setOpen(false)
  }

  if (!open) return null

  const current = STEPS[step]
  const Icon = current.icon

  return (
    <div className="onboarding-backdrop" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
      <div className="onboarding-card">
        <button type="button" className="onboarding-card__close" aria-label="Fermer" onClick={() => close(true)}>
          <X size={18} />
        </button>
        <p className="onboarding-card__eyebrow">Guide de démarrage · {step + 1}/{STEPS.length}</p>
        <div className="onboarding-card__icon">
          <Icon size={22} />
        </div>
        <h2 id="onboarding-title">{current.title}</h2>
        <p className="onboarding-card__body">{current.body}</p>
        <div className="onboarding-card__dots" aria-hidden="true">
          {STEPS.map((_, index) => (
            <span key={index} className={index === step ? 'active' : ''} />
          ))}
        </div>
        <div className="onboarding-card__actions">
          {step > 0 ? (
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setStep((s) => s - 1)}>
              Précédent
            </button>
          ) : (
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => close(false)}>
              Plus tard
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button type="button" className="btn btn--primary btn--sm" onClick={() => setStep((s) => s + 1)}>
              Suivant
            </button>
          ) : (
            <Link to={current.to} className="btn btn--primary btn--sm" onClick={() => close(true)}>
              {current.cta} <ExternalLink size={13} />
            </Link>
          )}
          {step < STEPS.length - 1 ? (
            <Link to={current.to} className="btn btn--ghost btn--sm" onClick={() => close(true)}>
              {current.cta}
            </Link>
          ) : null}
        </div>
        <button type="button" className="onboarding-card__skip" onClick={() => close(true)}>
          Ne plus afficher ce guide
        </button>
      </div>
    </div>
  )
}

export function reopenOnboarding() {
  localStorage.removeItem(STORAGE_KEY)
  window.location.reload()
}
