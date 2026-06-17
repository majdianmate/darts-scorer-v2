import { type FC } from 'react'
import type { Squad } from '#/features/clubs/types/club-types'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { getSquadIcon } from '#/components/IconPicker'
import { useAuthentication } from '#/features/authentication/hooks/use-authentication'
import { useClub } from '#/features/clubs/hooks/use-club'
import {
  useStore } from '../../../../../store/store'
import SquadDropdown from './SquadDropdown'
import ClubCardSquadMemberItem from './ClubCardSquadMemberItem'
import {
  clubCardSquadContentClass,
  clubCardSquadItemClass,
  clubCardSquadTriggerClass,
} from './club-card-section-styles'
import AvatarGroup from '#/components/AvatarGroup'

interface ClubCardSquadItemProps {
  squad: Squad
  rank?: number
}

const memberCountLabel = (count: number) => {
  if (count === 0) return 'No players in this squad'
  if (count === 1) return '1 player'
  return `${count} players`
}

const ClubCardSquadItem: FC<ClubCardSquadItemProps> = ({ squad, rank }) => {
  const { user } = useAuthentication()
  const setTargetClubId = useStore((state) => state.setTargetClubId);
  const setTargetSquadId = useStore((state) => state.setTargetSquadId);
  const setDialogOpen = useStore((state) => state.setDialogOpen);
  const { deleteSquad } = useClub(squad.clubId, user?.id)
  const SquadIcon = getSquadIcon(squad.icon)
  const memberCount = squad.members.length

  const handleEdit = () => {
    setTargetClubId(squad.clubId)
    setTargetSquadId(squad.id)
    setDialogOpen('editSquad', true)
  }

  const handleDelete = () => {
    deleteSquad({ squadId: squad.id })
  }

  return (
    <AccordionItem
      value={squad.id}
      className={clubCardSquadItemClass}
      style={{
        borderColor: `${squad.color}40`,
      }}
    >
      <AccordionTrigger
        className={clubCardSquadTriggerClass}
        style={
          {
            '--squad-accent': squad.color,
          } as React.CSSProperties
        }
      >
        <span
          className="pointer-events-none absolute top-2 bottom-2 left-0 w-0.5 rounded-full"
          style={{ backgroundColor: squad.color }}
          aria-hidden
        />

        <div className="flex min-w-0 flex-1 items-center gap-2.5 pl-1">
          {rank !== undefined && (
            <div className="flex w-5 shrink-0 items-center justify-center">
              <span className="text-[10px] font-semibold tabular-nums text-muted-foreground/70">
                {rank}
              </span>
            </div>
          )}

          <div
            className="flex size-8 shrink-0 items-center justify-center rounded-lg border"
            style={{
              backgroundColor: `${squad.color}18`,
              borderColor: `${squad.color}50`,
              color: squad.color,
            }}
          >
            <SquadIcon className="size-3.5" />
          </div>

          <div className="min-w-0 flex-1 overflow-hidden leading-none">
            <div className="truncate text-sm font-medium text-foreground">
              {squad.name}
            </div>
            <div className="truncate text-xs text-muted-foreground">
              {memberCountLabel(memberCount)}
            </div>
          </div>

          {memberCount > 0 && (
            <AvatarGroup
              users={squad.members.map(
                (squadMember) => squadMember.member.user,
              )}
              max={3}
              className="hidden shrink-0 sm:flex"
            />
          )}
        </div>

        <div
          className="shrink-0"
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <SquadDropdown
            squad={squad}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </AccordionTrigger>

      <AccordionContent
        className={clubCardSquadContentClass}
        style={{ borderColor: `${squad.color}30` }}
      >
        {memberCount === 0 ? (
          <p className="px-1 py-2 text-center text-xs text-muted-foreground">
            No players in this squad yet.
          </p>
        ) : (
          <div className="flex flex-col gap-1">
            {squad.members.map((squadMember) => (
              <ClubCardSquadMemberItem
                key={squadMember.id}
                squadMember={squadMember}
                squadColor={squad.color}
              />
            ))}
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  )
}

export default ClubCardSquadItem
