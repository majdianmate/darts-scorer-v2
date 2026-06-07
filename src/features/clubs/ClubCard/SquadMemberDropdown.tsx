import { type FC } from 'react'
import type { SquadMember } from '../../../../types/club-types'
import type { DropdownOption } from '#/components/Dropdown/DropdownComponent'
import { MoreVertical, Trash } from 'lucide-react'
import DropdownComponent from '#/components/Dropdown/DropdownComponent'
import { dropdownTriggerButtonClass } from '#/components/Dropdown/dropdown-trigger-styles'

interface SquadMemberDropdownProps {
  squadMember: SquadMember
  onRemove: () => void
}

const SquadMemberDropdown: FC<SquadMemberDropdownProps> = ({ squadMember, onRemove }) => {
  const dropdownOptions: DropdownOption[] = [
    {
      label: 'Remove from squad',
      onClick: onRemove,
      variant: 'destructive',
      icon: Trash
    },
  ]

  return (
    <DropdownComponent
      options={dropdownOptions}
      trigger={
        <button
          type="button"
          className={dropdownTriggerButtonClass}
          aria-label={`Actions for ${squadMember.member.user.name}`}
        >
          <MoreVertical className="size-4" />
        </button>
      }
    />
  )
}

export default SquadMemberDropdown
