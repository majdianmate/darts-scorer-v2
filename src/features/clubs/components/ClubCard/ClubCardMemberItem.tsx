import { type FC } from 'react'
import type { ClubMember } from '#/features/clubs/types/club-types'
import Avatar from '#/components/Avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '#/lib/utils.ts'
import {
  Clock,
  Crown,
  Shield,
  UserRound,
  UserRoundPlus,
} from 'lucide-react'
import { ClubRole } from '#/features/clubs/types/club-types'
import { roleAvatarRings, roleLabels, roleRowStyles, roleStyles } from './roles'
import ClubMemberDropdown from './ClubMemberDropdown'
import ClubInvitationDropdown from './ClubInvitationDropdown'
import { useAuthentication } from '#/features/authentication/hooks/use-authentication'
import { useClub, useClubs } from '#/features/clubs/hooks/use-club'

interface ClubCardMemberItemProps {
  member: ClubMember
  rank?: number
  isInvitation?: boolean
}

const roleIcons = {
  [ClubRole.LEADER]: Crown,
  [ClubRole.CAPTAIN]: Shield,
  [ClubRole.MEMBER]: UserRound,
  [ClubRole.GUEST]: UserRoundPlus,
} as const

const ClubCardMemberItem: FC<ClubCardMemberItemProps> = ({
  member,
  rank,
  isInvitation,
}) => {
  const RoleIcon = roleIcons[member.role]

  const { user } = useAuthentication()
  const { leaveClub } = useClubs(user)
  const { promoteClubMember, demoteClubMember, cancelInvite, removeMember } = useClub(  
    member.clubId,
    user?.id ?? '',
  )

  const isSelf = user?.id === member.userId
  const isGuest = member.role === ClubRole.GUEST && !member.userId

  return (
    <div
      className={cn(
        'group flex items-center gap-3 rounded-lg border px-2.5 py-2 transition-all duration-200',
        roleRowStyles[member.role],
      )}
    >
      <div className="flex w-5 shrink-0 items-center justify-center">
        {rank !== undefined && (
          <span className="text-[10px] font-semibold tabular-nums text-muted-foreground/70">
            {rank}
          </span>
        )}
      </div>

      <Avatar
        name={member.user.displayName || member.user.name}
        image={member.user.image}
        size="md"
        className={cn('ring-2 ring-background', roleAvatarRings[member.role])}
      />

      <div className="min-w-0 flex-1 overflow-hidden leading-none">
        <div className="truncate text-sm font-medium text-foreground">
          {member.user.displayName || member.user.name}
        </div>
        <div className="truncate text-xs text-muted-foreground">
          {isGuest && member.joinCode
            ? `Join code · ${member.joinCode}`
            : `@${member.user.username}`}
        </div>
      </div>
      {isSelf && (
        <Badge
          variant="outline"
          className={cn('shrink-0 gap-1 px-2', roleStyles['SELF'])}
        >
          <UserRound className="size-3" />
          {roleLabels['SELF']}
        </Badge>
      )}
      {isInvitation ? (
        <Badge
          variant="outline"
          className={cn('shrink-0 gap-1 px-2', roleStyles['PENDING'])}
        >
          <Clock className="size-3" />
          {roleLabels['PENDING']}
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className={cn('shrink-0 gap-1 px-2', roleStyles[member.role])}
        >
          <RoleIcon className="size-3" />
          {roleLabels[member.role]}
        </Badge>
      )}
      {isInvitation ? (
        <ClubInvitationDropdown
          member={member}
          onCancel={() =>
            cancelInvite({ membershipId: member.id })
          }
        />
      ) : (
        <ClubMemberDropdown
          member={member}
          onRemove={() => removeMember(member.id)}
          onLeave={() => leaveClub({ clubId: member.clubId })}
          onPromoteToCaptain={() =>
            promoteClubMember({
              membershipId: member.id,
            })
          }
          onDemoteToMember={() =>
            demoteClubMember({
              membershipId: member.id,
            })
          }
        />
      )}
    </div>
  )
}

export default ClubCardMemberItem
