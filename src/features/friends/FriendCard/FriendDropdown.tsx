import type { DropdownOption } from '#/components/Dropdown/DropdownComponent'
import { MoreVerticalIcon, User, UserMinus } from 'lucide-react'
import React, { type FC } from 'react'
import type { Friendship } from '../../../../types/friend-types'
import DropdownComponent from '#/components/Dropdown/DropdownComponent'

interface FriendDropdownProps {
  friendship: Friendship
  onRemove?: () => void
}

const FriendDropdown: FC<FriendDropdownProps> = ({ friendship, onRemove }) => {
  const dropdownOptions: DropdownOption[] = [
    {
      label: 'View profile',
      icon: User,
      onClick: () => {
        console.log('View profile')
      },
      variant: 'default',
    },
    {
      label: 'Remove friend',
      icon: UserMinus,
      onClick: () => onRemove?.(),
      variant: 'destructive',
    },
  ]

  return <DropdownComponent options={dropdownOptions} trigger={<MoreVerticalIcon className="size-4" />} />
}

export default FriendDropdown
