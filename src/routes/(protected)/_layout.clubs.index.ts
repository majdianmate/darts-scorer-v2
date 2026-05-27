import { createFileRoute } from '@tanstack/react-router'
import Clubs from '@/features/clubs/clubs'

export const Route = createFileRoute('/(protected)/_layout/clubs/')({
  component: Clubs,
})
