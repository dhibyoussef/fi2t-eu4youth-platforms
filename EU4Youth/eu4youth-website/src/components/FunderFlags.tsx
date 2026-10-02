import './funder-flags.css'
import { useContent } from '../cms/ContentProvider'
import { useEditMode } from '../cms/EditModeProvider'
import { assetUrl } from '../lib/assetUrl'

type FunderFlagsProps = {
  className?: string
  variant?: 'header' | 'footer'
}

/**
 * Header: client blend art on white.
 * Footer: same client art, tightly cropped (no white plate) so flags
 * sit on the blue band without a white box — EU blue stays visible.
 */
const FLAG_SRC = {
  header: {
    eu: '/img/flag-eu-client-blend.webp',
    tn: '/img/flag-tn-client-blend.webp',
  },
  footer: {
    eu: '/img/flag-eu-footer.webp?v=4',
    tn: '/img/flag-tn-footer.webp?v=4',
  },
} as const

export default function FunderFlags({
  className = '',
  variant = 'header',
}: FunderFlagsProps) {
  const { t } = useContent()
  const { locale } = useEditMode()
  const src = FLAG_SRC[variant]
  /* Captions sit in a dir=ltr lockup; Arabic must use rtl on the caption
     or flex/inline order reads as “الاتحاد الأوروبي بتمويل من”. */
  const captionDir = locale === 'ar' ? 'rtl' : 'ltr'
  const euLine1 = t('funder.eu_line1', 'Financé par')
  const euLine2 = t('funder.eu_line2', "l'Union européenne")
  const tnLine1 = t('funder.tn_line1', 'République')
  const tnLine2 = t('funder.tn_line2', 'Tunisienne')

  return (
    <div
      className={`funder-flags funder-flags--${variant}${className ? ` ${className}` : ''}`}
      dir="ltr"
      aria-label={t(
        'funder.aria',
        "Financé par l'Union européenne — République Tunisienne",
      )}
    >
      <div className="funder-flags__item funder-flags__item--eu">
        <span className="funder-flags__flag-wrap">
          <img className="funder-flags__flag" src={assetUrl(src.eu)} alt="" />
        </span>
        <span className="funder-flags__caption" dir={captionDir} lang={locale}>
          {locale === 'ar' ? (
            `${euLine1} ${euLine2}`
          ) : (
            <>
              <span>{euLine1}</span> <span>{euLine2}</span>
            </>
          )}
        </span>
      </div>
      <div className="funder-flags__item funder-flags__item--tn">
        <span className="funder-flags__flag-wrap">
          <img className="funder-flags__flag" src={assetUrl(src.tn)} alt="" />
        </span>
        <span className="funder-flags__caption" dir={captionDir} lang={locale}>
          {locale === 'ar' ? (
            `${tnLine1} ${tnLine2}`
          ) : (
            <>
              <span>{tnLine1}</span> <span>{tnLine2}</span>
            </>
          )}
        </span>
      </div>
    </div>
  )
}
