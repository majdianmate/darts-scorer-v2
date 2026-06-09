import { type FC } from 'react'
import { Link, useMatchRoute } from '@tanstack/react-router'
import { cn } from '#/lib/utils'
import type { SidebarMenuItem as SidebarMenuItemConfig } from './SidebarMenuItems'

interface SidebarMenuItemProps {
  item: SidebarMenuItemConfig
}

const SidebarMenuItem: FC<SidebarMenuItemProps> = ({ item }) => {
  const matchRoute = useMatchRoute()
  const isActive = !!matchRoute({ to: item.href, fuzzy: true })
  const Icon = item.icon

  return (
    <Link
      to={item.href}
      className={cn(
        'group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
        'hover:bg-muted hover:text-foreground',
        isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground',
      )}
    >
      <Icon
        className={cn(
          'size-4 shrink-0',
          isActive
            ? 'text-primary'
            : 'text-muted-foreground group-hover:text-foreground',
        )}
      />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge && (
        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground">
          {item.badge}
        </span>
      )}
    </Link>
  )
}

export default SidebarMenuItem
