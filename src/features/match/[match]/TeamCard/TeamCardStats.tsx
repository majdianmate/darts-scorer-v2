import { type FC, useState } from 'react'

import { BarChart3, History, Users } from 'lucide-react'

import { cn } from '#/lib/utils'

import type { TeamLocal, TeamStatistics } from '../../../../../types/match-types'

import TeamCardPlayerStats from './TeamCardPlayerStats'
import TeamCardScoreHistory from './TeamCardScoreHistory'
import {
  teamCardStatCellStyle,
  teamCardStatsScrollClass,
  teamCardTabBarStyle,
  teamCardTabStyle,
} from './team-card-utils'

type StatsTab = 'game' | 'players' | 'history'

const STATS_TABS: { id: StatsTab; label: string; icon: typeof BarChart3 }[] = [
  { id: 'game', label: 'Game stats', icon: BarChart3 },
  { id: 'players', label: 'Player stats', icon: Users },
  { id: 'history', label: 'Score history', icon: History },
]

interface TeamCardStatsProps {
  team: TeamLocal
  accent: string
}

const StatCell: FC<{ label: string; value: string; accent: string }> = ({
  label,
  value,
  accent,
}) => (
  <div
    className="rounded-xl border px-2 py-2 text-center"
    style={teamCardStatCellStyle(accent)}
  >
    <p className="text-[8px] font-medium uppercase tracking-wider text-white/30">
      {label}
    </p>
    <p className="mt-1 text-base font-bold tabular-nums leading-none text-white/88">
      {value}
    </p>
  </div>
)

function getPreviousLegAverage(stats: TeamStatistics) {
  if (stats.legAverages.length === 0) return 0
  return stats.legAverages[stats.legAverages.length - 1]!
}

const GameStatsPanel: FC<{ stats: TeamStatistics; accent: string }> = ({
  stats,
  accent,
}) => {
  const prevLeg = getPreviousLegAverage(stats)

  return (
    <div className="flex w-full flex-col gap-2 pt-1">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatCell label="Leg avg" value={stats.legAverage.toFixed(1)} accent={accent} />
        <StatCell label="Prev leg" value={prevLeg.toFixed(1)} accent={accent} />
        <StatCell label="Game avg" value={stats.gameAverage.toFixed(1)} accent={accent} />
        <StatCell
          label="1st 9 avg"
          value={stats.firstNineDartsAverage.toFixed(1)}
          accent={accent}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <StatCell label="Best CO" value={String(stats.bestCheckout)} accent={accent} />
        <StatCell label="CO rate" value={`${stats.checkoutRate}%`} accent={accent} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <StatCell label="60+" value={String(stats.sixtyPlus)} accent={accent} />
        <StatCell label="120+" value={String(stats.hundredTwentyPlus)} accent={accent} />
        <StatCell label="180+" value={String(stats.hundredEightyPlus)} accent={accent} />
      </div>
    </div>
  )
}

const EmptyStatsPanel: FC = () => (
  <div className="flex items-center justify-center py-8 text-xs text-white/25">
    No data yet
  </div>
)

const StatsMenubar: FC<{
  active: StatsTab
  onChange: (tab: StatsTab) => void
  accent: string
}> = ({ active, onChange, accent }) => (
  <div
    className="relative z-10 mt-2 grid shrink-0 grid-cols-3 overflow-hidden rounded-xl border"
    style={teamCardTabBarStyle(accent)}
  >
    {STATS_TABS.map(({ id, label, icon: Icon }) => {
      const isActive = active === id

      return (
        <button
          key={id}
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onChange(id)
          }}
          className="flex flex-col items-center gap-0.5 px-1 py-2 transition-colors duration-200"
          style={teamCardTabStyle(accent, isActive)}
        >
          <Icon className="size-3.5" strokeWidth={isActive ? 2.25 : 1.75} />
          <span className="text-[8px] font-semibold uppercase tracking-wide leading-tight">
            {label}
          </span>
          {isActive && (
            <span
              className="mt-0.5 h-0.5 w-4 rounded-full"
              style={{ backgroundColor: accent }}
            />
          )}
        </button>
      )
    })}
  </div>
)

const TeamCardStats: FC<TeamCardStatsProps> = ({ team, accent }) => {
  const [statsTab, setStatsTab] = useState<StatsTab>('game')

  return (
    <div
      className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <div className={cn(teamCardStatsScrollClass, 'pb-2')}>
        {statsTab === 'game' && (
          <GameStatsPanel stats={team.statistics} accent={accent} />
        )}
        {statsTab === 'players' &&
          (team.members.length > 0 ? (
            <TeamCardPlayerStats team={team} accent={accent} />
          ) : (
            <EmptyStatsPanel />
          ))}
        {statsTab === 'history' && (
          <TeamCardScoreHistory team={team} accent={accent} />
        )}
      </div>

      <StatsMenubar active={statsTab} onChange={setStatsTab} accent={accent} />
    </div>
  )
}

export default TeamCardStats
