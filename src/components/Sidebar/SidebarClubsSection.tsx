import type { FC } from 'react'
import { Link } from '@tanstack/react-router'
import { Loader2, Plus } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'

import type { Club } from '../../../types/club-types'

type SidebarClubsSectionProps = {
  clubs: Club[]
  isLoading: boolean
  collapsed?: boolean
  onCreateClub: () => void
}

const MAX_CLUBS = 5

const SidebarClubsSection: FC<SidebarClubsSectionProps> = ({
  clubs,
  isLoading,
  collapsed = false,
  onCreateClub,
}) => {
  const listedClubs = clubs.slice(0, MAX_CLUBS)

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-1 border-t border-sidebar-border pt-3">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-sidebar-foreground/70"
          onClick={onCreateClub}
          title="Create club"
        >
          <Plus className="size-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 border-t border-sidebar-border pt-3">
      <div className="flex items-center justify-between gap-2 px-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/45">
          Clubs
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="size-7 text-sidebar-foreground/70 hover:text-sidebar-foreground"
          onClick={onCreateClub}
          aria-label="Create club"
        >
          <Plus className="size-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-4 text-xs text-sidebar-foreground/50">
          <Loader2 className="size-3.5 animate-spin" />
          Loading…
        </div>
      ) : clubs.length === 0 ? (
        <button
          type="button"
          onClick={onCreateClub}
          className={cn(
            'mx-1 flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-sidebar-border',
            'px-3 py-4 text-center text-xs text-sidebar-foreground/55 transition-colors',
            'hover:border-sidebar-primary/40 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground',
          )}
        >
          <p className="font-medium">No clubs yet</p>
          <p className="text-[10px]">Tap to create one</p>
        </button>
      ) : (
        <ul className="flex flex-col gap-0.5 px-1">
          {listedClubs.map((club) => (
            <li key={club.id}>
              <Link
                to="/clubs/$club"
                params={{ club: club.id }}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors',
                  'text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
                )}
              >
                <span
                  className="size-2 shrink-0 rounded-full bg-sidebar-primary"
                  aria-hidden
                />
                <span className="min-w-0 truncate">{club.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SidebarClubsSection
