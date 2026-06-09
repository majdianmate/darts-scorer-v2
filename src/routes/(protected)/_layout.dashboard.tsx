import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/_layout/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">
        Welcome back. Your stats and recent activity will appear here.
      </p>
    </div>
  )
}
