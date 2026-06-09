import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Layers3 } from 'lucide-react'

const iconMap = LucideIcons as Record<string, LucideIcon>

function normalizeIconName(name: string) {
  const trimmed = name.trim()
  if (!trimmed) return ''

  if (iconMap[trimmed]) return trimmed

  const pascalCase = trimmed
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

  return pascalCase
}

export function resolveLucideIcon(name: string, fallback: LucideIcon = Layers3) {
  const normalized = normalizeIconName(name)
  return iconMap[normalized] ?? fallback
}

type LucideIconByNameProps = {
  name: string
  className?: string
  fallback?: LucideIcon
}

export function LucideIconByName({
  name,
  className,
  fallback,
}: LucideIconByNameProps) {
  const Icon = resolveLucideIcon(name, fallback)
  return <Icon className={className} />
}
