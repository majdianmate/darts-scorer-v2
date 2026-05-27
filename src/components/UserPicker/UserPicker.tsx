import { Loader2, Search } from 'lucide-react'
import {
  type ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import type { User } from '../../../types/user-types'
import { cn } from '#/lib/utils.ts'
import UserPickerOption from './UserPickerOption'
import UserPickerSelectedTags from './UserPickerSelectedTags'
import type { UserPickerGuest } from './user-picker-types'

const GLOBAL_MIN_SEARCH_LENGTH = 3

function filterUsersByTerm(users: User[], term: string) {
  if (!term) return users

  const normalizedTerm = term.toLowerCase()

  return users.filter(
    (user) =>
      user.name.toLowerCase().includes(normalizedTerm) ||
      user.username.toLowerCase().includes(normalizedTerm) ||
      user.email.toLowerCase().includes(normalizedTerm),
  )
}

type SelectableWithId = { id: string }

function isGuestSelectionItem(
  item: SelectableWithId,
): item is UserPickerGuest {
  return (
    'kind' in item &&
    (item as UserPickerGuest).kind === 'guest' &&
    'guestName' in item
  )
}

export interface UserPickerProps<T extends SelectableWithId = User> {
  selectedUsers: T[]
  onSelectionChange: (users: T[]) => void
  /** Local list to display and filter. When omitted, global remote search is used. */
  source?: User[]
  /** Remote search used only when `source` is not provided. */
  onSearch?: (term: string) => Promise<User[]>
  /** User IDs that stay selected and cannot be deselected. */
  lockedUserIds?: string[]
  multiple?: boolean
  placeholder?: string
  emptyMessage?: string
  showSelectedTags?: boolean
  maxListHeight?: string
  /** When true, the list grows to fill remaining height and scrolls internally. */
  fillHeight?: boolean
  className?: string
  excludeUserIds?: string[]
}

const UserPicker = <T extends SelectableWithId = User>({
  selectedUsers,
  onSelectionChange,
  source,
  onSearch,
  lockedUserIds,
  multiple = true,
  placeholder,
  emptyMessage = 'No users found.',
  showSelectedTags = true,
  maxListHeight = '18rem',
  fillHeight = false,
  className = '',
  excludeUserIds,
}: UserPickerProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [remoteResults, setRemoteResults] = useState<User[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const trimmedTerm = searchTerm.trim()
  const hasSource = source !== undefined

  const excludeSet = useMemo(
    () => new Set(excludeUserIds ?? []),
    [excludeUserIds],
  )

  const lockedSet = useMemo(
    () => new Set(lockedUserIds ?? []),
    [lockedUserIds],
  )

  const nonGuestSelection = useMemo(
    () => selectedUsers.filter((item) => !isGuestSelectionItem(item)),
    [selectedUsers],
  )

  const guestSelection = useMemo(
    () => selectedUsers.filter(isGuestSelectionItem),
    [selectedUsers],
  )

  const lockedUsers = useMemo(() => {
    const users: User[] = []
    for (const item of nonGuestSelection) {
      const user = item as User
      if (lockedSet.has(user.id)) users.push(user)
    }
    return users
  }, [nonGuestSelection, lockedSet])

  const emitUserSelectionChange = (users: User[]) => {
    const nextIds = new Set(users.map((user) => user.id))
    const merged = [...users]

    for (const lockedUser of lockedUsers) {
      if (!nextIds.has(lockedUser.id)) {
        merged.push(lockedUser)
      }
    }

    onSelectionChange([...merged, ...guestSelection] as T[])
  }

  useEffect(() => {
    if (hasSource || !onSearch) return

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (trimmedTerm.length < GLOBAL_MIN_SEARCH_LENGTH) {
      setRemoteResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const found = await onSearch(trimmedTerm)
        setRemoteResults(found)
      } catch {
        setRemoteResults([])
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [trimmedTerm, hasSource, onSearch])

  const userResults = useMemo(() => {
    const pool = hasSource
      ? filterUsersByTerm(source, trimmedTerm)
      : remoteResults

    return pool.filter((user) => !excludeSet.has(user.id))
  }, [hasSource, source, trimmedTerm, remoteResults, excludeSet])

  const isUserSelected = (user: User) =>
    nonGuestSelection.some((selected) => (selected as User).id === user.id)

  const isUserLocked = (user: User) => lockedSet.has(user.id)

  const toggleUser = (user: User) => {
    if (isUserLocked(user)) return

    const selectedUserItems = nonGuestSelection as User[]

    if (isUserSelected(user)) {
      emitUserSelectionChange(
        selectedUserItems.filter((selected) => selected.id !== user.id),
      )
      return
    }

    if (multiple) {
      emitUserSelectionChange([...selectedUserItems, user])
    } else {
      emitUserSelectionChange([user, ...lockedUsers])
    }
  }

  const removeSelectedItem = (item: T) => {
    if (isGuestSelectionItem(item)) {
      onSelectionChange(
        selectedUsers.filter((selected) => selected.id !== item.id),
      )
      return
    }

    const user = item as User
    if (isUserLocked(user)) return

    emitUserSelectionChange(
      (nonGuestSelection as User[]).filter(
        (selected) => selected.id !== user.id,
      ),
    )
  }

  const resolvedPlaceholder =
    placeholder ??
    (hasSource
      ? 'Filter by name, username or email…'
      : 'Search by name, username or email…')

  const idleHint = !hasSource && trimmedTerm.length === 0
  const tooShortHint =
    !hasSource &&
    trimmedTerm.length > 0 &&
    trimmedTerm.length < GLOBAL_MIN_SEARCH_LENGTH

  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        fillHeight && 'h-full min-h-0',
        className,
      )}
    >
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          placeholder={resolvedPlaceholder}
          className="w-full rounded-lg border border-input bg-transparent py-2 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground hover:border-muted-foreground/30 focus:border-ring/70 focus:outline-none focus:ring-2 focus:ring-ring/20"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {showSelectedTags && (
        <UserPickerSelectedTags
          selectedUsers={selectedUsers}
          onRemove={removeSelectedItem}
          lockedUserIds={lockedUserIds}
        />
      )}

      <div
        className={cn(
          'flex flex-col gap-1 overflow-y-auto rounded-lg border border-border/60 bg-muted/10 p-1',
          fillHeight && 'min-h-0 flex-1',
        )}
        style={fillHeight ? undefined : { maxHeight: maxListHeight }}
      >
        {idleHint && (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">
            Type at least {GLOBAL_MIN_SEARCH_LENGTH} characters to search.
          </p>
        )}
        {tooShortHint && (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">
            Type at least {GLOBAL_MIN_SEARCH_LENGTH} characters.
          </p>
        )}
        {!idleHint &&
          !tooShortHint &&
          !isSearching &&
          userResults.length === 0 && (
            <p className="px-2 py-6 text-center text-xs text-muted-foreground">
              {emptyMessage}
            </p>
          )}
        {!idleHint &&
          !tooShortHint &&
          userResults.map((user) => (
            <UserPickerOption
              key={user.id}
              user={user}
              isSelected={isUserSelected(user) || isUserLocked(user)}
              isLocked={isUserLocked(user)}
              onSelect={() => toggleUser(user)}
            />
          ))}
      </div>
    </div>
  )
}

export default UserPicker
