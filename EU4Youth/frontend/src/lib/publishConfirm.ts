import type { Locale } from '../api/client'

export function confirmPublish(
  title: string,
  missingLocales?: Partial<Record<Locale, boolean>>,
) {
  const missing = Boolean(missingLocales?.en || missingLocales?.ar)
  if (missing) {
    return confirm(
      `« ${title} » sera visible sur le site public.\n\nCertaines traductions EN / AR sont incomplètes. Publier quand même ?`,
    )
  }
  return confirm(`« ${title} » sera visible sur le site public. Continuer ?`)
}

export function confirmSubmitReview(title: string) {
  return confirm(`Envoyer « ${title} » à validation ? Un éditeur devra l’approuver avant publication.`)
}
