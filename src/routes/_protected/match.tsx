import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/match')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/match"!</div>
}
