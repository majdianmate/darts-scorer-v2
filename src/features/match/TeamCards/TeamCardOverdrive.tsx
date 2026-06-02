import { type FC } from 'react'
import { Flame, Zap } from 'lucide-react'
import Avatar from '#/components/Avatar'
import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'
import { cn } from '#/lib/utils'
import type { MockTeamCardData } from '#/utils/mock'

interface Props {
  team: MockTeamCardData
}

const MOMENTUM = {
  hot: { label: 'On fire', icon: Flame, width: 85 },
  steady: { label: 'Steady', icon: Zap, width: 55 },
  cold: { label: 'Cold', icon: Zap, width: 25 },
}

const TeamCardOverdrive: FC<Props> = ({ team }) => {
  const TeamIcon = getSquadIcon(team.icon)
  const mom = MOMENTUM[team.stats.momentum]
  const MomIcon = mom.icon

  return (
    <div
      className={cn(
        'relative flex min-h-[480px] flex-col overflow-hidden transition-all',
        !team.isCurrentTeam && 'opacity-80',
      )}
      style={{
        background: `linear-gradient(165deg, #111 0%, #111 40%, ${team.color}18 100%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(-45deg, ${team.color}, ${team.color} 1px, transparent 1px, transparent 12px)`,
        }}
      />

      <div className="relative flex items-center justify-between px-5 pt-4">
        <div className="flex items-center gap-2">
          <TeamIcon className="size-5" style={{ color: team.color }} />
          <h3 className="text-sm font-black uppercase tracking-wide">{team.name}</h3>
        </div>
        <div className="flex items-center gap-3">
          {team.stats.ton80s > 0 && (
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black tabular-nums leading-none" style={{ color: team.color }}>
                {team.stats.ton80s}
              </span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-white/40">180s</span>
            </div>
          )}
          <div className="text-right">
            <p className="text-2xl font-black tabular-nums leading-none">
              {team.legsWon}
              <span className="text-sm text-white/30">/{team.legsTarget}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="relative mx-5 mt-3">
        <div className="mb-1 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MomIcon className="size-3.5" style={{ color: team.color }} />
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: team.color }}>
              {mom.label}
            </span>
          </div>
          <span className="text-[10px] tabular-nums text-white/40">
            Visit avg {team.stats.visitAverage.toFixed(1)}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${mom.width}%`,
              background: `linear-gradient(90deg, ${team.color}80, ${team.color})`,
              boxShadow: `0 0 12px ${team.color}`,
            }}
          />
        </div>
        <div className="mt-2 flex justify-between gap-1">
          {team.stats.lastVisits.map((v, i) => (
            <div
              key={i}
              className="flex-1 py-1.5 text-center"
              style={{
                backgroundColor: v >= 100 ? `${team.color}25` : 'rgba(255,255,255,0.04)',
                borderBottom: v >= 100 ? `2px solid ${team.color}` : '2px solid transparent',
              }}
            >
              <p className="text-[8px] uppercase text-white/30">V{i + 1}</p>
              <p
                className="text-lg font-black tabular-nums"
                style={v >= 100 ? { color: team.color } : undefined}
              >
                {v}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex flex-col items-center py-4">
        {team.isCurrentTeam && (
          <span
            className="mb-1 rounded-sm px-2 py-px text-[9px] font-black uppercase tracking-[0.3em] text-black"
            style={{ backgroundColor: team.color }}
          >
            Live
          </span>
        )}
        <p
          className="text-[88px] font-black leading-none tabular-nums tracking-tighter"
          style={{
            color: team.isCurrentTeam ? team.color : '#fff',
            filter: team.isCurrentTeam ? `drop-shadow(0 0 30px ${team.color}60)` : undefined,
          }}
        >
          {team.remainingScore}
        </p>
        <div className="mt-2 flex gap-2">
          {team.recommendedCheckout.map((d, i) => (
            <span
              key={`${d}-${i}`}
              className="px-2.5 py-1 text-sm font-black tabular-nums ring-1 ring-white/15"
              style={i === 2 ? { backgroundColor: team.color, color: '#000' } : undefined}
            >
              {d}
            </span>
          ))}
        </div>
      </div>

      <div className="relative space-y-1.5 px-4 pb-4">
        {team.members.map((member) => {
          const isActive = member.id === team.currentPlayerId
          const maxVisit = Math.max(...member.visitHistory, 1)
          return (
            <div
              key={member.id}
              className={cn(
                'flex items-center gap-3 px-2 py-2',
                isActive && 'bg-white/5',
              )}
              style={isActive ? { borderLeft: `3px solid ${team.color}` } : { borderLeft: '3px solid transparent' }}
            >
              <Avatar
                name={member.name}
                image={member.image}
                size="sm"
                className={cn(!isActive && 'opacity-50')}
              />
              <div className="min-w-0 flex-1">
                <p className={cn('truncate text-xs', isActive ? 'font-bold' : 'text-white/50')}>
                  {member.name}
                </p>
                <div className="mt-1 flex h-1 gap-px">
                  {member.visitHistory.map((v, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{
                        height: `${Math.max(20, (v / maxVisit) * 100)}%`,
                        minHeight: 4,
                        backgroundColor: v >= 100 ? team.color : 'rgba(255,255,255,0.15)',
                        alignSelf: 'flex-end',
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black tabular-nums" style={isActive ? { color: team.color } : undefined}>
                  {member.matchAverage.toFixed(1)}
                </p>
                <p className="text-[9px] text-white/30">last {member.lastVisit}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div
        className="relative mt-auto grid grid-cols-5 gap-px text-center"
        style={{ backgroundColor: `${team.color}30` }}
      >
        {[
          ['Match', team.stats.matchAverage.toFixed(1)],
          ['Leg', team.stats.legAverage.toFixed(1)],
          ['CO%', `${team.stats.checkoutRate}%`],
          ['Dbl', `${team.stats.doublesRate}%`],
          ['Win', `${team.stats.winProbability}%`],
        ].map(([k, v]) => (
          <div key={k} className="bg-[#111] px-1 py-2.5">
            <p className="text-[7px] font-bold uppercase text-white/30">{k}</p>
            <p className="text-xs font-black tabular-nums">{v}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeamCardOverdrive
