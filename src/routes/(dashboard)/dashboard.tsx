import { createFileRoute } from '@tanstack/react-router'
import { useUser } from '../../../hooks/use-user';

export const Route = createFileRoute('/(dashboard)/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useUser();
  return <div>{user?.id}</div>
}
