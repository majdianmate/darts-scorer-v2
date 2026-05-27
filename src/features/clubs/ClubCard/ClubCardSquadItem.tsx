import { type FC } from 'react'
import type { Squad } from '../../../../types/club-types'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '#/lib/utils.ts'
import { getSquadIcon } from '#/components/IconPicker'
import AvatarGroup from '#/components/AvatarGroup'
import { useUser } from '../../../../hooks/use-user'
import { useClub } from '../../../../hooks/use-club'
import {
  setDialog,
  setTargetClubId,
  setTargetSquadId,
} from '../../../../store/store'
import SquadDropdown from './SquadDropdown'
import ClubCardSquadMemberItem from './ClubCardSquadMemberItem'

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
  const { user } = useUser()
  const { deleteSquad } = useClub(squad.clubId, user?.id)
  const SquadIcon = getSquadIcon(squad.icon)
  const memberCount = squad.members.length

  const handleEdit = () => {
    setTargetClubId(squad.clubId)
    setTargetSquadId(squad.id)
    setDialog('editSquad', true)
  }

  const handleDelete = () => {
    deleteSquad({ squadId: squad.id })
  }

  return (
    <AccordionItem
      value={squad.id}
      className={cn(
        'overflow-hidden rounded-lg border border-b-0 transition-all duration-200',
      )}
      style={{
        borderColor: `${squad.color}35`,
        backgroundColor: `${squad.color}0c`,
      }}
    >
      <AccordionTrigger
        className={cn(
          'group items-center justify-start gap-2 px-2.5 py-2 hover:no-underline',
          '[&_[data-slot=accordion-trigger-icon]]:mt-0',
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          {rank !== undefined && (
            <div className="flex w-5 shrink-0 items-center justify-center">
              <span className="text-[10px] font-semibold tabular-nums text-muted-foreground/70">
                {rank}
              </span>
            </div>
          )}

          <div
            className="flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-sm"
            style={{
              backgroundColor: `${squad.color}22`,
              borderColor: `${squad.color}45`,
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
        className="border-t px-2 pb-2 pt-1.5 [&_p]:mb-0"
        style={{ borderColor: `${squad.color}25` }}
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
