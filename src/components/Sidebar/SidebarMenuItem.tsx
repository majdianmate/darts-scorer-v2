import type { FC, ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

import { Badge } from '#/components/ui/badge'
import { cn } from '#/lib/utils'

type SidebarMenuItemProps = {
  to: string
  label: string
  icon: ReactNode
  isActive?: boolean
  badgeCount?: number
  collapsed?: boolean
}

const SidebarMenuItem: FC<SidebarMenuItemProps> = ({
  to,
  label,
  icon,
  isActive = false,
  badgeCount = 0,
  collapsed = false,
}) => {
  const badge = badgeCount > 0 ? formatBadge(badgeCount) : null

  return (
    <Link
      to={to}
      className={cn(
        'group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
        collapsed && 'justify-center px-2',
      )}
      title={collapsed ? label : undefined}
    >
      <span
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-md',
          isActive
            ? 'bg-sidebar-primary/15 text-sidebar-primary'
            : 'text-sidebar-foreground/60 group-hover:text-sidebar-foreground',
        )}
      >
        {icon}
      </span>

      {!collapsed ? (
        <>
          <span className="min-w-0 flex-1 truncate">{label}</span>
          {badge ? (
            <Badge variant="destructive" className="h-5 min-w-5 px-1.5">
              {badge}
            </Badge>
          ) : null}
        </>
      ) : badge ? (
        <span className="absolute right-1 top-1 size-2 rounded-full bg-destructive" />
      ) : null}
    </Link>
  )
}

function formatBadge(count: number) {
  if (count > 9) return '9+'
  return String(count)
}

export default SidebarMenuItem
