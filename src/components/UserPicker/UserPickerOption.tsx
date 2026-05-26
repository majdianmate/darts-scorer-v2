import Avatar from '#/components/Avatar'
import { cn } from '#/lib/utils.ts'
import { Check, Lock } from 'lucide-react'
import type { User } from '../../../types/user-types'

interface UserPickerOptionProps {
  user: User
  onSelect: () => void
  isSelected: boolean
  isLocked?: boolean
  disabled?: boolean
}

const UserPickerOption = ({
  user,
  onSelect,
  isSelected,
  isLocked = false,
  disabled = false,
}: UserPickerOptionProps) => {
  const isInteractionDisabled = disabled || isLocked

  return (
    <button
      type="button"
      onClick={() => {
        if (!isInteractionDisabled) onSelect()
      }}
      disabled={disabled}
      aria-pressed={isSelected}
      aria-disabled={isLocked || undefined}
      className={cn(
        'group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
        !isInteractionDisabled && 'cursor-pointer hover:bg-secondary/80',
        isInteractionDisabled && 'cursor-default',
        disabled && 'cursor-not-allowed opacity-50',
        isSelected && !isLocked && 'bg-primary/8 ring-1 ring-primary/15',
        isSelected && isLocked && 'bg-primary/10 ring-1 ring-primary/25',
      )}
    >
      <Avatar name={user.name} image={user.image} size="md" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {user.name}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          @{user.username}
        </p>
      </div>

      {isLocked && isSelected ? (
        <span
          aria-hidden
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/15 text-primary"
        >
          <Lock className="h-3 w-3" />
        </span>
      ) : (
        <span
          aria-hidden
          className={cn(
            'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors',
            isSelected
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-input bg-background text-transparent group-hover:border-muted-foreground/50',
          )}
        >
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
      )}
    </button>
  )
}

export default UserPickerOption
