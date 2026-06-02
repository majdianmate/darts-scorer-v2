import type { Score, Statistic } from '../../types/match-types'

export interface IStatTracker {
  update: (score: Score) => number | number[]
  getValue: () => number | number[]
}

export function resolveDartsThrownForScore(score: Score): number {
  const thrown = score.dartsThrown ?? 3
  return thrown >= 1 && thrown <= 3 ? thrown : 3
}

/** Standard 3-dart average: (total points / total darts thrown) × 3 */
export function computeThreeDartAverage(points: number, darts: number): number {
  if (darts <= 0 || points < 0) return 0
  return parseFloat(((points / darts) * 3).toFixed(2))
}

export class ThreeDartAverageTracker implements IStatTracker {
  protected points = 0
  protected darts = 0
  protected currentAverage = 0

  public update(score: Score): number {
    this.points += score.score
    this.darts += resolveDartsThrownForScore(score)
    this.currentAverage = computeThreeDartAverage(this.points, this.darts)
    return this.currentAverage
  }

  public getValue(): number {
    return this.currentAverage
  }
}

export class LegAverageTracker extends ThreeDartAverageTracker {
  public reset() {
    this.points = 0
    this.darts = 0
    this.currentAverage = 0
  }
}

/** First 3 visits of each leg (first 9 darts when 3 darts per visit). */
export class FirstNineTracker implements IStatTracker {
  private points = 0
  private darts = 0
  private visitsInLeg = 0
  private currentAverage = 0

  public update(score: Score): number {
    if (this.visitsInLeg >= 3) return this.currentAverage

    this.points += score.score
    this.darts += resolveDartsThrownForScore(score)
    this.visitsInLeg++
    this.currentAverage = computeThreeDartAverage(this.points, this.darts)
    return this.currentAverage
  }

  public getValue(): number {
    return this.currentAverage
  }

  public hasVisitsInCurrentLeg() {
    return this.visitsInLeg > 0
  }

  public nextLeg() {
    this.points = 0
    this.darts = 0
    this.visitsInLeg = 0
    this.currentAverage = 0
  }
}

export class CheckoutRateTracker implements IStatTracker {
  private attempts = 0
  private checkouts = 0
  private currentRate = 0

  public update(score: Score): number {
    if (!score.isCheckoutAttempt) return this.currentRate

    this.attempts++
    if (score.isCheckedOut) this.checkouts++

    this.currentRate = parseFloat(((this.checkouts / this.attempts) * 100).toFixed(2))
    return this.currentRate
  }

  public getValue(): number {
    return this.currentRate
  }
}

export class MilestoneTracker implements IStatTracker {
  private count = 0

  constructor(
    private targetScore: number,
    private maxScore?: number,
  ) {}

  public update(score: Score): number {
    if (
      score.score >= this.targetScore &&
      (this.maxScore ? score.score <= this.maxScore : true)
    ) {
      this.count++
    }
    return this.count
  }

  public getValue(): number {
    return this.count
  }
}

export class StatsManager {
  public gameAvg = new ThreeDartAverageTracker()
  public legAvg = new LegAverageTracker()
  public firstNine = new FirstNineTracker()
  public checkout = new CheckoutRateTracker()
  public sixtyPlus = new MilestoneTracker(60, 119)
  public hundredTwentyPlus = new MilestoneTracker(120, 179)
  public hundredEighty = new MilestoneTracker(180, 180)

  public bestCheckout = 0
  public legAverages: number[] = []
  /** Per-leg firstNineDartsAverage values (first 3 visits each leg). */
  public firstNineLegAverages: number[] = []

  public processNewScore(score: Score): Statistic {
    const stats: Statistic = {
      legAverage: this.legAvg.update(score),
      gameAverage: this.gameAvg.update(score),
      firstNineDartsAverage: this.firstNine.update(score),
      checkoutRate: this.checkout.update(score),
      sixtyPlus: this.sixtyPlus.update(score),
      hundredTwentyPlus: this.hundredTwentyPlus.update(score),
      hundredEightyPlus: this.hundredEighty.update(score),
      bestCheckout: this.bestCheckout,
      legAverages: this.legAverages,
    }

    if (score.isCheckedOut && score.score > this.bestCheckout) {
      this.bestCheckout = score.score
      stats.bestCheckout = score.score
    }

    return stats
  }

  public handleLegEnd() {
    this.legAverages.push(this.legAvg.getValue() as number)
    if (this.firstNine.hasVisitsInCurrentLeg()) {
      this.firstNineLegAverages.push(this.firstNine.getValue() as number)
    }
    this.legAvg.reset()
    this.firstNine.nextLeg()
  }

  public getSnapshot(): Statistic {
    return {
      legAverage: this.legAvg.getValue() as number,
      gameAverage: this.gameAvg.getValue() as number,
      firstNineDartsAverage: this.firstNine.getValue() as number,
      checkoutRate: this.checkout.getValue() as number,
      sixtyPlus: this.sixtyPlus.getValue() as number,
      hundredTwentyPlus: this.hundredTwentyPlus.getValue() as number,
      hundredEightyPlus: this.hundredEighty.getValue() as number,
      bestCheckout: this.bestCheckout,
      legAverages: [...this.legAverages],
    }
  }
}

/** Match-wide mean of per-leg firstNineDartsAverage (same tracker rules as live stats). */
export function computeMatchFirstNineDartsAverage(
  manager: StatsManager,
): number {
  const legValues = [...manager.firstNineLegAverages]
  if (manager.firstNine.hasVisitsInCurrentLeg()) {
    legValues.push(manager.firstNine.getValue() as number)
  }
  if (legValues.length === 0) return 0
  return parseFloat(
    (legValues.reduce((sum, value) => sum + value, 0) / legValues.length).toFixed(
      2,
    ),
  )
}
