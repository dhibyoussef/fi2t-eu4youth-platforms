import type { Locale } from '../../../api/client'

export default function CookieBannerPreview({
  locale,
  message,
  accept,
  reject,
  more,
}: {
  locale: Locale
  message: string
  accept: string
  reject: string
  more: string
}) {
  const rtl = locale === 'ar'

  return (
    <div className="cookie-preview" aria-hidden="true">
      <p className="cookie-preview__label">Aperçu du bandeau</p>
      <div className="cookie-preview__frame">
        <div className="cookie-preview__chrome">
          <span />
          <span />
          <span />
        </div>
        <div className="cookie-preview__content">
          <div className="cookie-preview__skeleton" />
          <div className="cookie-preview__skeleton cookie-preview__skeleton--short" />
        </div>
        <div className="cookie-preview__bar" dir={rtl ? 'rtl' : 'ltr'}>
          <p>{message || 'Votre message cookies apparaîtra ici…'}</p>
          <div className="cookie-preview__buttons">
            <span className="cookie-preview__more">{more || 'En savoir plus'}</span>
            <span className="cookie-preview__reject">{reject || 'Refuser'}</span>
            <span className="cookie-preview__accept">{accept || 'Accepter'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
