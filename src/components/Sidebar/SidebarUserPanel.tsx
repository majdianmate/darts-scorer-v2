import { type FC } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'

import Avatar from '#/components/Avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { cn } from '#/lib/utils'
import { useUser } from '../../../hooks/use-user'
import type { User } from '../../../types/user-types'

type SidebarUserPanelProps = {
  user: User
}

const SidebarUserPanel: FC<SidebarUserPanelProps> = ({ user }) => {
  const navigate = useNavigate()
  const { logout, isLogoutLoading } = useUser()

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/sign-in' })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors',
          'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        )}
      >
        <Avatar name={user.name} image={user.image} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-sidebar-foreground">
            {user.name}
          </p>
          <p className="truncate text-xs text-sidebar-foreground/70">
            {user.email}
          </p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            disabled={isLogoutLoading}
            onClick={handleLogout}
          >
            <LogOut />
            {isLogoutLoading ? 'Signing out…' : 'Log out'}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SidebarUserPanel
