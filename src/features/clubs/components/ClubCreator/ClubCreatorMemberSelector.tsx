import { type FC } from 'react'
import type { User } from '#/features/authentication/types/user-types'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsContents,
} from '@/components/animate-ui/components/animate/tabs'
import { cn } from '#/lib/utils.ts'
import { useAuthentication } from '#/features/authentication/hooks/use-authentication'
import { searchUsersService } from '#/features/authentication/service/user-service'
import { Globe, Users } from 'lucide-react'
import UserPicker from '#/components/UserPicker'

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
  const { user } = useAuthentication()

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
          <TabsTrigger value="global" className="gap-1.5">
            <Globe className="size-3.5" />
            Global
          </TabsTrigger>
          <TabsTrigger value="friends" className="gap-1.5">
            <Users className="size-3.5" />
            Friends
          </TabsTrigger>
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
          />
        </TabsContent>
        </TabsContents>
      </Tabs>
    </div>
  )
}

export default ClubCreatorMemberSelector
