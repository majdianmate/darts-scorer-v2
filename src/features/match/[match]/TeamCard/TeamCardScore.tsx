import { type FC } from 'react'

import { useSelector } from '@tanstack/react-store'

import { getRemainingScore, matchStore } from '../../../../../store/match-store'

import type { Team } from '../../../../../types/match-types'

interface TeamCardScoreProps {
  team: Team
  accent: string
}

const TeamCardScore: FC<TeamCardScoreProps> = ({ team, accent }) => {
  const remainingScore = useSelector(matchStore, () =>
    getRemainingScore(team.id),
  )

  return (
    <div className="relative flex min-h-0 flex-[1.2] flex-col items-center justify-center overflow-visible px-4 py-2">
      <p
        className="relative z-10 font-sans font-black tabular-nums leading-none tracking-[-0.05em] text-white"
        style={{
          fontSize: 'clamp(3.5rem, 16vh, 7.5rem)',
          textShadow: `0 0 32px ${accent}66, 0 2px 8px rgba(0,0,0,0.45)`,
        }}
      >
        {remainingScore}
      </p>
    </div>
  )
}

export default TeamCardScore
