import { type FC } from 'react'

import Avatar from '#/components/Avatar'
import { cn } from '#/lib/utils'

import type { PlayerLocal, TeamLocal } from '../../../../../types/match-types'
import { setCurrentPlayerId } from '../../../../../store/match-store'

import { getMemberDisplayName } from './team-card-utils'

interface TeamCardPlayerProps {
  player: PlayerLocal
  team: TeamLocal
  isActive: boolean
  accent: string
}

const TeamCardPlayer: FC<TeamCardPlayerProps> = ({ player, team, isActive, accent }) => {
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
      <div
        className={cn(
          'rounded-full p-0.5 transition-all duration-300',
          isActive && 'scale-110',
        )}
        style={
          isActive
            ? {
                background: `linear-gradient(135deg, ${accent}, ${accent}60)`,
                boxShadow: `0 0 20px ${accent}50`,
              }
            : undefined
        }
      >
        <Avatar
          name={name}
          image={player.user.image}
          size="lg"
          className={cn(
            'h-14 w-14 border-2 border-white/10 text-base',
            !isActive && 'opacity-70',
          )}
        />
      </div>

      <p
        className={cn(
          'max-w-[96px] truncate text-sm',
          isActive ? 'font-semibold text-white/95' : 'text-white/45',
        )}
      >
        {firstName}
      </p>

      <div className="flex items-center gap-2 text-xs font-bold tabular-nums">
        <span style={{ color: isActive ? accent : 'rgba(255,255,255,0.55)' }}>
          <span className="mr-0.5 text-[10px] font-medium uppercase text-white/30">Leg</span>
          {player.legAverage.toFixed(1)}
        </span>
        <span className="text-white/15">·</span>
        <span style={{ color: isActive ? accent : 'rgba(255,255,255,0.55)' }}>
          <span className="mr-0.5 text-[10px] font-medium uppercase text-white/30">Game</span>
          {player.gameAverage.toFixed(1)}
        </span>
      </div>
    </div>
  )
}

export default TeamCardPlayer
