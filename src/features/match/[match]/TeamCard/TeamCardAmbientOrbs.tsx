import { type FC } from 'react'
import { motion, useReducedMotion } from 'motion/react'

import { accentAlpha } from './team-card-utils'

interface TeamCardAmbientOrbsProps {
  accent: string
}

const TeamCardAmbientOrbs: FC<TeamCardAmbientOrbsProps> = ({ accent }) => {
  const fill = accentAlpha(accent, '70')
  const reduceMotion = useReducedMotion()

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-2xl"
    >
      <motion.div
        className="absolute rounded-full blur-[72px]"
        style={{
          width: 'min(55%, 16rem)',
          height: 'min(55%, 16rem)',
          background: fill,
          opacity: 0.42,
        }}
        initial={{ left: '8%', top: '18%' }}
        animate={{
          left: ['8%', '48%', '22%', '62%', '8%'],
          top: ['18%', '42%', '68%', '28%', '18%'],
          scale: [1, 1.12, 0.92, 1.08, 1],
        }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 22, repeat: Infinity, ease: 'easeInOut' }
        }
      />
      <motion.div
        className="absolute rounded-full blur-[64px]"
        style={{
          width: 'min(48%, 14rem)',
          height: 'min(48%, 14rem)',
          background: fill,
          opacity: 0.32,
        }}
        initial={{ left: '52%', top: '55%' }}
        animate={{
          left: ['52%', '12%', '58%', '30%', '52%'],
          top: ['55%', '32%', '72%', '48%', '55%'],
          scale: [1.05, 0.9, 1.15, 0.95, 1.05],
        }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 26, repeat: Infinity, ease: 'easeInOut' }
        }
      />
    </div>
  )
}

export default TeamCardAmbientOrbs
