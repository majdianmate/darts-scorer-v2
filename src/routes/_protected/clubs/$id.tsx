import Club from '#/features/clubs/components/[club]/Club'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/clubs/$id')({
  component: Club,
})
