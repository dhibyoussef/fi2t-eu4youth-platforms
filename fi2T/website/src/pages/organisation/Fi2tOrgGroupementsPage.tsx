import OrgPageShell from './OrgPageShell'
import { GroupementsSection } from './sections'

export default function Fi2tOrgGroupementsPage() {
  return (
    <OrgPageShell
      titleKey="groupements.page_title"
      titleFallback="Les Groupements Professionnels"
    >
      <GroupementsSection hideTitle />
    </OrgPageShell>
  )
}
