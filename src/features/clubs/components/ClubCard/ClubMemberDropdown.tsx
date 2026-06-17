import { type FC } from 'react'
import {
  ClubRole,
  ROLE_RANK,
  type ClubMember,
} from '#/features/clubs/types/club-types'
import { useAuthentication } from '#/features/authentication/hooks/use-authentication'
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
import { dropdownTriggerButtonClass } from '#/components/Dropdown/dropdown-trigger-styles'
import { useClub } from '#/features/clubs/hooks/use-club'

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
  const { user } = useAuthentication()
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
          className={dropdownTriggerButtonClass}
          aria-label={`Actions for ${member.user.name}`}
        >
          <MoreVertical className="size-4" />
        </button>
      }
    />
  )
}

export default ClubMemberDropdown
