import Avatar from '#/components/Avatar'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { ScrollArea } from '#/components/ui/scroll-area'
import { cn } from '#/lib/utils.ts'
import { Check, Loader2, UserPlus, X } from 'lucide-react'
import { useState } from 'react'
import { useFriends } from '../../../../hooks/use-friend'
import { useUser } from '../../../../hooks/use-user'

const FriendRequests = () => {
  const { user } = useUser()
  const {
    pendingRequests,
    isGetPendingRequestsLoading,
    acceptFriendRequest,
    rejectFriendRequest,
  } = useFriends(user?.id ?? '')

  const [actingOn, setActingOn] = useState<{
    id: string
    action: 'accept' | 'reject'
  } | null>(null)
  const requestCount = pendingRequests.length

  const handleAccept = (friendshipId: string) => {
    setActingOn({ id: friendshipId, action: 'accept' })
    acceptFriendRequest(friendshipId, {
      onSettled: () => setActingOn(null),
    })
  }

  const handleReject = (friendshipId: string) => {
    setActingOn({ id: friendshipId, action: 'reject' })
    rejectFriendRequest(friendshipId, {
      onSettled: () => setActingOn(null),
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" className="relative gap-1.5">
            <UserPlus className="size-4" />
            Requests
            {requestCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex size-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {requestCount > 9 ? '9+' : requestCount}
              </span>
            )}
          </Button>
        }
      />

      <DropdownMenuContent align="end" className="w-80 p-0">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="border-b border-border px-3 py-2.5">
            Friend requests
            {requestCount > 0 && (
              <span className="ml-1.5 font-normal text-muted-foreground">
                ({requestCount})
              </span>
            )}
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        {isGetPendingRequestsLoading ? (
          <div className="flex items-center justify-center gap-2 px-3 py-8 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading requests…
          </div>
        ) : requestCount === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-muted-foreground">
            No pending friend requests
          </div>
        ) : (
          <ScrollArea className="max-h-72">
            <ul className="divide-y divide-border p-1">
              {pendingRequests.map((request) => {
                const sender = request.sender
                const isActing = actingOn?.id === request.id
                const isAccepting = isActing && actingOn?.action === 'accept'
                const isRejecting = isActing && actingOn?.action === 'reject'

                return (
                  <li
                    key={request.id}
                    className={cn(
                      'flex items-center gap-2.5 rounded-md px-2 py-2.5 transition-colors',
                      isActing && 'bg-muted/40',
                    )}
                  >
                    <Avatar
                      name={sender?.name ?? 'Unknown'}
                      image={sender?.image ?? ''}
                      size="sm"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {sender?.name ?? 'Unknown user'}
                      </p>
                      {sender?.username && (
                        <p className="truncate text-xs text-muted-foreground">
                          @{sender.username}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`Accept friend request from ${sender?.name ?? 'user'}`}
                        disabled={isActing}
                        onClick={() => handleAccept(request.id)}
                        className="text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                      >
                        {isAccepting ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Check className="size-3.5" />
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`Reject friend request from ${sender?.name ?? 'user'}`}
                        disabled={isActing}
                        onClick={() => handleReject(request.id)}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        {isRejecting ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <X className="size-3.5" />
                        )}
                      </Button>
                    </div>
                  </li>
                )
              })}
            </ul>
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default FriendRequests
