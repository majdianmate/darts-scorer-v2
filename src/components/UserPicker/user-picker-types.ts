import type { User } from '../../../types/user-types'

export type UserPickerGuest = {
  kind: 'guest'
  id: string
  guestName: string
}

export type UserPickerItem = User | UserPickerGuest

export function isUserPickerGuest(item: UserPickerItem): item is UserPickerGuest {
  return 'kind' in item && item.kind === 'guest'
}

export function isUserPickerUser(item: UserPickerItem): item is User {
  return !isUserPickerGuest(item)
}

export function createUserPickerGuest(guestName: string): UserPickerGuest {
  return {
    kind: 'guest',
    id: crypto.randomUUID(),
    guestName,
  }
}