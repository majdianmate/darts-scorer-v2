import { type FC } from 'react'
import { Target } from 'lucide-react'
import Avatar from '#/components/Avatar'
import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'
import { Badge } from '#/components/ui/badge'
import { cn } from '#/lib/utils'
import type { MockTeamCardData } from '#/utils/mock'

interface Props {
  team: MockTeamCardData
}

const TeamCardGlass: FC<Props> = ({ team }) => {
  const TeamIcon = getSquadIcon(team.icon)

  return (
    <div
      className={cn(
        'group relative flex min-h-[440px] flex-col overflow-hidden rounded-2xl transition-all duration-300',
        team.isCurrentTeam ? 'scale-[1.01]' : 'opacity-80',
      )}
    >
      <div
        className="absolute -left-16 -top-16 size-56 rounded-full blur-3xl transition-opacity duration-500"
        style={{ backgroundColor: team.color, opacity: team.isCurrentTeam ? 0.35 : 0.15 }}
      />
      <div
        className="absolute -bottom-20 -right-10 size-48 rounded-full blur-3xl"
        style={{ backgroundColor: team.color, opacity: 0.12 }}
      />

      <div
        className={cn(
          'relative flex flex-1 flex-col border backdrop-blur-2xl',
          team.isCurrentTeam
            ? 'border-white/20 bg-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
            : 'border-white/8 bg-white/[0.04]',
        )}
        style={
          team.isCurrentTeam
            ? { boxShadow: `0 0 0 1px ${team.color}40, 0 20px 60px ${team.color}15` }
            : undefined
        }
      >
        <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
          <div className="flex items-center gap-3">
            <div
              className="flex size-9 items-center justify-center rounded-xl backdrop-blur-md"
              style={{
                backgroundColor: `${team.color}25`,
                boxShadow: `inset 0 1px 0 ${team.color}40`,
              }}
            >
              <TeamIcon className="size-4" style={{ color: team.color }} />
            </div>
            <div>
              <h3 className="font-medium leading-tight">{team.name}</h3>
              <p className="text-xs text-muted-foreground">
                {team.legsWon} / {team.legsTarget} legs
              </p>
            </div>
          </div>
          {team.isCurrentTeam && (
            <Badge
              variant="outline"
              className="border-white/20 bg-white/5 text-[10px] uppercase tracking-wider backdrop-blur-sm"
              style={{ color: team.color, borderColor: `${team.color}50` }}
            >
              At oche
            </Badge>
          )}
        </div>

        <div className="flex flex-col items-center px-5 py-6">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Remaining
          </p>
          <p
            className="display-title text-7xl font-bold tabular-nums leading-none tracking-tight"
            style={{ color: team.color }}
          >
            {team.remainingScore}
          </p>

          <div className="mt-5 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
            <Target className="size-3.5 text-muted-foreground" />
            {team.recommendedCheckout.map((dart, i) => (
              <span key={`${dart}-${i}`} className="flex items-center gap-2">
                {i > 0 && <span className="text-white/20">·</span>}
                <span className="text-sm font-semibold tabular-nums">{dart}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-6 px-5 pb-5">
          {team.members.map((member) => {
            const isActive = member.id === team.currentPlayerId
            return (
              <div key={member.id} className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    'rounded-full p-0.5 transition-all duration-300',
                    isActive && 'scale-110',
                  )}
                  style={
                    isActive
                      ? {
                          background: `linear-gradient(135deg, ${team.color}, ${team.color}60)`,
                          boxShadow: `0 0 20px ${team.color}50`,
                        }
                      : undefined
                  }
                >
                  <Avatar
                    name={member.name}
                    image={member.image}
                    size="md"
                    className={cn(
                      'border-2 border-white/10',
                      !isActive && 'opacity-70',
                    )}
                  />
                </div>
                <p
                  className={cn(
                    'max-w-[72px] truncate text-xs',
                    isActive ? 'font-semibold text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {member.name.split(' ')[0]}
                </p>
                <span
                  className="rounded-md px-1.5 py-px text-[10px] font-bold tabular-nums backdrop-blur-sm"
                  style={
                    isActive
                      ? { backgroundColor: `${team.color}25`, color: team.color }
                      : undefined
                  }
                >
                  {member.matchAverage.toFixed(1)}
                </span>
              </div>
            )
          })}
        </div>

        <div className="mt-auto grid grid-cols-4 gap-px border-t border-white/8 bg-white/5">
          {[
            { label: 'Match', value: team.stats.matchAverage.toFixed(1) },
            { label: 'Leg', value: team.stats.legAverage.toFixed(1) },
            { label: 'Checkout', value: `${team.stats.checkoutRate}%` },
            { label: 'Hi CO', value: team.stats.highestCheckout },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-0.5 bg-background/20 px-2 py-3 backdrop-blur-sm"
            >
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </span>
              <span className="text-sm font-semibold tabular-nums">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TeamCardGlass
