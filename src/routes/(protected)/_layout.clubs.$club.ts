import { createFileRoute } from '@tanstack/react-router'
import Club from '@/features/clubs/club/Club'

export const Route = createFileRoute('/(protected)/_layout/clubs/$club')({
  component: Club,
})
