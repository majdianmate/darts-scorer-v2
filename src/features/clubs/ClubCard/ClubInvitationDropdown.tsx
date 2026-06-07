import { type FC } from 'react'
import {
  ClubRole,
  ROLE_RANK,
  type ClubMember,
} from '../../../../types/club-types'
import { useUser } from '../../../../hooks/use-user'
import type { DropdownOption } from '#/components/Dropdown/DropdownComponent'
import { MailX, MoreVertical } from 'lucide-react'
import DropdownComponent from '#/components/Dropdown/DropdownComponent'
import { dropdownTriggerButtonClass } from '#/components/Dropdown/dropdown-trigger-styles'
import { useClub } from '../../../../hooks/use-club'

interface ClubInvitationDropdownProps {
  member: ClubMember
  onCancel?: () => void
}

const ClubInvitationDropdown: FC<ClubInvitationDropdownProps> = ({
  member,
  onCancel,
}) => {
  const { user } = useUser()
  const { club } = useClub(member.clubId)

  if (!club) return null

  const currentUserRole = club.members.find((m) => m.userId === user?.id)?.role
  const isInvitationFromCurrentUser = member.invitedBy?.id === user?.id
  const canCancel =
    (!!currentUserRole &&
      ROLE_RANK[currentUserRole] > ROLE_RANK[ClubRole.MEMBER]) ||
    isInvitationFromCurrentUser

  const dropdownOptions: DropdownOption[] = [
    {
      label: 'Cancel invitation',
      icon: MailX,
      onClick: () => onCancel?.(),
      variant: 'destructive',
      render: canCancel,
    },
  ]

  return (
    <DropdownComponent
      options={dropdownOptions}
      trigger={
        <button
          type="button"
          className={dropdownTriggerButtonClass}
          aria-label={`Invitation actions for ${member.user.name}`}
        >
          <MoreVertical className="size-4" />
        </button>
      }
    />
  )
}

export default ClubInvitationDropdown
