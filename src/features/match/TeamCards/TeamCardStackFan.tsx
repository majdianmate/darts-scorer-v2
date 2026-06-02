import type { FC } from 'react'
import type { MockTeamCardData } from '#/utils/mock'
import { StackFanCard } from './StackFanCard'

interface Props {
  team: MockTeamCardData
}

const TeamCardStackFan: FC<Props> = ({ team }) => (
  <StackFanCard team={team} showLegsInFooter />
)

export default TeamCardStackFan
