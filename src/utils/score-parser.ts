import { toast } from 'sonner'

export interface ParsedScore {
  type: 'score' | 'remaining' | 'detailed'
  value: number | string[]
  dartsThrown?: number
  checkoutAttempts?: number
  forceMode: boolean
  isAdvanced: boolean
  isValid: boolean
  error?: string
}

export interface ParseScoreInputOptions {
  silent?: boolean
  remainingScore?: number
}

export interface ScoreValidationContext {
  parsed: ParsedScore
  remainingScore?: number
}

export type ScoreValidator = {
  id: string
  skipWhenForce?: boolean
  validate: (ctx: ScoreValidationContext) => string | undefined
}

const COMMAND_REGEX = /^(f)?(r)?(a)?([A-Z0-9\s-]+)$/i
const DART_TOKEN_REGEX = /^[SDT]\d+$/i

export function isValidVisitScore(score: number) {
  return score >= 0 && score <= 180
}

export function isValidRemainingScore(score: number) {
  return score >= 0 && score <= 501
}

export function isValidThrownDarts(dartsThrown: number) {
  return dartsThrown >= 1 && dartsThrown <= 3
}

export function isValidCheckoutAttempts(
  checkoutAttempts: number,
  dartsThrown: number,
) {
  return checkoutAttempts >= 0 && checkoutAttempts <= dartsThrown
}

export function isValidCheckoutRemaining(remaining: number) {
  return remaining % 2 === 0
}

export function maxScoreForDarts(dartsThrown: number) {
  return dartsThrown * 60
}

export function resolveDartsThrown(parsed: ParsedScore) {
  return parsed.dartsThrown ?? 3
}

export function resolveCheckoutAttempts(parsed: ParsedScore) {
  return parsed.checkoutAttempts ?? 0
}

export function resolveVisitScore(parsed: ParsedScore, remainingBefore: number) {
  if (typeof parsed.value !== 'number') return null

  if (parsed.type === 'score') return parsed.value
  if (parsed.type === 'remaining') return remainingBefore - parsed.value

  return null
}

export function resolveRemainingAfter(
  parsed: ParsedScore,
  remainingBefore: number,
): number | null {
  if (parsed.type === 'detailed') return null

  if (parsed.forceMode && parsed.type === 'remaining' && typeof parsed.value === 'number') {
    return parsed.value
  }

  const visit = resolveVisitScore(parsed, remainingBefore)
  if (visit === null) return null

  if (!parsed.forceMode && visit < 0) return null

  return remainingBefore - visit
}

export function isInCheckoutZone(remaining: number) {
  return remaining <= 179
}

export function needsCheckoutPrompt(
  parsed: ParsedScore,
  remainingBefore: number,
) {
  if (parsed.isAdvanced) return false

  const remainingAfter = resolveRemainingAfter(parsed, remainingBefore)
  if (remainingAfter === null) return false

  return (
    isInCheckoutZone(remainingBefore) && isInCheckoutZone(remainingAfter)
  )
}

export function applyCheckoutDetails(
  parsed: ParsedScore,
  dartsThrown: number,
  checkoutAttempts: number,
): ParsedScore {
  return { ...parsed, dartsThrown, checkoutAttempts }
}

export function isCheckoutSituation(parsed: ParsedScore, remainingBefore: number) {
  if (typeof parsed.value !== 'number') return false

  if (parsed.type === 'score') return parsed.value === remainingBefore
  if (parsed.type === 'remaining') return parsed.value === 0

  return false
}

export const scoreValidators: ScoreValidator[] = [
  {
    id: 'visit-exceeds-remaining',
    validate: ({ parsed, remainingScore }) => {
      if (remainingScore === undefined || parsed.type === 'detailed') return

      const visit = resolveVisitScore(parsed, remainingScore)
      if (visit === null) return

      if (visit > remainingScore) {
        return `Score cannot exceed remaining (${remainingScore}).`
      }

      if (visit < 0) {
        return `Remaining cannot exceed current score (${remainingScore}).`
      }
    },
  },
  {
    id: 'visit-score-range',
    skipWhenForce: true,
    validate: ({ parsed, remainingScore }) => {
      if (remainingScore === undefined) return
      const visit = resolveVisitScore(parsed, remainingScore)
      if (visit === null) return
      if (!isValidVisitScore(visit)) {
        return 'Visit score must be between 0 and 180.'
      }
    },
  },
  {
    id: 'remaining-score-range',
    skipWhenForce: true,
    validate: ({ parsed }) => {
      if (parsed.type !== 'remaining' || typeof parsed.value !== 'number') return
      if (!isValidRemainingScore(parsed.value)) {
        return 'Remaining must be between 0 and 501.'
      }
    },
  },
  {
    id: 'max-score-for-darts',
    skipWhenForce: true,
    validate: ({ parsed, remainingScore }) => {
      if (remainingScore === undefined) return

      const visit = resolveVisitScore(parsed, remainingScore)
      if (visit === null || visit < 0) return

      const dartsThrown = resolveDartsThrown(parsed)
      const maxScore = maxScoreForDarts(dartsThrown)

      if (visit > maxScore) {
        return `Max score with ${dartsThrown} dart${dartsThrown === 1 ? '' : 's'} is ${maxScore}.`
      }
    },
  },
  {
    id: 'thrown-darts',
    skipWhenForce: true,
    validate: ({ parsed }) => {
      if (parsed.dartsThrown === undefined) return
      if (!isValidThrownDarts(parsed.dartsThrown)) {
        return 'Darts thrown must be between 1 and 3.'
      }
    },
  },
  {
    id: 'checkout-attempts',
    skipWhenForce: true,
    validate: ({ parsed }) => {
      const dartsThrown = resolveDartsThrown(parsed)
      const checkoutAttempts = resolveCheckoutAttempts(parsed)

      if (!isValidCheckoutAttempts(checkoutAttempts, dartsThrown)) {
        return 'Checkout attempts cannot exceed darts thrown.'
      }
    },
  },
  {
    id: 'checkout-attempts-when-not-checkout',
    skipWhenForce: true,
    validate: ({ parsed, remainingScore }) => {
      if (remainingScore === undefined) return

      const checkoutAttempts = resolveCheckoutAttempts(parsed)
      if (checkoutAttempts === 0) return

      if (!isInCheckoutZone(remainingScore)) {
        return 'Checkout attempts must be 0 when not in checkout zone.'
      }
    },
  },
  {
    id: 'checkout-even',
    skipWhenForce: true,
    validate: ({ parsed, remainingScore }) => {
      if (remainingScore === undefined) return
      if (!isCheckoutSituation(parsed, remainingScore)) return

      if (!isValidCheckoutRemaining(remainingScore)) {
        return 'Checkout remaining must be an even number.'
      }
    },
  },
  {
    id: 'detailed-dart-format',
    skipWhenForce: true,
    validate: ({ parsed }) => {
      if (parsed.type !== 'detailed' || !Array.isArray(parsed.value)) return
      const invalid = parsed.value.find((dart) => !DART_TOKEN_REGEX.test(dart))
      if (invalid) return `Invalid dart notation: ${invalid}`
    },
  },
]

export function registerScoreValidator(validator: ScoreValidator) {
  scoreValidators.push(validator)
}

export function validateParsedScore(
  parsed: ParsedScore,
  validators: ScoreValidator[] = scoreValidators,
  context?: Omit<ScoreValidationContext, 'parsed'>,
): string | undefined {
  const ctx: ScoreValidationContext = { parsed, ...context }

  for (const validator of validators) {
    if (parsed.forceMode) continue

    const message = validator.validate(ctx)
    if (message) return message
  }

  return undefined
}

function invalidParsed(
  partial: Pick<ParsedScore, 'type' | 'forceMode'> & Partial<ParsedScore>,
  error: string,
): ParsedScore {
  return {
    type: partial.type,
    value: partial.value ?? 0,
    dartsThrown: partial.dartsThrown,
    checkoutAttempts: partial.checkoutAttempts,
    forceMode: partial.forceMode,
    isAdvanced: partial.isAdvanced ?? false,
    isValid: false,
    error,
  }
}

export function parseScoreStructure(input: string): ParsedScore {
  const cleanInput = input.trim()

  if (!cleanInput) {
    return invalidParsed({ type: 'score', forceMode: false }, 'Enter a score.')
  }

  if (/^[SDT]\d+/i.test(cleanInput)) {
    const darts = cleanInput.toUpperCase().split(/\s+/)
    return {
      type: 'detailed',
      value: darts,
      forceMode: false,
      isAdvanced: false,
      isValid: true,
    }
  }

  const match = cleanInput.match(COMMAND_REGEX)
  if (!match) {
    return invalidParsed(
      { type: 'score', forceMode: false },
      'Invalid format. Use a score, prefix flags (f/r/a), or detailed darts (S20 D16 T12).',
    )
  }

  const [, hasF, hasR, hasA, rawValue] = match
  const forceMode = !!hasF
  const isRemaining = !!hasR
  const isAdvanced = !!hasA
  const type = isRemaining ? 'remaining' : 'score'

  if (isAdvanced) {
    const parts = rawValue.split('-')
    const scoreOrRemaining = parseInt(parts[0], 10)
    const dartsThrown = parts[1] ? parseInt(parts[1], 10) : 3
    const checkoutAttempts = parts[2] ? parseInt(parts[2], 10) : 0

    if (Number.isNaN(scoreOrRemaining)) {
      return invalidParsed(
        { type, forceMode, dartsThrown, checkoutAttempts, isAdvanced },
        'Advanced value must start with a number.',
      )
    }
    if (parts[1] && Number.isNaN(dartsThrown)) {
      return invalidParsed(
        { type, forceMode, value: scoreOrRemaining, checkoutAttempts, isAdvanced },
        'Darts thrown must be a number.',
      )
    }
    if (parts[2] && Number.isNaN(checkoutAttempts)) {
      return invalidParsed(
        { type, forceMode, value: scoreOrRemaining, dartsThrown, isAdvanced },
        'Checkout attempts must be a number.',
      )
    }

    return {
      type,
      value: scoreOrRemaining,
      dartsThrown,
      checkoutAttempts,
      forceMode,
      isAdvanced,
      isValid: true,
    }
  }

  const finalValue = parseInt(rawValue, 10)
  if (Number.isNaN(finalValue)) {
    return invalidParsed({ type, forceMode }, 'Value must be a number.')
  }

  return {
    type,
    value: finalValue,
    forceMode,
    isAdvanced,
    isValid: true,
  }
}

export function parseScoreInput(
  input: string,
  options?: ParseScoreInputOptions,
): ParsedScore {
  const parsed = parseScoreStructure(input)

  if (!parsed.isValid && parsed.error) {
    if (!options?.silent) toast.error(parsed.error)
    return parsed
  }

  const validationError = validateParsedScore(parsed, scoreValidators, {
    remainingScore: options?.remainingScore,
  })

  if (validationError) {
    const result: ParsedScore = { ...parsed, isValid: false, error: validationError }
    if (!options?.silent) toast.error(validationError)
    return result
  }

  return { ...parsed, isValid: true, error: undefined }
}
