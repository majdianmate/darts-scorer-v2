import { createFileRoute } from '@tanstack/react-router'
import ClubsLayout from '@/features/clubs/ClubsLayout'

export const Route = createFileRoute('/(protected)/_layout/clubs')({
  component: ClubsLayout,
})
