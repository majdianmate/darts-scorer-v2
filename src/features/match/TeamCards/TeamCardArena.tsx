import { type FC } from 'react'
import Avatar from '#/components/Avatar'
import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'
import { cn } from '#/lib/utils'
import type { MockTeamCardData } from '#/utils/mock'

interface Props {
  team: MockTeamCardData
}

const TeamCardArena: FC<Props> = ({ team }) => {
  const TeamIcon = getSquadIcon(team.icon)
  const activeMember = team.members.find((m) => m.id === team.currentPlayerId)

  return (
    <div
      className={cn(
        'relative flex min-h-[440px] flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10 transition-all',
        !team.isCurrentTeam && 'opacity-75',
      )}
    >
      {team.isCurrentTeam && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${team.color}20, transparent 70%)`,
          }}
        />
      )}

      <div className="relative flex items-center justify-between px-5 pt-5">
        <div className="flex items-center gap-2.5">
          <div
            className="flex size-9 items-center justify-center rounded-full ring-1 ring-foreground/10"
            style={{ backgroundColor: `${team.color}15` }}
          >
            <TeamIcon className="size-4" style={{ color: team.color }} />
          </div>
          <div>
            <h3 className="font-heading text-base font-medium">{team.name}</h3>
            <p className="text-xs text-muted-foreground">
              {team.legsWon} leg{team.legsWon !== 1 ? 's' : ''} won
            </p>
          </div>
        </div>
        {team.isCurrentTeam && (
          <div className="flex items-center gap-1.5 rounded-full bg-foreground/5 px-3 py-1 ring-1 ring-foreground/10">
            <span
              className="size-2 rounded-full animate-pulse"
              style={{ backgroundColor: team.color }}
            />
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              Throwing
            </span>
          </div>
        )}
      </div>

      <div className="relative flex flex-col items-center px-5 pt-4 pb-2">
        <p
          className="display-title text-[88px] font-bold leading-none tabular-nums tracking-tight"
          style={{
            color: team.isCurrentTeam ? team.color : undefined,
            textShadow: team.isCurrentTeam ? `0 4px 40px ${team.color}40` : undefined,
          }}
        >
          {team.remainingScore}
        </p>

        <div className="mt-3 flex items-center gap-1.5">
          {team.recommendedCheckout.map((dart, i) => (
            <span
              key={`${dart}-${i}`}
              className="rounded-md bg-muted px-2.5 py-1 text-xs font-semibold tabular-nums ring-1 ring-foreground/8"
            >
              {dart}
            </span>
          ))}
        </div>
      </div>

      {activeMember && team.isCurrentTeam && (
        <div className="relative mx-5 mb-4 flex items-center gap-3 rounded-xl bg-muted/50 p-3 ring-1 ring-foreground/8">
          <Avatar
            name={activeMember.name}
            image={activeMember.image}
            size="md"
            className="border-2"
            style={{ borderColor: team.color }}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{activeMember.name}</p>
            <p className="text-xs text-muted-foreground">
              Match avg · {activeMember.matchAverage.toFixed(1)}
            </p>
          </div>
          <div
            className="rounded-lg px-2.5 py-1 text-xs font-bold tabular-nums text-white"
            style={{ backgroundColor: team.color }}
          >
            ON
          </div>
        </div>
      )}

      <div className="relative flex justify-center gap-3 px-5 pb-4">
        {team.members
          .filter((m) => !(team.isCurrentTeam && m.id === team.currentPlayerId))
          .map((member) => (
            <div key={member.id} className="flex flex-col items-center gap-1 opacity-60">
              <Avatar
                name={member.name}
                image={member.image}
                size="sm"
                className="border border-border"
              />
              <p className="max-w-[60px] truncate text-[10px] text-muted-foreground">
                {member.name.split(' ')[0]}
              </p>
              <p className="text-[10px] font-medium tabular-nums">
                {member.matchAverage.toFixed(1)}
              </p>
            </div>
          ))}
      </div>

      <div className="relative mt-auto border-t border-border">
        <div className="grid grid-cols-3 divide-x divide-border">
          {[
            { label: 'Match avg', value: team.stats.matchAverage.toFixed(1) },
            { label: 'Leg avg', value: team.stats.legAverage.toFixed(1) },
            { label: 'Checkout', value: `${team.stats.checkoutRate}%` },
          ].map((stat) => (
            <div key={stat.label} className="px-3 py-3 text-center">
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              <p className="text-sm font-semibold tabular-nums">{stat.value}</p>
            </div>
          ))}
        </div>
        <div
          className="h-0.5 w-full"
          style={{
            background: team.isCurrentTeam
              ? `linear-gradient(90deg, transparent, ${team.color}, transparent)`
              : 'transparent',
          }}
        />
      </div>
    </div>
  )
}

export default TeamCardArena
