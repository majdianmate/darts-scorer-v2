import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/_layout/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-2">
      <p className="text-sm text-muted-foreground">
        Account and app preferences will live here.
      </p>
    </div>
  )
}
