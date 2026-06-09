import { type FC } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { PanelLeft } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'
import {
  toggleSidebarCollapsed,
  useSidebarCollapsed,
} from '../../../store/ui-store'

import { useSidebarLayout } from './SidebarLayoutContext'
import { resolvePageTitle } from './resolve-page-title'

const AppPageHeader: FC = () => {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const collapsed = useSidebarCollapsed()
  const { pageTitleOverride, pageHeaderToolbar } = useSidebarLayout()

  const title = pageTitleOverride ?? resolvePageTitle(pathname)

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 px-4">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={cn('shrink-0 text-muted-foreground')}
        onClick={toggleSidebarCollapsed}
        aria-label={collapsed ? 'Open sidebar' : 'Close sidebar'}
      >
        <PanelLeft className="size-4" />
      </Button>

      <h1 className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
        {title}
      </h1>

      {pageHeaderToolbar ? (
        <div className="flex shrink-0 items-center gap-2">{pageHeaderToolbar}</div>
      ) : null}
    </header>
  )
}

export default AppPageHeader
