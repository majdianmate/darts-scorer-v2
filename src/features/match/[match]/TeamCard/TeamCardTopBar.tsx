import { type FC } from 'react'

import { useSelector } from '@tanstack/react-store'

import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'
import { countLegsWon, getLegsToWin } from '#/utils/match-leg-utils'
import { matchStore } from '../../../../../store/match-store'
import type { Match, Team } from '../../../../../types/match-types'

import TeamTurnIndicator from '../../TeamCards/TeamTurnIndicator'
import TeamCardLegIndicator from './TeamCardLegIndicator'

interface TeamCardTopBarProps {
  team: Team
  isCurrentTeam: boolean
}

function getIsNextTeam(match: Match | null, teamId: string, isCurrentTeam: boolean) {
  if (!match || isCurrentTeam) return false

  const currentIdx = match.teams.findIndex((t) => t.id === match.currentTeamId)
  if (currentIdx === -1) return false

  const nextIdx = (currentIdx + 1) % match.teams.length
  return match.teams[nextIdx]?.id === teamId
}

const TeamCardTopBar: FC<TeamCardTopBarProps> = ({ team, isCurrentTeam }) => {
  const match = useSelector(matchStore, (state) => state.match)
  const matchConfig = useSelector(matchStore, (state) => state.matchConfig)
  const TeamIcon = getSquadIcon(team.icon)
  const isNextTeam = getIsNextTeam(match, team.id, isCurrentTeam)
  const legsWon = countLegsWon(match?.legs ?? [], team.id)
  const legsToWin = getLegsToWin(matchConfig)

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 backdrop-blur-md">
            <TeamIcon className="size-4" style={{ color: team.color }} />
          </div>
          <span className="truncate text-sm font-semibold text-white/95">{team.name}</span>
        </div>

        <div className="flex shrink-0 items-center">
          <TeamTurnIndicator
            isCurrentTeam={isCurrentTeam}
            isNextTeam={isNextTeam}
            color={team.color}
          />
        </div>
      </div>

      <TeamCardLegIndicator
        legsWon={legsWon}
        legsToWin={legsToWin}
        accent={team.color}
      />
    </div>
  )
}

export default TeamCardTopBar
