import { UserMinus } from 'lucide-react'

import { defineDropdown } from '#/components/dropdown'

export type FriendDropdownContext = {
  onRemove: () => void
}

export const friendDropdownItems = defineDropdown<FriendDropdownContext>([
  {
    id: 'remove',
    label: 'Remove friend',
    icon: UserMinus,
    variant: 'destructive',
    onClick: (ctx) => ctx.onRemove(),
  },
])
