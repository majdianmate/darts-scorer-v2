import { type FC } from 'react'
import Avatar from '#/components/Avatar'
import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'
import { cn } from '#/lib/utils'
import type { MockTeamCardData } from '#/utils/mock'

interface Props {
  team: MockTeamCardData
}

const TeamCardDial: FC<Props> = ({ team }) => {
  const TeamIcon = getSquadIcon(team.icon)
  const progress = Math.min(
    100,
    Math.round((1 - team.remainingScore / 501) * 100),
  )
  const circumference = 2 * Math.PI * 88
  const offset = circumference - (progress / 100) * circumference

  return (
    <div
      className={cn(
        'flex min-h-[440px] flex-col items-center rounded-2xl bg-card ring-1 ring-foreground/10 transition-all',
        !team.isCurrentTeam && 'opacity-75',
      )}
    >
      <div className="flex w-full items-center justify-between px-5 pt-4">
        <div className="flex items-center gap-2">
          <TeamIcon className="size-4" style={{ color: team.color }} />
          <span className="text-sm font-medium">{team.name}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {team.legsWon}/{team.legsTarget}
        </span>
      </div>

      <div className="relative my-4 flex size-[200px] items-center justify-center">
        <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-muted/40"
          />
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke={team.color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700"
          />
        </svg>
        <div className="flex flex-col items-center">
          <p className="text-5xl font-black tabular-nums leading-none">
            {team.remainingScore}
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
            to go
          </p>
        </div>
        {team.isCurrentTeam && (
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase text-white"
            style={{ backgroundColor: team.color }}
          >
            At oche
          </div>
        )}
      </div>

      <div className="mb-4 flex gap-2">
        {team.recommendedCheckout.map((dart, i) => (
          <span
            key={`${dart}-${i}`}
            className="rounded-full px-3 py-1 text-xs font-bold tabular-nums ring-1 ring-foreground/10"
            style={
              i === team.recommendedCheckout.length - 1
                ? { backgroundColor: `${team.color}20`, color: team.color }
                : undefined
            }
          >
            {dart}
          </span>
        ))}
      </div>

      <div className="flex w-full justify-center gap-8 px-4 pb-4">
        {team.members.map((member) => {
          const isActive = member.id === team.currentPlayerId
          return (
            <div key={member.id} className="flex flex-col items-center gap-1">
              <div className="relative">
                <Avatar
                  name={member.name}
                  image={member.image}
                  size="md"
                  className={cn(!isActive && 'opacity-50')}
                />
                {isActive && (
                  <div
                    className="absolute -inset-1 rounded-full border-2"
                    style={{ borderColor: team.color }}
                  />
                )}
              </div>
              <p
                className={cn(
                  'max-w-[64px] truncate text-[10px]',
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

      <div className="mt-auto grid w-full grid-cols-3 divide-x divide-border border-t border-border">
        {[
          ['Match avg', team.stats.matchAverage.toFixed(1)],
          ['Leg avg', team.stats.legAverage.toFixed(1)],
          ['Checkout', `${team.stats.checkoutRate}%`],
        ].map(([label, val]) => (
          <div key={label} className="py-3 text-center">
            <p className="text-[9px] text-muted-foreground">{label}</p>
            <p className="text-sm font-semibold tabular-nums">{val}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeamCardDial
