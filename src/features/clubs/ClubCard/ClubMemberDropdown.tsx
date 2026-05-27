import React, { type FC } from 'react'
import { ClubRole, ROLE_RANK, type ClubMember } from '../../../../types/club-types'
import { useUser } from '../../../../hooks/use-user'
import type { Club } from '../../../../types/club-types'
import type { DropdownOption } from '#/components/Dropdown/DropdownComponent'
import { MoreVerticalIcon, User, UserMinus, UserPlus } from 'lucide-react'
import DropdownComponent from '#/components/Dropdown/DropdownComponent'
import { useClub } from '../../../../hooks/use-club'

interface ClubMemberDropdownProps {
  member: ClubMember
  onRemove?: () => void
  onLeave?: () => void
  onPromoteToCaptain?: () => void
  onDemoteToMember?: () => void
}

const ClubMemberDropdown: FC<ClubMemberDropdownProps> = ({ member, onRemove, onLeave, onPromoteToCaptain, onDemoteToMember }) => {
    const {user} = useUser();
    const { club } = useClub(member.clubId);
    if (!club) return null;
    const currentUserRole = club.members.find(m => m.userId === user?.id)?.role;
    const isMemberSelf = member.userId === user?.id;
    const dropdownOptions: DropdownOption[] = [
        {
            label: 'View member',
            icon: User,
            onClick: () => {
                console.log('View member')
            },
        },
        {
            label: 'Promote',
            icon: UserPlus,
            onClick: () => onPromoteToCaptain?.(),
            variant: 'default',
            render: currentUserRole === ClubRole.LEADER && member.role === ClubRole.MEMBER,
        },
        {
            label: 'Demote',
            icon: UserMinus,
            onClick: () => onDemoteToMember?.(),
            variant: 'default',
            render: currentUserRole === ClubRole.LEADER && member.role === ClubRole.CAPTAIN,
        },
        {
            label: 'Leave',
            icon: UserMinus,
            onClick: () => onLeave?.(),
            variant: 'destructive',
            render: isMemberSelf && currentUserRole !== ClubRole.LEADER,
        },
        {
            label: 'Remove member',
            icon: UserMinus,
            onClick: () => onRemove?.(),
            variant: 'destructive',
            render: !!currentUserRole && ROLE_RANK[currentUserRole] > ROLE_RANK[ClubRole.MEMBER] && !isMemberSelf,
        },
    ]
  return (
    <DropdownComponent options={dropdownOptions} trigger={<MoreVerticalIcon className="size-4" />} />
  )
}

export default ClubMemberDropdown