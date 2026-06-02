import { type FC } from 'react'
import type { MockTeamCardData } from '#/utils/mock'
import { StackFanCard } from './StackFanCard'

interface Props {
  team: MockTeamCardData
}

/** Filled vs empty pips — one dot per leg needed to win. */
const TeamCardStackFanLegPips: FC<Props> = ({ team }) => (
  <StackFanCard
    team={team}
    legWinIndicator={
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
          First to {team.legsTarget}
        </p>
        <div className="flex items-center gap-[clamp(0.35rem,1vw,0.55rem)]">
          {Array.from({ length: team.legsTarget }, (_, i) => {
            const won = i < team.legsWon
            return (
              <span
                key={i}
                className="rounded-full transition-all"
                style={{
                  width: 'clamp(0.65rem, 1.8vh, 0.85rem)',
                  height: 'clamp(0.65rem, 1.8vh, 0.85rem)',
                  backgroundColor: won ? team.color : 'transparent',
                  boxShadow: won ? `0 0 12px ${team.color}88` : undefined,
                  border: `2px solid ${won ? team.color : `${team.color}44`}`,
                }}
              />
            )
          })}
        </div>
        <span className="text-xs font-bold tabular-nums" style={{ color: team.color }}>
          {team.legsWon}/{team.legsTarget}
        </span>
      </div>
    }
  />
)

export default TeamCardStackFanLegPips
