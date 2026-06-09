import { createFileRoute, Outlet } from '@tanstack/react-router'

import AppPageHeader from '#/components/Sidebar/AppPageHeader'
import { Sidebar } from '#/components/Sidebar'
import { SidebarLayoutProvider } from '#/components/Sidebar/SidebarLayoutContext'
import { cn } from '#/lib/utils'
import { useSidebarCollapsed } from '../../../store/ui-store'

export const Route = createFileRoute('/(protected)/_layout')({
  component: LayoutComponent,
})

function LayoutComponent() {
  const collapsed = useSidebarCollapsed()

  return (
    <SidebarLayoutProvider>
      <div className="flex h-screen min-h-0 w-full overflow-hidden bg-background text-foreground">
        <Sidebar />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background">
          <AppPageHeader />
          <div
            className={cn(
              'flex min-h-0 min-w-0 flex-1 flex-col bg-muted',
              !collapsed && 'rounded-tl-2xl',
            )}
          >
            <main className="flex min-h-0 flex-1 flex-col overflow-hidden p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </SidebarLayoutProvider>
  )
}
