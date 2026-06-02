import { createFileRoute, Outlet } from '@tanstack/react-router'

import AppPageHeader from '#/components/Sidebar/AppPageHeader'
import { Sidebar } from '#/components/Sidebar'
import { SidebarLayoutProvider } from '#/components/Sidebar/SidebarLayoutContext'

export const Route = createFileRoute('/(protected)/_layout')({
  component: LayoutComponent,
})

function LayoutComponent() {
  return (
    <SidebarLayoutProvider>
      <div className="flex h-screen min-h-0 w-full overflow-hidden bg-background text-foreground">
        <Sidebar />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <AppPageHeader />
          <main className="min-h-0 flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarLayoutProvider>
  )
}
