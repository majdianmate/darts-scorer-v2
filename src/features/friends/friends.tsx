import FriendCard from './FriendCard/FriendCard'
import { useFriends } from '../../../hooks/use-friend'
import { useUser } from '../../../hooks/use-user'
import NewFriendDialog from './FriendAdd/NewFriendDialog'
import { ScrollArea } from '#/components/ui/scroll-area'
import FriendRequests from './FriendRequests/FriendRequests'
import PageHeaderToolbar from '#/components/Sidebar/PageHeaderToolbar'
import { Users } from 'lucide-react'

const Friends = () => {
  const { user } = useUser()
  const { friends, deleteFriend, isGetFriendsLoading, deletingFriendshipId } =
    useFriends(user?.id ?? '')

  if (isGetFriendsLoading) {
    return <p className="text-sm text-muted-foreground">Loading friends…</p>
  }

  const headerToolbar = (
    <PageHeaderToolbar>
      <>
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/30">
            <Users className="size-4 text-muted-foreground" />
          </div>
          <p className="truncate text-sm text-muted-foreground">
            {friends.length === 0
              ? 'Send requests to grow your list'
              : `${friends.length} friend${friends.length === 1 ? '' : 's'}`}
          </p>
        </div>
        <div className="flex-1" />
        <div className="flex shrink-0 items-center gap-2">
          {friends.length > 0 ? <FriendRequests /> : null}
          <NewFriendDialog />
        </div>
      </>
    </PageHeaderToolbar>
  )

  if (friends.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        {headerToolbar}
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
          <p className="font-medium text-foreground">No friends yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Send a friend request to start building your list.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {headerToolbar}
      <ScrollArea className="h-[calc(100vh-3.5rem-3rem)] [scrollbar-gutter:stable] overflow-y-hidden pr-4">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {friends.map(({ friend, friendship }) => (
            <FriendCard
              key={friendship.id}
              friend={friend}
              friendship={friendship}
              onRemove={() => deleteFriend(friendship.id)}
              isRemoving={deletingFriendshipId === friendship.id}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export default Friends
