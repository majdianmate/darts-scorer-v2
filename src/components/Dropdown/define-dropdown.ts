import type {
  DropdownActionItem,
  DropdownItem,
  DropdownLabelItem,
  DropdownSeparatorItem,
} from './types'

type ActionInput<TContext> = Omit<DropdownActionItem<TContext>, 'kind'>
type SeparatorInput<TContext> = Omit<DropdownSeparatorItem<TContext>, 'kind'>
type LabelInput<TContext> = Omit<DropdownLabelItem<TContext>, 'kind'>

/**
 * Freeze a dropdown definition for reuse across components.
 * Items can still depend on context via `visible`, `disabled`, and callbacks.
 */
export function defineDropdown<TContext>(
  items: DropdownItem<TContext>[],
): DropdownItem<TContext>[] {
  return items
}

export function createDropdownBuilder<TContext>() {
  const items: DropdownItem<TContext>[] = []

  const builder = {
    action(item: ActionInput<TContext>) {
      items.push({ kind: 'action', ...item })
      return builder
    },

    separator(input: SeparatorInput<TContext> = {}) {
      items.push({ kind: 'separator', ...input })
      return builder
    },

    label(item: LabelInput<TContext>) {
      items.push({ kind: 'label', ...item })
      return builder
    },

    build() {
      return [...items] as DropdownItem<TContext>[]
    },
  }

  return builder
}
