import { type FC } from 'react'
import type { Squad } from '../../../../types/club-types'
import type { DropdownOption } from '#/components/Dropdown/DropdownComponent'
import { MoreVertical, Pencil, Trash } from 'lucide-react'
import DropdownComponent from '#/components/Dropdown/DropdownComponent'

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
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-muted hover:text-foreground data-[popup-open]:opacity-100"
          aria-label={`Actions for squad ${squad.name}`}
        >
          <MoreVertical className="size-4" />
        </button>
      }
    />
  )
}

export default SquadDropdown
