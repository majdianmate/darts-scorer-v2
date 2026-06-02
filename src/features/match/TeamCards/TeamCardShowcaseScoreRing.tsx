import { type FC } from 'react'
import type { MockTeamCardData } from '#/utils/mock'
import { LegWinScoreDial } from './leg-win-segments'
import { ShowcaseFrostCard } from './ShowcaseFrostCard'

interface Props {
  team: MockTeamCardData
}

/** Score dial — dark disc, dashed track, arc segments for won legs. */
const TeamCardShowcaseScoreRing: FC<Props> = ({ team }) => (
  <ShowcaseFrostCard
    team={team}
    scoreSlot={
      <LegWinScoreDial
        score={team.remainingScore}
        won={team.legsWon}
        target={team.legsTarget}
        color={team.color}
      />
    }
  />
)

export default TeamCardShowcaseScoreRing
