import { type FC } from 'react'
import Avatar from '#/components/Avatar'
import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'
import { cn } from '#/lib/utils'
import type { MockTeamCardData } from '#/utils/mock'

interface Props {
  team: MockTeamCardData
}

const TeamCardFlight: FC<Props> = ({ team }) => {
  const TeamIcon = getSquadIcon(team.icon)

  return (
    <div
      className={cn(
        'relative flex min-h-[440px] flex-col overflow-hidden bg-card transition-all',
        !team.isCurrentTeam && 'opacity-75',
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${team.color}30 0%, transparent 45%, ${team.color}15 100%)`,
        }}
      />

      <div
        className="relative px-5 pb-16 pt-5"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)',
          backgroundColor: `${team.color}22`,
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <TeamIcon className="size-4" style={{ color: team.color }} />
            <h3 className="font-semibold">{team.name}</h3>
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">
            {team.legsWon}/{team.legsTarget}
          </span>
        </div>

        <div className="mt-4 text-center">
          <p className="text-7xl font-black tabular-nums leading-none tracking-tighter">
            {team.remainingScore}
          </p>
          {team.isCurrentTeam && (
            <p
              className="mt-2 text-[10px] font-bold uppercase tracking-[0.3em]"
              style={{ color: team.color }}
            >
              Your turn
            </p>
          )}
        </div>
      </div>

      <div className="relative -mt-8 flex justify-center gap-2 px-4">
        {team.recommendedCheckout.map((dart, i) => (
          <div
            key={`${dart}-${i}`}
            className="flex size-10 items-center justify-center text-xs font-bold tabular-nums shadow-md"
            style={{
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              backgroundColor: i === team.recommendedCheckout.length - 1 ? team.color : 'var(--muted)',
              color: i === team.recommendedCheckout.length - 1 ? '#fff' : undefined,
            }}
          >
            {dart}
          </div>
        ))}
      </div>

      <div className="relative mt-6 flex flex-1 items-end justify-center gap-6 px-4 pb-4">
        {team.members.map((member) => {
          const isActive = member.id === team.currentPlayerId
          return (
            <div
              key={member.id}
              className={cn(
                'flex flex-col items-center gap-1.5 transition-transform',
                isActive && '-translate-y-5',
              )}
            >
              <div
                className="relative"
                style={
                  isActive
                    ? {
                        filter: `drop-shadow(0 8px 16px ${team.color}50)`,
                      }
                    : undefined
                }
              >
                <Avatar
                  name={member.name}
                  image={member.image}
                  size={isActive ? 'lg' : 'md'}
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
              </div>
              <p
                className={cn(
                  'max-w-[68px] truncate text-[11px]',
                  isActive ? 'font-semibold' : 'text-muted-foreground',
                )}
              >
                {member.name.split(' ')[0]}
              </p>
              <p
                className="text-xs font-bold tabular-nums"
                style={isActive ? { color: team.color } : undefined}
              >
                {member.matchAverage.toFixed(1)}
              </p>
            </div>
          )
        })}
      </div>

      <div className="flex border-t border-border text-center text-xs">
        {[
          ['M', team.stats.matchAverage.toFixed(1)],
          ['L', team.stats.legAverage.toFixed(1)],
          ['CO', `${team.stats.checkoutRate}%`],
          ['9', team.stats.first9Average.toFixed(1)],
        ].map(([k, v]) => (
          <div key={k} className="flex-1 border-r border-border py-2.5 last:border-r-0">
            <p className="text-[9px] text-muted-foreground">{k}</p>
            <p className="font-bold tabular-nums">{v}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeamCardFlight
