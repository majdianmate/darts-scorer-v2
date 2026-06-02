import { type FC } from 'react'
import Avatar from '#/components/Avatar'
import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'
import { cn } from '#/lib/utils'
import type { MockTeamCardData } from '#/utils/mock'

interface Props {
  team: MockTeamCardData
}

const TeamCardFlux: FC<Props> = ({ team }) => {
  const TeamIcon = getSquadIcon(team.icon)

  return (
    <div
      className={cn(
        'relative flex min-h-[480px] flex-col overflow-hidden rounded-3xl transition-all',
        !team.isCurrentTeam && 'opacity-80',
      )}
    >
      <div className="absolute inset-0 bg-[#08080f]" />
      <div
        className="absolute inset-[-50%] animate-[spin_18s_linear_infinite] opacity-60"
        style={{
          background: `conic-gradient(from 0deg, transparent, ${team.color}, transparent 30%, ${team.color}88 50%, transparent 70%, ${team.color}44)`,
        }}
      />
      <div className="absolute inset-[2px] rounded-[22px] bg-[#08080f]/92 backdrop-blur-2xl" />

      <div className="relative flex flex-1 flex-col">
        <div className="flex items-center justify-between px-6 pt-5">
          <div className="flex items-center gap-2">
            <TeamIcon className="size-4" style={{ color: team.color }} />
            <span className="bg-gradient-to-r from-white to-white/50 bg-clip-text text-sm font-bold uppercase tracking-wide text-transparent">
              {team.name}
            </span>
          </div>
          <span className="text-xs tabular-nums text-white/40">
            {team.legsWon}/{team.legsTarget}
          </span>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-2">
          {team.isCurrentTeam && (
            <span
              className="mb-3 rounded-full border px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.25em]"
              style={{ borderColor: `${team.color}60`, color: team.color }}
            >
              Live
            </span>
          )}
          <p
            className="text-[92px] font-black leading-none tabular-nums tracking-tighter"
            style={{
              color: 'transparent',
              WebkitTextStroke: `1.5px ${team.color}`,
              filter: `drop-shadow(0 0 30px ${team.color}80)`,
            }}
          >
            {team.remainingScore}
          </p>
          <div className="mt-4 flex gap-1">
            {team.recommendedCheckout.map((d, i) => (
              <span
                key={`${d}-${i}`}
                className="px-3 py-1 text-sm font-bold tabular-nums text-white"
                style={{
                  background: `linear-gradient(135deg, ${team.color}40, transparent)`,
                  borderLeft: i === 0 ? `2px solid ${team.color}` : undefined,
                }}
              >
                {d}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 px-5 pb-4">
          {team.members.map((member) => {
            const isActive = member.id === team.currentPlayerId
            return (
              <div
                key={member.id}
                className={cn(
                  'relative overflow-hidden rounded-2xl p-3',
                  isActive ? 'bg-white/8' : 'bg-white/[0.03]',
                )}
                style={
                  isActive
                    ? { boxShadow: `inset 0 0 0 1px ${team.color}50, 0 0 30px ${team.color}20` }
                    : undefined
                }
              >
                {isActive && (
                  <div
                    className="absolute inset-x-0 top-0 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${team.color}, transparent)` }}
                  />
                )}
                <Avatar name={member.name} image={member.image} size="sm" className={cn('mb-2', !isActive && 'opacity-50')} />
                <p className={cn('truncate text-[11px]', isActive ? 'font-semibold text-white' : 'text-white/45')}>
                  {member.name.split(' ')[0]}
                </p>
                <p className="text-xs font-bold tabular-nums" style={isActive ? { color: team.color } : undefined}>
                  {member.matchAverage.toFixed(1)}
                </p>
                <p className="text-[9px] tabular-nums text-white/30">↓{member.lastVisit}</p>
              </div>
            )
          })}
        </div>

        <div
          className="grid grid-cols-5 gap-px text-center text-[10px]"
          style={{ backgroundColor: `${team.color}20` }}
        >
          {[
            ['M', team.stats.matchAverage.toFixed(1)],
            ['L', team.stats.legAverage.toFixed(1)],
            ['CO', `${team.stats.checkoutRate}%`],
            ['180', String(team.stats.ton80s)],
            ['W', `${team.stats.winProbability}%`],
          ].map(([k, v]) => (
            <div key={k} className="bg-[#08080f]/95 py-2.5">
              <p className="text-white/30">{k}</p>
              <p className="font-bold tabular-nums text-white/85">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TeamCardFlux
