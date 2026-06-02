import { type FC } from 'react'

import { cn } from '#/lib/utils'

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

  const hasWon = legsWon >= legsToWin

  return (
    <div className="flex w-full gap-1">
      {Array.from({ length: legsToWin }).map((_, index) => {
        const isFilled = index < legsWon

        return (
          <div
            key={index}
            className={cn(
              'h-1.5 min-w-0 flex-1 rounded-full transition-all duration-300',
              !isFilled && 'bg-white/12',
            )}
            style={
              isFilled
                ? {
                    backgroundColor: accent,
                    boxShadow: hasWon
                      ? `0 0 10px ${accent}88`
                      : `0 0 6px ${accent}55`,
                  }
                : undefined
            }
          />
        )
      })}
    </div>
  )
}

export default TeamCardLegIndicator
