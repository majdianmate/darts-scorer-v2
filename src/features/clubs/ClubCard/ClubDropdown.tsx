import React, { type FC } from 'react'
import type { Club } from '../../../../types/club-types'
import type { DropdownOption } from '#/components/Dropdown/DropdownComponent'
import { MoreVerticalIcon, Pencil, UserMinus, Users } from 'lucide-react'
import DropdownComponent from '#/components/Dropdown/DropdownComponent'
import { useUser } from '../../../../hooks/use-user'

interface ClubDropdownProps {
  club: Club
  onView?: () => void
  onEdit?: () => void
  onRemove?: () => void
  onManageMembers?: () => void
  //onDetailedSquadEditor?: () => void
}

const ClubDropdown: FC<ClubDropdownProps> = ({ club, onRemove, onManageMembers, onEdit }) => {
  const { user } = useUser()
  const dropdownOptions: DropdownOption[] = [
    {
      label: 'View club',
      icon: Users,
      onClick: () => {
        console.log('View club')
      },
    },
    {
      label: 'Edit club',
      icon: Pencil,
      onClick: () => onEdit?.(),
      render: user?.id === club.createdBy.id,
    },
    {
      label: 'Manage members',
      icon: Users,
      onClick: () => onManageMembers?.(),
    },
    {
      label: 'Remove club',
      icon: UserMinus,
      onClick: () => onRemove?.(),
      variant: 'destructive',
      render: user?.id === club.createdBy.id,
    },
  ]
  return (
    <DropdownComponent
      options={dropdownOptions}
      trigger={<MoreVerticalIcon className="size-4" />}
    />
  )
}

export default ClubDropdown
