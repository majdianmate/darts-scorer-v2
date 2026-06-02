import { type FC } from 'react'
import Avatar from '#/components/Avatar'
import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'
import { cn } from '#/lib/utils'
import type { MockTeamCardData } from '#/utils/mock'

interface Props {
  team: MockTeamCardData
}

/** Lanes — each player owns a full-width horizontal racing lane. Score sits in a floating tab. */
const TeamCardLanes: FC<Props> = ({ team }) => {
  const TeamIcon = getSquadIcon(team.icon)
  const maxAvg = Math.max(...team.members.map((m) => m.matchAverage), 1)

  return (
    <div
      className={cn(
        'relative flex min-h-[480px] flex-col gap-0 transition-all',
        !team.isCurrentTeam && 'opacity-75',
      )}
    >
      <div
        className="absolute left-4 top-4 z-20 flex items-center gap-3 rounded-sm px-4 py-2 shadow-xl"
        style={{
          backgroundColor: team.color,
          color: '#fff',
          clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 100%, 0 100%)',
        }}
      >
        <span className="text-4xl font-black tabular-nums leading-none">
          {team.remainingScore}
        </span>
        <div className="border-l border-white/30 pl-3">
          <p className="text-[9px] uppercase tracking-wider opacity-80">Finish</p>
          <p className="text-xs font-bold tabular-nums">
            {team.recommendedCheckout.join(' ')}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 px-4 pt-4">
        <TeamIcon className="size-3.5" style={{ color: team.color }} />
        <span className="text-xs font-bold uppercase">{team.name}</span>
        <span className="text-xs text-muted-foreground">
          {team.legsWon}–{team.legsTarget}
        </span>
        {team.isCurrentTeam && (
          <span
            className="rounded-sm px-1.5 py-px text-[9px] font-bold uppercase"
            style={{ backgroundColor: `${team.color}25`, color: team.color }}
          >
            Oche
          </span>
        )}
      </div>

      <div className="mt-16 flex flex-1 flex-col justify-center gap-1 px-2">
        {team.members.map((member, laneIdx) => {
          const isActive = member.id === team.currentPlayerId
          const laneWidth = (member.matchAverage / maxAvg) * 100

          return (
            <div
              key={member.id}
              className="group relative flex h-[72px] items-center"
            >
              <div
                className={cn(
                  'absolute inset-y-1 left-0 rounded-r-sm transition-all',
                  isActive ? 'opacity-100' : 'opacity-35',
                )}
                style={{
                  width: `${laneWidth}%`,
                  minWidth: isActive ? '40%' : '20%',
                  backgroundColor: isActive ? `${team.color}35` : `${team.color}12`,
                  borderLeft: `4px solid ${isActive ? team.color : `${team.color}50`}`,
                }}
              />

              <div className="relative z-10 flex w-full items-center gap-3 px-3">
                <span className="w-4 text-[10px] font-bold tabular-nums text-muted-foreground">
                  {laneIdx + 1}
                </span>
                <Avatar
                  name={member.name}
                  image={member.image}
                  size="sm"
                  className={cn(!isActive && 'grayscale')}
                />
                <div className="min-w-0 flex-1">
                  <p className={cn('truncate text-sm', isActive && 'font-bold')}>
                    {member.name}
                  </p>
                  <div className="flex gap-2 text-[10px] tabular-nums text-muted-foreground">
                    <span>match {member.matchAverage.toFixed(1)}</span>
                    <span>leg {member.legAverage.toFixed(1)}</span>
                    <span>last {member.lastVisit}</span>
                  </div>
                </div>
                {isActive && team.isCurrentTeam && (
                  <span
                    className="shrink-0 text-[10px] font-black uppercase tracking-widest"
                    style={{ color: team.color }}
                  >
                    →
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-auto flex divide-x divide-border border-t border-border text-center text-[10px]">
        {[
          ['Avg', team.stats.matchAverage.toFixed(1)],
          ['Leg', team.stats.legAverage.toFixed(1)],
          ['CO', `${team.stats.checkoutRate}%`],
          ['Mom', team.stats.momentum],
          ['Win', `${team.stats.winProbability}%`],
        ].map(([k, v]) => (
          <div key={k} className="flex-1 py-2">
            <span className="text-muted-foreground">{k} </span>
            <span className="font-bold uppercase tabular-nums">{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeamCardLanes
