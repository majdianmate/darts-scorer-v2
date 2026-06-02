import {
  GameMode,
  MatchStatus,
  type Leg,
  type Match,
  type MatchConfig,
} from '../../types/match-types'

export function getLegsToWin(matchConfig: MatchConfig): number {
  if (matchConfig.gameMode === GameMode.BestOf) {
    return Math.ceil(matchConfig.numberOfLegs / 2)
  }

  return matchConfig.numberOfLegs
}

export function countLegsWon(legs: Leg[], teamId: string): number {
  return legs.filter((leg) => leg.winnerTeamId === teamId).length
}

export function getCurrentLeg(match: Match): Leg | undefined {
  const legIndex = Math.max(0, match.currentLeg - 1)
  return match.legs[legIndex]
}

export function isMatchEnded(match: Match): boolean {
  return match.status === MatchStatus.Ended || match.winnerTeamId !== null
}
