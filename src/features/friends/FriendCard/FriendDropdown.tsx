import { MoreVerticalIcon } from 'lucide-react'
import { type FC } from 'react'

import { ActionDropdown } from '#/components/dropdown'
import { Button } from '#/components/ui/button'

import { friendDropdownItems } from './friend-dropdown-items'

interface FriendDropdownProps {
  onRemove?: () => void
}

const FriendDropdown: FC<FriendDropdownProps> = ({ onRemove }) => {
  return (
    <ActionDropdown
      items={friendDropdownItems}
      context={{
        onRemove: () => onRemove?.(),
      }}
      trigger={
        <Button
          variant="ghost"
          size="icon-sm"
          className="shrink-0 text-muted-foreground"
          aria-label="More actions"
        >
          <MoreVerticalIcon className="size-4" />
        </Button>
      }
    />
  )
}

export default FriendDropdown
