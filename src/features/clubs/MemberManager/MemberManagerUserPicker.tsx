import { type FC } from 'react'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsContents,
} from '@/components/animate-ui/components/animate/tabs'
import UserPicker from '#/components/UserPicker'
import type { UserPickerGuest, UserPickerItem } from '#/components/UserPicker/user-picker-types'
import { cn } from '#/lib/utils.ts'
import { useUser } from '../../../../hooks/use-user'
import { useFriends } from '../../../../hooks/use-friend'
import { searchUsersService } from '../../../../services/user-service'
import MemberManagerGuestPicker from './MemberManagerGuestPicker'

interface MemberManagerUserPickerProps {
  selectedItems: UserPickerItem[]
  onSelectedItemsChange: (items: UserPickerItem[]) => void
  lockedUserIds: string[]
  className?: string
}

const MemberManagerUserPicker: FC<MemberManagerUserPickerProps> = ({
  selectedItems,
  onSelectedItemsChange,
  lockedUserIds,
  className,
}) => {
  const { user } = useUser()
  const { friends } = useFriends(user?.id ?? '')

  const handleAddGuest = (guest: UserPickerGuest) => {
    onSelectedItemsChange([...selectedItems, guest])
  }

  return (
    <div className={cn('flex h-full min-h-0 flex-col', className)}>
      <div className="shrink-0">
        <h3 className="text-sm font-semibold text-foreground">
          Invite members
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Search globally, pick friends, or add guests. Already in the club or
          invited players are locked.
        </p>
      </div>

      <Tabs className="mt-4 flex min-h-0 flex-1 flex-col">
        <TabsList defaultValue="global" className="relative shrink-0">
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="guests">Guests</TabsTrigger>
        </TabsList>
        <TabsContents>
          <TabsContent value="global">
            <UserPicker<UserPickerItem>
              fillHeight
              selectedUsers={selectedItems}
              onSelectionChange={onSelectedItemsChange}
              onSearch={searchUsersService}
              excludeUserIds={[user?.id ?? '']}
              lockedUserIds={lockedUserIds}
            />
          </TabsContent>
          <TabsContent value="friends">
            <UserPicker<UserPickerItem>
              fillHeight
              selectedUsers={selectedItems}
              onSelectionChange={onSelectedItemsChange}
              source={friends.map((friend) => friend.friend)}
              lockedUserIds={lockedUserIds}
            />
          </TabsContent>
          <TabsContent value="guests">
            <MemberManagerGuestPicker
              selectedItems={selectedItems}
              onAddGuest={handleAddGuest}
            />
          </TabsContent>
        </TabsContents>
      </Tabs>
    </div>
  )
}

export default MemberManagerUserPicker
