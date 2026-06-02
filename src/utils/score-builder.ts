import { Timestamp } from 'firebase/firestore'

import type { Leg, Match, Score } from '../../types/match-types'

import {
  resolveCheckoutAttempts,
  resolveDartsThrown,
  resolveVisitScore,
  type ParsedScore,
} from './score-parser'

export function getOrCreateCurrentLeg(match: Match): {
  legs: Leg[]
  legId: string
} {
  const legIndex = Math.max(0, match.currentLeg - 1)
  const legs = [...match.legs]

  if (!legs[legIndex]) {
    legs[legIndex] = {
      id: crypto.randomUUID(),
      matchId: match.id,
      createdAt: Timestamp.now(),
      endedAt: null,
      scores: [],
      winnerTeamId: null,
    }
  }

  return { legs, legId: legs[legIndex]!.id }
}

export function appendScoreToLegs(legs: Leg[], legId: string, score: Score): Leg[] {
  return legs.map((leg) =>
    leg.id === legId ? { ...leg, scores: [...leg.scores, score] } : leg,
  )
}

export function removeLastScoreFromLeg(
  legs: Leg[],
  legId: string,
): { legs: Leg[]; removed: Score | null } {
  let removed: Score | null = null

  const updatedLegs = legs.map((leg) => {
    if (leg.id !== legId || leg.scores.length === 0) return leg

    removed = leg.scores[leg.scores.length - 1]!
    return { ...leg, scores: leg.scores.slice(0, -1) }
  })

  return { legs: updatedLegs, removed }
}

export function closeLeg(
  legs: Leg[],
  legId: string,
  winnerTeamId: string,
): Leg[] {
  return legs.map((leg) =>
    leg.id === legId
      ? { ...leg, winnerTeamId, endedAt: Timestamp.now() }
      : leg,
  )
}

export function reopenLeg(legs: Leg[], legId: string): Leg[] {
  return legs.map((leg) =>
    leg.id === legId
      ? { ...leg, winnerTeamId: null, endedAt: null }
      : leg,
  )
}

export function findLastScoredLegIndex(legs: Leg[]): number | null {
  let lastIndex: number | null = null
  let lastTime = -1

  legs.forEach((leg, legIndex) => {
    const lastScore = leg.scores[leg.scores.length - 1]
    if (!lastScore) return

    const time = lastScore.createdAt?.toMillis?.() ?? 0
    if (time >= lastTime) {
      lastTime = time
      lastIndex = legIndex
    }
  })

  return lastIndex
}

export function buildScoreFromParsed(
  parsed: ParsedScore,
  context: {
    matchId: string
    legId: string
    teamId: string
    playerId: string
    remainingBefore: number
  },
): Score | null {
  if (parsed.type === 'detailed') return null

  let visit: number
  let remainingAfter: number

  if (parsed.forceMode) {
    if (parsed.type === 'remaining' && typeof parsed.value === 'number') {
      remainingAfter = parsed.value
      visit = context.remainingBefore - remainingAfter
    } else {
      const resolved = resolveVisitScore(parsed, context.remainingBefore)
      if (resolved === null) return null
      visit = resolved
      remainingAfter = context.remainingBefore - visit
    }
  } else {
    const resolved = resolveVisitScore(parsed, context.remainingBefore)
    if (resolved === null || resolved < 0) return null
    visit = resolved
    remainingAfter = context.remainingBefore - visit
  }

  const isCheckedOut = remainingAfter === 0
  const checkoutAttempts = resolveCheckoutAttempts(parsed)
  const dartsThrown = resolveDartsThrown(parsed)
  const now = Timestamp.now()

  return {
    id: crypto.randomUUID(),
    matchId: context.matchId,
    legId: context.legId,
    teamId: context.teamId,
    playerId: context.playerId,
    score: visit,
    remainingScore: remainingAfter,
    createdAt: now,
    updatedAt: now,
    isCheckoutAttempt: checkoutAttempts > 0 || isCheckedOut,
    isCheckedOut,
    dartsThrown,
    checkoutAttempts,
  }
}
