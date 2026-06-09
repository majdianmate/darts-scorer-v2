import type { FC, ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

import { Badge } from '#/components/ui/badge'
import { cn } from '#/lib/utils'

import { formatBadge } from './sidebar-utils'

type SidebarMenuItemProps = {
  to: string
  label: string
  icon: ReactNode
  isActive?: boolean
  badgeCount?: number
}

const SidebarMenuItem: FC<SidebarMenuItemProps> = ({
  to,
  label,
  icon,
  isActive = false,
  badgeCount = 0,
}) => {
  const badge = badgeCount > 0 ? formatBadge(badgeCount) : null

  return (
    <Link
      to={to}
      className={cn(
        'group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium no-underline transition-colors',
        isActive
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
      )}
    >
      <span className="flex size-4 shrink-0 items-center justify-center">
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {badge ? (
        <Badge variant="destructive" className="h-5 min-w-5 px-1.5">
          {badge}
        </Badge>
      ) : null}
    </Link>
  )
}

export default SidebarMenuItem
