import { createFileRoute } from '@tanstack/react-router'
// Itt hívod be a feature mappából a kész oldaladat
import Friends from '@/features/friends/friends' 

export const Route = createFileRoute('/(protected)/_layout/friends')({
  component: Friends,
})