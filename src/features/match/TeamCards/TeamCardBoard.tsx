import { type FC } from 'react'
import Avatar from '#/components/Avatar'
import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'
import { cn } from '#/lib/utils'
import type { MockTeamCardData } from '#/utils/mock'

interface Props {
  team: MockTeamCardData
}

const BOARD_RINGS = [
  { size: '100%', opacity: 0.06 },
  { size: '78%', opacity: 0.08 },
  { size: '56%', opacity: 0.1 },
  { size: '34%', opacity: 0.14 },
]

const TeamCardBoard: FC<Props> = ({ team }) => {
  const TeamIcon = getSquadIcon(team.icon)

  return (
    <div
      className={cn(
        'relative flex min-h-[440px] flex-col overflow-hidden rounded-2xl bg-[#141414] ring-1 ring-white/10 transition-all',
        team.isCurrentTeam ? '' : 'opacity-80',
      )}
      style={
        team.isCurrentTeam
          ? { boxShadow: `0 0 0 2px ${team.color}, 0 12px 40px ${team.color}25` }
          : undefined
      }
    >
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="flex items-center gap-2.5">
          <TeamIcon className="size-4" style={{ color: team.color }} />
          <span className="text-sm font-semibold text-[#f5f0e6]">{team.name}</span>
        </div>
        <span className="rounded-full bg-[#f5f0e6]/10 px-2.5 py-0.5 text-xs tabular-nums text-[#f5f0e6]/70">
          {team.legsWon}:{team.legsTarget}
        </span>
      </div>

      <div className="relative mx-auto my-2 flex size-[220px] items-center justify-center">
        {BOARD_RINGS.map((ring, i) => (
          <div
            key={i}
            className="absolute rounded-full border"
            style={{
              width: ring.size,
              height: ring.size,
              borderColor:
                i === 0
                  ? `${team.color}${Math.round(ring.opacity * 255).toString(16).padStart(2, '0')}`
                  : `rgba(245, 240, 230, ${ring.opacity})`,
            }}
          />
        ))}

        <div
          className="absolute size-3 rounded-full"
          style={{ backgroundColor: team.color, boxShadow: `0 0 12px ${team.color}` }}
        />

        <div className="relative z-10 flex flex-col items-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#f5f0e6]/40">
            To go
          </p>
          <p className="display-title text-6xl font-bold tabular-nums text-[#f5f0e6]">
            {team.remainingScore}
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-2 px-4 pb-3">
        {team.recommendedCheckout.map((dart, i) => (
          <span
            key={`${dart}-${i}`}
            className="rounded-full px-3 py-1 text-xs font-bold tabular-nums"
            style={{
              backgroundColor: i === team.recommendedCheckout.length - 1 ? team.color : '#f5f0e6',
              color: i === team.recommendedCheckout.length - 1 ? '#fff' : '#141414',
            }}
          >
            {dart}
          </span>
        ))}
      </div>

      {team.isCurrentTeam && (
        <div className="mx-5 mb-3 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-30" style={{ color: team.color }} />
      )}

      <div className="flex justify-center gap-4 px-4 pb-4">
        {team.members.map((member) => {
          const isActive = member.id === team.currentPlayerId
          return (
            <div key={member.id} className="flex flex-col items-center gap-1.5">
              <div className="relative">
                <Avatar
                  name={member.name}
                  image={member.image}
                  size="md"
                  className={cn(
                    'border-2',
                    isActive ? 'border-[#f5f0e6]' : 'border-[#f5f0e6]/20 opacity-60',
                  )}
                  style={
                    isActive
                      ? { boxShadow: `0 0 0 3px ${team.color}` }
                      : undefined
                  }
                />
                {isActive && team.isCurrentTeam && (
                  <div
                    className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45"
                    style={{ backgroundColor: team.color }}
                  />
                )}
              </div>
              <p
                className={cn(
                  'max-w-[68px] truncate text-[11px]',
                  isActive ? 'font-medium text-[#f5f0e6]' : 'text-[#f5f0e6]/45',
                )}
              >
                {member.name.split(' ')[0]}
              </p>
              <p
                className="text-[10px] font-bold tabular-nums"
                style={{ color: isActive ? team.color : '#f5f0e6' }}
              >
                {member.matchAverage.toFixed(1)}
              </p>
            </div>
          )
        })}
      </div>

      <div className="mt-auto grid grid-cols-4 border-t border-[#f5f0e6]/10 bg-[#f5f0e6]/[0.03]">
        {[
          ['Match', team.stats.matchAverage.toFixed(1)],
          ['Leg', team.stats.legAverage.toFixed(1)],
          ['CO%', `${team.stats.checkoutRate}%`],
          ['Hi', String(team.stats.highestCheckout)],
        ].map(([label, val]) => (
          <div key={label} className="px-2 py-3 text-center">
            <p className="text-[9px] uppercase tracking-wider text-[#f5f0e6]/35">
              {label}
            </p>
            <p className="text-sm font-semibold tabular-nums text-[#f5f0e6]/85">
              {val}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeamCardBoard
