import { type FC } from 'react'
import { useRouterState } from '@tanstack/react-router'
import {
  Building2,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Swords,
  UserPlus,
} from 'lucide-react'

import { cn } from '#/lib/utils'
import { useClubs } from '../../../hooks/use-club'
import { useFriends } from '../../../hooks/use-friend'
import { useUser } from '../../../hooks/use-user'
import { useSidebarCollapsed } from '../../../store/ui-store'

import SidebarMenu from './SidebarMenu'
import SidebarMenuItem from './SidebarMenuItem'
import SidebarThemeToggle from './SidebarThemeToggle'
import SidebarUserPanel from './SidebarUserPanel'
import { isNavActive } from './sidebar-utils'

const Sidebar: FC = () => {
  const { user } = useUser()
  const collapsed = useSidebarCollapsed()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const { incomingClubInvites } = useClubs(user)
  const { pendingRequests } = useFriends(user?.id ?? '')

  const clubInviteCount = incomingClubInvites?.length ?? 0
  const friendRequestCount = pendingRequests.length

  if (!user) return null

  return (
    <aside
      className={cn(
        'flex h-full shrink-0 flex-col bg-background text-foreground transition-[width] duration-200',
        collapsed ? 'w-0 overflow-hidden' : 'w-64',
      )}
      aria-hidden={collapsed}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-3 py-4 [scrollbar-width:thin]">
        <SidebarMenu label="Main">
          <SidebarMenuItem
            to="/dashboard"
            label="Dashboard"
            icon={<LayoutDashboard className="size-4" />}
            isActive={isNavActive(pathname, '/dashboard')}
          />
          <SidebarMenuItem
            to="/matches"
            label="Matches"
            icon={<Swords className="size-4" />}
            isActive={isNavActive(pathname, '/matches')}
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
            icon={<UserPlus className="size-4" />}
            isActive={isNavActive(pathname, '/friends')}
            badgeCount={friendRequestCount}
          />
        </SidebarMenu>

        <SidebarMenu label="Secondary">
          <SidebarMenuItem
            to="/settings"
            label="Settings"
            icon={<Settings className="size-4" />}
            isActive={isNavActive(pathname, '/settings')}
          />
          <SidebarMenuItem
            to="/feedback"
            label="Feedback"
            icon={<MessageSquare className="size-4" />}
            isActive={isNavActive(pathname, '/feedback')}
          />
          <SidebarMenuItem
            to="/patch-notes"
            label="Patch Notes"
            icon={<FileText className="size-4" />}
            isActive={isNavActive(pathname, '/patch-notes')}
          />
        </SidebarMenu>
      </div>

      <div className="flex shrink-0 flex-col gap-3 border-t border-sidebar-border px-3 py-3">
        <SidebarThemeToggle />
        <SidebarUserPanel user={user} />
      </div>
    </aside>
  )
}

export default Sidebar
