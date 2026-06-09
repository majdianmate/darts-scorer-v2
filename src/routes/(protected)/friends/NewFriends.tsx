import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import UserPicker from '@/components/UserPicker/UserPicker'
import { useFriends } from '../../../../hooks/use-friends'
import { useUser } from '../../../../hooks/use-user'
import { searchUsersService } from '../../../../services/user-service'
import type { User } from '../../../../types/user-types'
import { FriendshipStatus, type FriendshipDoc } from '../../../../types/friends-types'
import { serverTimestamp, Timestamp } from 'firebase/firestore'

const NewFriendDialog = () => {
  const { user: currentUser } = useUser()
  const { friends, addFriends } = useFriends(currentUser?.id ?? '')
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])

  const existingFriends = useMemo(
    () => friends.map(({ friend }) => friend),
    [friends],
  )

  const lockedUserIds = useMemo(
    () => existingFriends.map((friend) => friend.id),
    [existingFriends],
  )

  useEffect(() => {
    
  }, [existingFriends]);

  const excludeUserIds = currentUser ? [currentUser.id] : [];

  const handleAddFriends = () => {
    if (!currentUser) return;

    const newFriendships: FriendshipDoc[] = selectedUsers.map((user) => ({
      senderId: currentUser?.id,
      receiverId: user.id,
      status: FriendshipStatus.PENDING,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
      userIds: [user.id, user.id],
    }));

    addFriends(newFriendships);
    console.log(newFriendships);
  }

  return (
    <Dialog>
      <DialogTrigger render={<Button>Add Friend</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
          <DialogDescription>
            Search for a player by name, username or email.
          </DialogDescription>
        </DialogHeader>
        <UserPicker
          selectedUsers={selectedUsers}
          onSelectionChange={setSelectedUsers}
          onSearch={searchUsersService}
          excludeUserIds={excludeUserIds}
          lockedUserIds={lockedUserIds}
        />
        <DialogFooter>
        <Button onClick={handleAddFriends} disabled={selectedUsers.length === 0}>Add Friends</Button>
      </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default NewFriendDialog