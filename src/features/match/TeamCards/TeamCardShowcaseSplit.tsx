import { type FC } from 'react'
import type { MockTeamCardData } from '#/utils/mock'
import { LegWinSplitRail } from './leg-win-segments'
import { ShowcaseFrostCard } from './ShowcaseFrostCard'

interface Props {
  team: MockTeamCardData
}

/** Split pane — score left, leg rail right. */
const TeamCardShowcaseSplit: FC<Props> = ({ team }) => {
  const accent = team.color

  return (
    <ShowcaseFrostCard
      team={team}
      scoreSlot={
        <div className="flex h-full w-full max-w-sm items-stretch px-3">
          <div className="flex min-w-0 flex-1 items-center justify-center">
            <p
              className="font-sans font-black tabular-nums leading-none tracking-[-0.06em] text-white"
              style={{
                fontSize: 'clamp(3.5rem, 18vh, 6.5rem)',
                textShadow: `0 0 32px ${accent}66, 0 2px 8px rgba(0,0,0,0.45)`,
              }}
            >
              {team.remainingScore}
            </p>
          </div>

          <div className="mx-3 w-px shrink-0 self-stretch bg-gradient-to-b from-transparent via-white/15 to-transparent" />

          <div className="flex shrink-0 items-center py-2">
            <LegWinSplitRail won={team.legsWon} target={team.legsTarget} color={accent} />
          </div>
        </div>
      }
    />
  )
}

export default TeamCardShowcaseSplit
