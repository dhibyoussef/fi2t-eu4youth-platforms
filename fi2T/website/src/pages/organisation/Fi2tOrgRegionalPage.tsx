import OrgPageShell from './OrgPageShell'
import { RegionalSection } from './sections'

export default function Fi2tOrgRegionalPage() {
  return (
    <OrgPageShell
      titleKey="regional.page_title"
      titleFallback="Les Bureaux Régionaux"
      leadKey="regional.lead"
      leadFallback="Présents sur tout le territoire, les bureaux régionaux sont dirigés par 3 membres : 1 Président, 1 Vice-Président et 1 Secrétaire Général."
    >
      <RegionalSection showAll hideTitle />
    </OrgPageShell>
  )
}
