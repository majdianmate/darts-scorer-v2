import { type FC } from 'react'

import { useSelector } from '@tanstack/react-store'

import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'

import { cn } from '#/lib/utils'

import { matchStore, setCurrentTeamId } from '../../../../../store/match-store'

import type { TeamLocal } from '../../../../../types/match-types'

import TeamCardTopBar from './TeamCardTopBar'

import TeamCardScore from './TeamCardScore'

import TeamCardPlayers from './TeamCardPlayers'

import TeamCardStats from './TeamCardStats'

interface TeamCardProps {
  team: TeamLocal
}

const TeamCard: FC<TeamCardProps> = ({ team }) => {
  const match = useSelector(matchStore, (state) => state.match)

  const isCurrentTeam = team.id === match?.currentTeamId

  const accent = team.color

  const TeamIcon = getSquadIcon(team.icon)

  const onClick = () => {
    setCurrentTeamId(team.id)
  }

  return (
    <div
      className={cn(
        'relative h-full min-h-0 w-full cursor-pointer overflow-hidden rounded-[28px] border border-white/10 transition-all duration-300',

        isCurrentTeam
          ? `scale-[1.005] border-${team.color}20`
          : `border-${team.color}8`,
      )}
      style={{
        boxShadow: isCurrentTeam
          ? `0 0 48px ${accent}55, 0 20px 56px rgba(0,0,0,0.5)`
          : `0 0 24px ${accent}28, 0 16px 48px rgba(0,0,0,0.45)`,
      }}
      onClick={onClick}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute -left-[20%] -top-[25%] h-[80%] w-[85%] rounded-full blur-[64px]"
          style={{ background: accent, opacity: isCurrentTeam ? 0.88 : 0 }}
        />

        <div
          className="absolute -bottom-[30%] -right-[15%] h-[75%] w-[80%] rounded-full blur-[48px]"
          style={{
            background: accent,
            opacity: isCurrentTeam ? 0.58 : 0,
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(165deg, ${accent}38 0%, transparent 50%, ${accent}1a 100%)`,
          }}
        />
      </div>

      {isCurrentTeam ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 90% 70% at 50% 0%, ${accent}44, transparent 72%)`,
          }}
        />
      ) : (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 20%, ${accent}1a, transparent 70%)`,
          }}
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-[#0a0a0d]/72" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.14] via-white/[0.05] to-transparent" />

      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]" />

      <div className="relative flex h-full min-h-0 flex-col">
        <div className="relative z-10 shrink-0 px-4 pt-4">
          <TeamCardTopBar team={team} isCurrentTeam={isCurrentTeam} />
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <TeamIcon
              className="absolute blur-3xl"
              strokeWidth={1.25}
              style={{
                color: accent,

                opacity: isCurrentTeam ? 0.78 : 0.48,

                width: 'clamp(10rem, 34vh, 18rem)',

                height: 'clamp(10rem, 34vh, 18rem)',
              }}
            />

            <TeamIcon
              strokeWidth={1}
              style={{
                color: `${accent}${isCurrentTeam ? '77' : '55'}`,

                width: 'clamp(10rem, 34vh, 18rem)',

                height: 'clamp(10rem, 34vh, 18rem)',

                filter: `drop-shadow(0 0 24px ${accent}88)`,
                opacity: isCurrentTeam ? 0.78 : 0.2,
              }}
            />
          </div>

          <div className="relative z-10 flex min-h-0 flex-1 flex-col px-4 pb-4">
            <TeamCardScore team={team} accent={accent} />

            <TeamCardPlayers team={team} accent={accent} />

            <TeamCardStats team={team} accent={accent} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamCard
