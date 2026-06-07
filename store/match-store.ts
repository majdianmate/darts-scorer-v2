import { Store } from '@tanstack/react-store'
import { Timestamp } from 'firebase/firestore'
import { toast } from 'sonner'

import {
  applyCheckoutDetails,
  parseScoreInput,
  parseScoreStructure,
  scoreValidators,
  validateParsedScore,
} from '#/utils/score-parser'
import {
  appendScoreToLegs,
  buildScoreFromParsed,
  closeLeg,
  findLastScoredLegIndex,
  getOrCreateCurrentLeg,
  reopenLeg,
  removeLastScoreFromLeg,
} from '#/utils/score-builder'
import {
  countLegsWon,
  getCurrentLeg,
  getLegsToWin,
  isMatchEnded,
} from '#/utils/match-leg-utils'

import type { ClubMember } from '../types/club-types'
import {
  CheckoutMode,
  defaultPlayerStatistics,
  defaultTeamStatistics,
  GameMode,
  MatchStatus,
  type Match,
  type MatchConfig,
  type Score,
  type Team,
  type TeamLocal,
} from '../types/match-types'
import { emitScoreDisplay } from '#/features/match/[match]/score-display-bus'
import { addScoreToMatchService } from '../services/match-service'
import {
  clearMatchStatsRegistry,
  getPlayerStatsManager,
  getTeamStatsManager,
  handleLegEndForAllTeams,
  initMatchStatsRegistry,
  registerTeamStats,
  unregisterTeamStats,
} from './match-stats-registry'

export {
  getPlayerStatsManager,
  getTeamStatsManager,
} from './match-stats-registry'

export interface RandomTeamDraft {
  selectedMembers: ClubMember[]
  teamCount: number
}

export const MIN_RANDOM_TEAMS = 2
export const MAX_RANDOM_TEAMS = 3

export const defaultRandomTeamDraft = (): RandomTeamDraft => ({
  selectedMembers: [],
  teamCount: MIN_RANDOM_TEAMS,
})

export function getMaxRandomTeamCount(memberCount: number): number {
  return Math.min(memberCount, MAX_RANDOM_TEAMS)
}

export function clampRandomTeamCount(
  teamCount: number,
  memberCount: number,
): number {
  const max = getMaxRandomTeamCount(memberCount)

  if (max < 1) return MIN_RANDOM_TEAMS
  if (max === 1) return 1

  return Math.min(max, Math.max(MIN_RANDOM_TEAMS, teamCount))
}

export const defaultMatchConfig = (): MatchConfig => ({
  gameMode: GameMode.FirstTo,
  checkoutMode: CheckoutMode.Double,
  startingScore: 501,
  numberOfLegs: 3,
  startingTeamId: '',
  displayScore: true,
  aiVoice: false,
})

export interface MatchStoreState {
  clubId: string | null
  match: Match | null
  matchConfig: MatchConfig
  teams: TeamLocal[]
  randomDraft: RandomTeamDraft
}

const resolveCurrentPlayerId = (team: Team): string => {
  const { currentPlayerId, members } = team
  if (!members.length) return ''
  if (!currentPlayerId) return members[0]!.id

  const member = members.find(
    (m) => m.id === currentPlayerId || m.userId === currentPlayerId,
  )
  return member?.id ?? members[0]!.id
}

const toTeamLocal = (team: Team): TeamLocal => ({
  ...team,
  currentPlayerId: resolveCurrentPlayerId(team),
  statistics: defaultTeamStatistics,
  scores: [],
  members: team.members.map((member) => ({
    ...member,
    legAverage: defaultPlayerStatistics.legAverage,
    gameAverage: defaultPlayerStatistics.gameAverage,
    statistics: defaultPlayerStatistics,
  })),
})

function collectScoresByTeam(match: Match): Map<string, Score[]> {
  const byTeam = new Map<string, Score[]>()

  for (const leg of match.legs ?? []) {
    for (const score of leg.scores ?? []) {
      const list = byTeam.get(score.teamId) ?? []
      list.push(score)
      byTeam.set(score.teamId, list)
    }
  }

  for (const scores of byTeam.values()) {
    scores.sort(
      (a, b) =>
        (a.createdAt?.toMillis?.() ?? 0) - (b.createdAt?.toMillis?.() ?? 0),
    )
  }

  return byTeam
}

function buildTeamsFromMatch(match: Match): TeamLocal[] {
  const scoresByTeam = collectScoresByTeam(match)

  return match.teams.map((team) => ({
    ...toTeamLocal(team),
    scores: scoresByTeam.get(team.id) ?? [],
  }))
}

function replayStatsForTeams(teams: TeamLocal[], match: Match) {
  for (const leg of match.legs ?? []) {
    for (const score of leg.scores ?? []) {
      getTeamStatsManager(score.teamId)?.processNewScore(score)
      getPlayerStatsManager(score.teamId, score.playerId)?.processNewScore(score)
    }

    if (leg.winnerTeamId) {
      handleLegEndForAllTeams()
    }
  }
}

function applyStatsSnapshots(teams: TeamLocal[]): TeamLocal[] {
  return teams.map((team) => ({
    ...team,
    statistics: getTeamStatsManager(team.id)?.getSnapshot() ?? defaultTeamStatistics,
    members: team.members.map((member) => {
      const playerStats =
        getPlayerStatsManager(team.id, member.id)?.getSnapshot() ??
        defaultPlayerStatistics

      return {
        ...member,
        legAverage: playerStats.legAverage,
        gameAverage: playerStats.gameAverage,
        statistics: playerStats,
      }
    }),
  }))
}

export const hydrateMatchFromServer = (match: Match) => {
  const teams = buildTeamsFromMatch(match)

  initMatchStatsRegistry(teams)
  replayStatsForTeams(teams, match)

  const teamsWithStats = applyStatsSnapshots(teams)

  matchStore.setState((prev) => ({
    ...prev,
    clubId: match.clubId,
    match,
    matchConfig: match.matchConfig,
    teams: teamsWithStats,
  }))
}

function getNextPlayerId(team: TeamLocal, currentPlayerId: string): string {
  if (team.members.length === 0) return ''

  const idx = team.members.findIndex((member) => member.id === currentPlayerId)
  const nextIdx = idx === -1 ? 0 : (idx + 1) % team.members.length
  return team.members[nextIdx]!.id
}

function getNextTeamId(teams: TeamLocal[], currentTeamId: string): string {
  if (teams.length === 0) return currentTeamId

  const idx = teams.findIndex((team) => team.id === currentTeamId)
  const nextIdx = idx === -1 ? 0 : (idx + 1) % teams.length
  return teams[nextIdx]!.id
}

/** Team that lost the leg — throws first in the next leg (standard darts rules). */
function getLoserTeamId(teams: TeamLocal[], winnerTeamId: string): string {
  if (teams.length === 2) {
    return teams.find((team) => team.id !== winnerTeamId)?.id ?? winnerTeamId
  }

  return getNextTeamId(teams, winnerTeamId)
}

function advanceTurnAfterScore(
  teams: TeamLocal[],
  match: Match,
  scoringTeamId: string,
  scoringPlayerId: string,
): { teams: TeamLocal[]; match: Match } {
  const scoringTeam = teams.find((team) => team.id === scoringTeamId)
  if (!scoringTeam) return { teams, match }

  const nextPlayerId = getNextPlayerId(scoringTeam, scoringPlayerId)
  const nextTeamId = getNextTeamId(teams, scoringTeamId)

  const updatedTeams = teams.map((team) =>
    team.id === scoringTeamId
      ? { ...team, currentPlayerId: nextPlayerId }
      : team,
  )

  const updatedMatchTeams = match.teams.map((team) =>
    team.id === scoringTeamId
      ? { ...team, currentPlayerId: nextPlayerId }
      : team,
  )

  return {
    teams: updatedTeams,
    match: {
      ...match,
      teams: updatedMatchTeams,
      currentTeamId: nextTeamId,
      currentLegRound: match.currentLegRound + 1,
      currentRound: match.currentRound + 1,
    },
  }
}

function applyScoreOptimistic(
  score: Score,
  teamId: string,
  playerId: string,
) {
  const teamStats = getTeamStatsManager(teamId)
  const playerStats = getPlayerStatsManager(teamId, playerId)

  teamStats?.processNewScore(score)
  playerStats?.processNewScore(score)

  const teamStatistics = teamStats?.getSnapshot() ?? defaultTeamStatistics
  const playerStatistics = playerStats?.getSnapshot() ?? defaultPlayerStatistics

  matchStore.setState((prev) => ({
    ...prev,
    teams: prev.teams.map((team) =>
      team.id === teamId
        ? {
            ...team,
            scores: [...team.scores, score],
            statistics: teamStatistics,
            members: team.members.map((member) =>
              member.id === playerId
                ? {
                    ...member,
                    legAverage: playerStatistics.legAverage,
                    gameAverage: playerStatistics.gameAverage,
                    statistics: playerStatistics,
                  }
                : member,
            ),
          }
        : team,
    ),
  }))
}

export const matchStore = new Store<MatchStoreState>({
  clubId: null,
  match: null,
  matchConfig: defaultMatchConfig(),
  teams: [],
  randomDraft: defaultRandomTeamDraft(),
})

const emptyMatchStoreState = (): MatchStoreState => ({
  clubId: null,
  match: null,
  matchConfig: defaultMatchConfig(),
  teams: [],
  randomDraft: defaultRandomTeamDraft(),
})

export const resetMatchDraft = (clubId: string) => {
  matchStore.setState(() => ({
    ...emptyMatchStoreState(),
    clubId,
  }))
}

export const loadMatch = (match: Match) => {
  hydrateMatchFromServer(match)
}

export const clearMatchStore = () => {
  clearMatchStatsRegistry()
  matchStore.setState(() => emptyMatchStoreState())
}

export const setRandomDraftMembers = (selectedMembers: ClubMember[]) => {
  matchStore.setState((prev) => ({
    ...prev,
    randomDraft: {
      selectedMembers,
      teamCount: clampRandomTeamCount(
        prev.randomDraft.teamCount,
        selectedMembers.length,
      ),
    },
  }))
}

export const setRandomTeamCount = (teamCount: number) => {
  matchStore.setState((prev) => ({
    ...prev,
    randomDraft: {
      ...prev.randomDraft,
      teamCount: clampRandomTeamCount(
        teamCount,
        prev.randomDraft.selectedMembers.length,
      ),
    },
  }))
}

export const setMatchConfig = (matchConfig: MatchConfig) => {
  matchStore.setState((prev) => ({
    ...prev,
    matchConfig,
  }))
}

export const patchMatchConfig = (patch: Partial<MatchConfig>) => {
  matchStore.setState((prev) => ({
    ...prev,
    matchConfig: { ...prev.matchConfig, ...patch },
  }))
}

export const addTeam = (team: Team) => {
  matchStore.setState((prev) => {
    if (prev.teams.some((existing) => existing.id === team.id)) {
      return prev
    }

    const teams = [...prev.teams, toTeamLocal(team)]
    const localTeam = teams[teams.length - 1]!

    registerTeamStats(
      localTeam.id,
      localTeam.members.map((member) => member.id),
    )

    const startingTeamId =
      prev.matchConfig.startingTeamId || team.id

    return {
      ...prev,
      teams,
      matchConfig: { ...prev.matchConfig, startingTeamId },
    }
  })
}

export const removeTeam = (teamId: string) => {
  unregisterTeamStats(teamId)

  matchStore.setState((prev) => {
    const teams = prev.teams.filter((team) => team.id !== teamId)
    const startingTeamId =
      prev.matchConfig.startingTeamId === teamId
        ? (teams[0]?.id ?? '')
        : prev.matchConfig.startingTeamId

    return {
      ...prev,
      teams,
      matchConfig: { ...prev.matchConfig, startingTeamId },
    }
  })
}

export const setCurrentTeamId = (teamId: string) => {
  matchStore.setState((prev) => {
    if (!prev.match) return prev

    return {
      ...prev,
      match: { ...prev.match, currentTeamId: teamId },
    }
  })
}

export const setCurrentPlayerId = (playerId: string, teamId: string) => {
  matchStore.setState((prev) => ({
    ...prev,
    teams: prev.teams.map((team) =>
      team.id === teamId ? { ...team, currentPlayerId: playerId } : team,
    ),
    match: prev.match
      ? {
          ...prev.match,
          teams: prev.match.teams.map((team) =>
            team.id === teamId ? { ...team, currentPlayerId: playerId } : team,
          ),
        }
      : null,
  }))
}

export const getRemainingScore = (teamId: string): number => {
  const state = matchStore.get()
  const match = state.match
  if (!match) return state.matchConfig.startingScore

  const currentLeg = getCurrentLeg(match)
  if (!currentLeg) return state.matchConfig.startingScore

  const team = state.teams.find((t) => t.id === teamId)
  const legScores =
    team?.scores.filter((score) => score.legId === currentLeg.id) ?? []
  const scoreSum = legScores.reduce((acc, score) => acc + score.score, 0)

  if (!scoreSum) return state.matchConfig.startingScore
  return state.matchConfig.startingScore - scoreSum
}

export function canUndoLastScore(): boolean {
  const match = matchStore.get().match
  if (!match || isMatchEnded(match)) return false

  return findLastScoredLegIndex(match.legs) !== null
}

export interface AddScoreOptions {
  checkoutDetails?: {
    dartsThrown: number
    checkoutAttempts: number
  }
}

export interface AddScoreScorer {
  teamId: string
  playerId: string
}

export const addScore = async (
  inputScore: string,
  options?: AddScoreOptions,
  scorer?: AddScoreScorer,
): Promise<boolean> => {
  const state = matchStore.get()
  const match = state.match

  if (!match) return false

  const teamId = scorer?.teamId ?? match.currentTeamId
  const team = state.teams.find((entry) => entry.id === teamId)
  const playerId = scorer?.playerId ?? team?.currentPlayerId

  if (!teamId || !playerId) return false

  if (isMatchEnded(match)) {
    toast.error('Match is already over.')
    return false
  }

  if (teamId !== match.currentTeamId) {
    toast.error('Turn has changed — score the active team.')
    return false
  }

  const remainingBefore = getRemainingScore(teamId)
  let parsed = parseScoreStructure(inputScore)

  if (!parsed.isValid) {
    toast.error(parsed.error ?? 'Invalid score input.')
    return false
  }

  if (options?.checkoutDetails) {
    parsed = applyCheckoutDetails(
      parsed,
      options.checkoutDetails.dartsThrown,
      options.checkoutDetails.checkoutAttempts,
    )
  }

  const validationError = validateParsedScore(parsed, scoreValidators, {
    remainingScore: remainingBefore,
  })

  if (validationError) {
    toast.error(validationError)
    return false
  }

  if (parsed.type === 'detailed') {
    toast.error('Detailed dart input is not supported yet.')
    return false
  }

  const { legs, legId } = getOrCreateCurrentLeg(match)
  const score = buildScoreFromParsed(parsed, {
    matchId: match.id,
    legId,
    teamId,
    playerId,
    remainingBefore,
  })

  if (!score) {
    toast.error('Could not build score from input.')
    return false
  }

  const updatedLegs = appendScoreToLegs(legs, legId, score)

  applyScoreOptimistic(score, teamId, playerId)

  let finalLegs = updatedLegs
  let finalMatch: Match = { ...match, legs: updatedLegs }
  let finalTeams = matchStore.get().teams

  if (score.isCheckedOut) {
    const winnerTeamId = teamId
    finalLegs = closeLeg(finalLegs, legId, winnerTeamId)
    finalMatch = { ...finalMatch, legs: finalLegs }

    handleLegEndForAllTeams()
    finalTeams = applyStatsSnapshots(finalTeams)

    const legsToWin = getLegsToWin(state.matchConfig)
    const teamLegsWon = countLegsWon(finalLegs, winnerTeamId)

    if (teamLegsWon >= legsToWin) {
      finalMatch = {
        ...finalMatch,
        winnerTeamId,
        status: MatchStatus.Ended,
        endedAt: Timestamp.now(),
        currentRound: finalMatch.currentRound + 1,
      }
    } else {
      const nextLegNumber = finalMatch.currentLeg + 1
      const nextLeg = getOrCreateCurrentLeg({
        ...finalMatch,
        currentLeg: nextLegNumber,
        legs: finalLegs,
      })
      const loserTeamId = getLoserTeamId(finalTeams, winnerTeamId)

      finalMatch = {
        ...finalMatch,
        legs: nextLeg.legs,
        currentLeg: nextLegNumber,
        currentLegRound: 1,
        currentTeamId: loserTeamId,
        currentRound: finalMatch.currentRound + 1,
      }
    }
  } else {
    const afterTurn = advanceTurnAfterScore(
      finalTeams,
      finalMatch,
      teamId,
      playerId,
    )
    finalTeams = afterTurn.teams
    finalMatch = afterTurn.match
  }

  matchStore.setState((prev) => ({
    ...prev,
    teams: finalTeams,
    match: finalMatch,
  }))

  try {
    await addScoreToMatchService(match.id, {
      legs: finalMatch.legs,
      teams: finalMatch.teams,
      currentTeamId: finalMatch.currentTeamId,
      currentLegRound: finalMatch.currentLegRound,
      currentRound: finalMatch.currentRound,
      currentLeg: finalMatch.currentLeg,
      winnerTeamId: finalMatch.winnerTeamId,
      status: finalMatch.status,
      endedAt: finalMatch.endedAt,
    })
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : 'Failed to save score.',
    )
    return false
  }

  if (finalMatch.matchConfig.displayScore) {
    emitScoreDisplay(score.score)
  }

  return true
}

export const undoLastScore = async (): Promise<boolean> => {
  const state = matchStore.get()
  const match = state.match
  if (!match) return false

  if (isMatchEnded(match)) {
    toast.error('Nothing to undo.')
    return false
  }

  const legIndex = findLastScoredLegIndex(match.legs)
  if (legIndex === null) {
    toast.error('Nothing to undo.')
    return false
  }

  const leg = match.legs[legIndex]!
  const { legs: legsAfterRemoval, removed } = removeLastScoreFromLeg(
    match.legs,
    leg.id,
  )

  if (!removed) return false

  let updatedLegs = legsAfterRemoval

  let updatedMatch: Match = {
    ...match,
    legs: updatedLegs,
    currentTeamId: removed.teamId,
    currentLegRound: Math.max(1, match.currentLegRound - 1),
    currentRound: Math.max(0, match.currentRound - 1),
    teams: match.teams.map((team) =>
      team.id === removed.teamId
        ? { ...team, currentPlayerId: removed.playerId }
        : team,
    ),
  }

  if (removed.isCheckedOut) {
    updatedLegs = reopenLeg(updatedLegs, leg.id)

    const currentIdx = Math.max(0, match.currentLeg - 1)
    if (currentIdx > legIndex) {
      const trailingLeg = updatedLegs[currentIdx]
      if (
        trailingLeg &&
        trailingLeg.scores.length === 0 &&
        !trailingLeg.winnerTeamId
      ) {
        updatedLegs = updatedLegs.filter((_, index) => index !== currentIdx)
      }

      updatedMatch = {
        ...updatedMatch,
        currentLeg: legIndex + 1,
        legs: updatedLegs,
      }
    }
  }

  updatedMatch = {
    ...updatedMatch,
    legs: updatedLegs,
    winnerTeamId: null,
    status: MatchStatus.InProgress,
    endedAt: null,
  }

  const teams = buildTeamsFromMatch(updatedMatch)
  clearMatchStatsRegistry()
  initMatchStatsRegistry(teams)
  replayStatsForTeams(teams, updatedMatch)
  const teamsWithStats = applyStatsSnapshots(teams)

  matchStore.setState((prev) => ({
    ...prev,
    match: updatedMatch,
    teams: teamsWithStats,
  }))

  try {
    await addScoreToMatchService(match.id, {
      legs: updatedLegs,
      teams: updatedMatch.teams,
      currentTeamId: updatedMatch.currentTeamId,
      currentLegRound: updatedMatch.currentLegRound,
      currentRound: updatedMatch.currentRound,
      currentLeg: updatedMatch.currentLeg,
      winnerTeamId: updatedMatch.winnerTeamId,
      status: updatedMatch.status,
      endedAt: updatedMatch.endedAt,
    })
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : 'Failed to undo score.',
    )
    return false
  }

  return true
}

export const validateScore = (inputScore: string): boolean => {
  const currentTeamId = matchStore.get().match?.currentTeamId
  const remainingScore = currentTeamId
    ? getRemainingScore(currentTeamId)
    : undefined

  return parseScoreInput(inputScore, { silent: true, remainingScore }).isValid
}
