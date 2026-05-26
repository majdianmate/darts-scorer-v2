import { X } from 'lucide-react'

import Avatar from '#/components/Avatar'
import type { User } from '../../../types/user-types'

interface UserPickerSelectedTagsProps {
  selectedUsers: User[]
  onRemove: (user: User) => void
  lockedUserIds?: string[]
}

const UserPickerSelectedTags = ({
  selectedUsers,
  onRemove,
  lockedUserIds = [],
}: UserPickerSelectedTagsProps) => {
  const lockedSet = new Set(lockedUserIds)

  if (selectedUsers.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5">
      {selectedUsers.map((user) => {
        const isLocked = lockedSet.has(user.id)

        if (isLocked) {
          return (
            <span
              key={user.id}
              className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 py-0.5 pl-0.5 pr-2.5 text-xs text-foreground"
            >
              <Avatar
                name={user.name}
                image={user.image}
                size="sm"
                className="h-6 w-6"
              />
              <span className="font-medium">@{user.username}</span>
            </span>
          )
        }

        return (
          <button
            key={user.id}
            type="button"
            onClick={() => onRemove(user)}
            className="group flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-secondary py-0.5 pl-0.5 pr-2 text-xs text-secondary-foreground transition-colors hover:bg-secondary/70"
            aria-label={`Remove ${user.name}`}
          >
            <Avatar
              name={user.name}
              image={user.image}
              size="sm"
              className="h-6 w-6"
            />
            <span className="font-medium">@{user.username}</span>
            <X className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
          </button>
        )
      })}
    </div>
  )
}

export default UserPickerSelectedTags
