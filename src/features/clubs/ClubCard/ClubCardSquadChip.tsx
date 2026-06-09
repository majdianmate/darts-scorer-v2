import type { FC } from 'react'
import { useUser } from '../../../../hooks/use-user'
import { useClub } from '../../../../hooks/use-club'
import {
  setDialog,
  setTargetClubId,
  setTargetSquadId,
} from '../../../../store/store'
import type { Squad } from '../../../../types/club-types'
import { getSquadIcon } from '../SquadSystem/squad-icon-registry'
import SquadDropdown from '../SquadSystem/SquadDropdown'

type ClubCardSquadChipProps = {
  squad: Squad
}

const ClubCardSquadChip: FC<ClubCardSquadChipProps> = ({ squad }) => {
  const { user } = useUser()
  const { deleteSquad } = useClub(squad.clubId, user?.id)
  const memberCount = squad.members?.length ?? squad.memberIds?.length ?? 0
  const squadColor = squad.color || 'currentColor'
  const SquadIcon = getSquadIcon(squad.icon)

  const handleEdit = () => {
    setTargetClubId(squad.clubId)
    setTargetSquadId(squad.id)
    setDialog('editSquad', true)
  }

  const handleDelete = () => {
    deleteSquad({ squadId: squad.id })
  }

  return (
    <div className="inline-flex max-w-full items-center gap-0.5 rounded-full border border-border/60 bg-background py-1 pl-1 pr-1">
      <span
        className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted/50"
        style={{ color: squadColor }}
      >
        <SquadIcon className="size-3" />
      </span>
      <span className="truncate text-xs font-medium text-foreground">
        {squad.name}
      </span>
      <span className="shrink-0 pr-0.5 text-[10px] tabular-nums text-muted-foreground">
        {memberCount}
      </span>
      <SquadDropdown squad={squad} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  )
}

export default ClubCardSquadChip
