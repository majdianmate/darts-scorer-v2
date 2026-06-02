import { type FC } from 'react'
import type { MockTeamCardData } from '#/utils/mock'
import { legsRemaining, StackFanCard } from './StackFanCard'

interface Props {
  team: MockTeamCardData
}

/** Full-width progress track. */
const TeamCardStackFanLegBar: FC<Props> = ({ team }) => {
  const pct = Math.min(100, (team.legsWon / team.legsTarget) * 100)
  const remaining = legsRemaining(team)

  return (
    <StackFanCard
      team={team}
      legWinIndicator={
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Leg race
            </span>
            <span className="font-sans text-lg font-black tabular-nums leading-none">
              {team.legsWon}
              <span className="text-sm font-normal text-muted-foreground">
                /{team.legsTarget}
              </span>
            </span>
          </div>
          <div className="relative h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                backgroundColor: team.color,
                boxShadow: `0 0 16px ${team.color}66`,
              }}
            />
          </div>
          <p className="text-right text-[10px] text-muted-foreground">
            {remaining === 0 ? (
              <span style={{ color: team.color }} className="font-bold">
                Match point
              </span>
            ) : (
              <>
                <span className="font-bold tabular-nums" style={{ color: team.color }}>
                  {remaining}
                </span>{' '}
                leg{remaining !== 1 ? 's' : ''} to win
              </>
            )}
          </p>
        </div>
      }
    />
  )
}

export default TeamCardStackFanLegBar
