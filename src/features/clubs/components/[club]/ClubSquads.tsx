import { type FC } from 'react'
import type { Squad } from '#/features/clubs/types/club-types'
import ClubCardSquadList from '../ClubCard/ClubCardSquadList'

interface ClubSquadsProps {
  squads: Squad[]
  clubId: string
}

const ClubSquads: FC<ClubSquadsProps> = ({ squads, clubId }) => {
  return <ClubCardSquadList squads={squads} />
}

export default ClubSquads
