import { type FC } from 'react'
import Avatar from '#/components/Avatar'
import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'
import { cn } from '#/lib/utils'
import type { MockTeamCardData } from '#/utils/mock'

interface Props {
  team: MockTeamCardData
}

const TeamCardRibbon: FC<Props> = ({ team }) => {
  const TeamIcon = getSquadIcon(team.icon)

  return (
    <div
      className={cn(
        'relative flex min-h-[440px] flex-col overflow-hidden rounded-xl bg-muted/30 transition-all',
        !team.isCurrentTeam && 'opacity-75',
      )}
    >
      <div
        className="absolute -right-8 top-6 z-10 rotate-45 px-10 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-md"
        style={{ backgroundColor: team.color }}
      >
        {team.isCurrentTeam ? 'Throwing' : 'Waiting'}
      </div>

      <div className="relative mx-4 mt-6 overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-foreground/10">
        <div className="flex items-center gap-4 px-4 py-3">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-card"
            style={{
              borderColor: team.color,
              backgroundColor: `${team.color}15`,
              boxShadow: `0 0 0 2px ${team.color}`,
            }}
          >
            <TeamIcon className="size-5" style={{ color: team.color }} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-heading text-base font-semibold">
              {team.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              Leg {team.legsWon + 1} · first to {team.legsTarget}
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black tabular-nums leading-none">
              {team.remainingScore}
            </p>
          </div>
        </div>

        <div
          className="h-1 w-full"
          style={{
            background: `repeating-linear-gradient(90deg, ${team.color}, ${team.color} 8px, transparent 8px, transparent 16px)`,
            opacity: 0.5,
          }}
        />

        <div className="grid grid-cols-3 gap-2 px-4 py-3">
          {team.recommendedCheckout.map((dart, i) => (
            <div
              key={`${dart}-${i}`}
              className="flex flex-col items-center rounded-lg border border-dashed border-border py-2"
            >
              <span className="text-[9px] uppercase text-muted-foreground">
                Dart {i + 1}
              </span>
              <span className="text-lg font-bold tabular-nums">{dart}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-0 px-4 py-4">
        {team.members.map((member, idx) => {
          const isActive = member.id === team.currentPlayerId
          return (
            <div key={member.id} className="relative flex items-center">
              {idx < team.members.length - 1 && (
                <div className="absolute left-5 top-8 h-full w-px bg-border" />
              )}
              <div
                className={cn(
                  'relative z-10 flex w-full items-center gap-3 rounded-xl px-3 py-2.5',
                  isActive && 'bg-card shadow-sm ring-1 ring-foreground/10',
                )}
              >
                <Avatar
                  name={member.name}
                  image={member.image}
                  size="sm"
                  className={cn(
                    'shrink-0',
                    isActive && 'ring-2',
                  )}
                  style={isActive ? { boxShadow: `0 0 0 2px ${team.color}` } : undefined}
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      'truncate text-sm',
                      isActive ? 'font-semibold' : 'text-muted-foreground',
                    )}
                  >
                    {member.name}
                  </p>
                  {isActive && team.isCurrentTeam && (
                    <p className="text-[10px] font-medium" style={{ color: team.color }}>
                      Up now
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold tabular-nums">
                    {member.matchAverage.toFixed(1)}
                  </p>
                  <p className="text-[9px] text-muted-foreground">avg</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div
        className="mx-4 mb-4 flex items-center justify-between rounded-lg px-4 py-3 text-xs"
        style={{ backgroundColor: `${team.color}12` }}
      >
        <span>
          Match <strong className="tabular-nums">{team.stats.matchAverage.toFixed(1)}</strong>
        </span>
        <span>
          Leg <strong className="tabular-nums">{team.stats.legAverage.toFixed(1)}</strong>
        </span>
        <span>
          CO <strong className="tabular-nums">{team.stats.checkoutRate}%</strong>
        </span>
        <span>
          Hi <strong className="tabular-nums">{team.stats.highestCheckout}</strong>
        </span>
      </div>
    </div>
  )
}

export default TeamCardRibbon
