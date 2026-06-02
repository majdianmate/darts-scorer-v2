import { createFileRoute, Outlet } from '@tanstack/react-router'

import { Sidebar } from '#/components/Sidebar'

export const Route = createFileRoute('/(protected)/_layout')({
  component: LayoutComponent,
})

function LayoutComponent() {
  return (
    <div className="flex h-screen min-h-0 w-full overflow-hidden bg-background text-foreground">
      <Sidebar />
      <main className="min-h-0 min-w-0 flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
