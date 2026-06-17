import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/clubs')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
