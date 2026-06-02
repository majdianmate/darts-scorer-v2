import { type FC, type ReactNode, useState } from 'react'
import Avatar from '#/components/Avatar'
import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'
import { cn } from '#/lib/utils'
import type { MockTeamCardData } from '#/utils/mock'

export interface ShowcaseFrostCardProps {
  team: MockTeamCardData
  topSlot?: ReactNode
  scoreSlot: ReactNode
}

export const ShowcaseFrostCard: FC<ShowcaseFrostCardProps> = ({
  team,
  topSlot,
  scoreSlot,
}) => {
  const TeamIcon = getSquadIcon(team.icon)
  const [expanded, setExpanded] = useState(false)
  const center = (team.members.length - 1) / 2
  const stepDefault = 28 + team.members.length * 10
  const stepHover = 44 + team.members.length * 22
  const accent = team.color

  return (
    <div
      className={cn(
        'relative h-full min-h-0 w-full overflow-hidden rounded-[28px] border border-white/10 transition-all duration-300',
        team.isCurrentTeam ? 'scale-[1.005]' : 'opacity-90',
      )}
      style={{
        boxShadow: team.isCurrentTeam
          ? `0 0 40px ${accent}33, 0 20px 56px rgba(0,0,0,0.5)`
          : '0 16px 48px rgba(0,0,0,0.45)',
      }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-[20%] -top-[25%] h-[70%] w-[75%] rounded-full blur-[72px]"
          style={{ background: accent, opacity: team.isCurrentTeam ? 0.45 : 0.28 }}
        />
        <div
          className="absolute -bottom-[30%] -right-[15%] h-[65%] w-[70%] rounded-full blur-[88px]"
          style={{
            background: accent,
            opacity: team.isCurrentTeam ? 0.22 : 0.12,
            filter: 'brightness(0.45) saturate(1.2)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(165deg, ${accent}18 0%, transparent 45%, ${accent}0a 100%)`,
          }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-neutral-950/55 backdrop-blur-2xl backdrop-saturate-150" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.09] via-white/[0.03] to-black/25" />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]" />

      <div className="relative flex h-full min-h-0 flex-col">
        {topSlot}

        <div
          className={cn(
            'relative flex shrink-0 items-center justify-between px-4',
            topSlot ? 'pt-2' : 'pt-4',
          )}
        >
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 backdrop-blur-md">
              <TeamIcon className="size-4" style={{ color: accent }} />
            </div>
            <span className="text-sm font-semibold text-white/95">{team.name}</span>
          </div>
          {team.isCurrentTeam ? (
            <span
              className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md"
              style={{ color: accent }}
            >
              At oche
            </span>
          ) : (
            <span className="text-xs tabular-nums text-white/45">
              {team.legsWon}/{team.legsTarget} legs
            </span>
          )}
        </div>

        <div className="relative flex min-h-0 flex-[1.35] items-center justify-center overflow-visible px-2 py-2">
          {scoreSlot}
        </div>

        <div
          className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden px-3"
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
        >
          <p className="mb-1 shrink-0 text-center text-[9px] uppercase tracking-widest text-white/35">
            {expanded ? 'Squad' : 'Hover players'}
          </p>

          <div className="relative min-h-[clamp(9rem,20vh,14rem)] flex-1 overflow-hidden">
            {team.members.map((member, i) => {
              const isActive = member.id === team.currentPlayerId
              const offsetFromCenter = i - center
              const step = expanded ? stepHover : stepDefault
              const x = offsetFromCenter * step
              const rotation = expanded ? 0 : offsetFromCenter * 4
              const lift = isActive && !expanded ? -10 : 0
              const scale = isActive && !expanded ? 1.05 : 1
              const zIndex = expanded ? 10 + i : isActive ? 20 : 10 + i

              return (
                <div
                  key={member.id}
                  className="absolute bottom-0 left-1/2 will-change-transform"
                  style={{
                    zIndex,
                    transform: `translateX(calc(-50% + ${x}px)) translateY(${lift}px) rotate(${rotation}deg) scale(${scale})`,
                    transition:
                      'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
                  }}
                >
                  <div
                    className={cn(
                      'flex flex-col items-center rounded-2xl border p-2.5 backdrop-blur-md',
                      isActive ? 'border-white/25 bg-white/12' : 'border-white/10 bg-white/[0.06]',
                    )}
                    style={{
                      width: 'clamp(5rem, 11vw, 7rem)',
                      boxShadow: isActive
                        ? `0 8px 24px ${accent}33, inset 0 1px 0 rgba(255,255,255,0.18)`
                        : 'inset 0 1px 0 rgba(255,255,255,0.08)',
                    }}
                  >
                    <Avatar
                      name={member.name}
                      image={member.image}
                      size={isActive ? 'lg' : 'md'}
                    />
                    <p className="mt-1.5 max-w-full truncate text-[10px] font-medium text-white/90">
                      {member.name.split(' ')[0]}
                    </p>
                    <p
                      className="mt-0.5 text-sm font-black tabular-nums leading-none"
                      style={{ color: isActive ? accent : 'rgba(255,255,255,0.85)' }}
                    >
                      {member.matchAverage.toFixed(1)}
                    </p>
                    {expanded && (
                      <p className="mt-1 text-[9px] tabular-nums text-white/40">
                        last {member.lastVisit}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="relative z-10 flex shrink-0 flex-col items-center gap-2 px-4 pb-3 pt-1">
          <div className="flex gap-2">
            {team.recommendedCheckout.map((dart, i) => (
              <span
                key={`${dart}-${i}`}
                className={cn(
                  'flex size-9 items-center justify-center rounded-xl border text-xs font-bold tabular-nums backdrop-blur-md',
                  i === team.recommendedCheckout.length - 1
                    ? 'border-white/25 text-white'
                    : 'border-white/10 bg-white/8 text-white/90',
                )}
                style={
                  i === team.recommendedCheckout.length - 1
                    ? {
                        background: `${accent}44`,
                        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15), 0 0 12px ${accent}44`,
                      }
                    : undefined
                }
              >
                {dart}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-px border-t border-white/8 bg-white/[0.04] text-center text-[10px] backdrop-blur-sm">
          {[
            ['Match', team.stats.matchAverage.toFixed(1)],
            ['Leg', team.stats.legAverage.toFixed(1)],
            ['CO', `${team.stats.checkoutRate}%`],
          ].map(([label, val]) => (
            <div key={label} className="py-2.5">
              <p className="text-[8px] uppercase tracking-wider text-white/35">{label}</p>
              <p className="font-bold tabular-nums text-white/90">{val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
