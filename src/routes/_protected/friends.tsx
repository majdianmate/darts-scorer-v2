import Friends from '#/features/friends/friends'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/friends')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <Friends />
  </div>
}
