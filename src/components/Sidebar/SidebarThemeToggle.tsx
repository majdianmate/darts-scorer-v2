import type { FC } from 'react'
import { useTheme } from 'next-themes'

import { cn } from '#/lib/utils'

type ThemeOption = 'light' | 'dark' | 'system'

const OPTIONS: { id: ThemeOption; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'system', label: 'Auto' },
]

type SidebarThemeToggleProps = {
  collapsed?: boolean
}

const SidebarThemeToggle: FC<SidebarThemeToggleProps> = ({ collapsed }) => {
  const { theme, setTheme } = useTheme()
  const active = (theme ?? 'dark') as ThemeOption

  if (collapsed) return null

  return (
    <div className="flex flex-col gap-1.5 px-1">
      <p className="px-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/45">
        Theme
      </p>
      <div
        className="grid grid-cols-3 gap-0.5 rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-0.5"
        role="tablist"
        aria-label="Theme"
      >
        {OPTIONS.map((option) => {
          const isActive = active === option.id

          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setTheme(option.id)}
              className={cn(
                'rounded-md px-2 py-1.5 text-[11px] font-semibold transition-colors',
                isActive
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-sidebar-foreground/55 hover:text-sidebar-foreground',
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SidebarThemeToggle
