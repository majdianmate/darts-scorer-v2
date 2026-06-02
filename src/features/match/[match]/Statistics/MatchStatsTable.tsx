import { type FC, useMemo } from 'react'

import Avatar from '#/components/Avatar'
import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { cn } from '#/lib/utils'
import type { Match } from '../../../../../types/match-types'
import { accentAlpha } from '../TeamCard/team-card-utils'

import {
  STAT_TABLE_METRICS,
  bestSeriesKeysForMetric,
  computePlayerMatchStats,
} from './compute-player-match-stats'

export type MatchStatsTableSeries = {
  key: string
  playerId: string
  teamId: string
  teamName: string
  teamColor: string
  teamIcon: string
  playerName: string
  playerImage: string
  color: string
}

type ComparisonMode = 'none' | 'team' | 'everyone'

interface MatchStatsTableProps {
  match: Match
  seriesList: MatchStatsTableSeries[]
  comparisonMode: ComparisonMode
}

function columnHeaderStyle(series: MatchStatsTableSeries) {
  return {
    borderTopWidth: 2,
    borderTopStyle: 'solid' as const,
    borderTopColor: series.teamColor,
    background: `linear-gradient(180deg, ${accentAlpha(series.teamColor, '28')} 0%, transparent 72%)`,
  }
}

function bestCellStyle(series: MatchStatsTableSeries, isBest: boolean) {
  if (!isBest) return undefined
  return {
    backgroundColor: accentAlpha(series.color, '30'),
    boxShadow: `inset 0 0 0 1px ${accentAlpha(series.color, '55')}`,
    color: series.color,
  }
}

const MatchStatsTable: FC<MatchStatsTableProps> = ({
  match,
  seriesList,
  comparisonMode,
}) => {
  const statRows = useMemo(
    () =>
      seriesList.map((series) => ({
        ...computePlayerMatchStats(match, series.teamId, series.playerId),
        seriesKey: series.key,
      })),
    [match, seriesList],
  )

  const hasAnyScore = statRows.some(
    (row) =>
      row.maxThrow > 0 ||
      row.matchAverage > 0 ||
      row.bestCheckout > 0,
  )

  if (!hasAnyScore) return null

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-sm font-semibold text-foreground">Statistics</h2>
      <div className="overflow-hidden rounded-xl border border-border/60">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/60 hover:bg-transparent">
              <TableHead className="w-[140px] bg-muted/20 text-xs text-muted-foreground">
                Stat
              </TableHead>
              {seriesList.map((series) => {
                const TeamIcon = getSquadIcon(series.teamIcon)
                return (
                  <TableHead
                    key={series.key}
                    className="min-w-[100px] border-l border-border/40 p-0 text-center first:border-l-0"
                    style={columnHeaderStyle(series)}
                  >
                    <div className="flex flex-col items-center gap-1.5 px-2 py-2.5">
                      <div
                        className="rounded-full p-0.5"
                        style={{
                          boxShadow: `0 0 0 2px ${accentAlpha(series.color, '88')}`,
                        }}
                      >
                        <Avatar
                          name={series.playerName}
                          image={series.playerImage}
                          size="xs"
                        />
                      </div>
                      <span
                        className="max-w-[88px] truncate text-xs font-semibold"
                        style={{ color: series.teamColor }}
                        title={series.playerName}
                      >
                        {series.playerName}
                      </span>
                      {comparisonMode === 'everyone' ? (
                        <span
                          className="flex max-w-[88px] items-center gap-1 truncate text-[10px] text-muted-foreground"
                          title={series.teamName}
                        >
                          <span
                            className="flex size-4 shrink-0 items-center justify-center rounded border"
                            style={{
                              borderColor: accentAlpha(series.teamColor, '55'),
                              backgroundColor: accentAlpha(series.teamColor, '18'),
                              color: series.teamColor,
                            }}
                          >
                            <TeamIcon className="size-2.5" />
                          </span>
                          {series.teamName}
                        </span>
                      ) : (
                        <span
                          className="size-1.5 rounded-full"
                          style={{ backgroundColor: series.color }}
                          aria-hidden
                        />
                      )}
                    </div>
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {STAT_TABLE_METRICS.map((metric) => {
              const leaders = bestSeriesKeysForMetric(statRows, metric.key)

              return (
                <TableRow
                  key={metric.key}
                  className="border-border/40 hover:bg-muted/15"
                >
                  <TableCell className="bg-muted/10 text-xs font-medium text-muted-foreground">
                    {metric.label}
                  </TableCell>
                  {seriesList.map((series) => {
                    const row = statRows.find((r) => r.seriesKey === series.key)
                    const value = row?.[metric.key] ?? 0
                    const isBest =
                      leaders.has(series.key) &&
                      (value > 0 || metric.key === 'checkoutRate')

                    return (
                      <TableCell
                        key={series.key}
                        className={cn(
                          'border-l border-border/30 text-center text-sm tabular-nums text-foreground',
                          isBest && 'font-bold',
                        )}
                        style={bestCellStyle(series, isBest)}
                      >
                        {metric.format(value)}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default MatchStatsTable
