import {
  Award,
  Crown,
  Crosshair,
  Flag,
  Flame,
  Heart,
  Shield,
  Star,
  Swords,
  Target,
  Trophy,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react'

export const SQUAD_ICON_KEYS = [
  'users',
  'target',
  'trophy',
  'shield',
  'star',
  'zap',
  'flame',
  'crown',
  'flag',
  'crosshair',
  'award',
  'heart',
  'swords',
] as const

export type SquadIconKey = (typeof SQUAD_ICON_KEYS)[number]

export const squadIconRegistry: Record<SquadIconKey, LucideIcon> = {
  users: Users,
  target: Target,
  trophy: Trophy,
  shield: Shield,
  star: Star,
  zap: Zap,
  flame: Flame,
  crown: Crown,
  flag: Flag,
  crosshair: Crosshair,
  award: Award,
  heart: Heart,
  swords: Swords,
}

export const squadIconLabels: Record<SquadIconKey, string> = {
  users: 'Team',
  target: 'Target',
  trophy: 'Trophy',
  shield: 'Shield',
  star: 'Star',
  zap: 'Bolt',
  flame: 'Flame',
  crown: 'Crown',
  flag: 'Flag',
  crosshair: 'Crosshair',
  award: 'Award',
  heart: 'Heart',
  swords: 'Swords',
}

export const DEFAULT_SQUAD_ICON: SquadIconKey = 'users'

export function isSquadIconKey(value: string): value is SquadIconKey {
  return (SQUAD_ICON_KEYS as readonly string[]).includes(value)
}

export function getSquadIcon(key: string): LucideIcon {
  if (isSquadIconKey(key)) {
    return squadIconRegistry[key]
  }

  return squadIconRegistry[DEFAULT_SQUAD_ICON]
}
