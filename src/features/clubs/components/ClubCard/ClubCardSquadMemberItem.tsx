import { type FC } from 'react'
import type { SquadMember } from '#/features/clubs/types/club-types'
import { ClubRole } from '#/features/clubs/types/club-types'
import { cn } from '#/lib/utils.ts'
import { useAuthentication } from '#/features/authentication/hooks/use-authentication'
import { useClub } from '#/features/clubs/hooks/use-club'
import SquadMemberDropdown from './SquadMemberDropdown'
import Avatar from '#/components/Avatar'

interface ClubCardSquadMemberItemProps {
  squadMember: SquadMember
  squadColor: string
}

const ClubCardSquadMemberItem: FC<ClubCardSquadMemberItemProps> = ({
  squadMember,
  squadColor,
}) => {
  const { user } = useAuthentication()
  const { removeSquadMember } = useClub(squadMember.clubId, user?.id)
  const member = squadMember.member
  const isGuest = member.role === ClubRole.GUEST && !member.userId

  const handleRemove = () => {
    removeSquadMember(squadMember.id)
  }

  return (
    <div
      className={cn(
        'group flex items-center gap-2.5 rounded-md border border-transparent bg-background/60 px-2 py-1.5 transition-colors hover:bg-background',
      )}
      style={{
        borderColor: `${squadColor}25`,
      }}
    >
      <div
        className="shrink-0 rounded-full ring-2 ring-background"
        style={{ boxShadow: `0 0 0 2px ${squadColor}40` }}
      >
        <Avatar name={member.user.displayName || member.user.name} image={member.user.image} size="sm" />
      </div>

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

      <SquadMemberDropdown
        squadMember={squadMember}
        onRemove={handleRemove}
      />
    </div>
  )
}

export default ClubCardSquadMemberItem
