import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import UserPicker from '#/components/UserPicker'
import { useFriends } from '../../../../hooks/use-friend'
import { useUser } from '../../../../hooks/use-user'
import { searchUsersService } from '../../../../services/user-service'
import type { User } from '../../../../types/user-types'

const NewFriendDialog = () => {
  const { user } = useUser()
  const { friends } = useFriends(user?.id ?? '')
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
    setSelectedUsers(existingFriends)
  }, [existingFriends])

  const excludeUserIds = user ? [user.id] : []

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
      </DialogContent>
    </Dialog>
  )
}

export default NewFriendDialog
