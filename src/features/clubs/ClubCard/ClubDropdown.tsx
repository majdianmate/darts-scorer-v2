import { type FC } from 'react'
import type { Club } from '../../../../types/club-types'
import type { DropdownOption } from '#/components/Dropdown/DropdownComponent'
import { ArrowUpRight, MoreVertical, Pencil, Trash2, UserCog, Users } from 'lucide-react'
import DropdownComponent from '#/components/Dropdown/DropdownComponent'
import { useUser } from '../../../../hooks/use-user'

interface ClubDropdownProps {
  club: Club
  onView?: () => void
  onEdit?: () => void
  onRemove?: () => void
  onManageMembers?: () => void
  onCreateSquad?: () => void
}

const ClubDropdown: FC<ClubDropdownProps> = ({
  club,
  onView,
  onRemove,
  onManageMembers,
  onEdit,
  onCreateSquad,
}) => {
  const { user } = useUser()
  const isOwner = user?.id === club.createdBy.id

  const dropdownOptions: DropdownOption[] = [
    {
      label: 'View club',
      icon: ArrowUpRight,
      onClick: () => onView?.(),
    },
    {
      label: 'Edit club',
      icon: Pencil,
      onClick: () => onEdit?.(),
      render: isOwner,
    },
    {
      label: 'Create squad',
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
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={`Club actions for ${club.name}`}
        >
          <MoreVertical className="size-4" />
        </button>
      }
    />
  )
}

export default ClubDropdown
