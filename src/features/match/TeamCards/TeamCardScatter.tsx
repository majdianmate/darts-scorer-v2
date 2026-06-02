import { type FC } from 'react'
import Avatar from '#/components/Avatar'
import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'
import { cn } from '#/lib/utils'
import type { MockTeamCardData } from '#/utils/mock'

interface Props {
  team: MockTeamCardData
}

const POSITIONS = [
  { top: '8%', left: '6%', rotate: -6 },
  { top: '42%', right: '5%', rotate: 4 },
  { bottom: '18%', left: '12%', rotate: -2 },
]

/** Scatter — no card box; elements float independently in space. */
const TeamCardScatter: FC<Props> = ({ team }) => {
  const TeamIcon = getSquadIcon(team.icon)

  return (
    <div
      className={cn(
        'relative min-h-[480px] overflow-hidden transition-all',
        !team.isCurrentTeam && 'opacity-65',
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 30% 20%, ${team.color}12, transparent 70%)`,
        }}
      />

      <div
        className="absolute left-[8%] top-[6%] max-w-[140px]"
        style={{ transform: 'rotate(-3deg)' }}
      >
        <TeamIcon className="mb-1 size-6" style={{ color: team.color }} />
        <h3 className="text-lg font-black uppercase leading-none tracking-tight">
          {team.name}
        </h3>
        <p className="mt-1 text-[10px] text-muted-foreground">
          {team.legsWon}/{team.legsTarget} · {team.stats.momentum}
        </p>
      </div>

      {team.isCurrentTeam && (
        <div
          className="absolute right-[6%] top-[5%] px-2 py-1 text-[9px] font-black uppercase tracking-widest text-white"
          style={{ backgroundColor: team.color, transform: 'rotate(3deg)' }}
        >
          Live
        </div>
      )}

      <div className="absolute left-1/2 top-[28%] -translate-x-1/2 rotate-1 text-center">
        <p
          className="text-[120px] font-black leading-[0.85] tabular-nums tracking-tighter"
          style={{
            color: 'transparent',
            WebkitTextStroke: `2px ${team.color}`,
          }}
        >
          {team.remainingScore}
        </p>
      </div>

      <div
        className="absolute right-[10%] top-[32%] flex flex-col gap-2"
        style={{ transform: 'rotate(5deg)' }}
      >
        <p className="text-[9px] uppercase tracking-widest text-muted-foreground">
          Checkout
        </p>
        {team.recommendedCheckout.map((d, i) => (
          <span
            key={`${d}-${i}`}
            className="text-2xl font-black tabular-nums"
            style={{ color: i === 2 ? team.color : undefined }}
          >
            {d}
          </span>
        ))}
      </div>

      <div
        className="absolute bottom-[32%] left-[6%] text-[10px] leading-relaxed text-muted-foreground"
        style={{ transform: 'rotate(-4deg)' }}
      >
        <p>M {team.stats.matchAverage.toFixed(1)}</p>
        <p>L {team.stats.legAverage.toFixed(1)}</p>
        <p>CO {team.stats.checkoutRate}%</p>
        <p>Win {team.stats.winProbability}%</p>
      </div>

      {team.members.map((member, i) => {
        const pos = POSITIONS[i % POSITIONS.length]
        const isActive = member.id === team.currentPlayerId
        const transform = `rotate(${pos.rotate}deg)`

        return (
          <div
            key={member.id}
            className={cn(
              'absolute flex items-center gap-2 rounded-lg border bg-card/90 p-2 shadow-lg backdrop-blur-sm',
              isActive ? 'z-20 border-transparent' : 'z-10 border-border/50',
            )}
            style={{
              ...pos,
              transform,
              boxShadow: isActive ? `0 12px 40px ${team.color}30, 0 0 0 2px ${team.color}` : undefined,
            }}
          >
            <Avatar name={member.name} image={member.image} size="sm" />
            <div>
              <p className={cn('text-xs', isActive && 'font-bold')}>
                {member.name.split(' ')[0]}
              </p>
              <p
                className="text-[10px] font-bold tabular-nums"
                style={isActive ? { color: team.color } : undefined}
              >
                {member.matchAverage.toFixed(1)} · {member.lastVisit}
              </p>
            </div>
          </div>
        )
      })}

      <div
        className="absolute bottom-[8%] right-[8%] text-right text-[10px] tabular-nums text-muted-foreground"
        style={{ transform: 'rotate(2deg)' }}
      >
        {team.stats.ton80s}×180 · hi {team.stats.highestVisit}
      </div>
    </div>
  )
}

export default TeamCardScatter
