import { type FC } from 'react'
import Avatar from '#/components/Avatar'
import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'
import { cn } from '#/lib/utils'
import type { MockTeamCardData } from '#/utils/mock'

interface Props {
  team: MockTeamCardData
}

const TeamCardOche: FC<Props> = ({ team }) => {
  const TeamIcon = getSquadIcon(team.icon)

  return (
    <div
      className={cn(
        'relative flex min-h-[440px] flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-all',
        !team.isCurrentTeam && 'opacity-75',
      )}
      style={
        team.isCurrentTeam
          ? { boxShadow: `0 0 0 2px ${team.color}, 0 0 24px ${team.color}20` }
          : undefined
      }
    >
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{ backgroundColor: `${team.color}18` }}
      >
        <div
          className="flex size-8 items-center justify-center rounded-lg"
          style={{ backgroundColor: team.color, color: '#fff' }}
        >
          <TeamIcon className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold uppercase tracking-wide">
            {team.name}
          </h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Legs
          </p>
          <p className="text-lg font-bold tabular-nums leading-none">
            {team.legsWon}
            <span className="text-sm font-normal text-muted-foreground">
              /{team.legsTarget}
            </span>
          </p>
        </div>
      </div>

      {team.isCurrentTeam && (
        <div
          className="flex items-center justify-center gap-2 py-1 text-[10px] font-bold uppercase tracking-[0.25em]"
          style={{ backgroundColor: team.color, color: '#fff' }}
        >
          <span className="size-1.5 animate-pulse rounded-full bg-white" />
          Live · At the oche
        </div>
      )}

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-5">
        <p className="text-8xl font-extrabold tabular-nums leading-none tracking-tighter">
          {team.remainingScore}
        </p>
        <div className="mt-4 flex gap-2">
          {team.recommendedCheckout.map((dart, i) => (
            <div
              key={`${dart}-${i}`}
              className="flex size-11 items-center justify-center rounded-lg bg-muted text-sm font-bold tabular-nums ring-1 ring-foreground/10"
            >
              {dart}
            </div>
          ))}
        </div>
        <p className="mt-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          Suggested checkout
        </p>
      </div>

      <div className="border-t border-border px-4 py-3">
        <div className="flex items-end justify-center gap-5">
          {team.members.map((member) => {
            const isActive = member.id === team.currentPlayerId
            return (
              <div
                key={member.id}
                className={cn(
                  'relative flex flex-col items-center gap-1.5 pb-1',
                  isActive && 'pb-0',
                )}
              >
                {isActive && (
                  <div
                    className="absolute -top-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full"
                    style={{ backgroundColor: team.color }}
                  />
                )}
                <Avatar
                  name={member.name}
                  image={member.image}
                  size={isActive ? 'lg' : 'md'}
                  className={cn(
                    'border-2 transition-all',
                    isActive ? 'border-transparent' : 'border-border opacity-60',
                  )}
                  style={
                    isActive
                      ? { boxShadow: `0 0 0 2px ${team.color}` }
                      : undefined
                  }
                />
                <p
                  className={cn(
                    'max-w-[76px] truncate text-xs',
                    isActive ? 'font-semibold' : 'text-muted-foreground',
                  )}
                >
                  {member.name}
                </p>
                <p
                  className={cn(
                    'text-xs font-bold tabular-nums',
                    isActive ? '' : 'text-muted-foreground',
                  )}
                  style={isActive ? { color: team.color } : undefined}
                >
                  {member.matchAverage.toFixed(1)}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <div
        className="grid grid-cols-5 gap-0 border-t border-border text-center"
        style={{ backgroundColor: `${team.color}08` }}
      >
        {[
          ['Match', team.stats.matchAverage.toFixed(1)],
          ['Leg', team.stats.legAverage.toFixed(1)],
          ['CO%', `${team.stats.checkoutRate}%`],
          ['1st 9', team.stats.first9Average.toFixed(1)],
          ['Darts', String(team.stats.dartsThrown)],
        ].map(([label, value]) => (
          <div key={label} className="border-r border-border/50 px-1 py-2.5 last:border-r-0">
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className="text-xs font-bold tabular-nums">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeamCardOche
