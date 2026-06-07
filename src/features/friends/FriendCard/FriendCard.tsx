import Avatar from '#/components/Avatar'
import { Card, CardContent } from '#/components/ui/card'
import { cn } from '#/lib/utils.ts'
import { CalendarDays, Loader2 } from 'lucide-react'
import type { Friendship } from '../../../../types/friend-types'
import type { User } from '../../../../types/user-types'
import FriendDropdown from './FriendDropdown'

interface FriendCardProps {
  friend: User
  friendship: Friendship
  onRemove?: () => void
  isRemoving?: boolean
  className?: string
}

const ACCENT_PALETTE = [
  {
    gradient: 'from-emerald-500/25 via-teal-500/10 to-transparent',
    glow: 'bg-emerald-500/15',
    ring: 'ring-emerald-500/25',
    badge: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  },
  {
    gradient: 'from-cyan-500/25 via-sky-500/10 to-transparent',
    glow: 'bg-cyan-500/15',
    ring: 'ring-cyan-500/25',
    badge: 'border-cyan-500/25 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
  },
  {
    gradient: 'from-violet-500/25 via-purple-500/10 to-transparent',
    glow: 'bg-violet-500/15',
    ring: 'ring-violet-500/25',
    badge: 'border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-300',
  },
  {
    gradient: 'from-amber-500/25 via-orange-500/10 to-transparent',
    glow: 'bg-amber-500/15',
    ring: 'ring-amber-500/25',
    badge: 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  },
  {
    gradient: 'from-rose-500/25 via-pink-500/10 to-transparent',
    glow: 'bg-rose-500/15',
    ring: 'ring-rose-500/25',
    badge: 'border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300',
  },
] as const

function getAccentFromName(name: string) {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return ACCENT_PALETTE[hash % ACCENT_PALETTE.length]
}

function formatFriendSince(createdAt: Friendship['createdAt']) {
  if (!createdAt || typeof createdAt.toDate !== 'function') return null

  return createdAt.toDate().toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric',
  })
}

const FriendCard = ({
  friend,
  friendship,
  onRemove,
  isRemoving = false,
  className,
}: FriendCardProps) => {
  const friendSince = formatFriendSince(friendship.createdAt)
  const accent = getAccentFromName(friend.name)

  return (
    <Card
      size="sm"
      className={cn(
        'group relative overflow-hidden py-0 transition-all duration-300',
        'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5',
        'ring-1 ring-foreground/10 hover:ring-foreground/15',
        isRemoving && 'pointer-events-none',
        className,
      )}
    >
      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b',
          accent.gradient,
        )}
      />
      <div
        className={cn(
          'pointer-events-none absolute -right-6 -top-6 size-24 rounded-full blur-2xl',
          accent.glow,
        )}
      />

      <CardContent className="relative p-0">
        <div
          className={cn(
            'flex flex-col gap-4 p-4 transition-all duration-300',
            isRemoving && 'scale-[0.98] blur-sm opacity-50',
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <span
              className={cn(
                'rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                accent.badge,
              )}
            >
              Friend
            </span>

            {!isRemoving && (
              <FriendDropdown friendship={friendship} friend={friend} onRemove={onRemove} />
            )}
          </div>

          <div className="flex flex-col items-center gap-3 text-center">
            <div className="relative">
              <div
                className={cn(
                  'absolute -inset-1 rounded-full opacity-60 blur-md transition-opacity group-hover:opacity-100',
                  accent.glow,
                )}
              />
              <Avatar
                name={friend.name}
                image={friend.image}
                size="lg"
                className={cn('relative ring-2', accent.ring)}
              />
            </div>

            <div className="min-w-0 space-y-0.5">
              <p className="truncate font-semibold text-foreground">{friend.name}</p>
              <p className="truncate text-sm text-muted-foreground">@{friend.username}</p>
            </div>
          </div>

          {friendSince && (
            <div className="flex items-center justify-center gap-1.5 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              <CalendarDays className="size-3.5 shrink-0 opacity-70" />
              <span>Friends since {friendSince}</span>
            </div>
          )}
        </div>

        {isRemoving && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="flex size-10 items-center justify-center rounded-full border border-border/60 bg-background/80 shadow-sm backdrop-blur-sm">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default FriendCard
