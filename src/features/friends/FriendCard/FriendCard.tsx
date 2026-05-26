import Avatar from '#/components/Avatar'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { cn } from '#/lib/utils.ts'
import { UserMinus } from 'lucide-react'
import type { Friendship } from '../../../../types/friend-types'
import type { User } from '../../../../types/user-types'

interface FriendCardProps {
  friend: User
  friendship: Friendship
  onRemove?: () => void
  isRemoving?: boolean
  className?: string
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

  return (
    <Card
      size="sm"
      className={cn(
        'py-0 transition-colors hover:bg-muted/20',
        className,
      )}
    >
      <CardContent className="flex items-center gap-3 py-3">
        <Avatar
          name={friend.name}
          image={friend.image}
          size="lg"
          className="ring-2 ring-background"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">
                {friend.name}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                @{friend.username}
              </p>
            </div>

            <span className="shrink-0 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Friend
            </span>
          </div>

          {friendSince && (
            <p className="mt-1.5 text-xs text-muted-foreground">
              Friends since {friendSince}
            </p>
          )}
        </div>

        {onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-muted-foreground hover:text-destructive"
            aria-label={`Remove ${friend.name}`}
            disabled={isRemoving}
            onClick={onRemove}
          >
            <UserMinus />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default FriendCard
