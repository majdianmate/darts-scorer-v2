import { type FC } from 'react'
import type { MockTeamCardData } from '#/utils/mock'
import { legsRemaining, StackFanCard } from './StackFanCard'

interface Props {
  team: MockTeamCardData
}

/** Bold fraction + arc ring showing progress toward match win. */
const TeamCardStackFanLegArc: FC<Props> = ({ team }) => {
  const pct = team.legsWon / team.legsTarget
  const circumference = 2 * Math.PI * 18
  const offset = circumference * (1 - pct)
  const remaining = legsRemaining(team)

  return (
    <StackFanCard
      team={team}
      legWinIndicator={
        <div className="flex items-center gap-4">
          <div className="relative size-11 shrink-0">
            <svg className="size-full -rotate-90" viewBox="0 0 44 44">
              <circle
                cx="22"
                cy="22"
                r="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-muted"
              />
              <circle
                cx="22"
                cy="22"
                r="18"
                fill="none"
                stroke={team.color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ filter: `drop-shadow(0 0 6px ${team.color}88)` }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black tabular-nums">
              {team.legsWon}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Match legs
            </p>
            <p className="font-sans text-xl font-black tabular-nums leading-tight">
              {team.legsWon}
              <span className="text-base font-normal text-muted-foreground">
                {' '}
                / {team.legsTarget}
              </span>
            </p>
            <p className="text-[10px] text-muted-foreground">
              {remaining === 0 ? (
                <span className="font-semibold" style={{ color: team.color }}>
                  On match point
                </span>
              ) : (
                <>Need {remaining} more to win</>
              )}
            </p>
          </div>
        </div>
      }
    />
  )
}

export default TeamCardStackFanLegArc
