import { type FC } from 'react'
import type { User } from '../../../../types/user-types'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsContents,
} from '@/components/animate-ui/components/animate/tabs'
import UserPicker from '#/components/UserPicker'
import { cn } from '#/lib/utils.ts'
import { useUser } from '../../../../hooks/use-user'
import { useFriends } from '../../../../hooks/use-friend'
import { searchUsersService } from '../../../../services/user-service'

interface ClubCreatorMemberSelectorProps {
  selectedUsers: User[]
  onSelectedUsersChange: (users: User[]) => void
  className?: string
}

const ClubCreatorMemberSelector: FC<ClubCreatorMemberSelectorProps> = ({
  selectedUsers,
  onSelectedUsersChange,
  className,
}) => {
  const { user } = useUser()
  const { friends } = useFriends(user?.id ?? '')

  return (
    <div className={cn('flex h-full min-h-0 flex-col', className)}>
      <div className="shrink-0">
        <h3 className="text-sm font-semibold text-foreground">
          Invite members
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Search globally or pick from your friends.
        </p>
      </div>

      <Tabs className="mt-4 flex min-h-0 flex-1 flex-col">
        <TabsList defaultValue="global" className="relative shrink-0">
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
        </TabsList>
        <TabsContents>
        <TabsContent value="global">
          <UserPicker
            fillHeight
            selectedUsers={selectedUsers}
            onSelectionChange={onSelectedUsersChange}
            onSearch={searchUsersService}
            excludeUserIds={[user?.id ?? '']}
          />
        </TabsContent>
        <TabsContent value="friends">
          <UserPicker
            fillHeight
            selectedUsers={selectedUsers}
            onSelectionChange={onSelectedUsersChange}
            source={friends.map((friend) => friend.friend)}
          />
        </TabsContent>
        </TabsContents>
      </Tabs>
    </div>
  )
}

export default ClubCreatorMemberSelector
