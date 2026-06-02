import { type FC } from 'react'
import Avatar from '#/components/Avatar'
import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'
import { cn } from '#/lib/utils'
import type { MockTeamCardData } from '#/utils/mock'

interface Props {
  team: MockTeamCardData
}

const TeamCardGloss: FC<Props> = ({ team }) => {
  const TeamIcon = getSquadIcon(team.icon)

  return (
    <div
      className={cn(
        'group relative flex min-h-[480px] flex-col overflow-hidden rounded-[28px] p-[1px] transition-all duration-500',
        team.isCurrentTeam ? 'scale-[1.008]' : 'opacity-85',
      )}
      style={{
        background: `linear-gradient(145deg, rgba(255,255,255,0.55) 0%, ${team.color}90 35%, rgba(255,255,255,0.15) 70%, ${team.color}50 100%)`,
        boxShadow: team.isCurrentTeam
          ? `0 24px 80px ${team.color}35, 0 0 0 1px rgba(255,255,255,0.12)`
          : '0 16px 48px rgba(0,0,0,0.35)',
      }}
    >
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background: `radial-gradient(circle at 20% 0%, ${team.color}55, transparent 45%), radial-gradient(circle at 90% 90%, ${team.color}40, transparent 40%)`,
        }}
      />

      <div className="relative flex flex-1 flex-col overflow-hidden rounded-[27px] bg-[#0a0a0c]/75 backdrop-blur-3xl">
        <div
          className="pointer-events-none absolute -left-1/4 -top-1/3 h-[120%] w-[70%] rotate-[-24deg] opacity-40"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35) 45%, transparent)',
          }}
        />
        <div className="pointer-events-none absolute inset-0 rounded-[27px] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(0,0,0,0.45)]" />

        <div className="relative flex items-center justify-between px-6 pt-5">
          <div className="flex items-center gap-3">
            <div
              className="flex size-10 items-center justify-center rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_8px_24px_rgba(0,0,0,0.35)]"
              style={{
                background: `linear-gradient(160deg, rgba(255,255,255,0.25), ${team.color}55)`,
              }}
            >
              <TeamIcon className="size-4 text-white drop-shadow-sm" />
            </div>
            <div>
              <h3 className="font-semibold tracking-tight text-white/95">{team.name}</h3>
              <p className="text-[11px] text-white/45">
                {team.legsWon} / {team.legsTarget} legs
              </p>
            </div>
          </div>
          {team.isCurrentTeam && (
            <span
              className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg"
              style={{
                background: `linear-gradient(180deg, rgba(255,255,255,0.35), ${team.color})`,
                boxShadow: `0 4px 20px ${team.color}60, inset 0 1px 0 rgba(255,255,255,0.4)`,
              }}
            >
              At oche
            </span>
          )}
        </div>

        <div className="relative mx-6 my-5 overflow-hidden rounded-3xl p-[1px]"
          style={{
            background: 'linear-gradient(160deg, rgba(255,255,255,0.5), rgba(255,255,255,0.05))',
          }}
        >
          <div
            className="relative flex flex-col items-center rounded-[23px] px-6 py-8"
            style={{
              background: `linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 100%)`,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)',
            }}
          >
            <div
              className="pointer-events-none absolute inset-x-8 top-2 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
            />
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.35em] text-white/40">
              Remaining
            </p>
            <p
              className="display-title text-7xl font-bold tabular-nums leading-none"
              style={{
                background: `linear-gradient(180deg, #fff 20%, ${team.color} 80%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: `drop-shadow(0 8px 24px ${team.color}50)`,
              }}
            >
              {team.remainingScore}
            </p>
            <div className="mt-5 flex gap-2">
              {team.recommendedCheckout.map((dart, i) => (
                <span
                  key={`${dart}-${i}`}
                  className="rounded-xl px-3 py-1.5 text-sm font-bold tabular-nums text-white/90"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04))',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), 0 4px 12px rgba(0,0,0,0.25)',
                  }}
                >
                  {dart}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex justify-center gap-5 px-4 pb-4">
          {team.members.map((member) => {
            const isActive = member.id === team.currentPlayerId
            return (
              <div key={member.id} className="flex flex-col items-center gap-2">
                <div
                  className={cn('rounded-full p-[2px]', isActive && 'scale-105')}
                  style={
                    isActive
                      ? {
                          background: `linear-gradient(145deg, rgba(255,255,255,0.7), ${team.color})`,
                          boxShadow: `0 0 24px ${team.color}55`,
                        }
                      : { background: 'rgba(255,255,255,0.12)' }
                  }
                >
                  <Avatar
                    name={member.name}
                    image={member.image}
                    size="md"
                    className={cn('border-0', !isActive && 'opacity-75')}
                  />
                </div>
                <p className={cn('max-w-[72px] truncate text-[11px]', isActive ? 'font-semibold text-white' : 'text-white/45')}>
                  {member.name.split(' ')[0]}
                </p>
                <span
                  className="rounded-lg px-2 py-0.5 text-[10px] font-bold tabular-nums"
                  style={
                    isActive
                      ? {
                          color: team.color,
                          background: 'rgba(255,255,255,0.9)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        }
                      : { color: 'rgba(255,255,255,0.5)' }
                  }
                >
                  {member.matchAverage.toFixed(1)}
                </span>
              </div>
            )
          })}
        </div>

        <div
          className="relative mt-auto grid grid-cols-4 gap-1 border-t border-white/8 p-3"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.06), transparent)' }}
        >
          {[
            ['Match', team.stats.matchAverage.toFixed(1)],
            ['Leg', team.stats.legAverage.toFixed(1)],
            ['CO', `${team.stats.checkoutRate}%`],
            ['Win', `${team.stats.winProbability}%`],
          ].map(([label, val]) => (
            <div key={label} className="text-center">
              <p className="text-[9px] uppercase tracking-wider text-white/35">{label}</p>
              <p className="text-sm font-semibold tabular-nums text-white/90">{val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TeamCardGloss
