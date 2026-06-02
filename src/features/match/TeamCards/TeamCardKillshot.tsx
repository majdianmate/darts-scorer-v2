import { type FC } from 'react'
import { Crosshair } from 'lucide-react'
import Avatar from '#/components/Avatar'
import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'
import { cn } from '#/lib/utils'
import type { MockTeamCardData } from '#/utils/mock'

interface Props {
  team: MockTeamCardData
}

const inCheckoutZone = (score: number) => score <= 170 && score > 1

const TeamCardKillshot: FC<Props> = ({ team }) => {
  const TeamIcon = getSquadIcon(team.icon)
  const checkout = inCheckoutZone(team.remainingScore)
  const active = team.members.find((m) => m.id === team.currentPlayerId)

  return (
    <div
      className={cn(
        'relative flex min-h-[480px] flex-col overflow-hidden bg-[#0c0c0c] transition-all',
        team.isCurrentTeam && checkout && 'ring-2 ring-offset-2 ring-offset-[#0c0c0c]'
      )}
      style={
        team.isCurrentTeam && checkout
          ? {
              boxShadow: `0 0 0 2px ${team.color}, 0 0 60px ${team.color}40, inset 0 0 80px ${team.color}08`,
            }
          : undefined
      }
    >
      {checkout && team.isCurrentTeam && (
        <div
          className="absolute inset-x-0 top-0 z-20 flex items-center justify-center gap-2 py-1.5 text-[11px] font-black uppercase tracking-[0.35em] text-black"
          style={{ backgroundColor: team.color }}
        >
          <Crosshair className="size-3.5" />
          Checkout zone
        </div>
      )}

      <div className="relative flex flex-1 flex-col px-5 pb-4 pt-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <TeamIcon className="size-4" style={{ color: team.color }} />
            <span className="text-xs font-bold uppercase tracking-widest text-white/50">
              {team.name}
            </span>
          </div>
          <div className="text-right">
            <p className="text-[9px] uppercase tracking-widest text-white/30">Win prob</p>
            <p className="text-lg font-black tabular-nums" style={{ color: team.color }}>
              {team.stats.winProbability}%
            </p>
          </div>
        </div>

        <div className="relative my-4 flex flex-col items-center">
          <svg className="absolute size-48 opacity-20" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke={team.color} strokeWidth="0.5" />
            <circle cx="50" cy="50" r="30" fill="none" stroke={team.color} strokeWidth="0.5" />
            <line x1="50" y1="5" x2="50" y2="95" stroke={team.color} strokeWidth="0.5" />
            <line x1="5" y1="50" x2="95" y2="50" stroke={team.color} strokeWidth="0.5" />
          </svg>
          <p
            className="relative text-[96px] font-black leading-none tabular-nums tracking-tighter text-white"
            style={{
              textShadow: checkout
                ? `0 0 40px ${team.color}, 4px 4px 0 ${team.color}40`
                : undefined,
            }}
          >
            {team.remainingScore}
          </p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
            to finish
          </p>
        </div>

        <div className="mb-4 flex justify-center gap-3">
          {team.recommendedCheckout.map((dart, i) => (
            <div
              key={`${dart}-${i}`}
              className="flex flex-col items-center"
            >
              <span
                className="flex size-12 items-center justify-center text-base font-black tabular-nums"
                style={{
                  backgroundColor: i === team.recommendedCheckout.length - 1 ? team.color : '#1a1a1a',
                  color: i === team.recommendedCheckout.length - 1 ? '#000' : team.color,
                  clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)',
                }}
              >
                {dart}
              </span>
              <span className="mt-0.5 text-[8px] text-white/25">D{i + 1}</span>
            </div>
          ))}
        </div>

        {active && (
          <div
            className="mb-3 flex items-center gap-3 rounded-none border-l-4 px-3 py-2"
            style={{ borderColor: team.color, backgroundColor: `${team.color}10` }}
          >
            <Avatar name={active.name} image={active.image} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black uppercase">{active.name}</p>
              <p className="text-[10px] text-white/40">
                Last visit · <span className="font-bold text-white">{active.lastVisit}</span>
                {' · '}Leg {active.legAverage.toFixed(1)}
              </p>
            </div>
            <div className="flex gap-1">
              {active.visitHistory.map((v, i) => (
                <span
                  key={i}
                  className="bg-white/5 px-1.5 py-0.5 text-[10px] font-bold tabular-nums"
                  style={v >= 100 ? { color: team.color } : undefined}
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto grid grid-cols-3 gap-2 border-t border-white/8 pt-3">
          {[
            ['Doubles', `${team.stats.doublesRate}%`],
            ['CO', `${team.stats.checkoutsHit}/${team.stats.checkoutAttempts}`],
            ['Hi visit', team.stats.highestVisit],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="text-[8px] uppercase tracking-wider text-white/25">{k}</p>
              <p className="text-sm font-black tabular-nums text-white/80">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TeamCardKillshot
