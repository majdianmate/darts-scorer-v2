import { type FC } from 'react'
import type { Squad } from '../../../../types/club-types'
import type { DropdownOption } from '#/components/Dropdown/DropdownComponent'
import { MoreVertical, Pencil, Trash } from 'lucide-react'
import DropdownComponent from '#/components/Dropdown/DropdownComponent'
import { dropdownTriggerButtonClass } from '#/components/Dropdown/dropdown-trigger-styles'

interface SquadDropdownProps {
  squad: Squad
  onEdit: () => void
  onDelete: () => void
}

const SquadDropdown: FC<SquadDropdownProps> = ({ squad, onEdit, onDelete }) => {
  const dropdownOptions: DropdownOption[] = [
    {
      label: 'Edit',
      onClick: onEdit,
      icon: Pencil
    },
    {
      label: 'Delete',
      onClick: onDelete,
      variant: 'destructive',
      icon: Trash
    }
  ]

  return (
    <DropdownComponent
      options={dropdownOptions}
      trigger={
        <button
          type="button"
          className={dropdownTriggerButtonClass}
          aria-label={`Actions for squad ${squad.name}`}
        >
          <MoreVertical className="size-4" />
        </button>
      }
    />
  )
}

export default SquadDropdown
