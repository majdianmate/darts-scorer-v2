import { type FC } from 'react'
import type { MockTeamCardData } from '#/utils/mock'
import { LegWinChips, LegWinStadium } from './leg-win-segments'
import { ShowcaseFrostCard } from './ShowcaseFrostCard'

interface Props {
  team: MockTeamCardData
}

/** Score hero + stadium semicircle gauge + leg chips. */
const TeamCardShowcaseStadium: FC<Props> = ({ team }) => {
  const accent = team.color

  return (
    <ShowcaseFrostCard
      team={team}
      scoreSlot={
        <div className="flex h-full w-full flex-col items-center justify-end gap-1 pb-1">
          <p
            className="font-sans font-black tabular-nums leading-none tracking-[-0.05em] text-white"
            style={{
              fontSize: 'clamp(3rem, 15vh, 5.5rem)',
              textShadow: `0 0 28px ${accent}66, 0 2px 8px rgba(0,0,0,0.45)`,
            }}
          >
            {team.remainingScore}
          </p>

          <LegWinStadium won={team.legsWon} target={team.legsTarget} color={accent} />

          <LegWinChips won={team.legsWon} target={team.legsTarget} color={accent} />
        </div>
      }
    />
  )
}

export default TeamCardShowcaseStadium
