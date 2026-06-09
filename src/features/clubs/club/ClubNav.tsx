import {
  Mail,
  Settings,
  Target,
  Users,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '#/lib/utils'
import type { ClubSection } from './types'

type NavItem = {
  id: ClubSection
  label: string
  icon: LucideIcon
  count?: number
}

type ClubNavProps = {
  active: ClubSection
  onChange: (section: ClubSection) => void
  counts: {
    members: number
    invitations: number
    squads: number
  }
  layout?: 'vertical' | 'horizontal'
  className?: string
}

const ClubNav = ({
  active,
  onChange,
  counts,
  layout = 'vertical',
  className,
}: ClubNavProps) => {
  const items: NavItem[] = [
    { id: 'members', label: 'Members', icon: Users, count: counts.members },
    {
      id: 'invitations',
      label: 'Invitations',
      icon: Mail,
      count: counts.invitations,
    },
    { id: 'squads', label: 'Squads', icon: UsersRound, count: counts.squads },
    { id: 'matches', label: 'Matches', icon: Target },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  if (layout === 'horizontal') {
    return (
      <div
        className={cn(
          'flex gap-1 overflow-x-auto border-b border-border/60 px-1 pb-3',
          className,
        )}
      >
        {items.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={cn(
                'inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                isActive
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
              )}
            >
              <Icon className="size-3.5" />
              {item.label}
              {item.count !== undefined ? (
                <span
                  className={cn(
                    'tabular-nums',
                    isActive ? 'text-background/80' : 'text-muted-foreground',
                  )}
                >
                  {item.count}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <nav className={cn('flex flex-col gap-0.5', className)}>
      {items.map((item) => {
        const Icon = item.icon
        const isActive = active === item.id

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={cn(
              'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors',
              isActive
                ? 'bg-background font-medium text-foreground shadow-sm ring-1 ring-border/60'
                : 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            {item.count !== undefined ? (
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {item.count}
              </span>
            ) : null}
          </button>
        )
      })}
    </nav>
  )
}

export default ClubNav
