import { type FC } from 'react'

import { cn } from '#/lib/utils'

import type { PlayerLocal, TeamLocal } from '../../../../../types/match-types'

import {
  getMemberDisplayName,
  isCurrentPlayer,
  teamCardPanelStyle,
  teamCardStatCellStyle,
} from './team-card-utils'
import TeamCardPlayerAvatar from './TeamCardPlayerAvatar'

const StatCell: FC<{ label: string; value: string; accent: string }> = ({
  label,
  value,
  accent,
}) => (
  <div
    className="rounded-lg border px-1.5 py-1.5 text-center"
    style={teamCardStatCellStyle(accent)}
  >
    <p className="text-[7px] font-medium uppercase tracking-wider text-white/30">
      {label}
    </p>
    <p className="mt-0.5 text-sm font-bold tabular-nums leading-none text-white/88">
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
      className="rounded-xl border p-2.5 transition-all duration-300"
      style={teamCardPanelStyle(accent, isActive)}
    >
      <div className="mb-2 flex items-center gap-2">
        <TeamCardPlayerAvatar
          name={name}
          image={player.user.image}
          isActive={isActive}
          accent={accent}
          size="sm"
        />

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              'truncate text-sm font-semibold tracking-tight',
              isActive ? 'text-white/90' : 'text-white/50',
            )}
          >
            {name}
          </p>
          {isActive && (
            <p
              className="text-[8px] font-semibold uppercase tracking-wider"
              style={{ color: accent }}
            >
              At oche
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        <StatCell label="Leg avg" value={stats.legAverage.toFixed(1)} accent={accent} />
        <StatCell label="Prev leg" value={prevLeg.toFixed(1)} accent={accent} />
        <StatCell label="Game avg" value={stats.gameAverage.toFixed(1)} accent={accent} />
        <StatCell
          label="1st 9 avg"
          value={stats.firstNineDartsAverage.toFixed(1)}
          accent={accent}
        />
      </div>
      <div className="mt-1.5 grid grid-cols-2 gap-1.5">
        <StatCell label="Best CO" value={String(stats.bestCheckout)} accent={accent} />
        <StatCell label="CO rate" value={`${stats.checkoutRate}%`} accent={accent} />
      </div>
      <div className="mt-1.5 grid grid-cols-3 gap-1.5">
        <StatCell label="60+" value={String(stats.sixtyPlus)} accent={accent} />
        <StatCell label="120+" value={String(stats.hundredTwentyPlus)} accent={accent} />
        <StatCell label="180+" value={String(stats.hundredEightyPlus)} accent={accent} />
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
    <div className="flex flex-col gap-2 pt-1">
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
