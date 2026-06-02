import { type FC, useState } from 'react'
import { BarChart3, History, Users } from 'lucide-react'
import Avatar from '#/components/Avatar'
import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'
import { cn } from '#/lib/utils'
import type { MockTeamCardData, MockTeamStats } from '#/utils/mock'
import { TeamTurnIndicator } from './TeamTurnIndicator'

type StatsTab = 'game' | 'players' | 'history'

interface Props {
  team: MockTeamCardData
  playersVariant?: 'fan' | 'row'
  checkoutVariant?: 'chips' | 'underScore'
  extendedStats?: boolean
}

const PlayerAverages: FC<{
  legAverage: number
  gameAverage: number
  isActive: boolean
  accent: string
  dual?: boolean
}> = ({ legAverage, gameAverage, isActive, accent, dual }) => {
  if (!dual) {
    return (
      <span
        className="rounded-md px-1.5 py-px text-[10px] font-bold tabular-nums backdrop-blur-sm"
        style={
          isActive
            ? { backgroundColor: `${accent}25`, color: accent }
            : { color: 'rgba(255,255,255,0.55)' }
        }
      >
        {gameAverage.toFixed(1)}
      </span>
    )
  }

  return (
    <div className="flex items-center gap-1.5 text-[10px] font-bold tabular-nums">
      <span style={{ color: isActive ? accent : 'rgba(255,255,255,0.55)' }}>
        <span className="mr-0.5 text-[8px] font-medium uppercase text-white/30">Leg</span>
        {legAverage.toFixed(1)}
      </span>
      <span className="text-white/15">·</span>
      <span style={{ color: isActive ? accent : 'rgba(255,255,255,0.55)' }}>
        <span className="mr-0.5 text-[8px] font-medium uppercase text-white/30">Game</span>
        {gameAverage.toFixed(1)}
      </span>
    </div>
  )
}

const StatCell: FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-lg border border-white/8 bg-white/[0.03] px-2 py-2 text-center backdrop-blur-sm">
    <p className="text-[8px] font-medium uppercase tracking-wider text-white/35">{label}</p>
    <p className="mt-1 text-base font-black tabular-nums leading-none text-white/90">{value}</p>
  </div>
)

const ExtendedStatsPanel: FC<{ stats: MockTeamStats }> = ({ stats }) => (
  <div className="flex w-full flex-col gap-2">
    <div className="grid grid-cols-3 gap-2">
      <StatCell label="Leg avg" value={stats.legAverage.toFixed(1)} />
      <StatCell label="Prev leg" value={stats.previousLegAverage.toFixed(1)} />
      <StatCell label="Game avg" value={stats.matchAverage.toFixed(1)} />
    </div>
    <div className="grid grid-cols-2 gap-2">
      <StatCell label="Best CO" value={String(stats.highestCheckout)} />
      <StatCell label="CO rate" value={`${stats.checkoutRate}%`} />
    </div>
    <div className="grid grid-cols-3 gap-2">
      <StatCell label="60+" value={String(stats.scores60Plus)} />
      <StatCell label="120+" value={String(stats.scores120Plus)} />
      <StatCell label="180+" value={String(stats.scores180Plus)} />
    </div>
  </div>
)

const PlayerStatsPanel: FC<{ team: MockTeamCardData; accent: string }> = ({ team, accent }) => (
  <div className="flex w-full flex-col gap-2">
    {team.members.map((member) => {
      const isActive = member.id === team.currentPlayerId
      return (
        <div
          key={member.id}
          className={cn(
            'flex items-center gap-2.5 rounded-lg border px-2.5 py-2 backdrop-blur-sm',
            isActive ? 'border-white/15 bg-white/[0.06]' : 'border-white/8 bg-white/[0.02]',
          )}
        >
          <Avatar
            name={member.name}
            image={member.image}
            size="sm"
            className={cn('border border-white/10', !isActive && 'opacity-70')}
          />
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                'truncate text-[11px] font-semibold',
                isActive ? 'text-white/95' : 'text-white/55',
              )}
            >
              {member.name.split(' ')[0]}
            </p>
            <div className="mt-0.5 flex gap-2 text-[10px] font-bold tabular-nums">
              <span style={{ color: isActive ? accent : 'rgba(255,255,255,0.45)' }}>
                Leg {member.legAverage.toFixed(1)}
              </span>
              <span className="text-white/15">·</span>
              <span style={{ color: isActive ? accent : 'rgba(255,255,255,0.45)' }}>
                Game {member.matchAverage.toFixed(1)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[7px] uppercase tracking-wider text-white/30">Last</p>
            <p
              className="text-sm font-black tabular-nums"
              style={{ color: isActive ? accent : 'rgba(255,255,255,0.7)' }}
            >
              {member.lastVisit}
            </p>
          </div>
        </div>
      )
    })}
  </div>
)

const ScoreHistoryPanel: FC<{ stats: MockTeamStats; accent: string }> = ({ stats, accent }) => (
  <div className="flex w-full flex-col gap-2">
    <div className="flex flex-wrap gap-1.5">
      {[...stats.scoreHistory].reverse().map((score, i) => (
        <span
          key={`${score}-${i}`}
          className={cn(
            'rounded-lg border px-2.5 py-1.5 text-sm font-black tabular-nums backdrop-blur-sm',
            score >= 100 ? 'border-white/15 bg-white/[0.06]' : 'border-white/8 bg-white/[0.02]',
          )}
          style={score >= 100 ? { color: accent } : { color: 'rgba(255,255,255,0.55)' }}
        >
          {score}
        </span>
      ))}
    </div>
    <p className="text-center text-[9px] text-white/30">Newest first · {stats.scoreHistory.length} visits</p>
  </div>
)

const STATS_TABS: { id: StatsTab; label: string; icon: typeof BarChart3 }[] = [
  { id: 'game', label: 'Game stats', icon: BarChart3 },
  { id: 'players', label: 'Player stats', icon: Users },
  { id: 'history', label: 'Score history', icon: History },
]

const StatsMenubar: FC<{
  active: StatsTab
  onChange: (tab: StatsTab) => void
  accent: string
}> = ({ active, onChange, accent }) => (
  <div className="relative z-10 grid shrink-0 grid-cols-3 border-t border-white/8 bg-white/[0.03] backdrop-blur-sm">
    {STATS_TABS.map(({ id, label, icon: Icon }) => {
      const isActive = active === id
      return (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={cn(
            'flex flex-col items-center gap-0.5 px-1 py-2.5 transition-colors',
            isActive ? 'text-white/90' : 'text-white/35 hover:text-white/55',
          )}
          style={isActive ? { color: accent } : undefined}
        >
          <Icon className="size-4" strokeWidth={isActive ? 2.25 : 1.75} />
          <span className="text-[8px] font-semibold uppercase tracking-wide leading-tight">
            {label}
          </span>
          {isActive && (
            <span
              className="mt-0.5 h-0.5 w-5 rounded-full"
              style={{ backgroundColor: accent }}
            />
          )}
        </button>
      )
    })}
  </div>
)

const TeamCardShowcaseGlass: FC<Props> = ({
  team,
  playersVariant = 'fan',
  checkoutVariant = 'chips',
  extendedStats = false,
}) => {
  const TeamIcon = getSquadIcon(team.icon)
  const [expanded, setExpanded] = useState(false)
  const [statsTab, setStatsTab] = useState<StatsTab>('game')
  const center = (team.members.length - 1) / 2
  const stepDefault = 28 + team.members.length * 10
  const stepHover = 44 + team.members.length * 22
  const accent = team.color

  return (
    <div
      className={cn(
        'relative h-full min-h-0 w-full overflow-hidden rounded-[28px] border border-white/10 transition-all duration-300',
        team.isCurrentTeam ? 'scale-[1.005]' : 'opacity-90',
      )}
      style={{
        boxShadow: team.isCurrentTeam
          ? `0 0 40px ${accent}33, 0 20px 56px rgba(0,0,0,0.5)`
          : '0 16px 48px rgba(0,0,0,0.45)',
      }}
    >
      {/* Blurred team-color gradient backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-[20%] -top-[25%] h-[70%] w-[75%] rounded-full blur-[72px]"
          style={{ background: accent, opacity: team.isCurrentTeam ? 0.45 : 0.28 }}
        />
        <div
          className="absolute -bottom-[30%] -right-[15%] h-[65%] w-[70%] rounded-full blur-[88px]"
          style={{
            background: accent,
            opacity: team.isCurrentTeam ? 0.22 : 0.12,
            filter: 'brightness(0.45) saturate(1.2)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(165deg, ${accent}18 0%, transparent 45%, ${accent}0a 100%)`,
          }}
        />
      </div>

      {/* Frost layer */}
      {team.isCurrentTeam && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${accent}22, transparent 70%)`,
          }}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-neutral-950/55 backdrop-blur-2xl backdrop-saturate-150" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.09] via-white/[0.03] to-black/25" />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]" />

      <div className="relative flex h-full min-h-0 flex-col">
        <div className="relative flex shrink-0 items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 backdrop-blur-md">
              <TeamIcon className="size-4 text-white" style={{ color: accent }} />
            </div>
            <span className="text-sm font-semibold text-white/95">{team.name}</span>
          </div>
          <TeamTurnIndicator
            isCurrentTeam={team.isCurrentTeam}
            isNextTeam={team.isNextTeam}
            color={accent}
          />
          {!team.isCurrentTeam && !team.isNextTeam && (
            <span className="text-xs tabular-nums text-white/45">
              {team.legsWon}/{team.legsTarget} legs
            </span>
          )}
        </div>

        <div
          className={cn(
            'relative flex min-h-0 flex-col items-center justify-center overflow-visible px-4 py-2',
            checkoutVariant === 'underScore' ? 'flex-[1.25] gap-4' : 'flex-[1.2]',
            extendedStats && 'flex-[1.05] gap-3',
          )}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <TeamIcon
              className="absolute blur-3xl"
              strokeWidth={1.25}
              style={{
                color: accent,
                opacity: team.isCurrentTeam ? 0.4 : 0.2,
                width: 'clamp(10rem, 34vh, 18rem)',
                height: 'clamp(10rem, 34vh, 18rem)',
              }}
            />
            <TeamIcon
              strokeWidth={1}
              style={{
                color: `${accent}${team.isCurrentTeam ? '44' : '22'}`,
                width: 'clamp(10rem, 34vh, 18rem)',
                height: 'clamp(10rem, 34vh, 18rem)',
                filter: `drop-shadow(0 0 24px ${accent}88)`,
              }}
            />
          </div>

          <p
            className="relative z-10 font-sans font-black tabular-nums leading-none tracking-[-0.05em] text-white"
            style={{
              fontSize: 'clamp(3.5rem, 16vh, 7.5rem)',
              textShadow: `0 0 32px ${accent}66, 0 2px 8px rgba(0,0,0,0.45)`,
            }}
          >
            {team.remainingScore}
          </p>

          {checkoutVariant === 'underScore' && (
            <div className="relative z-10 flex items-center gap-1.5">
              {team.recommendedCheckout.map((dart, i) => {
                const isLast = i === team.recommendedCheckout.length - 1
                return (
                  <span
                    key={`${dart}-${i}`}
                    className={cn(
                      'rounded-full border px-2.5 py-0.5 text-[11px] font-bold tabular-nums backdrop-blur-md',
                      isLast
                        ? 'border-white/25 text-white'
                        : 'border-white/10 bg-white/[0.06] text-white/55',
                    )}
                    style={
                      isLast
                        ? {
                            background: `${accent}44`,
                            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15), 0 0 10px ${accent}55`,
                            color: accent,
                          }
                        : undefined
                    }
                  >
                    {dart}
                  </span>
                )
              })}
            </div>
          )}
        </div>

        {playersVariant === 'fan' ? (
          <div
            className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden px-3"
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
          >
            <p className="mb-1 shrink-0 text-center text-[9px] uppercase tracking-widest text-white/35">
              {expanded ? 'Squad' : 'Hover players'}
            </p>

            <div className="relative min-h-[clamp(9rem,20vh,14rem)] flex-1 overflow-hidden">
              {team.members.map((member, i) => {
                const isActive = member.id === team.currentPlayerId
                const offsetFromCenter = i - center
                const step = expanded ? stepHover : stepDefault
                const x = offsetFromCenter * step
                const rotation = expanded ? 0 : offsetFromCenter * 4
                const lift = isActive && !expanded ? -10 : 0
                const scale = isActive && !expanded ? 1.05 : 1
                const zIndex = expanded ? 10 + i : isActive ? 20 : 10 + i

                return (
                  <div
                    key={member.id}
                    className="absolute bottom-0 left-1/2 will-change-transform"
                    style={{
                      zIndex,
                      transform: `translateX(calc(-50% + ${x}px)) translateY(${lift}px) rotate(${rotation}deg) scale(${scale})`,
                      transition:
                        'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
                    }}
                  >
                    <div
                      className={cn(
                        'flex flex-col items-center rounded-2xl border p-2.5 backdrop-blur-md',
                        isActive ? 'border-white/25 bg-white/12' : 'border-white/10 bg-white/[0.06]',
                      )}
                      style={{
                        width: 'clamp(5rem, 11vw, 7rem)',
                        boxShadow: isActive
                          ? `0 8px 24px ${accent}33, inset 0 1px 0 rgba(255,255,255,0.18)`
                          : 'inset 0 1px 0 rgba(255,255,255,0.08)',
                      }}
                    >
                      <Avatar
                        name={member.name}
                        image={member.image}
                        size={isActive ? 'lg' : 'md'}
                      />
                      <p className="mt-1.5 max-w-full truncate text-[10px] font-medium text-white/90">
                        {member.name.split(' ')[0]}
                      </p>
                      <p
                        className="mt-0.5 text-sm font-black tabular-nums leading-none"
                        style={{ color: isActive ? accent : 'rgba(255,255,255,0.85)' }}
                      >
                        {extendedStats ? (
                          <span className="flex flex-col items-center gap-0.5 text-[10px]">
                            <span>
                              <span className="text-[8px] font-medium uppercase text-white/30">Leg </span>
                              {member.legAverage.toFixed(1)}
                            </span>
                            <span>
                              <span className="text-[8px] font-medium uppercase text-white/30">Game </span>
                              {member.matchAverage.toFixed(1)}
                            </span>
                          </span>
                        ) : (
                          member.matchAverage.toFixed(1)
                        )}
                      </p>
                      {expanded && (
                        <p className="mt-1 text-[9px] tabular-nums text-white/40">
                          last {member.lastVisit}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div
            className={cn(
              'relative z-10 flex min-h-0 flex-1 flex-col px-3',
              extendedStats
                ? 'min-h-0 justify-start gap-3 pb-1 pt-1'
                : 'items-center justify-center',
            )}
          >
            <div className="flex items-center justify-center gap-[clamp(0.75rem,3.5vw,1.5rem)]">
              {team.members.map((member) => {
                const isActive = member.id === team.currentPlayerId
                return (
                  <div key={member.id} className="flex flex-col items-center gap-1.5">
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
                        name={member.name}
                        image={member.image}
                        size="md"
                        className={cn('border-2 border-white/10', !isActive && 'opacity-70')}
                      />
                    </div>
                    <p
                      className={cn(
                        'max-w-[72px] truncate text-xs',
                        isActive ? 'font-semibold text-white/95' : 'text-white/45',
                      )}
                    >
                      {member.name.split(' ')[0]}
                    </p>
                    <PlayerAverages
                      legAverage={member.legAverage}
                      gameAverage={member.matchAverage}
                      isActive={isActive}
                      accent={accent}
                      dual={extendedStats}
                    />
                  </div>
                )
              })}
            </div>
            {extendedStats && (
              <div className="min-h-0 w-full flex-1 overflow-y-auto">
                {statsTab === 'game' && <ExtendedStatsPanel stats={team.stats} />}
                {statsTab === 'players' && (
                  <PlayerStatsPanel team={team} accent={accent} />
                )}
                {statsTab === 'history' && (
                  <ScoreHistoryPanel stats={team.stats} accent={accent} />
                )}
              </div>
            )}
          </div>
        )}

        {checkoutVariant === 'chips' && (
          <div className="relative z-10 flex shrink-0 flex-col items-center gap-2 px-4 pb-3 pt-1">
            <div className="flex gap-2">
              {team.recommendedCheckout.map((dart, i) => (
                <span
                  key={`${dart}-${i}`}
                  className={cn(
                    'flex size-9 items-center justify-center rounded-xl border text-xs font-bold tabular-nums backdrop-blur-md',
                    i === team.recommendedCheckout.length - 1
                      ? 'border-white/25 text-white'
                      : 'border-white/10 bg-white/8 text-white/90',
                  )}
                  style={
                    i === team.recommendedCheckout.length - 1
                      ? {
                          background: `${accent}44`,
                          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15), 0 0 12px ${accent}44`,
                        }
                      : undefined
                  }
                >
                  {dart}
                </span>
              ))}
            </div>
          </div>
        )}

        {!extendedStats && (
          <div className="relative z-10 grid grid-cols-3 gap-px border-t border-white/8 bg-white/[0.04] text-center text-[10px] backdrop-blur-sm">
            {[
              ['Match', team.stats.matchAverage.toFixed(1)],
              ['Leg', team.stats.legAverage.toFixed(1)],
              ['CO', `${team.stats.checkoutRate}%`],
            ].map(([label, val]) => (
              <div key={label} className="py-2.5">
                <p className="text-[8px] uppercase tracking-wider text-white/35">{label}</p>
                <p className="font-bold tabular-nums text-white/90">{val}</p>
              </div>
            ))}
          </div>
        )}

        {extendedStats && (
          <StatsMenubar active={statsTab} onChange={setStatsTab} accent={accent} />
        )}
      </div>
    </div>
  )
}

export default TeamCardShowcaseGlass
