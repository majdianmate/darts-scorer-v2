import FriendCard from './FriendCard/FriendCard'
import { useFriends } from '../../../hooks/use-friend'
import { useUser } from '../../../hooks/use-user'
import NewFriendDialog from './FriendAdd/NewFriendDialog'
import { ScrollArea } from '#/components/ui/scroll-area'
import FriendRequests from './FriendRequests/FriendRequests'

const Friends = () => {
  const { user } = useUser()
  const { friends, deleteFriend, isGetFriendsLoading, deletingFriendshipId } =
    useFriends(user?.id ?? '')

  if (isGetFriendsLoading) {
    return <p className="text-sm text-muted-foreground">Loading friends…</p>
  }

  if (friends.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <NewFriendDialog />
        </div>
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Friends</h2>
        <div className="flex justify-end gap-2">
          <FriendRequests />
          <NewFriendDialog />
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-100px)] [scrollbar-gutter:stable] overflow-y-hidden pr-4">
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
