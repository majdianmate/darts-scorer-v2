import { type FC } from 'react'
import type { Club } from '../../../../types/club-types'
import type { DropdownOption } from '#/components/Dropdown/DropdownComponent'
import { MoreVertical, Pencil, Trash2, UserCog } from 'lucide-react'
import DropdownComponent from '#/components/Dropdown/DropdownComponent'
import { useUser } from '../../../../hooks/use-user'

interface ClubDropdownProps {
  club: Club
  onEdit?: () => void
  onRemove?: () => void
  onManageMembers?: () => void
}

const ClubDropdown: FC<ClubDropdownProps> = ({
  club,
  onRemove,
  onManageMembers,
  onEdit,
}) => {
  const { user } = useUser()
  const isOwner = user?.id === club.createdBy.id

  const dropdownOptions: DropdownOption[] = [
    {
      label: 'Edit club',
      icon: Pencil,
      onClick: () => onEdit?.(),
      render: isOwner,
    },
    {
      label: 'Manage members',
      icon: UserCog,
      onClick: () => onManageMembers?.(),
    },
    {
      label: 'Remove club',
      icon: Trash2,
      onClick: () => onRemove?.(),
      variant: 'destructive',
      render: isOwner,
    },
  ]

  return (
    <DropdownComponent
      options={dropdownOptions}
      trigger={
        <button
          type="button"
          className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={`Club actions for ${club.name}`}
        >
          <MoreVertical className="size-4" />
        </button>
      }
    />
  )
}

export default ClubDropdown
