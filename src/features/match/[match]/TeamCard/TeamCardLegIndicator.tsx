import { type FC } from 'react'

import { accentAlpha } from './team-card-utils'

interface TeamCardLegIndicatorProps {
  legsWon: number
  legsToWin: number
  accent: string
}

const TeamCardLegIndicator: FC<TeamCardLegIndicatorProps> = ({
  legsWon,
  legsToWin,
  accent,
}) => {
  if (legsToWin <= 0) return null

  return (
    <div className="flex items-center justify-center w-full gap-1.5 ">
      {Array.from({ length: legsToWin }).map((_, index) => {
        const isFilled = index < legsWon

        return (
          <div
            key={index}
            className="h-1 min-w-0 w-10 overflow-hidden rounded-full transition-all duration-300"
            style={{
              backgroundColor: 'rgba(255,255,255,0.08)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={
                isFilled
                  ? {
                      width: '100%',
                      background: accent,
                      boxShadow: `0 0 8px ${accentAlpha(accent, '44')}`,
                    }
                  : { width: '0%' }
              }
            />
          </div>
        )
      })}
    </div>
  )
}

export default TeamCardLegIndicator
