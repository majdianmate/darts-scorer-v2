import { type FC } from 'react'
import type { MockTeamCardData } from '#/utils/mock'
import { LegWinSideLadder } from './leg-win-segments'
import { ShowcaseFrostCard } from './ShowcaseFrostCard'

interface Props {
  team: MockTeamCardData
}

/** Vertical leg rungs on the left — won colored, remainder gray. */
const TeamCardShowcaseRayLegs: FC<Props> = ({ team }) => {
  const accent = team.color

  return (
    <ShowcaseFrostCard
      team={team}
      scoreSlot={
        <div className="relative flex size-full items-center justify-center">
          <LegWinSideLadder won={team.legsWon} target={team.legsTarget} color={accent} />

          <p
            className="relative z-10 font-sans font-black tabular-nums leading-none tracking-[-0.05em] text-white"
            style={{
              fontSize: 'clamp(3.5rem, 16vh, 7.5rem)',
              textShadow: `0 0 32px ${accent}66, 0 2px 8px rgba(0,0,0,0.45)`,
            }}
          >
            {team.remainingScore}
          </p>
        </div>
      }
    />
  )
}

export default TeamCardShowcaseRayLegs
