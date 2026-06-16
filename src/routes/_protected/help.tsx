import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/help')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/help"!</div>
}
