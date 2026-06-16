import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/friends')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/friends"!</div>
}
