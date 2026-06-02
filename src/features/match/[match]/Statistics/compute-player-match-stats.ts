import {
  StatsManager,
  computeMatchFirstNineDartsAverage,
} from '#/utils/stats-engine'
import type { Match } from '../../../../../types/match-types'

export interface PlayerMatchStatsRow {
  seriesKey: string
  maxThrow: number
  bestCheckout: number
  matchAverage: number
  bestLegAverage: number
  checkoutRate: number
  firstNineDartsAverage: number
}

export function computePlayerMatchStats(
  match: Match,
  teamId: string,
  playerId: string,
): PlayerMatchStatsRow {
  const manager = new StatsManager()
  let maxThrow = 0

  for (const leg of match.legs) {
    let playedInLeg = false
    for (const score of leg.scores) {
      if (score.teamId !== teamId || score.playerId !== playerId) continue
      playedInLeg = true
      maxThrow = Math.max(maxThrow, score.score)
      manager.processNewScore(score)
    }
    if (playedInLeg) manager.handleLegEnd()
  }

  const snapshot = manager.getSnapshot()
  const legAvgValues = [
    ...snapshot.legAverages,
    snapshot.legAverage,
  ].filter((v) => v > 0)
  const bestLegAverage =
    legAvgValues.length > 0 ? Math.max(...legAvgValues) : 0

  return {
    seriesKey: `p-${playerId}-t-${teamId}`,
    maxThrow,
    bestCheckout: snapshot.bestCheckout,
    matchAverage: snapshot.gameAverage,
    bestLegAverage,
    checkoutRate: snapshot.checkoutRate,
    firstNineDartsAverage: computeMatchFirstNineDartsAverage(manager),
  }
}

export type StatMetricKey = keyof Omit<PlayerMatchStatsRow, 'seriesKey'>

export const STAT_TABLE_METRICS: {
  key: StatMetricKey
  label: string
  format: (value: number) => string
}[] = [
  { key: 'maxThrow', label: 'Highest throw', format: (v) => String(v) },
  { key: 'bestCheckout', label: 'Best checkout', format: (v) => String(v) },
  {
    key: 'matchAverage',
    label: 'Match average',
    format: (v) => v.toFixed(2),
  },
  {
    key: 'bestLegAverage',
    label: 'Best leg average',
    format: (v) => v.toFixed(2),
  },
  {
    key: 'checkoutRate',
    label: 'Checkout rate',
    format: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: 'firstNineDartsAverage',
    label: 'First 9 average',
    format: (v) => v.toFixed(2),
  },
]

/** Higher is better for all comparison metrics. */
export function bestSeriesKeysForMetric(
  rows: PlayerMatchStatsRow[],
  metric: StatMetricKey,
): Set<string> {
  if (rows.length === 0) return new Set()

  const max = Math.max(...rows.map((row) => row[metric]))
  if (max <= 0 && metric !== 'checkoutRate') return new Set()

  return new Set(
    rows.filter((row) => row[metric] === max).map((row) => row.seriesKey),
  )
}
