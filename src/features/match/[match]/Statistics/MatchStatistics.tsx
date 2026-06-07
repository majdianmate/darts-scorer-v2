import React, { type FC, useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts'
import { BarChart3, ChartArea, Users } from 'lucide-react'

import Avatar from '#/components/Avatar'
import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from '#/components/ui/chart'
import { ScrollArea } from '#/components/ui/scroll-area'
import { cn } from '#/lib/utils'
import type { ClubMember } from '../../../../../types/club-types'
import type { Match, Score, Team } from '../../../../../types/match-types'

import MatchStatsTable from './MatchStatsTable'

type ComparisonMode = 'none' | 'team' | 'everyone'
type ChartKind = 'bar' | 'area'

interface VisitMeta {
  scoreId: string
  legIndex: number
  visitIndex: number
  thrown: number
  remainingBefore: number
  remainingAfter: number
  checkoutAttempts: number
  dartsThrown: number
  isCheckedOut: boolean
  isCheckoutAttempt: boolean
  thrownAt: Date | null
}

interface PlayerSeries {
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

type ChartRow = {
  label: string
  rowKey: string
  [key: string]: string | number | VisitMeta | undefined
}

interface MatchStatisticsProps {
  match: Match
}

const COMPARISON_OPTIONS: { value: ComparisonMode; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'team', label: 'Team' },
  { value: 'everyone', label: 'Everyone' },
]

const CHART_KIND_OPTIONS: { value: ChartKind; label: string; icon: typeof BarChart3 }[] = [
  { value: 'bar', label: 'Bar', icon: BarChart3 },
  { value: 'area', label: 'Area', icon: ChartArea },
]

function normalizeHex(hex: string): string {
  const raw = hex.trim()
  if (!raw.startsWith('#')) return '#6366f1'
  if (raw.length >= 7) return raw.slice(0, 7)
  return '#6366f1'
}

function mixHex(hex: string, mixAmount: number, toward: 'white' | 'black'): string {
  const base = normalizeHex(hex).replace('#', '')
  const r = Number.parseInt(base.slice(0, 2), 16)
  const g = Number.parseInt(base.slice(2, 4), 16)
  const b = Number.parseInt(base.slice(4, 6), 16)
  const target = toward === 'white' ? 255 : 0
  const mix = (channel: number) =>
    Math.round(channel + (target - channel) * mixAmount)
  const toHex = (n: number) => n.toString(16).padStart(2, '0')
  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`
}

/** Distinct shades from the same team color for teammates. */
function teamMemberShades(teamColor: string, index: number, total: number): string {
  if (total <= 1) return normalizeHex(teamColor)
  const amount = 0.12 + (index / Math.max(1, total - 1)) * 0.42
  return index % 2 === 0
    ? mixHex(teamColor, amount, 'white')
    : mixHex(teamColor, amount * 0.65, 'black')
}

function metaKey(seriesKey: string) {
  return `${seriesKey}__meta`
}

function memberDisplayName(member: ClubMember): string {
  return member.guestName?.trim() || member.user.name
}

function resolveMemberName(team: Team, playerId: string): string {
  const member = team.members.find(
    (m) => m.id === playerId || m.userId === playerId,
  )
  return member ? memberDisplayName(member) : 'Unknown'
}

function resolveMemberImage(team: Team, playerId: string): string {
  const member = team.members.find(
    (m) => m.id === playerId || m.userId === playerId,
  )
  return member?.user.image ?? ''
}

function getPlayerVisitsInLeg(
  legScores: Score[],
  teamId: string,
  playerId: string,
): Score[] {
  return legScores.filter(
    (score) => score.teamId === teamId && score.playerId === playerId,
  )
}

function toVisitMeta(
  visit: Score,
  legIndex: number,
  visitIndex: number,
  remainingBefore: number,
): VisitMeta {
  return {
    scoreId: visit.id,
    legIndex,
    visitIndex,
    thrown: visit.score,
    remainingBefore,
    remainingAfter: visit.remainingScore,
    checkoutAttempts: visit.checkoutAttempts ?? 0,
    dartsThrown: visit.dartsThrown ?? 3,
    isCheckedOut: visit.isCheckedOut,
    isCheckoutAttempt: visit.isCheckoutAttempt,
    thrownAt: visit.createdAt?.toDate?.() ?? null,
  }
}

function buildChartRows(
  match: Match,
  seriesList: PlayerSeries[],
): ChartRow[] {
  const rows: ChartRow[] = []
  const startingScore = match.matchConfig.startingScore

  match.legs.forEach((leg, legIndex) => {
    const visitsBySeries = new Map<string, Score[]>()
    let maxRounds = 0

    for (const series of seriesList) {
      const visits = getPlayerVisitsInLeg(leg.scores, series.teamId, series.playerId)
      visitsBySeries.set(series.key, visits)
      maxRounds = Math.max(maxRounds, visits.length)
    }

    for (let round = 0; round < maxRounds; round += 1) {
      const rowKey = `${legIndex}-${round}`
      const row: ChartRow = {
        label: `L${legIndex + 1} · ${round + 1}`,
        rowKey,
      }
      let hasValue = false

      for (const series of seriesList) {
        const visits = visitsBySeries.get(series.key) ?? []
        const visit = visits[round]
        if (!visit) continue

        hasValue = true
        const remainingBefore =
          round === 0
            ? startingScore
            : (visits[round - 1]?.remainingScore ?? startingScore)

        row[series.key] = visit.score
        row[metaKey(series.key)] = toVisitMeta(
          visit,
          legIndex,
          round + 1,
          remainingBefore,
        )
      }

      if (hasValue) rows.push(row)
    }
  })

  return rows
}

function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T
  onChange: (value: T) => void
  options: { value: T; label: string; icon?: React.ComponentType<{ className?: string }> }[]
  className?: string
}) {
  return (
    <div
      className={cn(
        'inline-flex flex-wrap gap-0.5 rounded-lg border border-border/60 bg-muted/40 p-0.5',
        className,
      )}
    >
      {options.map((option) => {
        const Icon = option.icon
        const active = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
              active
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {Icon ? <Icon className="size-3.5 shrink-0" /> : null}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

function formatThrownAt(date: Date | null) {
  if (!date) return '—'
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function VisitTooltipBody({
  meta,
  series,
  showPlayer,
  showTeam,
}: {
  meta: VisitMeta
  series: PlayerSeries
  showPlayer: boolean
  showTeam: boolean
}) {
  const TeamIcon = getSquadIcon(series.teamIcon)

  return (
    <div className="grid gap-2 text-xs">
      {showTeam ? (
        <div className="flex items-center gap-2 border-b border-border/50 pb-2">
          <div
            className="flex size-7 shrink-0 items-center justify-center rounded-md border"
            style={{
              backgroundColor: `${series.teamColor}22`,
              borderColor: `${series.teamColor}55`,
              color: series.teamColor,
            }}
          >
            <TeamIcon className="size-3.5" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground">{series.teamName}</p>
            <p className="text-muted-foreground">Team</p>
          </div>
        </div>
      ) : null}

      {showPlayer ? (
        <div className="flex items-center gap-2">
          <Avatar
            name={series.playerName}
            image={series.playerImage}
            size="xs"
          />
          <p className="font-medium text-foreground">{series.playerName}</p>
        </div>
      ) : null}

      <div className="grid gap-1 text-muted-foreground">
        <p>
          <span className="text-foreground font-medium">{meta.thrown}</span> pts
          thrown
        </p>
        <p>
          Remaining:{' '}
          <span className="text-foreground tabular-nums">
            {meta.remainingBefore}
          </span>
          {' → '}
          <span className="text-foreground tabular-nums">
            {meta.remainingAfter}
          </span>
        </p>
        {meta.isCheckoutAttempt || meta.checkoutAttempts > 0 ? (
          <p>
            Checkout darts:{' '}
            <span className="text-foreground tabular-nums">
              {meta.checkoutAttempts}/{meta.dartsThrown}
            </span>
          </p>
        ) : null}
        <p>
          Checked out:{' '}
          <span className="text-foreground">
            {meta.isCheckedOut ? 'Yes' : 'No'}
          </span>
        </p>
        <p className="text-[10px]">{formatThrownAt(meta.thrownAt)}</p>
      </div>
    </div>
  )
}

function MatchStatsTooltip({
  active,
  payload,
  label,
  seriesList,
  comparisonMode,
}: {
  active?: boolean
  payload?: Array<{
    dataKey?: string | number
    value?: number
    payload?: ChartRow
  }>
  label?: string
  seriesList: PlayerSeries[]
  comparisonMode: ComparisonMode
}) {
  if (!active || !payload?.length) return null

  const showPlayer = comparisonMode !== 'none'
  const showTeam = comparisonMode === 'everyone'

  return (
    <div className="max-w-[min(96vw,720px)] rounded-lg border border-border/50 bg-background px-3 py-2.5 text-xs shadow-xl">
      {label ? (
        <p className="mb-2 font-medium text-foreground">{String(label)}</p>
      ) : null}
      <div className="flex flex-row flex-wrap items-stretch gap-2">
      {payload
        .filter((item) => item.value != null)
        .map((item) => {
          const seriesKey = String(item.dataKey ?? '')
          const series = seriesList.find((s) => s.key === seriesKey)
          const meta = item.payload?.[metaKey(seriesKey)] as VisitMeta | undefined
          if (!series || !meta) return null

          return (
            <div
              key={seriesKey}
              className="min-w-[148px] max-w-[200px] shrink-0 rounded-md border border-border/40 bg-muted/20 p-2"
              style={{ borderLeftColor: series.color, borderLeftWidth: 3 }}
            >
              <VisitTooltipBody
                meta={meta}
                series={series}
                showPlayer={showPlayer}
                showTeam={showTeam}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SeriesColorMap({
  seriesList,
  comparisonMode,
}: {
  seriesList: PlayerSeries[]
  comparisonMode: ComparisonMode
}) {
  if (seriesList.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 rounded-lg border border-border/60 bg-muted/20 p-2">
      {seriesList.map((series) => {
        const TeamIcon = getSquadIcon(series.teamIcon)
        return (
          <div
            key={series.key}
            className="flex min-w-0 items-center gap-2 rounded-md border border-border/50 bg-background/80 px-2 py-1.5"
          >
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: series.color }}
              aria-hidden
            />
            <Avatar
              name={series.playerName}
              image={series.playerImage}
              size="xs"
            />
            <div className="min-w-0 leading-tight">
              <p className="truncate text-xs font-medium text-foreground">
                {series.playerName}
              </p>
              {comparisonMode === 'everyone' ? (
                <p className="flex items-center gap-1 truncate text-[10px] text-muted-foreground">
                  <TeamIcon
                    className="size-3 shrink-0"
                    style={{ color: series.teamColor }}
                  />
                  {series.teamName}
                </p>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const MatchStatistics: FC<MatchStatisticsProps> = ({ match }) => {
  const teams = match.teams

  const [selectedTeamId, setSelectedTeamId] = useState(
    () => teams[0]?.id ?? '',
  )
  const [selectedPlayerId, setSelectedPlayerId] = useState(() => {
    const team = teams[0]
    return team?.members[0]?.id ?? ''
  })
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('none')
  const [chartKind, setChartKind] = useState<ChartKind>('bar')

  const selectedTeam = teams.find((t) => t.id === selectedTeamId) ?? teams[0]

  const playerOptions = useMemo(() => {
    if (!selectedTeam) return []
    return selectedTeam.members.map((member) => ({
      value: member.id,
      label: memberDisplayName(member),
    }))
  }, [selectedTeam])

  const teamOptions = useMemo(
    () =>
      teams.map((team) => ({
        value: team.id,
        label: team.name,
      })),
    [teams],
  )

  const seriesList = useMemo((): PlayerSeries[] => {
    if (!selectedTeam || !selectedPlayerId) return []

    const buildSeries = (
      team: Team,
      playerId: string,
      shadeIndex: number,
      shadeTotal: number,
    ): PlayerSeries => {
      const key = `p-${playerId}-t-${team.id}`
      return {
        key,
        playerId,
        teamId: team.id,
        teamName: team.name,
        teamColor: normalizeHex(team.color),
        teamIcon: team.icon,
        playerName: resolveMemberName(team, playerId),
        playerImage: resolveMemberImage(team, playerId),
        color: teamMemberShades(team.color, shadeIndex, shadeTotal),
      }
    }

    if (comparisonMode === 'none') {
      return [buildSeries(selectedTeam, selectedPlayerId, 0, 1)]
    }

    if (comparisonMode === 'team') {
      const teammates = selectedTeam.members.map((m) => m.id)
      return teammates.map((playerId, index) =>
        buildSeries(selectedTeam, playerId, index, teammates.length),
      )
    }

    const allEntries: { team: Team; playerId: string }[] = []
    for (const team of teams) {
      for (const member of team.members) {
        allEntries.push({ team, playerId: member.id })
      }
    }

    const byTeam = new Map<string, number>()
    return allEntries.map(({ team, playerId }) => {
      const idx = byTeam.get(team.id) ?? 0
      const teamCount = team.members.length
      byTeam.set(team.id, idx + 1)
      return buildSeries(team, playerId, idx, teamCount)
    })
  }, [comparisonMode, selectedTeam, selectedPlayerId, teams])

  const chartRows = useMemo(
    () => buildChartRows(match, seriesList),
    [match, seriesList],
  )

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {}
    for (const series of seriesList) {
      config[series.key] = {
        label: series.playerName,
        color: series.color,
      }
    }
    return config
  }, [seriesList])

  const hasData = chartRows.length > 0

  const handleTeamChange = (teamId: string) => {
    setSelectedTeamId(teamId)
    const team = teams.find((t) => t.id === teamId)
    const stillValid = team?.members.some((m) => m.id === selectedPlayerId)
    if (!stillValid && team?.members[0]) {
      setSelectedPlayerId(team.members[0].id)
    }
  }

  return (
    <ScrollArea className="h-full min-h-0 [scrollbar-gutter:stable] pr-3">
      <div className="flex w-full flex-col gap-4 pb-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Team
          </span>
          <SegmentedControl
            value={selectedTeamId}
            onChange={handleTeamChange}
            options={teamOptions}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Player
          </span>
          <SegmentedControl
            value={selectedPlayerId}
            onChange={setSelectedPlayerId}
            options={playerOptions}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Compare
          </span>
          <SegmentedControl
            value={comparisonMode}
            onChange={setComparisonMode}
            options={COMPARISON_OPTIONS}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Chart
          </span>
          <SegmentedControl
            value={chartKind}
            onChange={setChartKind}
            options={CHART_KIND_OPTIONS}
          />
        </div>
      </div>

      <SeriesColorMap
        seriesList={seriesList}
        comparisonMode={comparisonMode}
      />

      {!hasData ? (
        <div className="flex min-h-[280px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/60 bg-muted/15 px-4 py-12 text-center">
          <Users className="size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            No scores yet for this selection.
          </p>
        </div>
      ) : (
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[320px] w-full"
        >
          {chartKind === 'bar' ? (
            <BarChart accessibilityLayer data={chartRows} margin={{ left: 4, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, 180]}
                allowDataOverflow
              />
              <ChartTooltip
                content={
                  <MatchStatsTooltip
                    seriesList={seriesList}
                    comparisonMode={comparisonMode}
                  />
                }
              />
              {seriesList.map((series) => (
                <Bar
                  key={series.key}
                  dataKey={series.key}
                  fill={`var(--color-${series.key})`}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={comparisonMode === 'none' ? 48 : 28}
                />
              ))}
            </BarChart>
          ) : (
            <AreaChart accessibilityLayer data={chartRows} margin={{ left: 4, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, 180]}
              />
              <ChartTooltip
                content={
                  <MatchStatsTooltip
                    seriesList={seriesList}
                    comparisonMode={comparisonMode}
                  />
                }
              />
              {seriesList.map((series) => (
                <Area
                  key={series.key}
                  type="monotone"
                  dataKey={series.key}
                  stroke={`var(--color-${series.key})`}
                  fill={`var(--color-${series.key})`}
                  fillOpacity={comparisonMode === 'none' ? 0.35 : 0.22}
                  strokeWidth={2}
                  connectNulls={false}
                  dot={{ r: 3, fill: series.color, strokeWidth: 0 }}
                />
              ))}
            </AreaChart>
          )}
        </ChartContainer>
      )}

      <MatchStatsTable
        match={match}
        seriesList={seriesList}
        comparisonMode={comparisonMode}
      />
      </div>
    </ScrollArea>
  )
}

export default MatchStatistics
