import { type FC } from 'react'
import Avatar from '#/components/Avatar'
import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'
import { cn } from '#/lib/utils'
import type { MockTeamCardData } from '#/utils/mock'

interface Props {
  team: MockTeamCardData
}

const TeamCardHeavy: FC<Props> = ({ team }) => {
  const TeamIcon = getSquadIcon(team.icon)

  return (
    <div
      className={cn(
        'relative flex min-h-[480px] flex-col border-4 border-black bg-[#e8e4dc] text-black transition-all dark:border-white dark:bg-[#1a1a1a] dark:text-white',
        !team.isCurrentTeam && 'opacity-75',
      )}
      style={
        team.isCurrentTeam
          ? { boxShadow: `8px 8px 0 ${team.color}` }
          : { boxShadow: '8px 8px 0 #000' }
      }
    >
      <div
        className="flex items-stretch border-b-4 border-black dark:border-white"
        style={{ backgroundColor: team.isCurrentTeam ? team.color : undefined }}
      >
        <div
          className={cn(
            'flex flex-1 items-center gap-3 px-4 py-3',
            team.isCurrentTeam ? 'text-black' : '',
          )}
        >
          <TeamIcon className="size-6" strokeWidth={2.5} />
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight">{team.name}</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
              {team.isCurrentTeam ? '● Throwing now' : 'Waiting'}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center border-l-4 border-black px-5 dark:border-white">
          <p className="text-[9px] font-black uppercase">Legs</p>
          <p className="text-3xl font-black tabular-nums leading-none">
            {team.legsWon}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center border-b-4 border-black px-4 py-6 dark:border-white">
        <p className="text-[11px] font-black uppercase tracking-[0.5em] opacity-40">
          Remaining
        </p>
        <p
          className="my-1 text-[100px] font-black leading-none tabular-nums tracking-[-0.05em]"
          style={{ WebkitTextStroke: team.isCurrentTeam ? `2px ${team.color}` : undefined }}
        >
          {team.remainingScore}
        </p>
        <div className="flex w-full max-w-[240px] gap-0 border-2 border-black dark:border-white">
          {team.recommendedCheckout.map((dart, i) => (
            <span
              key={`${dart}-${i}`}
              className={cn(
                'flex-1 border-r-2 border-black py-2 text-center text-lg font-black tabular-nums last:border-r-0 dark:border-white',
                i === team.recommendedCheckout.length - 1 && 'text-white',
              )}
              style={
                i === team.recommendedCheckout.length - 1
                  ? { backgroundColor: team.color }
                  : undefined
              }
            >
              {dart}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 border-b-4 border-black dark:border-white">
        {team.members.map((member) => {
          const isActive = member.id === team.currentPlayerId
          return (
            <div
              key={member.id}
              className={cn(
                'flex flex-col items-center gap-2 border-r-4 border-black px-2 py-4 last:border-r-0 dark:border-white',
                isActive && 'bg-black text-white dark:bg-white dark:text-black',
              )}
            >
              <Avatar
                name={member.name}
                image={member.image}
                size="md"
                className="rounded-none border-2 border-current"
              />
              <p className="max-w-full truncate text-[10px] font-black uppercase">
                {member.name.split(' ')[0]}
              </p>
              <p className="text-xl font-black tabular-nums">{member.matchAverage.toFixed(1)}</p>
              <p className="text-[9px] font-bold opacity-50">LV {member.lastVisit}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-0">
        {[
          ['Match avg', team.stats.matchAverage.toFixed(1)],
          ['Leg avg', team.stats.legAverage.toFixed(1)],
          ['Checkout', `${team.stats.checkoutsHit}/${team.stats.checkoutAttempts}`],
          ['180s', String(team.stats.ton80s)],
          ['Doubles', `${team.stats.doublesRate}%`],
          ['Win %', `${team.stats.winProbability}%`],
        ].map(([label, val]) => (
          <div
            key={label}
            className="flex items-center justify-between border-b border-r border-black/20 px-3 py-2 dark:border-white/20"
          >
            <span className="text-[9px] font-black uppercase opacity-50">{label}</span>
            <span className="text-sm font-black tabular-nums">{val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeamCardHeavy
