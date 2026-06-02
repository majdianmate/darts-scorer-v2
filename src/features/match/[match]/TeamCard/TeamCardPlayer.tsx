import { type FC } from 'react'

import { cn } from '#/lib/utils'

import type { PlayerLocal, TeamLocal } from '../../../../../types/match-types'
import { setCurrentPlayerId } from '../../../../../store/match-store'

import { getMemberDisplayName } from './team-card-utils'
import TeamCardPlayerAvatar from './TeamCardPlayerAvatar'

interface TeamCardPlayerProps {
  player: PlayerLocal
  team: TeamLocal
  isActive: boolean
  accent: string
}

const TeamCardPlayer: FC<TeamCardPlayerProps> = ({
  player,
  team,
  isActive,
  accent,
}) => {
  const name = getMemberDisplayName(player)
  const firstName = name.split(' ')[0]

  const onClick = () => setCurrentPlayerId(player.id, team.id)

  return (
    <div
      className="flex flex-col items-center gap-2"
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        onClick()
      }}
    >
      <TeamCardPlayerAvatar
        name={name}
        image={player.user.image}
        isActive={isActive}
        accent={accent}
        size="lg"
      />

      <p
        className={cn(
          'max-w-[96px] truncate text-sm tracking-tight',
          isActive ? 'font-semibold text-white/90' : 'font-medium text-white/40',
        )}
      >
        {firstName}
      </p>

      <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[11px] font-semibold tabular-nums shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]">
        <span style={{ color: isActive ? accent : 'rgba(255,255,255,0.45)' }}>
          <span className="mr-0.5 text-[9px] font-medium uppercase tracking-wide text-white/25">
            Leg
          </span>
          {player.legAverage.toFixed(1)}
        </span>
        <span className="text-white/12">·</span>
        <span style={{ color: isActive ? accent : 'rgba(255,255,255,0.45)' }}>
          <span className="mr-0.5 text-[9px] font-medium uppercase tracking-wide text-white/25">
            Game
          </span>
          {player.gameAverage.toFixed(1)}
        </span>
      </div>
    </div>
  )
}

export default TeamCardPlayer
