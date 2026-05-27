import { type FC } from 'react'
import {
  ClubRole,
  ROLE_RANK,
  type ClubMember,
} from '../../../../types/club-types'
import { useUser } from '../../../../hooks/use-user'
import type { DropdownOption } from '#/components/Dropdown/DropdownComponent'
import {
  ArrowDown,
  ArrowUp,
  Eye,
  LogOut,
  MoreVertical,
  UserX,
} from 'lucide-react'
import DropdownComponent from '#/components/Dropdown/DropdownComponent'
import { useClub } from '../../../../hooks/use-club'

interface ClubMemberDropdownProps {
  member: ClubMember
  onRemove?: () => void
  onLeave?: () => void
  onPromoteToCaptain?: () => void
  onDemoteToMember?: () => void
}

const ClubMemberDropdown: FC<ClubMemberDropdownProps> = ({
  member,
  onRemove,
  onLeave,
  onPromoteToCaptain,
  onDemoteToMember,
}) => {
  const { user } = useUser()
  const { club } = useClub(member.clubId)

  if (!club) return null

  const currentUserRole = club.members.find((m) => m.userId === user?.id)?.role
  const targetMemberRole = member.role
  const isMemberSelf = member.userId === user?.id

  const dropdownOptions: DropdownOption[] = [
    {
      label: 'View profile',
      icon: Eye,
      onClick: () => {},
      render: false,
    },
    {
      label: 'Promote to captain',
      icon: ArrowUp,
      onClick: () => onPromoteToCaptain?.(),
      render:
        currentUserRole === ClubRole.LEADER &&
        member.role === ClubRole.MEMBER,
    },
    {
      label: 'Demote to member',
      icon: ArrowDown,
      onClick: () => onDemoteToMember?.(),
      render:
        currentUserRole === ClubRole.LEADER &&
        member.role === ClubRole.CAPTAIN,
    },
    {
      label: 'Leave club',
      icon: LogOut,
      onClick: () => onLeave?.(),
      variant: 'destructive',
      render: isMemberSelf && currentUserRole !== ClubRole.LEADER,
    },
    {
      label: 'Remove member',
      icon: UserX,
      onClick: () => onRemove?.(),
      variant: 'destructive',
      render:
        !!currentUserRole &&
        ROLE_RANK[currentUserRole] > ROLE_RANK[targetMemberRole] &&
        !isMemberSelf,
    },
  ]

  return (
    <DropdownComponent
      options={dropdownOptions}
      trigger={
        <button
          type="button"
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-muted hover:text-foreground data-[popup-open]:opacity-100"
          aria-label={`Actions for ${member.user.name}`}
        >
          <MoreVertical className="size-4" />
        </button>
      }
    />
  )
}

export default ClubMemberDropdown
