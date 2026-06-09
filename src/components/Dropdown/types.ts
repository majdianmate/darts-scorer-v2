import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import type {
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'

export type DropdownItemVariant = 'default' | 'destructive'

/** Static value or a function evaluated with dropdown context. */
export type MaybeContextual<T, TContext> = T | ((context: TContext) => T)

export type DropdownIcon = LucideIcon | ReactNode

export type DropdownActionItem<TContext = void> = {
  kind?: 'action'
  /** Stable key for React rendering. */
  id: string
  label: MaybeContextual<string, TContext>
  icon?: MaybeContextual<DropdownIcon, TContext>
  onClick?: (context: TContext) => void | Promise<void>
  variant?: DropdownItemVariant
  disabled?: MaybeContextual<boolean, TContext>
  /**
   * When false, the item is omitted from the menu.
   * Alias: `render` (legacy naming from older dropdown code).
   */
  visible?: MaybeContextual<boolean, TContext>
  /** @deprecated Prefer `visible`. Kept for migration from DropdownComponent. */
  render?: MaybeContextual<boolean, TContext>
  className?: string
  shortcut?: MaybeContextual<string, TContext>
}

export type DropdownSeparatorItem<TContext = void> = {
  kind: 'separator'
  id?: string
  visible?: MaybeContextual<boolean, TContext>
  /** @deprecated Prefer `visible`. */
  render?: MaybeContextual<boolean, TContext>
}

export type DropdownLabelItem<TContext = void> = {
  kind: 'label'
  id: string
  label: MaybeContextual<string, TContext>
  visible?: MaybeContextual<boolean, TContext>
  /** @deprecated Prefer `visible`. */
  render?: MaybeContextual<boolean, TContext>
}

export type DropdownItem<TContext = void> =
  | DropdownActionItem<TContext>
  | DropdownSeparatorItem<TContext>
  | DropdownLabelItem<TContext>

export type ResolvedDropdownActionItem = {
  kind: 'action'
  id: string
  label: string
  icon: ReactNode | null
  onClick?: () => void | Promise<void>
  variant: DropdownItemVariant
  disabled: boolean
  className?: string
  shortcut?: string
}

export type ResolvedDropdownSeparatorItem = {
  kind: 'separator'
  id: string
}

export type ResolvedDropdownLabelItem = {
  kind: 'label'
  id: string
  label: string
}

export type ResolvedDropdownItem =
  | ResolvedDropdownActionItem
  | ResolvedDropdownSeparatorItem
  | ResolvedDropdownLabelItem

export type DropdownItemsSource<TContext> =
  | DropdownItem<TContext>[]
  | ((context: TContext) => DropdownItem<TContext>[])

export type ActionDropdownProps<TContext = void> = {
  items: DropdownItemsSource<TContext>
  context: TContext
  trigger: ReactNode
  triggerProps?: React.ComponentProps<typeof DropdownMenuTrigger>
  contentClassName?: string
  align?: React.ComponentProps<typeof DropdownMenuContent>['align']
  side?: React.ComponentProps<typeof DropdownMenuContent>['side']
  sideOffset?: React.ComponentProps<typeof DropdownMenuContent>['sideOffset']
  alignOffset?: React.ComponentProps<typeof DropdownMenuContent>['alignOffset']
  /** Hide the trigger when every item is filtered out. Default: true */
  hideWhenEmpty?: boolean
  /** Rendered when the menu has no visible items and hideWhenEmpty is false. */
  emptyFallback?: ReactNode
  onOpenChange?: (open: boolean) => void
}
