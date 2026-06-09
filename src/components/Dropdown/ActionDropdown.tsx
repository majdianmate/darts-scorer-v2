import { useMemo } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { cn } from '#/lib/utils'

import type { ActionDropdownProps } from './types'
import { hasDropdownActions, resolveDropdownItems } from './utils'

function ActionDropdown<TContext>({
  items,
  context,
  trigger,
  triggerProps,
  contentClassName,
  align = 'end',
  side = 'bottom',
  sideOffset = 4,
  alignOffset = 0,
  hideWhenEmpty = true,
  emptyFallback = null,
  onOpenChange,
}: ActionDropdownProps<TContext>) {
  const resolvedItems = useMemo(
    () => resolveDropdownItems(items, context),
    [items, context],
  )

  const hasActions = hasDropdownActions(resolvedItems)

  if (!hasActions) {
    if (hideWhenEmpty) return null
    return <>{emptyFallback}</>
  }

  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger {...triggerProps}>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        className={cn('min-w-40', contentClassName)}
      >
        <DropdownMenuGroup>
          {resolvedItems.map((item) => {
            if (item.kind === 'separator') {
              return <DropdownMenuSeparator key={item.id} />
            }

            if (item.kind === 'label') {
              return (
                <DropdownMenuLabel key={item.id}>{item.label}</DropdownMenuLabel>
              )
            }

            return (
              <DropdownMenuItem
                key={item.id}
                variant={item.variant}
                disabled={item.disabled}
                className={cn('cursor-pointer', item.className)}
                onClick={item.onClick}
              >
                {item.icon}
                {item.label}
                {item.shortcut ? (
                  <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
                ) : null}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ActionDropdown
