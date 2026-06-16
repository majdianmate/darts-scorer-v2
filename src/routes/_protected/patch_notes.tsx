import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/patch_notes')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/patch_notes"!</div>
}
