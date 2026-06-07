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
  const {
    collapsed,
    toggleCollapsed,
    pageTitleOverride,
    pageHeaderToolbar,
    registerPageHeaderCenterEl,
  } = useSidebarLayout()

  const title = pageTitleOverride ?? resolvePageTitle(pathname)
  const isLiveMatchPage =
    pathname.startsWith('/match/') &&
    pathname !== '/match/' &&
    pathname.length > '/match/'.length

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

      <h1 className="max-w-[10rem] shrink-0 truncate text-sm font-medium text-foreground sm:max-w-[14rem]">
        {title}
      </h1>

      {isLiveMatchPage ? (
        <>
          <div
            ref={registerPageHeaderCenterEl}
            className="flex min-w-0 flex-1 justify-center px-2"
          />
          <div className="flex shrink-0 items-center gap-2">
            {pageHeaderToolbar}
          </div>
        </>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {pageHeaderToolbar}
        </div>
      )}
    </header>
  )
}

export default AppPageHeader
