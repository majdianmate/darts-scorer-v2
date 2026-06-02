import { type FC } from 'react'
import type { MockTeamCardData } from '#/utils/mock'
import { LegWinWedgeBurst } from './leg-win-segments'
import { ShowcaseFrostCard } from './ShowcaseFrostCard'

interface Props {
  team: MockTeamCardData
}

/** Radial wedge burst behind score — won legs only. */
const TeamCardShowcaseWedge: FC<Props> = ({ team }) => {
  const accent = team.color

  return (
    <ShowcaseFrostCard
      team={team}
      scoreSlot={
        <div className="relative flex h-full w-full flex-col items-center justify-center">
          <LegWinWedgeBurst won={team.legsWon} target={team.legsTarget} color={accent} />

          <p
            className="relative z-10 font-sans font-black tabular-nums leading-none tracking-[-0.05em] text-white"
            style={{
              fontSize: 'clamp(3.5rem, 17vh, 6.25rem)',
              textShadow: `0 0 36px ${accent}88, 0 2px 8px rgba(0,0,0,0.5)`,
            }}
          >
            {team.remainingScore}
          </p>

          <p
            className="relative z-10 mt-3 text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: `${accent}cc` }}
          >
            {team.legsWon} of {team.legsTarget} legs
          </p>
        </div>
      }
    />
  )
}

export default TeamCardShowcaseWedge
