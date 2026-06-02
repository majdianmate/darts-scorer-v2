import { useEffect, useState, type FC } from 'react'
import { useRouterState } from '@tanstack/react-router'
import {
  Building2,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Target,
  Users,
} from 'lucide-react'

import { Button } from '#/components/ui/button'
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
import { isNavActive, readSidebarCollapsed, writeSidebarCollapsed } from './sidebar-utils'

const Sidebar: FC = () => {
  const { user } = useUser()
  const { clubs, isGetClubsLoading, incomingClubInvites } = useClubs(user)
  const { pendingRequests } = useFriends(user?.id ?? '')
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  const [collapsed, setCollapsed] = useState(false)
  const [createClubOpen, setCreateClubOpen] = useState(false)

  useEffect(() => {
    setCollapsed(readSidebarCollapsed())
  }, [])

  const toggleCollapsed = () => {
    setCollapsed((current) => {
      const next = !current
      writeSidebarCollapsed(next)
      return next
    })
  }

  const clubInviteCount = incomingClubInvites?.length ?? 0
  const friendRequestCount = pendingRequests.length

  if (!user) return null

  return (
    <>
      <CreateClubDialog
        open={createClubOpen}
        onOpenChange={setCreateClubOpen}
      />

      {collapsed ? (
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="fixed left-3 top-3 z-40 shadow-md"
          onClick={toggleCollapsed}
          aria-label="Open sidebar"
        >
          <PanelLeftOpen className="size-4" />
        </Button>
      ) : null}

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
            <span className="truncate font-bold tracking-tight">Darts Scorer</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-sidebar-foreground/60"
            onClick={toggleCollapsed}
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="size-4" />
          </Button>
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

          <SidebarClubsSection
            clubs={clubs}
            isLoading={isGetClubsLoading}
            onCreateClub={() => setCreateClubOpen(true)}
          />

          <SidebarSecondaryMenu />
        </SidebarContent>

        <SidebarFooter>
          <SidebarUserPanel user={user} />
        </SidebarFooter>
      </aside>
    </>
  )
}

export default Sidebar
