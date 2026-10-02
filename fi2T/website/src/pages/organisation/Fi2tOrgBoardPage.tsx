import OrgPageShell from './OrgPageShell'
import { BoardSection, OutgoingSection } from './sections'

export default function Fi2tOrgBoardPage() {
  return (
    <OrgPageShell
      titleKey="board.page_title"
      titleFallback="Le Conseil d’administration"
      leadKey="board.lead"
      leadFallback="Le Conseil d’Administration de la Fi2T est composé de 5 membres élus lors de l’assemblée constitutive."
    >
      <BoardSection />
      <OutgoingSection />
    </OrgPageShell>
  )
}
