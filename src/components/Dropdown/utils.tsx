import { isValidElement, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

import type {
  DropdownActionItem,
  DropdownIcon,
  DropdownItem,
  DropdownItemsSource,
  MaybeContextual,
  ResolvedDropdownItem,
} from './types'

export function resolveContextual<T, TContext>(
  value: MaybeContextual<T, TContext> | undefined,
  context: TContext,
  fallback: T,
): T {
  if (value === undefined) return fallback
  if (typeof value === 'function') {
    return (value as (ctx: TContext) => T)(context)
  }
  return value
}

function getItemVisibility<TContext>(
  item: DropdownItem<TContext>,
  context: TContext,
): boolean {
  const visibility = item.visible ?? item.render
  return resolveContextual(visibility, context, true)
}

function getItemKind<TContext>(item: DropdownItem<TContext>) {
  return item.kind ?? 'action'
}

function renderDropdownIcon(icon: DropdownIcon): ReactNode {
  if (!icon) return null
  if (isValidElement(icon)) return icon
  const Icon = icon as LucideIcon
  return <Icon className="size-4" />
}

function resolveActionItem<TContext>(
  item: DropdownActionItem<TContext>,
  context: TContext,
): ResolvedDropdownItem {
  const icon = resolveContextual(item.icon, context, undefined)

  return {
    kind: 'action',
    id: item.id,
    label: resolveContextual(item.label, context, ''),
    icon: icon ? renderDropdownIcon(icon) : null,
    onClick: item.onClick ? () => item.onClick?.(context) : undefined,
    variant: item.variant ?? 'default',
    disabled: resolveContextual(item.disabled, context, false),
    className: item.className,
    shortcut: resolveContextual(item.shortcut, context, undefined),
  }
}

function normalizeItems<TContext>(
  items: DropdownItemsSource<TContext>,
  context: TContext,
): DropdownItem<TContext>[] {
  return typeof items === 'function' ? items(context) : items
}

function collapseSeparators(
  items: ResolvedDropdownItem[],
): ResolvedDropdownItem[] {
  const result: ResolvedDropdownItem[] = []

  for (const item of items) {
    if (item.kind === 'separator') {
      const previous = result.at(-1)
      if (!previous || previous.kind === 'separator') continue
    }
    result.push(item)
  }

  const last = result.at(-1)
  if (last?.kind === 'separator') {
    result.pop()
  }

  return result
}

export function resolveDropdownItems<TContext>(
  items: DropdownItemsSource<TContext>,
  context: TContext,
): ResolvedDropdownItem[] {
  const source = normalizeItems(items, context)
  const resolved: ResolvedDropdownItem[] = []

  for (const item of source) {
    if (!getItemVisibility(item, context)) continue

    const kind = getItemKind(item)

    if (kind === 'separator') {
      resolved.push({
        kind: 'separator',
        id: item.id ?? `separator-${resolved.length}`,
      })
      continue
    }

    if (kind === 'label') {
      resolved.push({
        kind: 'label',
        id: item.id,
        label: resolveContextual(item.label, context, ''),
      })
      continue
    }

    resolved.push(resolveActionItem(item, context))
  }

  return collapseSeparators(resolved)
}

export function hasDropdownActions(items: ResolvedDropdownItem[]): boolean {
  return items.some((item) => item.kind === 'action')
}
