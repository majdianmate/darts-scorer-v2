import { type FC } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { PanelLeft } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { Separator } from '#/components/ui/separator'
import { cn } from '#/lib/utils'

import { useSidebarLayout } from './SidebarLayoutContext'
import { resolvePageTitle } from './resolve-page-title'

const AppPageHeader: FC = () => {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const { collapsed, toggleCollapsed, pageTitleOverride, pageHeaderToolbar } =
    useSidebarLayout()

  const title = pageTitleOverride ?? resolvePageTitle(pathname)

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/60 px-4">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={cn('shrink-0 text-muted-foreground')}
        onClick={toggleCollapsed}
        aria-label={collapsed ? 'Open sidebar' : 'Close sidebar'}
      >
        <PanelLeft className="size-4" />
      </Button>
      <Separator
        orientation="vertical"
        className="h-4 shrink-0 !self-center"
      />

      <div className="flex min-w-0 flex-1 items-center gap-3">
        <h1 className="shrink-0 text-sm font-medium text-foreground">{title}</h1>
        {pageHeaderToolbar ? (
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {pageHeaderToolbar}
          </div>
        ) : null}
      </div>
    </header>
  )
}

export default AppPageHeader
