import { Target } from 'lucide-react'
import ClubEmptyState from './ClubEmptyState'

const ClubMatchesSection = () => (
  <ClubEmptyState
    icon={Target}
    title="No matches yet"
    description="Club matches will show up here once match history is connected."
  />
)

export default ClubMatchesSection
