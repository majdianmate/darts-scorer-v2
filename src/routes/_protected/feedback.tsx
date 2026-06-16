import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/feedback')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/feedback"!</div>
}
