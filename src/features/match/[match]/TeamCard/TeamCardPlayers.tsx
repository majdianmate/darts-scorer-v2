import { type FC } from 'react'

import type { TeamLocal } from '../../../../../types/match-types'

import TeamCardPlayer from './TeamCardPlayer'

import { isCurrentPlayer } from './team-card-utils'

interface TeamCardPlayersProps {
  team: TeamLocal
  accent: string
}

const TeamCardPlayers: FC<TeamCardPlayersProps> = ({ team, accent }) => {

  return (
    <div className="flex items-center justify-center gap-[clamp(1rem,4.5vw,2rem)] py-4">
      {team.members.map((player) => (
        <TeamCardPlayer
          key={player.id}
          player={player}
          team={team}
          isActive={isCurrentPlayer(player, team.currentPlayerId)}
          accent={accent}
        />
      ))}
    </div>
  )
}

export default TeamCardPlayers
