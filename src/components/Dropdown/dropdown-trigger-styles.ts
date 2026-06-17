import { cn } from '#/lib/utils'

/** Icon button for row/card dropdown menus — always visible. */
export const dropdownTriggerButtonClass = cn(
  'inline-flex size-7 shrink-0 items-center justify-center rounded-md',
  'text-muted-foreground transition-colors',
  'hover:bg-muted hover:text-foreground',
  'data-popup-open:bg-muted data-popup-open:text-foreground',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
  '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
)
