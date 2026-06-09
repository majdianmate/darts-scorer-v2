import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/_layout/patch-notes')({
  component: PatchNotesPage,
})

function PatchNotesPage() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">
        Release notes and recent updates will be listed here.
      </p>
    </div>
  )
}
