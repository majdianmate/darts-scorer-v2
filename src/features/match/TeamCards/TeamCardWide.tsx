import { type FC } from 'react'
import Avatar from '#/components/Avatar'
import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'
import { cn } from '#/lib/utils'
import type { MockTeamCardData } from '#/utils/mock'

interface Props {
  team: MockTeamCardData
}

/** Landscape — everything in one horizontal band. No vertical score column. */
const TeamCardWide: FC<Props> = ({ team }) => {
  const TeamIcon = getSquadIcon(team.icon)

  return (
    <div
      className={cn(
        'flex min-h-[200px] flex-col overflow-hidden border-y-2 transition-all sm:min-h-[220px]',
        !team.isCurrentTeam && 'opacity-70',
      )}
      style={{ borderColor: team.isCurrentTeam ? team.color : 'var(--border)' }}
    >
      <div className="flex flex-1 items-stretch">
        <div
          className="flex w-14 shrink-0 flex-col items-center justify-center gap-2 border-r border-border py-3"
          style={team.isCurrentTeam ? { backgroundColor: `${team.color}15` } : undefined}
        >
          <TeamIcon className="size-5" style={{ color: team.color }} />
          <span
            className="text-[10px] font-black tabular-nums [writing-mode:vertical-lr] rotate-180"
            style={{ color: team.color }}
          >
            {team.legsWon}/{team.legsTarget}
          </span>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-4 px-4 py-3">
          <div className="shrink-0">
            <p className="max-w-[100px] truncate text-xs font-bold uppercase leading-tight">
              {team.name}
            </p>
            {team.isCurrentTeam && (
              <span className="text-[9px] font-bold uppercase" style={{ color: team.color }}>
                ● live
              </span>
            )}
          </div>

          <p
            className="shrink-0 text-5xl font-black tabular-nums leading-none sm:text-6xl"
            style={{ color: team.isCurrentTeam ? team.color : undefined }}
          >
            {team.remainingScore}
          </p>

          <div className="hidden h-12 w-px shrink-0 bg-border sm:block" />

          <div className="flex shrink-0 gap-1">
            {team.recommendedCheckout.map((d, i) => (
              <span
                key={`${d}-${i}`}
                className="flex size-9 items-center justify-center text-xs font-black tabular-nums"
                style={
                  i === team.recommendedCheckout.length - 1
                    ? { backgroundColor: team.color, color: '#fff' }
                    : { backgroundColor: 'var(--muted)' }
                }
              >
                {d}
              </span>
            ))}
          </div>

          <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-3 overflow-x-auto">
            {team.members.map((m) => {
              const active = m.id === team.currentPlayerId
              return (
                <div
                  key={m.id}
                  className={cn(
                    'flex shrink-0 items-center gap-2 rounded-full py-1 pl-1 pr-3',
                    active && 'ring-1',
                  )}
                  style={
                    active
                      ? {
                          backgroundColor: `${team.color}15`,
                          boxShadow: `0 0 0 1px ${team.color}`,
                        }
                      : undefined
                  }
                >
                  <Avatar name={m.name} image={m.image} size="xs" />
                  <div className="text-left">
                    <p className={cn('max-w-[64px] truncate text-[10px]', active && 'font-bold')}>
                      {m.name.split(' ')[0]}
                    </p>
                    <p className="text-[10px] font-bold tabular-nums">{m.matchAverage.toFixed(1)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div
        className="flex items-center justify-between gap-4 px-4 py-1.5 text-[10px] tabular-nums"
        style={{ backgroundColor: `${team.color}08` }}
      >
        <span>M {team.stats.matchAverage.toFixed(1)}</span>
        <span>L {team.stats.legAverage.toFixed(1)}</span>
        <span>CO {team.stats.checkoutRate}%</span>
        <span>Win {team.stats.winProbability}%</span>
        <span>180×{team.stats.ton80s}</span>
        <span>Hi {team.stats.highestVisit}</span>
      </div>
    </div>
  )
}

export default TeamCardWide
