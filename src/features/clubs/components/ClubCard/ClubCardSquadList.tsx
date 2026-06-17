import { type FC } from 'react'
import type { Squad } from '#/features/clubs/types/club-types'
import { Accordion } from '@/components/ui/accordion'
import ClubCardSquadItem from './ClubCardSquadItem'

interface ClubCardSquadListProps {
  squads: Squad[]
}

const ClubCardSquadList: FC<ClubCardSquadListProps> = ({ squads }) => {
  return (
    <Accordion type="multiple" className="flex flex-col gap-1.5">
      {squads.map((squad, index) => (
        <ClubCardSquadItem key={squad.id} squad={squad} rank={index + 1} />
      ))}
    </Accordion>
  )
}

export default ClubCardSquadList
