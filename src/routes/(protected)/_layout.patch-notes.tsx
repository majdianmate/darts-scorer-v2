import { createFileRoute } from '@tanstack/react-router'

import PatchNotes from '#/features/patch-notes/PatchNotes'

export const Route = createFileRoute('/(protected)/_layout/patch-notes')({
  component: PatchNotesPage,
})

function PatchNotesPage() {
  return <PatchNotes />
}
