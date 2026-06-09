import {
  CalendarDays,
  Clock3,
  Loader2,
  Mail,
  Swords,
  User,
  UserPlus,
} from 'lucide-react'
import type { ReactNode } from 'react'

import Avatar from '#/components/Avatar'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '#/components/ui/card'
import { cn } from '#/lib/utils'
import { useUser } from '../../../../hooks/use-user'
import { FriendshipStatus, type Friendship } from '../../../../types/friend-types'
import type { User as AppUser } from '../../../../types/user-types'
import FriendDropdown from './FriendDropdown'

interface FriendCardProps {
  friend: AppUser
  friendship: Friendship
  onRemove?: () => void
  onView?: () => void
  onStartMatch?: () => void
  isRemoving?: boolean
  className?: string
}

type TimestampLike = { toDate?: () => Date }

function formatDate(value: TimestampLike | null | undefined) {
  if (!value || typeof value.toDate !== 'function') return '—'

  return value.toDate().toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatStatus(status: FriendshipStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function InfoItem({
  icon,
  label,
  value,
  className,
}: {
  icon: ReactNode
  label: string
  value: ReactNode
  className?: string
}) {
  return (
    <div className={cn('min-w-0 space-y-1', className)}>
      <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <div className="flex min-w-0 items-center gap-1.5 text-sm text-foreground">
        <span className="shrink-0 text-muted-foreground">{icon}</span>
        <span className="min-w-0 truncate">{value}</span>
      </div>
    </div>
  )
}

const FriendCard = ({
  friend,
  friendship,
  onRemove,
  onView,
  onStartMatch,
  isRemoving = false,
  className,
}: FriendCardProps) => {
  const { user } = useUser()
  const requestedByCurrentUser = friendship.senderId === user?.id
  const requestLabel = requestedByCurrentUser
    ? 'You'
    : friendship.sender.name

  return (
    <Card
      className={cn(
        'relative gap-0 py-0 transition-shadow hover:shadow-md',
        isRemoving && 'pointer-events-none',
        className,
      )}
    >
      <CardHeader className="flex flex-row items-start gap-4 border-b border-border/60 py-4">
        <Avatar
          name={friend.name}
          image={friend.image}
          size="lg"
          className="shrink-0 ring-1 ring-border"
        />

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-foreground">
                {friend.name}
              </h3>
              <p className="truncate text-sm text-muted-foreground">
                @{friend.username}
              </p>
            </div>

            {!isRemoving ? <FriendDropdown onRemove={onRemove} /> : null}
          </div>

          <div className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
            <Mail className="size-3.5 shrink-0" />
            <span className="truncate">{friend.email}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
        <InfoItem
          icon={<CalendarDays className="size-3.5" />}
          label="Friends since"
          value={formatDate(friendship.createdAt)}
        />
        <InfoItem
          icon={<UserPlus className="size-3.5" />}
          label="Requested by"
          value={requestLabel}
        />
        <InfoItem
          icon={<CalendarDays className="size-3.5" />}
          label="Member since"
          value={formatDate(friend.createdAt)}
        />
        <InfoItem
          icon={<Clock3 className="size-3.5" />}
          label="Last updated"
          value={formatDate(friendship.updatedAt)}
        />
        <InfoItem
          icon={<User className="size-3.5" />}
          label="Friendship status"
          value={
            <Badge variant="secondary" className="font-normal">
              {formatStatus(friendship.status)}
            </Badge>
          }
          className="sm:col-span-2"
        />
      </CardContent>

      <CardFooter className="gap-2 border-t border-border/60 bg-muted/30 py-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          disabled={isRemoving}
          onClick={onView}
        >
          <User className="size-4" />
          View
        </Button>
        <Button
          type="button"
          className="flex-1"
          disabled={isRemoving}
          onClick={onStartMatch}
        >
          <Swords className="size-4" />
          Start match
        </Button>
      </CardFooter>

      {isRemoving ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/70 backdrop-blur-[1px]">
          <div className="flex size-10 items-center justify-center rounded-full border border-border bg-background shadow-sm">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        </div>
      ) : null}
    </Card>
  )
}

export default FriendCard
