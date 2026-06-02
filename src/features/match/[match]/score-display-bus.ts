export type ScoreDisplayEvent = {
  score: number
  id: number
}

type Listener = (event: ScoreDisplayEvent) => void

const listeners = new Set<Listener>()

export function subscribeScoreDisplay(listener: Listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function emitScoreDisplay(score: number) {
  const event: ScoreDisplayEvent = { score, id: Date.now() }
  listeners.forEach((listener) => listener(event))
}
