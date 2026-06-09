import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/_layout/feedback')({
  component: FeedbackPage,
})

function FeedbackPage() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">
        Share ideas, report bugs, or suggest improvements.
      </p>
    </div>
  )
}
