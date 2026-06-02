import { type FC, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ChevronUp, Loader2, LogOut } from 'lucide-react'

import Avatar from '#/components/Avatar'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'
import { useUser } from '../../../hooks/use-user'
import type { User } from '../../../types/user-types'

type SidebarUserPanelProps = {
  user: User
  collapsed?: boolean
}

const SidebarUserPanel: FC<SidebarUserPanelProps> = ({ user, collapsed }) => {
  const [expanded, setExpanded] = useState(false)
  const { logout, isLogoutLoading } = useUser()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    void navigate({ to: '/sign-in' })
  }

  if (collapsed) {
    return (
      <div className="flex justify-center border-t border-sidebar-border p-2">
        <Avatar name={user.name} image={user.image} size="sm" />
      </div>
    )
  }

  return (
    <div className="border-t border-sidebar-border">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className={cn(
          'flex w-full items-center gap-2.5 px-3 py-3 text-left transition-colors',
          'hover:bg-sidebar-accent/50',
          expanded && 'bg-sidebar-accent/30',
        )}
        aria-expanded={expanded}
      >
        <Avatar name={user.name} image={user.image} size="sm" />
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
        <ChevronUp
          className={cn(
            'size-4 shrink-0 text-sidebar-foreground/45 transition-transform',
            !expanded && 'rotate-180',
          )}
        />
      </button>

      {expanded ? (
        <div className="border-t border-sidebar-border/60 px-2 pb-2 pt-1">
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start gap-2 text-sidebar-foreground/80"
            disabled={isLogoutLoading}
            onClick={() => void handleLogout()}
          >
            {isLogoutLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <LogOut className="size-4" />
            )}
            Log out
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export default SidebarUserPanel
