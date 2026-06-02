import confetti from 'canvas-confetti'

export function fireScoreConfetti(particleCount: number) {
  if (particleCount <= 0 || typeof window === 'undefined') return

  const count = Math.min(particleCount, 180)
  const burstCount = Math.max(1, Math.ceil(count / 60))

  for (let i = 0; i < burstCount; i++) {
    const slice = Math.ceil(count / burstCount)
    const originX =
      burstCount === 1 ? 0.5 : 0.15 + (0.7 * i) / (burstCount - 1)

    confetti({
      particleCount: slice,
      spread: 80,
      startVelocity: 38,
      ticks: 140,
      gravity: 1.1,
      origin: { x: originX, y: 0.38 },
      zIndex: 10_000,
      disableForReducedMotion: true,
    })
  }
}
