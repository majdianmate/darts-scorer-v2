import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/_layout')({
  component: LayoutComponent,
})

function LayoutComponent() {
  return (
    <div className="h-full w-full flex flex-col gap-4 overflow-hidden text-foreground">
      <main className="p-6">
        <Outlet /> 
      </main>
    </div>
  )
}