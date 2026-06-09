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
      icon: Pencil,
    },
    {
      label: 'Delete',
      onClick: onDelete,
      variant: 'destructive',
      icon: Trash,
    },
  ]

  return (
    <DropdownComponent
      options={dropdownOptions}
      trigger={
        <button
          type="button"
          className="flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={`Actions for squad ${squad.name}`}
        >
          <MoreVertical className="size-3" />
        </button>
      }
    />
  )
}

export default SquadDropdown
