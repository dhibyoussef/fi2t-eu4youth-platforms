import OrgPageShell from './OrgPageShell'
import { HeadquartersSection } from './sections'

export default function Fi2tOrgSiegePage() {
  return (
    <OrgPageShell
      titleKey="headquarters.page_title"
      titleFallback="Le Siège"
      leadKey="headquarters.lead"
      leadFallback="L’équipe permanente du siège accompagne les adhérents, les groupements et les bureaux régionaux au quotidien."
    >
      <HeadquartersSection hideTitle />
    </OrgPageShell>
  )
}
