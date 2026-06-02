import { type FC } from 'react'

import Avatar from '#/components/Avatar'
import { cn } from '#/lib/utils'

import type { PlayerLocal, TeamLocal } from '../../../../../types/match-types'

import {
  getMemberDisplayName,
  isCurrentPlayer,
} from './team-card-utils'

const StatCell: FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-lg border border-white/8 bg-white/[0.03] px-1.5 py-1.5 text-center backdrop-blur-sm">
    <p className="text-[7px] font-medium uppercase tracking-wider text-white/35">
      {label}
    </p>
    <p className="mt-0.5 text-sm font-black tabular-nums leading-none text-white/90">
      {value}
    </p>
  </div>
)

function getPreviousLegAverage(player: PlayerLocal) {
  const { legAverages } = player.statistics
  if (legAverages.length === 0) return 0
  return legAverages[legAverages.length - 1]!
}

const PlayerStatsCard: FC<{
  player: PlayerLocal
  isActive: boolean
  accent: string
}> = ({ player, isActive, accent }) => {
  const stats = player.statistics
  const prevLeg = getPreviousLegAverage(player)
  const name = getMemberDisplayName(player)

  return (
    <div
      className={cn(
        'rounded-xl border p-2.5 transition-all duration-300',
        isActive
          ? 'border-white/20 bg-white/[0.07]'
          : 'border-white/8 bg-white/[0.02]',
      )}
      style={
        isActive
          ? {
              borderColor: `${accent}66`,
              boxShadow: `0 0 20px ${accent}28, inset 0 1px 0 ${accent}22`,
            }
          : undefined
      }
    >
      <div className="mb-2 flex items-center gap-2">
        <div
          className={cn(
            'rounded-full p-0.5 transition-all',
            isActive && 'scale-105',
          )}
          style={
            isActive
              ? {
                  background: `linear-gradient(135deg, ${accent}, ${accent}55)`,
                  boxShadow: `0 0 12px ${accent}44`,
                }
              : undefined
          }
        >
          <Avatar
            name={name}
            image={player.user.image}
            size="sm"
            className={cn(
              'border border-white/10',
              !isActive && 'opacity-65',
            )}
          />
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              'truncate text-sm font-semibold',
              isActive ? 'text-white' : 'text-white/55',
            )}
          >
            {name}
          </p>
          {isActive && (
            <p
              className="text-[8px] font-bold uppercase tracking-wider"
              style={{ color: accent }}
            >
              At oche
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        <StatCell label="Leg avg" value={stats.legAverage.toFixed(1)} />
        <StatCell label="Prev leg" value={prevLeg.toFixed(1)} />
        <StatCell label="Game avg" value={stats.gameAverage.toFixed(1)} />
        <StatCell
          label="1st 9 avg"
          value={stats.firstNineDartsAverage.toFixed(1)}
        />
      </div>
      <div className="mt-1.5 grid grid-cols-2 gap-1.5">
        <StatCell label="Best CO" value={String(stats.bestCheckout)} />
        <StatCell label="CO rate" value={`${stats.checkoutRate}%`} />
      </div>
      <div className="mt-1.5 grid grid-cols-3 gap-1.5">
        <StatCell label="60+" value={String(stats.sixtyPlus)} />
        <StatCell label="120+" value={String(stats.hundredTwentyPlus)} />
        <StatCell label="180+" value={String(stats.hundredEightyPlus)} />
      </div>
    </div>
  )
}

interface TeamCardPlayerStatsProps {
  team: TeamLocal
  accent: string
}

const TeamCardPlayerStats: FC<TeamCardPlayerStatsProps> = ({ team, accent }) => {
  const sortedMembers = [...team.members].sort((a, b) => {
    const aActive = isCurrentPlayer(a, team.currentPlayerId)
    const bActive = isCurrentPlayer(b, team.currentPlayerId)
    if (aActive === bActive) return 0
    return aActive ? -1 : 1
  })

  return (
    <div className="flex flex-col gap-2">
      {sortedMembers.map((player) => (
        <PlayerStatsCard
          key={player.id}
          player={player}
          isActive={isCurrentPlayer(player, team.currentPlayerId)}
          accent={accent}
        />
      ))}
    </div>
  )
}

export default TeamCardPlayerStats
