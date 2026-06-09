import type { FC } from 'react'
import AvatarGroup from '#/components/AvatarGroup'
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

type ClubSquadTileProps = {
  squad: Squad
}

const ClubSquadTile: FC<ClubSquadTileProps> = ({ squad }) => {
  const { user } = useUser()
  const { deleteSquad } = useClub(squad.clubId, user?.id)
  const SquadIcon = getSquadIcon(squad.icon)
  const memberCount = squad.members?.length ?? squad.memberIds?.length ?? 0
  const squadUsers = (squad.members ?? [])
    .map((entry) => entry.member?.user)
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))

  const handleEdit = () => {
    setTargetClubId(squad.clubId)
    setTargetSquadId(squad.id)
    setDialog('editSquad', true)
  }

  const handleDelete = () => {
    deleteSquad({ squadId: squad.id })
  }

  return (
    <div className="group flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/15 p-4 transition-shadow hover:shadow-sm">
      <div className="flex items-start gap-3">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background ring-1 ring-border/60"
          style={{ color: squad.color || 'currentColor' }}
        >
          <SquadIcon className="size-4" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground">{squad.name}</p>
          <p className="text-xs text-muted-foreground">
            {memberCount === 1 ? '1 player' : `${memberCount} players`}
          </p>
        </div>

        <SquadDropdown squad={squad} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {squadUsers.length > 0 ? (
        <AvatarGroup users={squadUsers} max={5} />
      ) : (
        <p className="text-xs text-muted-foreground">No players assigned</p>
      )}
    </div>
  )
}

export default ClubSquadTile
