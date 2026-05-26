import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/_layout')({
  component: LayoutComponent,
})

function LayoutComponent() {
  return (
    <div className="protected-layout h-full w-full flex flex-col gap-4">
      <main className="p-6">
        {/* KRITIKUS: Ez az Outlet mondja meg a routernek, 
            hogy a _layout.clubs.tsx tartalma pontosan ide kerüljön be! */}
        <Outlet /> 
      </main>
    </div>
  )
}