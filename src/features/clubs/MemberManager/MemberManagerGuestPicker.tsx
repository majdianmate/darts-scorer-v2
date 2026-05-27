import { type FC, useMemo, useState } from 'react'
import { Button } from '#/components/ui/button'
import { UserRoundPlus } from 'lucide-react'
import {
  createUserPickerGuest,
  isUserPickerGuest,
  type UserPickerGuest,
  type UserPickerItem,
} from '#/components/UserPicker/user-picker-types'

interface MemberManagerGuestPickerProps {
  selectedItems: UserPickerItem[]
  onAddGuest: (guest: UserPickerGuest) => void
}

const MemberManagerGuestPicker: FC<MemberManagerGuestPickerProps> = ({
  selectedItems,
  onAddGuest,
}) => {
  const [guestName, setGuestName] = useState('')

  const existingGuestNames = useMemo(
    () =>
      new Set(
        selectedItems
          .filter(isUserPickerGuest)
          .map((guest) => guest.guestName.trim().toLowerCase()),
      ),
    [selectedItems],
  )

  const trimmedName = guestName.trim()
  const isDuplicate =
    trimmedName.length > 0 &&
    existingGuestNames.has(trimmedName.toLowerCase())

  const handleAdd = () => {
    if (!trimmedName || isDuplicate) return

    onAddGuest(createUserPickerGuest(trimmedName))
    setGuestName('')
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Add a guest by display name. They will appear in the selection list.
      </p>

      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <UserRoundPlus className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAdd()
              }
            }}
            placeholder="Guest name…"
            className="w-full rounded-lg border border-input bg-transparent py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground hover:border-muted-foreground/30 focus:border-ring/70 focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>
        <Button
          type="button"
          variant="default"
          disabled={!trimmedName || isDuplicate}
          onClick={handleAdd}
          className="shrink-0"
        >
          Add
        </Button>
      </div>

      {isDuplicate && (
        <p className="text-xs text-destructive">
          This guest name is already in your selection.
        </p>
      )}
    </div>
  )
}

export default MemberManagerGuestPicker
