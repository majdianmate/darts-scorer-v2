import { useNavigate } from '@tanstack/react-router'
import { useMemo, type FC } from 'react'
import { Building2, Layers3, Plus, Swords, UserPlus, Users } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '#/components/ui/button'
import AvatarGroup from '#/components/AvatarGroup'
import { Card, CardContent, CardFooter, CardHeader } from '#/components/ui/card'
import { useClub } from '../../../../hooks/use-club'
import { setDialog, setTargetClubId } from '../../../../store/store'
import { ClubRole, type Club, type ClubMember } from '../../../../types/club-types'
import ClubCardPanel from './ClubCardPanel'
import ClubCardSquadChip from './ClubCardSquadChip'
import ClubDropdown from './ClubDropdown'
import { roleLabels, sortMembersByRole } from './roles'

interface ClubCardProps {
  club: Club
}

function countByRole(members: ClubMember[], role: ClubRole) {
  return members.filter((member) => member.role === role).length
}

function buildRoleSummary(members: ClubMember[]) {
  return [
    countByRole(members, ClubRole.LEADER) > 0
      ? `${countByRole(members, ClubRole.LEADER)} ${roleLabels[ClubRole.LEADER].toLowerCase()}`
      : null,
    countByRole(members, ClubRole.CAPTAIN) > 0
      ? `${countByRole(members, ClubRole.CAPTAIN)} ${roleLabels[ClubRole.CAPTAIN].toLowerCase()}${countByRole(members, ClubRole.CAPTAIN) > 1 ? 's' : ''}`
      : null,
    countByRole(members, ClubRole.MEMBER) > 0
      ? `${countByRole(members, ClubRole.MEMBER)} ${roleLabels[ClubRole.MEMBER].toLowerCase()}${countByRole(members, ClubRole.MEMBER) > 1 ? 's' : ''}`
      : null,
    countByRole(members, ClubRole.GUEST) > 0
      ? `${countByRole(members, ClubRole.GUEST)} ${roleLabels[ClubRole.GUEST].toLowerCase()}${countByRole(members, ClubRole.GUEST) > 1 ? 's' : ''}`
      : null,
  ]
    .filter(Boolean)
    .join(' · ')
}

const ClubCard: FC<ClubCardProps> = ({ club }) => {
  const navigate = useNavigate()
  const { deleteClub } = useClub(club.id)
  const squads = club.squads ?? []

  const sortedMembers = useMemo(
    () => sortMembersByRole(club.members),
    [club.members],
  )
  const sortedInvitations = useMemo(
    () => sortMembersByRole(club.invitations),
    [club.invitations],
  )
  const roleSummary = useMemo(
    () => buildRoleSummary(club.members),
    [club.members],
  )

  const visibleSquads = squads.slice(0, 6)
  const hiddenSquadCount = squads.length - visibleSquads.length

  const onView = () => {
    navigate({ to: '/clubs/$club', params: { club: club.id } })
  }

  const onStartMatch = () => {
    toast.info('Club match setup is coming soon.')
  }

  const onManageMembers = () => {
    setTargetClubId(club.id)
    setDialog('memberManager', true)
  }

  const onEdit = () => {
    setTargetClubId(club.id)
    setDialog('editClub', true)
  }

  const onCreateSquad = () => {
    setTargetClubId(club.id)
    setDialog('createSquad', true)
  }

  return (
    <Card className="gap-0 py-0 transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-border/60 px-4 py-4">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold tracking-tight text-foreground">
            {club.name}
          </h3>
          {club.description ? (
            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
              {club.description}
            </p>
          ) : null}
        </div>
        <ClubDropdown
          club={club}
          onView={onView}
          onRemove={() => deleteClub()}
          onManageMembers={onManageMembers}
          onEdit={onEdit}
          onCreateSquad={onCreateSquad}
        />
      </CardHeader>

      <CardContent className="space-y-3 px-4 py-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <ClubCardPanel
            label="Members"
            count={club.members.length}
            icon={<Users className="size-3.5" />}
          >
            {club.members.length > 0 ? (
              <div className="space-y-2">
                <AvatarGroup
                  users={sortedMembers.map((member) => member.user)}
                  max={5}
                />
                {roleSummary ? (
                  <p className="text-[11px] leading-snug text-muted-foreground">
                    {roleSummary}
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Empty</p>
            )}
          </ClubCardPanel>

          <ClubCardPanel
            label="Invitations"
            count={club.invitations.length}
            icon={<UserPlus className="size-3.5" />}
          >
            {club.invitations.length > 0 ? (
              <AvatarGroup
                users={sortedInvitations.map((invitation) => invitation.user)}
                max={5}
              />
            ) : (
              <p className="text-xs text-muted-foreground">None pending</p>
            )}
          </ClubCardPanel>
        </div>

        <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Layers3 className="size-3.5" />
              <span className="text-xs font-medium">Squads</span>
              <span className="text-xs tabular-nums text-muted-foreground">
                {squads.length}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-xs"
              onClick={onCreateSquad}
            >
              <Plus className="size-3" />
              Add
            </Button>
          </div>

          {squads.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {visibleSquads.map((squad) => (
                <ClubCardSquadChip key={squad.id} squad={squad} />
              ))}
              {hiddenSquadCount > 0 ? (
                <span className="inline-flex items-center rounded-full border border-dashed border-border px-2.5 py-1 text-[11px] text-muted-foreground">
                  +{hiddenSquadCount}
                </span>
              ) : null}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No squads yet</p>
          )}
        </div>
      </CardContent>

      <CardFooter className="gap-2 border-t border-border/60 bg-muted/30 px-4 py-3">
        <Button type="button" variant="outline" className="flex-1" onClick={onView}>
          <Building2 className="size-4" />
          View
        </Button>
        <Button type="button" className="flex-1" onClick={onStartMatch}>
          <Swords className="size-4" />
          Start match
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ClubCard
