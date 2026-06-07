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
import TeamCardAmbientOrbs from './TeamCardAmbientOrbs'
import TeamCardRotatingBorder from './TeamCardRotatingBorder'
import {
  teamCardAccentRailStyle,
  teamCardInnerRingClass,
  teamCardShellFaceStyle,
  teamCardShellStyle,
  teamCardWatermarkStyle,
} from './team-card-utils'

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
      className="relative flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl"
      onClick={onClick}
    >
      {isCurrentTeam ? <TeamCardRotatingBorder accent={accent} /> : null}

      <div
        className={cn(
          'group relative z-[1] flex min-h-0 w-full flex-1 cursor-pointer flex-col overflow-hidden transition-[transform,box-shadow,border-color] duration-300 ease-out',
          isCurrentTeam
            ? 'm-[2px] rounded-[calc(1rem-2px)]'
            : 'rounded-2xl border',
        )}
        style={teamCardShellStyle(accent, isCurrentTeam)}
      >
        {isCurrentTeam ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 rounded-[calc(1rem-2px)]"
            style={teamCardShellFaceStyle(accent, true)}
          />
        ) : null}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-4 top-0 h-px"
          style={teamCardAccentRailStyle(accent, isCurrentTeam)}
        />

        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0',
            isCurrentTeam ? 'rounded-[calc(1rem-2px)]' : 'rounded-2xl',
            teamCardInnerRingClass(isCurrentTeam),
          )}
        />

        {isCurrentTeam ? <TeamCardAmbientOrbs accent={accent} /> : null}

        <div
          className="relative z-[1] flex h-full min-h-0 flex-col"
          style={{
            backgroundImage: isCurrentTeam
              ? `linear-gradient(to bottom right, ${accent}, transparent)`
              : undefined,
          }}
        >
          <div className="relative z-10 shrink-0 border-b border-white/[0.05] px-4 py-3.5 ">
            <TeamCardTopBar team={team} isCurrentTeam={isCurrentTeam} />
          </div>

          <div className="relative flex min-h-0 flex-1 flex-col">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <TeamIcon
                strokeWidth={1.25}
                className="size-[clamp(9rem,32vh,16rem)]"
                style={teamCardWatermarkStyle(accent, isCurrentTeam)}
              />
            </div>

            <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-3 pt-1">
              <TeamCardScore team={team} accent={accent} />

              <TeamCardPlayers team={team} accent={accent} />

              <TeamCardStats team={team} accent={accent} isCurrentTeam={isCurrentTeam} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamCard
