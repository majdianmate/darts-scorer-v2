import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'

import { fireScoreConfetti } from './score-display-confetti'
import { subscribeScoreDisplay, type ScoreDisplayEvent } from './score-display-bus'

const DISPLAY_MS = 1_500

const ScoreDisplay = () => {
  const [flash, setFlash] = useState<ScoreDisplayEvent | null>(null)
  const [shownScore, setShownScore] = useState<number | null>(null)

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | undefined
    let clearTimer: ReturnType<typeof setTimeout> | undefined

    const unsubscribe = subscribeScoreDisplay((event) => {
      if (hideTimer) clearTimeout(hideTimer)
      if (clearTimer) clearTimeout(clearTimer)

      setFlash(event)
      setShownScore(event.score)
      fireScoreConfetti(event.score)

      hideTimer = setTimeout(() => setShownScore(null), DISPLAY_MS)
      clearTimer = setTimeout(() => {
        setFlash((current) => (current?.id === event.id ? null : current))
      }, DISPLAY_MS + 350)
    })

    return () => {
      unsubscribe()
      if (hideTimer) clearTimeout(hideTimer)
      if (clearTimer) clearTimeout(clearTimer)
    }
  }, [])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {shownScore !== null ? (
        <motion.div
          key={flash?.id ?? shownScore}
          className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <motion.div
            className="absolute inset-0 bg-background/85 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.p
            className="relative select-none font-black tabular-nums tracking-tighter text-foreground"
            style={{ fontSize: 'min(32vw, 11rem)' }}
            initial={{ scale: 0.55, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.08, opacity: 0, y: -12 }}
            transition={{ type: 'spring', stiffness: 420, damping: 26 }}
          >
            {shownScore}
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

export default ScoreDisplay
