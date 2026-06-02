import { type FC } from 'react'
import Avatar from '#/components/Avatar'
import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'
import { cn } from '#/lib/utils'
import type { MockTeamCardData } from '#/utils/mock'

interface Props {
  team: MockTeamCardData
}

const PODIUM_HEIGHT = ['h-8', 'h-16', 'h-8']

const TeamCardPodium: FC<Props> = ({ team }) => {
  const TeamIcon = getSquadIcon(team.icon)
  const activeIdx = team.members.findIndex((m) => m.id === team.currentPlayerId)

  const ordered = [...team.members]
  if (activeIdx > 0) {
    const [active] = ordered.splice(activeIdx, 1)
    ordered.splice(1, 0, active)
  }

  return (
    <div
      className={cn(
        'flex min-h-[440px] flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all',
        !team.isCurrentTeam && 'opacity-75',
      )}
      style={
        team.isCurrentTeam
          ? { borderColor: `${team.color}60` }
          : undefined
      }
    >
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="flex items-center gap-2">
          <div
            className="flex size-7 items-center justify-center rounded-md"
            style={{ backgroundColor: `${team.color}20` }}
          >
            <TeamIcon className="size-3.5" style={{ color: team.color }} />
          </div>
          <span className="text-sm font-medium">{team.name}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{team.legsWon}/{team.legsTarget} legs</span>
          {team.isCurrentTeam && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase text-white"
              style={{ backgroundColor: team.color }}
            >
              Live
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center px-5 py-4">
        <p className="display-title text-6xl font-bold tabular-nums leading-none">
          {team.remainingScore}
        </p>
        <div className="mt-3 flex items-center gap-1.5">
          {team.recommendedCheckout.map((dart, i) => (
            <span
              key={`${dart}-${i}`}
              className="rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold tabular-nums"
            >
              {dart}
            </span>
          ))}
        </div>
      </div>

      <div className="relative flex flex-1 items-end justify-center gap-3 px-4 pb-0">
        {ordered.map((member, displayIdx) => {
          const isActive = member.id === team.currentPlayerId
          const podiumIdx = isActive ? 1 : displayIdx === 0 ? 0 : 2
          const height = PODIUM_HEIGHT[podiumIdx] ?? 'h-8'

          return (
            <div key={member.id} className="flex w-[30%] flex-col items-center">
              <Avatar
                name={member.name}
                image={member.image}
                size={isActive ? 'lg' : 'sm'}
                className={cn(
                  'mb-2 border-2',
                  isActive ? 'border-transparent' : 'border-border opacity-70',
                )}
                style={
                  isActive
                    ? { boxShadow: `0 0 0 2px ${team.color}` }
                    : undefined
                }
              />
              <p
                className={cn(
                  'mb-1 max-w-full truncate text-[10px]',
                  isActive ? 'font-semibold' : 'text-muted-foreground',
                )}
              >
                {member.name.split(' ')[0]}
              </p>
              <p
                className="mb-2 text-[10px] font-bold tabular-nums"
                style={isActive ? { color: team.color } : undefined}
              >
                {member.matchAverage.toFixed(1)}
              </p>
              <div
                className={cn('w-full rounded-t-lg', height)}
                style={{
                  backgroundColor: isActive ? team.color : `${team.color}30`,
                  opacity: isActive ? 1 : 0.5,
                }}
              />
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-4 gap-3 border-t border-border px-5 py-3">
        {[
          { label: 'Match', value: team.stats.matchAverage.toFixed(1) },
          { label: 'Leg', value: team.stats.legAverage.toFixed(1) },
          { label: 'CO%', value: `${team.stats.checkoutRate}%` },
          { label: 'Darts', value: team.stats.dartsThrown },
        ].map((s) => (
          <div key={s.label}>
            <p className="text-[9px] uppercase text-muted-foreground">{s.label}</p>
            <p className="text-sm font-semibold tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeamCardPodium
