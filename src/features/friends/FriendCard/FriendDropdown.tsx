import type { DropdownOption } from '#/components/Dropdown/DropdownComponent'
import DropdownComponent from '#/components/Dropdown/DropdownComponent'
import { dropdownTriggerButtonClass } from '#/components/Dropdown/dropdown-trigger-styles'
import { MoreVertical, User as UserIcon, UserMinus } from 'lucide-react'
import { type FC } from 'react'
import type { Friendship } from '../../../../types/friend-types'
import type { User } from '../../../../types/user-types'

interface FriendDropdownProps {
  friendship: Friendship
  friend: User
  onRemove?: () => void
}

const FriendDropdown: FC<FriendDropdownProps> = ({ friend, onRemove }) => {
  const dropdownOptions: DropdownOption[] = [
    {
      label: 'View profile',
      icon: UserIcon,
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

  return (
    <DropdownComponent
      options={dropdownOptions}
      trigger={
        <button type="button" className={dropdownTriggerButtonClass} aria-label={`Actions for ${friend.name}`}>
          <MoreVertical />
        </button>
      }
    />
  )
}

export default FriendDropdown
