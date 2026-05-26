import { useMemo } from 'react'
import UserPicker from '#/components/UserPicker'
import { Label } from '#/components/ui/label'
import { useFriends } from '../../../../../hooks/use-friend'
import { useUser } from '../../../../../hooks/use-user'
import { searchUsersService } from '../../../../../services/user-service'
import type { User } from '../../../../../types/user-types.ts'
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from '@/components/animate-ui/components/animate/tabs'

interface ClubCreatorMembersProps {
  members: User[]
  setMembers: (members: User[]) => void
}

const ClubCreatorMembers = ({ members, setMembers }: ClubCreatorMembersProps) => {
  const { user } = useUser()
  const { friends } = useFriends(user?.id ?? '')

  const excludeUserIds = user ? [user.id] : []
  const friendUsers = useMemo(
    () => friends.map(({ friend }) => friend),
    [friends],
  )

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="space-y-1">
        <Label>Members</Label>
        <p className="text-sm text-muted-foreground">
          Invite players to join your club.
        </p>
      </div>

      <Tabs defaultValue="global">
        <TabsList>
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
        </TabsList>
        <TabsContents>
          <TabsContent value="global">
            <UserPicker
              selectedUsers={members}
              onSelectionChange={setMembers}
              onSearch={searchUsersService}
              excludeUserIds={excludeUserIds}
            />
          </TabsContent>
          <TabsContent value="friends">
            <UserPicker
              selectedUsers={members}
              onSelectionChange={setMembers}
              source={friendUsers}
              excludeUserIds={excludeUserIds}
              emptyMessage="No matching friends."
            />
          </TabsContent>
        </TabsContents>
      </Tabs>
    </div>
  )
}

export default ClubCreatorMembers
