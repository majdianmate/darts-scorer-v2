import { useState, type FC } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { Building2, Settings, Target, Users } from 'lucide-react'

import { cn } from '#/lib/utils'
import CreateClubDialog from '#/features/clubs/ClubCreator/CreateClubDialog'
import { useClubs } from '../../../hooks/use-club'
import { useFriends } from '../../../hooks/use-friend'
import { useUser } from '../../../hooks/use-user'

import SidebarClubsSection from './SidebarClubsSection'
import SidebarContent from './SidebarContent'
import SidebarFooter from './SidebarFooter'
import SidebarHeader from './SidebarHeader'
import SidebarMenu from './SidebarMenu'
import SidebarMenuItem from './SidebarMenuItem'
import SidebarSecondaryMenu from './SidebarSecondaryMenu'
import SidebarUserPanel from './SidebarUserPanel'
import { useSidebarLayout } from './SidebarLayoutContext'
import { isNavActive } from './sidebar-utils'

const Sidebar: FC = () => {
  const { user } = useUser()
  const { clubs, isGetClubsLoading, incomingClubInvites } = useClubs(user)
  const { pendingRequests } = useFriends(user?.id ?? '')
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const { collapsed } = useSidebarLayout()
  const [createClubOpen, setCreateClubOpen] = useState(false)

  const clubInviteCount = incomingClubInvites?.length ?? 0
  const friendRequestCount = pendingRequests.length

  if (!user) return null

  return (
    <>
      <CreateClubDialog
        open={createClubOpen}
        onOpenChange={setCreateClubOpen}
      />

      <aside
        className={cn(
          'flex h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200',
          collapsed ? 'w-0 overflow-hidden border-r-0' : 'w-64',
        )}
        aria-hidden={collapsed}
      >
        <SidebarHeader>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Target className="size-4" />
            </div>
            <span className="truncate font-bold tracking-tight">
              Darts Scorer
            </span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu label="Menu">
            <SidebarMenuItem
              to="/match"
              label="Match"
              icon={<Target className="size-4" />}
              isActive={isNavActive(pathname, '/match')}
            />
            <SidebarMenuItem
              to="/clubs"
              label="Clubs"
              icon={<Building2 className="size-4" />}
              isActive={isNavActive(pathname, '/clubs')}
              badgeCount={clubInviteCount}
            />
            <SidebarMenuItem
              to="/friends"
              label="Friends"
              icon={<Users className="size-4" />}
              isActive={isNavActive(pathname, '/friends')}
              badgeCount={friendRequestCount}
            />
            <SidebarMenuItem
              to="/settings"
              label="Settings"
              icon={<Settings className="size-4" />}
              isActive={isNavActive(pathname, '/settings')}
            />
          </SidebarMenu>
          
          <SidebarSecondaryMenu />

          <SidebarClubsSection
            clubs={clubs}
            isLoading={isGetClubsLoading}
            onCreateClub={() => setCreateClubOpen(true)}
          />
        </SidebarContent>

        <SidebarFooter>
          <SidebarUserPanel user={user} />
        </SidebarFooter>
      </aside>
    </>
  )
}

export default Sidebar
