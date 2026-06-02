import { type FC } from 'react'

import { cn } from '#/lib/utils'

import { accentAlpha } from './team-card-utils'

interface TeamCardRotatingBorderProps {
  accent: string
}

const TeamCardRotatingBorder: FC<TeamCardRotatingBorderProps> = ({ accent }) => {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-2xl isolate"
    >
      <div
        className={cn(
          'absolute left-1/2 top-1/2 size-[200%] -translate-x-1/2 -translate-y-1/2 opacity-75 motion-safe:animate-[spin_18s_linear_infinite] motion-reduce:animate-none',
        )}
        style={{
          background: `conic-gradient(from 0deg, transparent, ${accent}, transparent 28%, ${accentAlpha(accent, '88')} 48%, transparent 68%, ${accentAlpha(accent, '44')})`,
        }}
      />
    </div>
  )
}

export default TeamCardRotatingBorder
