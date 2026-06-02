import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/_layout/help')({
  component: HelpPage,
})

function HelpPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-2">
      <p className="text-sm text-muted-foreground">
        Guides and FAQs for scoring, clubs, and matches.
      </p>
    </div>
  )
}
