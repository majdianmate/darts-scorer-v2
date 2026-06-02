import { type FC } from 'react'
import Avatar from '#/components/Avatar'
import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'
import { cn } from '#/lib/utils'
import type { MockTeamCardData } from '#/utils/mock'

interface Props {
  team: MockTeamCardData
}

const TeamCardSplit: FC<Props> = ({ team }) => {
  const TeamIcon = getSquadIcon(team.icon)

  return (
    <div
      className={cn(
        'flex min-h-[440px] overflow-hidden rounded-2xl ring-1 ring-foreground/10 transition-all',
        !team.isCurrentTeam && 'opacity-75',
      )}
      style={
        team.isCurrentTeam
          ? { boxShadow: `0 0 0 2px ${team.color}40` }
          : undefined
      }
    >
      <div
        className="relative flex w-[42%] flex-col justify-between p-5 text-white"
        style={{ backgroundColor: team.color }}
      >
        <div>
          <TeamIcon className="size-5 opacity-80" />
          <h3 className="mt-3 text-lg font-bold leading-tight">{team.name}</h3>
          <p className="mt-1 text-xs opacity-70">
            {team.legsWon} / {team.legsTarget} legs
          </p>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] opacity-60">
            Remaining
          </p>
          <p className="display-title text-6xl font-bold tabular-nums leading-none">
            {team.remainingScore}
          </p>
        </div>

        {team.isCurrentTeam && (
          <div className="absolute right-0 top-1/2 size-3 -translate-y-1/2 translate-x-1/2 rotate-45 bg-card" />
        )}
      </div>

      <div className="flex flex-1 flex-col bg-card">
        <div className="border-b border-border px-4 py-3">
          {team.isCurrentTeam && (
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              At oche
            </p>
          )}
          <div className="flex gap-2">
            {team.recommendedCheckout.map((dart, i) => (
              <span
                key={`${dart}-${i}`}
                className="rounded-md px-2 py-1 text-xs font-bold tabular-nums"
                style={{ backgroundColor: `${team.color}18`, color: team.color }}
              >
                {dart}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-1 px-3 py-2">
          {team.members.map((member) => {
            const isActive = member.id === team.currentPlayerId
            return (
              <div
                key={member.id}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-2 py-2',
                  isActive && 'bg-muted',
                )}
              >
                <Avatar
                  name={member.name}
                  image={member.image}
                  size="sm"
                  className={cn(!isActive && 'opacity-50')}
                />
                <span
                  className={cn(
                    'flex-1 truncate text-sm',
                    isActive ? 'font-semibold' : 'text-muted-foreground',
                  )}
                >
                  {member.name}
                </span>
                <span
                  className="text-sm font-bold tabular-nums"
                  style={isActive ? { color: team.color } : undefined}
                >
                  {member.matchAverage.toFixed(1)}
                </span>
                {isActive && (
                  <span
                    className="size-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: team.color }}
                  />
                )}
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-2 gap-px border-t border-border bg-border text-center text-xs">
          {[
            ['Match', team.stats.matchAverage.toFixed(1)],
            ['Leg', team.stats.legAverage.toFixed(1)],
            ['Checkout', `${team.stats.checkoutRate}%`],
            ['Hi CO', String(team.stats.highestCheckout)],
          ].map(([label, val]) => (
            <div key={label} className="bg-card px-2 py-2">
              <p className="text-[9px] uppercase text-muted-foreground">{label}</p>
              <p className="font-bold tabular-nums">{val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TeamCardSplit
