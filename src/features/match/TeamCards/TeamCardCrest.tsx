import { type FC } from 'react'
import Avatar from '#/components/Avatar'
import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'
import { cn } from '#/lib/utils'
import type { MockTeamCardData } from '#/utils/mock'

interface Props {
  team: MockTeamCardData
}

const TeamCardCrest: FC<Props> = ({ team }) => {
  const TeamIcon = getSquadIcon(team.icon)

  return (
    <div
      className={cn(
        'relative flex min-h-[440px] flex-col items-center transition-all',
        !team.isCurrentTeam && 'opacity-75',
      )}
    >
      <div
        className="relative flex w-full flex-1 flex-col items-center px-4 pt-6"
        style={{
          clipPath:
            'polygon(50% 0%, 100% 12%, 100% 72%, 50% 100%, 0% 72%, 0% 12%)',
          background: `linear-gradient(180deg, ${team.color}28 0%, var(--card) 45%, var(--card) 100%)`,
          boxShadow: team.isCurrentTeam
            ? `0 0 0 2px ${team.color}50, 0 16px 40px ${team.color}20`
            : '0 4px 20px rgba(0,0,0,0.2)',
        }}
      >
        <div
          className="mb-2 flex size-12 items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-transparent"
          style={{
            backgroundColor: team.color,
            boxShadow: `0 0 0 2px ${team.color}60`,
          }}
        >
          <TeamIcon className="size-6 text-white" />
        </div>

        <h3 className="font-heading text-base font-semibold">{team.name}</h3>
        <p className="text-xs text-muted-foreground">
          {team.legsWon} legs · first to {team.legsTarget}
        </p>

        {team.isCurrentTeam && (
          <span
            className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: team.color }}
          >
            ● At the oche
          </span>
        )}

        <p className="display-title mt-4 text-6xl font-bold tabular-nums leading-none">
          {team.remainingScore}
        </p>

        <div className="mt-3 flex gap-1.5">
          {team.recommendedCheckout.map((dart, i) => (
            <span
              key={`${dart}-${i}`}
              className="rounded-md bg-muted px-2 py-0.5 text-xs font-bold tabular-nums"
            >
              {dart}
            </span>
          ))}
        </div>

        <div className="mt-5 flex w-full max-w-[260px] justify-center gap-4">
          {team.members.map((member) => {
            const isActive = member.id === team.currentPlayerId
            return (
              <div key={member.id} className="flex flex-col items-center gap-1">
                <Avatar
                  name={member.name}
                  image={member.image}
                  size={isActive ? 'md' : 'sm'}
                  className={cn(
                    'border-2',
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
                    'max-w-[60px] truncate text-[9px]',
                    isActive ? 'font-semibold' : 'text-muted-foreground',
                  )}
                >
                  {member.name.split(' ')[0]}
                </p>
                <p
                  className="text-[10px] font-bold tabular-nums"
                  style={isActive ? { color: team.color } : undefined}
                >
                  {member.matchAverage.toFixed(1)}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-3 grid w-full grid-cols-4 gap-2 px-2 pb-2 text-center text-xs">
        {[
          ['M', team.stats.matchAverage.toFixed(1)],
          ['L', team.stats.legAverage.toFixed(1)],
          ['CO', `${team.stats.checkoutRate}%`],
          ['9', team.stats.first9Average.toFixed(1)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg bg-muted/50 py-2">
            <p className="text-[8px] uppercase text-muted-foreground">{k}</p>
            <p className="font-bold tabular-nums">{v}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeamCardCrest
