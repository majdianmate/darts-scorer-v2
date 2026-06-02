import { type FC } from 'react'
import type { MockTeamCardData } from '#/utils/mock'
import { StackFanCard } from './StackFanCard'

interface Props {
  team: MockTeamCardData
}

/** Chunky horizontal steps — each leg is a block. */
const TeamCardStackFanLegSteps: FC<Props> = ({ team }) => (
  <StackFanCard
    team={team}
    legWinIndicator={
      <div>
        <p className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          Legs to win · first to {team.legsTarget}
        </p>
        <div className="flex gap-1">
          {Array.from({ length: team.legsTarget }, (_, i) => {
            const won = i < team.legsWon
            const isNext = i === team.legsWon
            return (
              <div
                key={i}
                className="flex flex-1 flex-col items-center gap-1 py-1"
              >
                <div
                  className="w-full rounded-md transition-all"
                  style={{
                    height: 'clamp(0.45rem, 1.2vh, 0.65rem)',
                    backgroundColor: won ? team.color : 'var(--muted)',
                    boxShadow: isNext && team.isCurrentTeam
                      ? `0 0 12px ${team.color}`
                      : won
                        ? `0 0 8px ${team.color}55`
                        : undefined,
                    opacity: won ? 1 : isNext ? 0.85 : 0.45,
                  }}
                />
                <span
                  className="text-[9px] font-bold tabular-nums"
                  style={{ color: won ? team.color : undefined }}
                >
                  {won ? '✓' : i + 1}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    }
  />
)

export default TeamCardStackFanLegSteps
