import { type FC } from 'react'

import { useSelector } from '@tanstack/react-store'

import { getRemainingScore, matchStore } from '../../../../../store/match-store'

import type { Team } from '../../../../../types/match-types'
import { teamCardScoreTextStyle } from './team-card-utils'

interface TeamCardScoreProps {
  team: Team
  accent: string
}

const TeamCardScore: FC<TeamCardScoreProps> = ({ team, accent }) => {
  const remainingScore = useSelector(matchStore, () =>
    getRemainingScore(team.id),
  )

  return (
    <div className="relative flex shrink-0 flex-col items-center justify-center overflow-visible py-2">
      <p
        className="relative z-10 font-sans font-black tabular-nums leading-none tracking-tight text-white/95"
        style={{
          fontSize: 'clamp(3.25rem, 30vh, 7rem)',
          ...teamCardScoreTextStyle(accent),
        }}
      >
        {remainingScore}
      </p>
    </div>
  )
}

export default TeamCardScore
