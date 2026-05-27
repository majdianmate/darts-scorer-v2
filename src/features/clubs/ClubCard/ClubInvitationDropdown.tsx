import React, { type FC } from 'react'
import { ClubRole, ROLE_RANK, type ClubMember } from '../../../../types/club-types'
import { useUser } from '../../../../hooks/use-user'
import type { Club } from '../../../../types/club-types'
import type { DropdownOption } from '#/components/Dropdown/DropdownComponent'
import { MoreVerticalIcon, User, UserMinus } from 'lucide-react'
import DropdownComponent from '#/components/Dropdown/DropdownComponent'
import { useClub } from '../../../../hooks/use-club'

interface ClubInvitationDropdownProps {
  member: ClubMember
  onCancel ?: () => void
}

const ClubInvitationDropdown: FC<ClubInvitationDropdownProps> = ({ member, onCancel }) => {
    const {user} = useUser();
    const { club } = useClub(member.clubId);
    if (!club) return null;
    const currentUserRole = club.members.find(m => m.userId === user?.id)?.role;
    const isInvitationFromCurrentUser = member.invitedBy?.id === user?.id;

    const dropdownOptions: DropdownOption[] = [
        {
            label: 'View member',
            icon: User,
            onClick: () => {
                console.log('View member')
            },
        },
        {
            label: 'Cancel invitation',
            icon: UserMinus,
            onClick: () => onCancel?.(),
            variant: 'destructive',
            render: !!currentUserRole && ROLE_RANK[currentUserRole] > ROLE_RANK[ClubRole.MEMBER] || isInvitationFromCurrentUser,
        },
    ]
  return (
    <DropdownComponent options={dropdownOptions} trigger={<MoreVerticalIcon className="size-4" />} />
  )
}

export default ClubInvitationDropdown