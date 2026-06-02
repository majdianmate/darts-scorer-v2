import { type FC } from 'react'
import Avatar from '#/components/Avatar'
import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'
import { cn } from '#/lib/utils'
import type { MockTeamCardData } from '#/utils/mock'

interface Props {
  team: MockTeamCardData
}

/** Ghost — score is a watermark; UI floats on top with extreme negative space. */
const TeamCardGhost: FC<Props> = ({ team }) => {
  const TeamIcon = getSquadIcon(team.icon)
  const active = team.members.find((m) => m.id === team.currentPlayerId)

  return (
    <div
      className={cn(
        'relative flex min-h-[480px] items-end overflow-hidden p-6 transition-all',
        !team.isCurrentTeam && 'opacity-60',
      )}
    >
      <p
        aria-hidden
        className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 select-none text-[280px] font-black leading-none tabular-nums tracking-tighter"
        style={{ color: team.color, opacity: 0.07 }}
      >
        {team.remainingScore}
      </p>

      <div className="relative z-10 flex w-full flex-col gap-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <TeamIcon className="size-3.5" style={{ color: team.color }} />
              <span className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
                {team.name}
              </span>
            </div>
            <p
              className="text-4xl font-light tabular-nums tracking-tight"
              style={{ color: team.color }}
            >
              {team.remainingScore}
              <span className="ml-2 text-base font-normal text-muted-foreground">left</span>
            </p>
          </div>
          {team.isCurrentTeam && (
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Win chance
              </p>
              <p className="text-3xl font-light tabular-nums">{team.stats.winProbability}%</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
          {team.recommendedCheckout.map((d, i) => (
            <span key={`${d}-${i}`} className="font-medium tabular-nums text-foreground">
              {d}
            </span>
          ))}
          <span className="text-muted-foreground/40">·</span>
          <span>{team.stats.matchAverage.toFixed(1)} match</span>
          <span>{team.stats.legAverage.toFixed(1)} leg</span>
          <span>{team.stats.checkoutRate}% co</span>
        </div>

        {active && (
          <div className="flex items-center gap-4">
            <Avatar
              name={active.name}
              image={active.image}
              size="lg"
              className={cn(team.isCurrentTeam && 'opacity-100')}
            />
            <div>
              <p className="text-lg font-medium">{active.name}</p>
              <p className="text-sm text-muted-foreground">
                {active.matchAverage.toFixed(1)} avg · last {active.lastVisit} · leg{' '}
                {active.legAverage.toFixed(1)}
              </p>
            </div>
            {team.isCurrentTeam && (
              <span
                className="ml-auto text-[10px] uppercase tracking-[0.3em]"
                style={{ color: team.color }}
              >
                throwing
              </span>
            )}
          </div>
        )}

        <div className="flex gap-8 border-t border-border/50 pt-4">
          {team.members
            .filter((m) => m.id !== team.currentPlayerId)
            .map((m) => (
              <div key={m.id} className="opacity-40">
                <p className="text-xs">{m.name.split(' ')[0]}</p>
                <p className="text-sm tabular-nums">{m.matchAverage.toFixed(1)}</p>
              </div>
            ))}
          <div className="ml-auto text-right text-xs text-muted-foreground">
            <p>{team.legsWon}/{team.legsTarget} legs</p>
            <p>{team.stats.ton80s} × 180</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamCardGhost
