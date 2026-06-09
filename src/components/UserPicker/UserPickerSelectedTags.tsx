import { X, UserRoundPlus } from 'lucide-react'

import Avatar from '#/components/Avatar'
import type { User } from '../../../types/user-types'
import {
  isUserPickerGuest,
  type UserPickerGuest,
  type UserPickerItem,
} from './user-picker-types'

type SelectableWithId = { id: string }

interface UserPickerSelectedTagsProps<T extends SelectableWithId = User> {
  selectedUsers: T[]
  onRemove: (item: T) => void
  lockedUserIds?: string[]
}

const UserPickerSelectedTags = <T extends SelectableWithId = User>({
  selectedUsers,
  onRemove,
  lockedUserIds = [],
}: UserPickerSelectedTagsProps<T>) => {
  const lockedSet = new Set(lockedUserIds)

  if (selectedUsers.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5">
      {selectedUsers.map((item) => {
        if (isUserPickerGuest(item as unknown as UserPickerItem)) {
          const guest = item as unknown as UserPickerGuest

          return (
            <button
              key={guest.id}
              type="button"
              onClick={() => onRemove(item)}
              className="group flex cursor-pointer items-center gap-1.5 rounded-full border border-lime-500/30 bg-lime-500/10 py-0.5 pl-2 pr-2 text-xs text-lime-800 transition-colors hover:bg-lime-500/20 dark:text-lime-300"
              aria-label={`Remove guest ${guest.guestName}`}
            >
              <UserRoundPlus className="size-3.5 shrink-0" />
              <span className="font-medium">{guest.guestName}</span>
              <X className="size-3 text-muted-foreground group-hover:text-foreground" />
            </button>
          )
        }

        const user = item as unknown as User
        const isLocked = lockedSet.has(user.id)

        if (isLocked) {
          return (
            <span
              key={user.id}
              className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 py-0.5 pl-0.5 pr-2.5 text-xs text-foreground"
            >
              <Avatar
                user={user}
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
            onClick={() => onRemove(item)}
            className="group flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-secondary py-0.5 pl-0.5 pr-2 text-xs text-secondary-foreground transition-colors hover:bg-secondary/70"
            aria-label={`Remove ${user.name}`}
          >
            <Avatar
              user={user}
              size="sm"
              className="h-6 w-6"
            />
            <span className="font-medium">@{user.username}</span>
            <X className="size-3 text-muted-foreground group-hover:text-foreground" />
          </button>
        )
      })}
    </div>
  )
}

export default UserPickerSelectedTags