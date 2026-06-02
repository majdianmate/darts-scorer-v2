import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/_layout/patch-notes')({
  component: PatchNotesPage,
})

function PatchNotesPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Patch notes</h1>
        <p className="text-sm text-muted-foreground">
          What changed in recent releases.
        </p>
      </div>
      <article className="rounded-xl border border-border/60 bg-card/50 p-4">
        <h2 className="font-semibold">Latest</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Collapsible sidebar navigation</li>
          <li>3-dart average statistics</li>
          <li>Checkout flow for dart counts</li>
          <li>Full-screen score display with confetti</li>
        </ul>
      </article>
    </div>
  )
}
