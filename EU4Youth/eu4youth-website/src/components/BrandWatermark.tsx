import { assetUrl } from '../lib/assetUrl'

export function BrandWatermark() {
  return (
    <img
      className="brand-filigrane"
      src={assetUrl('/img/eu4youth-filigrane.png')}
      alt=""
      aria-hidden="true"
    />
  )
}
