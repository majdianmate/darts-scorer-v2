import { type FC, type ReactNode, useState } from 'react'
import Avatar from '#/components/Avatar'
import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'
import { cn } from '#/lib/utils'
import type { MockTeamCardData } from '#/utils/mock'

export interface StackFanCardProps {
  team: MockTeamCardData
  legWinIndicator?: ReactNode
  showLegsInFooter?: boolean
}

export const StackFanCard: FC<StackFanCardProps> = ({
  team,
  legWinIndicator,
  showLegsInFooter = false,
}) => {
  const TeamIcon = getSquadIcon(team.icon)
  const [expanded, setExpanded] = useState(false)
  const center = (team.members.length - 1) / 2
  const spreadDefault = 52 + team.members.length * 18
  const spreadHover = 88 + team.members.length * 28

  return (
    <div
      className={cn(
        'relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl bg-gradient-to-b from-muted/30 to-card ring-1 ring-foreground/10 transition-all',
        !team.isCurrentTeam && 'opacity-75',
      )}
      style={
        team.isCurrentTeam
          ? { boxShadow: `inset 0 4px 0 ${team.color}` }
          : undefined
      }
    >
      <div className="flex shrink-0 flex-col gap-2 px-[clamp(1rem,3vw,1.5rem)] pt-[clamp(0.75rem,2vh,1.25rem)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TeamIcon
              className="size-[clamp(1rem,2.5vh,1.25rem)]"
              style={{ color: team.color }}
            />
            <span className="text-[clamp(0.8rem,2vh,0.95rem)] font-semibold">
              {team.name}
            </span>
          </div>
          {team.isCurrentTeam ? (
            <span
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: team.color }}
            >
              Throwing
            </span>
          ) : (
            <span className="text-xs tabular-nums text-muted-foreground">
              {team.stats.winProbability}% win
            </span>
          )}
        </div>
        {legWinIndicator}
      </div>

      <div className="relative flex min-h-0 flex-[1.15] items-center justify-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <TeamIcon
            className="absolute blur-3xl"
            strokeWidth={1.25}
            style={{
              color: team.color,
              opacity: team.isCurrentTeam ? 0.4 : 0.2,
              width: 'clamp(12rem, 38vh, 22rem)',
              height: 'clamp(12rem, 38vh, 22rem)',
            }}
          />
          <TeamIcon
            strokeWidth={1}
            style={{
              color: `${team.color}${team.isCurrentTeam ? '40' : '24'}`,
              width: 'clamp(12rem, 38vh, 22rem)',
              height: 'clamp(12rem, 38vh, 22rem)',
              filter: `
                drop-shadow(0 0 24px ${team.color})
                drop-shadow(0 0 64px ${team.color}bb)
              `,
            }}
          />
        </div>

        <p
          className="relative z-10 font-sans font-black tabular-nums leading-none tracking-[-0.05em] text-foreground"
          style={{
            fontSize: 'clamp(4.5rem, 18vh, 11rem)',
            textShadow: team.isCurrentTeam
              ? `0 2px 0 rgba(0,0,0,0.15), 0 0 48px ${team.color}55`
              : undefined,
          }}
        >
          {team.remainingScore}
        </p>
      </div>

      <div
        className="relative z-10 flex min-h-0 flex-1 flex-col px-[clamp(0.5rem,2vw,1rem)]"
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <p className="mb-[clamp(0.25rem,1vh,0.75rem)] shrink-0 text-center text-[9px] uppercase tracking-widest text-muted-foreground">
          {expanded ? 'Squad' : 'Hover to expand'}
        </p>

        <div className="relative min-h-[clamp(10rem,22vh,16rem)] flex-1">
          {team.members.map((member, i) => {
            const isActive = member.id === team.currentPlayerId
            const offsetFromCenter = i - center
            const spread = expanded ? spreadHover : spreadDefault
            const x = offsetFromCenter * spread
            const rotation = expanded ? 0 : offsetFromCenter * 5
            const lift = isActive ? (expanded ? -12 : -20) : expanded ? -6 : 0
            const scale = isActive && !expanded ? 1.06 : 1
            const zIndex = isActive ? 20 : 10 + i

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
                    'flex flex-col items-center rounded-2xl border p-[clamp(0.5rem,1.5vh,0.85rem)] shadow-lg backdrop-blur-md',
                    isActive
                      ? 'border-transparent bg-card/92'
                      : 'border-border/60 bg-card/70',
                  )}
                  style={{
                    width: 'clamp(6.5rem, 14vw, 9rem)',
                    ...(isActive
                      ? {
                          boxShadow: expanded
                            ? `0 16px 40px ${team.color}35, 0 0 0 2px ${team.color}`
                            : `0 10px 28px ${team.color}40, 0 0 0 2px ${team.color}`,
                        }
                      : expanded
                        ? { boxShadow: '0 10px 24px rgba(0,0,0,0.14)' }
                        : undefined),
                  }}
                >
                  <Avatar
                    name={member.name}
                    image={member.image}
                    size={isActive ? 'lg' : 'md'}
                  />
                  <p className="mt-2 max-w-full truncate text-[clamp(0.65rem,1.6vh,0.8rem)] font-medium">
                    {member.name.split(' ')[0]}
                  </p>
                  <p
                    className="mt-1 text-[clamp(0.85rem,2.2vh,1.1rem)] font-black tabular-nums leading-none"
                    style={{ color: isActive ? team.color : undefined }}
                  >
                    {member.matchAverage.toFixed(1)}
                  </p>
                  <p className="mt-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">
                    avg
                  </p>
                  {expanded && (
                    <p className="mt-1 text-[10px] tabular-nums text-muted-foreground">
                      last {member.lastVisit}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="relative z-10 flex shrink-0 flex-col items-center gap-2 px-5 py-[clamp(0.5rem,1.5vh,1rem)]">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Checkout
        </p>
        <div className="flex justify-center gap-[clamp(0.35rem,1vw,0.6rem)]">
          {team.recommendedCheckout.map((dart, i) => (
            <div
              key={`${dart}-${i}`}
              className="flex items-center justify-center rounded-xl font-bold tabular-nums ring-1 ring-foreground/10"
              style={{
                width: 'clamp(2.25rem, 5vh, 3rem)',
                height: 'clamp(2.25rem, 5vh, 3rem)',
                fontSize: 'clamp(0.7rem, 1.8vh, 0.85rem)',
                ...(i === team.recommendedCheckout.length - 1
                  ? { backgroundColor: team.color, color: '#fff' }
                  : { backgroundColor: 'var(--muted)' }),
              }}
            >
              {dart}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex shrink-0 items-center justify-between border-t border-border px-[clamp(1rem,3vw,1.5rem)] py-[clamp(0.6rem,1.5vh,0.85rem)] text-[clamp(0.65rem,1.6vh,0.8rem)]">
        <div>
          <span className="text-muted-foreground">Match </span>
          <span className="font-bold tabular-nums">{team.stats.matchAverage.toFixed(1)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Leg </span>
          <span className="font-bold tabular-nums">{team.stats.legAverage.toFixed(1)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">CO </span>
          <span className="font-bold tabular-nums">{team.stats.checkoutRate}%</span>
        </div>
        {showLegsInFooter && (
          <div>
            <span className="text-muted-foreground">Legs </span>
            <span className="font-bold tabular-nums">
              {team.legsWon}/{team.legsTarget}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export const legsToWinLabel = (team: MockTeamCardData) =>
  `${team.legsWon} of ${team.legsTarget} legs`

export const legsRemaining = (team: MockTeamCardData) =>
  Math.max(0, team.legsTarget - team.legsWon)
