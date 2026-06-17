import { type FC } from 'react'
import { cn } from '#/lib/utils'
import type { Club } from '#/features/clubs/types/club-types'
import type { DropdownOption } from '#/components/Dropdown/DropdownComponent'
import { MoreVertical, Pencil, Trash2, UserCog, Users } from 'lucide-react'
import DropdownComponent from '#/components/Dropdown/DropdownComponent'
import { dropdownTriggerButtonClass } from '#/components/Dropdown/dropdown-trigger-styles'
import { useAuthentication } from '#/features/authentication/hooks/use-authentication'

interface ClubDropdownProps {
  club: Club
  onEdit?: () => void
  onRemove?: () => void
  onManageMembers?: () => void
  onCreateSquad?: () => void
}

const ClubDropdown: FC<ClubDropdownProps> = ({
  club,
  onRemove,
  onManageMembers,
  onEdit,
  onCreateSquad,
}) => {
  const { user } = useAuthentication()
  const isOwner = user?.id === club.createdBy.id

  const dropdownOptions: DropdownOption[] = [
    {
      label: 'Edit club',
      icon: Pencil,
      onClick: () => onEdit?.(),
      render: isOwner,
    },
    {
        label: 'Create Squad',
        icon: Users,
        onClick: () => onCreateSquad?.(),
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
          className={cn(dropdownTriggerButtonClass, 'size-8 rounded-lg')}
          aria-label={`Club actions for ${club.name}`}
        >
          <MoreVertical className="size-4" />
        </button>
      }
    />
  )
}

export default ClubDropdown
