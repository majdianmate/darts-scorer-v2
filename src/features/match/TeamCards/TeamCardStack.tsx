import { type FC } from 'react'
import Avatar from '#/components/Avatar'
import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'
import { cn } from '#/lib/utils'
import type { MockTeamCardData } from '#/utils/mock'

interface Props {
  team: MockTeamCardData
}

const FAN_OFFSETS = [-28, 0, 28]

const TeamCardStack: FC<Props> = ({ team }) => {
  const TeamIcon = getSquadIcon(team.icon)

  return (
    <div
      className={cn(
        'relative flex min-h-[440px] flex-col overflow-hidden rounded-2xl bg-gradient-to-b from-muted/30 to-card ring-1 ring-foreground/10 transition-all',
        !team.isCurrentTeam && 'opacity-75',
      )}
      style={
        team.isCurrentTeam
          ? { boxShadow: `inset 0 4px 0 ${team.color}` }
          : undefined
      }
    >
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="flex items-center gap-2">
          <TeamIcon className="size-4" style={{ color: team.color }} />
          <span className="text-sm font-semibold">{team.name}</span>
        </div>
        {team.isCurrentTeam ? (
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: team.color }}>
            Throwing
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">{team.legsWon}/{team.legsTarget}</span>
        )}
      </div>

      <div className="relative mx-auto mt-2 flex h-[140px] w-full max-w-[280px] items-end justify-center">
        {team.members.map((member, i) => {
          const isActive = member.id === team.currentPlayerId
          const offset = FAN_OFFSETS[i] ?? (i - 1) * 28
          const rotation = offset * 0.4
          const zIndex = isActive ? 10 : i

          return (
            <div
              key={member.id}
              className="absolute bottom-0 transition-all duration-300"
              style={{
                transform: `translateX(${offset}px) rotate(${rotation}deg)`,
                zIndex,
              }}
            >
              <div
                className={cn(
                  'flex w-[88px] flex-col items-center rounded-xl border bg-card p-2 shadow-lg',
                  isActive ? 'border-transparent' : 'border-border opacity-80',
                )}
                style={
                  isActive
                    ? {
                        boxShadow: `0 8px 24px ${team.color}40, 0 0 0 2px ${team.color}`,
                        transform: 'translateY(-12px) scale(1.08)',
                      }
                    : undefined
                }
              >
                <Avatar name={member.name} image={member.image} size="md" />
                <p className="mt-1.5 max-w-full truncate text-[10px] font-medium">
                  {member.name.split(' ')[0]}
                </p>
                <p
                  className="text-xs font-bold tabular-nums"
                  style={isActive ? { color: team.color } : undefined}
                >
                  {member.matchAverage.toFixed(1)}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex flex-col items-center px-5 py-4">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Remaining
        </p>
        <p className="display-title text-6xl font-bold tabular-nums leading-none">
          {team.remainingScore}
        </p>
      </div>

      <div className="mx-5 mb-3 flex justify-center gap-2">
        {team.recommendedCheckout.map((dart, i) => (
          <div
            key={`${dart}-${i}`}
            className="flex size-9 items-center justify-center rounded-lg text-xs font-bold tabular-nums ring-1 ring-foreground/10"
            style={
              i === team.recommendedCheckout.length - 1
                ? { backgroundColor: team.color, color: '#fff' }
                : { backgroundColor: 'var(--muted)' }
            }
          >
            {dart}
          </div>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-border px-5 py-3 text-xs">
        <div>
          <span className="text-muted-foreground">Match </span>
          <span className="font-bold tabular-nums">{team.stats.matchAverage.toFixed(1)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Leg </span>
          <span className="font-bold tabular-nums">{team.stats.legAverage.toFixed(1)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">CO </span>
          <span className="font-bold tabular-nums">{team.stats.checkoutRate}%</span>
        </div>
        <div>
          <span className="text-muted-foreground">Legs </span>
          <span className="font-bold tabular-nums">{team.legsWon}/{team.legsTarget}</span>
        </div>
      </div>
    </div>
  )
}

export default TeamCardStack
