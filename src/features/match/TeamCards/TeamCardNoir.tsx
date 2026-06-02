import { type FC } from 'react'
import Avatar from '#/components/Avatar'
import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'
import { cn } from '#/lib/utils'
import type { MockTeamCardData } from '#/utils/mock'

interface Props {
  team: MockTeamCardData
}

const TeamCardNoir: FC<Props> = ({ team }) => {
  const TeamIcon = getSquadIcon(team.icon)
  const active = team.members.find((m) => m.id === team.currentPlayerId)

  return (
    <div
      className={cn(
        'relative flex min-h-[480px] flex-col overflow-hidden bg-[#050505] transition-all',
        !team.isCurrentTeam && 'opacity-80',
      )}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 35%, ${team.color}12, transparent 55%)`,
        }}
      />

      <div className="relative flex items-center justify-between px-6 pt-6">
        <div className="flex items-center gap-3">
          <div
            className="flex size-9 items-center justify-center rounded-full"
            style={{ boxShadow: `0 0 0 1px ${team.color}80, 0 0 20px ${team.color}30` }}
          >
            <TeamIcon className="size-4" style={{ color: team.color }} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/30">{team.name}</p>
            <p className="text-xs tabular-nums text-white/50">
              {team.legsWon} · {team.legsTarget} legs
            </p>
          </div>
        </div>
        {team.isCurrentTeam && (
          <div className="h-8 w-px bg-gradient-to-b from-transparent via-current to-transparent opacity-60" style={{ color: team.color }} />
        )}
      </div>

      <div className="relative mx-auto my-6 flex size-[240px] items-center justify-center">
        {[100, 82, 64].map((size, i) => (
          <div
            key={size}
            className="absolute rounded-full border"
            style={{
              width: size * 2.4,
              height: size * 2.4,
              borderColor: `${team.color}${i === 0 ? '25' : i === 1 ? '18' : '10'}`,
            }}
          />
        ))}

        <div className="relative z-10 text-center">
          <p
            className="display-title text-7xl font-light tabular-nums leading-none tracking-tight text-white"
            style={{ textShadow: `0 0 60px ${team.color}50` }}
          >
            {team.remainingScore}
          </p>
          <div className="mt-3 flex justify-center gap-3">
            {team.recommendedCheckout.map((d, i) => (
              <span
                key={`${d}-${i}`}
                className="text-xs font-medium tabular-nums tracking-widest"
                style={{ color: i === 2 ? team.color : 'rgba(255,255,255,0.35)' }}
              >
                {d}
              </span>
            ))}
          </div>
        </div>

        {[
          { label: 'Match', value: team.stats.matchAverage.toFixed(1), pos: 'left-0 top-1/2 -translate-y-1/2' },
          { label: 'Leg', value: team.stats.legAverage.toFixed(1), pos: 'right-0 top-1/2 -translate-y-1/2' },
          { label: 'CO%', value: `${team.stats.checkoutRate}%`, pos: 'bottom-0 left-1/2 -translate-x-1/2' },
        ].map((s) => (
          <div key={s.label} className={cn('absolute text-center', s.pos)}>
            <p className="text-[8px] uppercase tracking-widest text-white/25">{s.label}</p>
            <p className="text-sm font-light tabular-nums text-white/70">{s.value}</p>
          </div>
        ))}
      </div>

      {active && (
        <div className="relative mx-6 mb-4 flex items-center gap-4 border-y border-white/6 py-4">
          <Avatar
            name={active.name}
            image={active.image}
            size="lg"
            className="ring-1 ring-white/10"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">{active.name}</p>
            <p className="text-xs text-white/40">
              {active.matchAverage.toFixed(1)} match · {active.legAverage.toFixed(1)} leg · last {active.lastVisit}
            </p>
          </div>
          {team.isCurrentTeam && (
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-widest text-white/30">Win</p>
              <p className="text-xl font-light tabular-nums" style={{ color: team.color }}>
                {team.stats.winProbability}%
              </p>
            </div>
          )}
        </div>
      )}

      <div className="relative mt-auto flex justify-center gap-10 px-6 pb-6">
        {team.members
          .filter((m) => m.id !== team.currentPlayerId)
          .map((m) => (
            <div key={m.id} className="text-center opacity-40">
              <Avatar name={m.name} image={m.image} size="xs" className="mx-auto mb-1" />
              <p className="text-[10px] text-white/60">{m.matchAverage.toFixed(1)}</p>
            </div>
          ))}
      </div>
    </div>
  )
}

export default TeamCardNoir
