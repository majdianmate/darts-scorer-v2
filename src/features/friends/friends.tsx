import FriendCard from './FriendCard/FriendCard'
import { useFriends } from '../../../hooks/use-friend'
import { useUser } from '../../../hooks/use-user'
import NewFriendDialog from './FriendAdd/NewFriendDialog'

const Friends = () => {
  const { user } = useUser()
  const { friends, deleteFriend, isGetFriendsLoading } = useFriends(user?.id ?? '')

  if (isGetFriendsLoading) {
    return (
      <p className="text-sm text-muted-foreground">Loading friends…</p>
    )
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
        <div className='flex justify-end'>
            <NewFriendDialog />
        </div>
      <div className='grid gap-3 sm:grid-cols-2'>
      {friends.map(({ friend, friendship }) => (
        <FriendCard
          key={friendship.id}
          friend={friend}
          friendship={friendship}
          onRemove={() => deleteFriend(friendship.id)}
        />
      ))}
      </div>
    </div>
  )
}

export default Friends
