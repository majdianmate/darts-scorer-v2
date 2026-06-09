import { usePageHeader } from '#/components/Sidebar'
import { ScrollArea } from '#/components/ui/scroll-area'
import { useFriends } from '../../../hooks/use-friend'
import { useUser } from '../../../hooks/use-user'
import FriendCard from './FriendCard/FriendCard'
import NewFriendDialog from './FriendAdd/NewFriendDialog'
import FriendRequests from './FriendRequests/FriendRequests'

const Friends = () => {
  const { user } = useUser()
  const { friends, deleteFriend, isGetFriendsLoading, deletingFriendshipId } =
    useFriends(user?.id ?? '')

  usePageHeader({
    title: 'Friends',
    toolbar: (
      <>
        <FriendRequests />
        <NewFriendDialog />
      </>
    ),
  })

  if (isGetFriendsLoading) {
    return <p className="text-sm text-muted-foreground">Loading friends…</p>
  }

  if (friends.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/40 px-6 py-12 text-center">
          <p className="font-medium text-foreground">No friends yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Send a friend request to start building your list.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ScrollArea className="min-h-0 flex-1 [scrollbar-gutter:stable]">
        <div className="grid gap-4 lg:grid-cols-2">
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
