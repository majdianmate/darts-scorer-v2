import { Timestamp } from 'firebase/firestore'
import { describe, expect, it } from 'vitest'

import type { Score } from '../../types/match-types'

import {
  computeThreeDartAverage,
  FirstNineTracker,
  StatsManager,
} from './stats-engine'

function makeScore(
  partial: Pick<Score, 'score'> & Partial<Pick<Score, 'dartsThrown' | 'isCheckedOut'>>,
): Score {
  return {
    id: '1',
    matchId: 'm',
    legId: 'l',
    teamId: 't',
    playerId: 'p',
    remainingScore: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    isCheckoutAttempt: false,
    isCheckedOut: partial.isCheckedOut ?? false,
    score: partial.score,
    dartsThrown: partial.dartsThrown,
  }
}

describe('computeThreeDartAverage', () => {
  it('returns 180 for 180 points in 3 darts', () => {
    expect(computeThreeDartAverage(180, 3)).toBe(180)
  })

  it('returns 100 for 200 points in 6 darts', () => {
    expect(computeThreeDartAverage(200, 6)).toBe(100)
  })

  it('returns 0 when no darts thrown', () => {
    expect(computeThreeDartAverage(0, 0)).toBe(0)
  })
})

describe('StatsManager', () => {
  it('uses 3-dart average for leg and game stats', () => {
    const manager = new StatsManager()

    manager.processNewScore(makeScore({ score: 100, dartsThrown: 3 }))
    manager.processNewScore(makeScore({ score: 41, dartsThrown: 3 }))

    const snapshot = manager.getSnapshot()
    expect(snapshot.legAverage).toBe(70.5)
    expect(snapshot.gameAverage).toBe(70.5)
  })

  it('defaults missing dartsThrown to 3 per visit', () => {
    const manager = new StatsManager()

    manager.processNewScore(makeScore({ score: 60 }))
    manager.processNewScore(makeScore({ score: 60 }))

    expect(manager.getSnapshot().gameAverage).toBe(60)
  })

  it('resets leg average on leg end but keeps game average', () => {
    const manager = new StatsManager()

    manager.processNewScore(makeScore({ score: 90, dartsThrown: 3 }))
    manager.handleLegEnd()
    manager.processNewScore(makeScore({ score: 60, dartsThrown: 3 }))

    const snapshot = manager.getSnapshot()
    expect(snapshot.legAverages).toEqual([90])
    expect(snapshot.legAverage).toBe(60)
    expect(snapshot.gameAverage).toBe(75)
  })
})

describe('FirstNineTracker', () => {
  it('averages only the first three visits of a leg', () => {
    const tracker = new FirstNineTracker()

    tracker.update(makeScore({ score: 60, dartsThrown: 3 }))
    tracker.update(makeScore({ score: 57, dartsThrown: 3 }))
    tracker.update(makeScore({ score: 54, dartsThrown: 3 }))
    expect(tracker.getValue()).toBe(57)

    tracker.update(makeScore({ score: 180, dartsThrown: 3 }))
    expect(tracker.getValue()).toBe(57)

    tracker.nextLeg()
    tracker.update(makeScore({ score: 100, dartsThrown: 2 }))
    expect(tracker.getValue()).toBe(150)
  })
})
