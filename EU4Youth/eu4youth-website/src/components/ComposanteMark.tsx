import { assetUrl } from '../lib/assetUrl'
import { hasComposanteMark } from './composanteMarkSvg'

type Props = {
  theme: string
  name: string
  /** Real artwork — only Jeun'ESS has pre-existing composante logos. */
  markUrl?: string
}

/**
 * Jeun'ESS: dual-layer mark — grey base, colour fades in on hover / active.
 * Other projects: text name only.
 */
export default function ComposanteMark({ theme, name, markUrl }: Props) {
  if (hasComposanteMark(theme, name, markUrl)) {
    const src = assetUrl(markUrl!)
    return (
      <span className="pj-pick__mark">
        <img className="pj-pick__mark-img pj-pick__mark-img--grey" src={src} alt="" />
        <img
          className="pj-pick__mark-img pj-pick__mark-img--color"
          src={src}
          alt=""
          aria-hidden="true"
        />
      </span>
    )
  }

  return <span className="pj-pick__mark-text">{name}</span>
}
