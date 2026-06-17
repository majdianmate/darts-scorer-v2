import Clubs from '#/features/clubs/clubs'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/clubs/')({
  component: Clubs,
})
