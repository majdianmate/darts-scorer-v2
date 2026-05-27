import { createFileRoute } from '@tanstack/react-router'
// Itt hívod be a feature mappából a kész oldaladat
import Clubs from '@/features/clubs/clubs' 

export const Route = createFileRoute('/(protected)/_layout/clubs')({
  component: Clubs,
})