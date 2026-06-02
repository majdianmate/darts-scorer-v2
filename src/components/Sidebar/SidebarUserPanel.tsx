import { type FC } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ChevronUp, Loader2, LogOut } from 'lucide-react'

import Avatar from '#/components/Avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { cn } from '#/lib/utils'
import { useUser } from '../../../hooks/use-user'
import type { User } from '../../../types/user-types'

type SidebarUserPanelProps = {
  user: User
  collapsed?: boolean
}

const SidebarUserPanel: FC<SidebarUserPanelProps> = ({ user, collapsed }) => {
  const { logout, isLogoutLoading } = useUser()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    void navigate({ to: '/sign-in' })
  }

  const triggerClassName = collapsed
    ? 'flex size-10 items-center justify-center rounded-lg outline-none hover:bg-sidebar-accent/50 data-popup-open:bg-sidebar-accent/30'
    : cn(
        'flex w-full items-center gap-2.5 rounded-none px-3 py-3 text-left outline-none',
        'hover:bg-sidebar-accent/50 data-popup-open:bg-sidebar-accent/30',
      )

  return (
    <div className="border-t border-sidebar-border p-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className={triggerClassName}
              aria-label="Account menu"
            >
              <Avatar name={user.name} image={user.image} size="sm" />
              {!collapsed ? (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-sidebar-foreground">
                      {user.name}
                    </p>
                    {user.username ? (
                      <p className="truncate text-xs text-sidebar-foreground/50">
                        @{user.username}
                      </p>
                    ) : null}
                  </div>
                  <ChevronUp className="size-4 shrink-0 text-sidebar-foreground/45 transition-transform data-popup-open:rotate-180" />
                </>
              ) : null}
            </button>
          }
        />

        <DropdownMenuContent
          side="top"
          align={collapsed ? 'center' : 'start'}
          sideOffset={6}
          className="min-w-[calc(var(--anchor-width)+0.5rem)]"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-normal">
              <p className="truncate text-sm font-medium text-foreground">
                {user.name}
              </p>
              {user.username ? (
                <p className="truncate text-xs text-muted-foreground">
                  @{user.username}
                </p>
              ) : null}
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              variant="destructive"
              disabled={isLogoutLoading}
              onClick={() => void handleLogout()}
            >
              {isLogoutLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <LogOut className="size-4" />
              )}
              Log out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default SidebarUserPanel
