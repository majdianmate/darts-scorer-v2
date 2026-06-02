import { type FC } from 'react'
import Avatar from '#/components/Avatar'
import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'
import { cn } from '#/lib/utils'
import type { MockTeamCardData } from '#/utils/mock'

interface Props {
  team: MockTeamCardData
}

const TeamCardBento: FC<Props> = ({ team }) => {
  const TeamIcon = getSquadIcon(team.icon)

  return (
    <div
      className={cn(
        'grid min-h-[440px] grid-cols-6 grid-rows-[auto_1fr_auto_auto] gap-2 rounded-2xl bg-muted/40 p-2 transition-all',
        !team.isCurrentTeam && 'opacity-75',
      )}
      style={
        team.isCurrentTeam
          ? { boxShadow: `0 0 0 2px ${team.color}30` }
          : undefined
      }
    >
      <div
        className="col-span-4 flex items-center gap-2 rounded-xl bg-card px-3 py-2.5 ring-1 ring-foreground/8"
      >
        <TeamIcon className="size-4 shrink-0" style={{ color: team.color }} />
        <span className="truncate text-sm font-semibold">{team.name}</span>
        {team.isCurrentTeam && (
          <span
            className="ml-auto shrink-0 rounded-md px-1.5 py-px text-[9px] font-bold uppercase text-white"
            style={{ backgroundColor: team.color }}
          >
            Live
          </span>
        )}
      </div>

      <div className="col-span-2 flex items-center justify-center rounded-xl bg-card ring-1 ring-foreground/8">
        <span className="text-sm font-bold tabular-nums">
          {team.legsWon}<span className="text-muted-foreground">/{team.legsTarget}</span>
        </span>
      </div>

      <div
        className="col-span-4 row-span-2 flex flex-col justify-center rounded-xl px-4 ring-1 ring-foreground/8"
        style={{ backgroundColor: `${team.color}10` }}
      >
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Remaining
        </p>
        <p
          className="display-title text-7xl font-bold tabular-nums leading-none"
          style={{ color: team.color }}
        >
          {team.remainingScore}
        </p>
      </div>

      <div className="col-span-2 row-span-2 flex flex-col justify-center gap-2 rounded-xl bg-card p-3 ring-1 ring-foreground/8">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
          Checkout
        </p>
        {team.recommendedCheckout.map((dart, i) => (
          <span
            key={`${dart}-${i}`}
            className="rounded-lg bg-muted px-2 py-1.5 text-center text-sm font-bold tabular-nums"
          >
            {dart}
          </span>
        ))}
      </div>

      {team.members.map((member) => {
        const isActive = member.id === team.currentPlayerId
        return (
          <div
            key={member.id}
            className={cn(
              'col-span-2 flex items-center gap-2 rounded-xl px-2 py-2 ring-1',
              isActive
                ? 'ring-foreground/15 bg-card'
                : 'bg-card/60 ring-foreground/5',
            )}
            style={
              isActive
                ? { boxShadow: `inset 3px 0 0 ${team.color}` }
                : undefined
            }
          >
            <Avatar
              name={member.name}
              image={member.image}
              size="xs"
              className={cn(!isActive && 'opacity-60')}
            />
            <div className="min-w-0 flex-1">
              <p className={cn('truncate text-[11px]', isActive && 'font-semibold')}>
                {member.name.split(' ')[0]}
              </p>
              <p
                className="text-[10px] font-bold tabular-nums"
                style={isActive ? { color: team.color } : undefined}
              >
                {member.matchAverage.toFixed(1)}
              </p>
            </div>
          </div>
        )
      })}

      <div className="col-span-6 grid grid-cols-4 gap-2">
        {[
          ['Match', team.stats.matchAverage.toFixed(1)],
          ['Leg', team.stats.legAverage.toFixed(1)],
          ['CO%', `${team.stats.checkoutRate}%`],
          ['Hi', String(team.stats.highestCheckout)],
        ].map(([label, val]) => (
          <div
            key={label}
            className="rounded-lg bg-card px-2 py-2 text-center ring-1 ring-foreground/8"
          >
            <p className="text-[8px] uppercase text-muted-foreground">{label}</p>
            <p className="text-xs font-bold tabular-nums">{val}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeamCardBento
