import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/_layout/matches')({
  component: MatchesPage,
})

function MatchesPage() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">
        Start a new match or continue an existing one.
      </p>
    </div>
  )
}
