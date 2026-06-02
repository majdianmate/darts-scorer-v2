import { type FC } from 'react'
import { cn } from '#/lib/utils'

interface Props {
  isCurrentTeam: boolean
  isNextTeam?: boolean
  color: string
  className?: string
}

/** Arena Spotlight-style turn badge — throwing pulse or up-next. */
export const TeamTurnIndicator: FC<Props> = ({
  isCurrentTeam,
  isNextTeam,
  color,
  className,
}) => {
  if (isCurrentTeam) {
    return (
      <div
        className={cn(
          'flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 backdrop-blur-md',
          className,
        )}
      >
        <span
          className="size-2 shrink-0 animate-pulse rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/90">
          Throwing
        </span>
      </div>
    )
  }

  if (isNextTeam) {
    return (
      <div
        className={cn(
          'flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 backdrop-blur-md',
          className,
        )}
      >
        <span
          className="size-2 shrink-0 rounded-full ring-2 ring-white/10"
          style={{ backgroundColor: `${color}88` }}
        />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
          Up next
        </span>
      </div>
    )
  }

  return null
}

export default TeamTurnIndicator
