import { type FC } from 'react'

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, r, startAngle)
  const end = polarToCartesian(cx, cy, r, endAngle)
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`
}

interface ScoreDialProps {
  score: number
  won: number
  target: number
  color: string
}

/** Arc segments (won only) + dashed track ring, large score in center. */
export const LegWinScoreDial: FC<ScoreDialProps> = ({ score, won, target, color }) => {
  const pad = 28
  const size = 300
  const cx = size / 2
  const cy = size / 2
  const arcR = 132
  const outerR = 150
  const arcStroke = 15
  const slice = 360 / target
  const gapDeg = 10
  const scoreFontSize = score >= 100 ? 120 : score >= 10 ? 66 : 74

  return (
    <div className="relative mx-auto aspect-square h-full max-h-[min(100%,16rem)] w-auto max-w-full">
      <div
        aria-hidden
        className="absolute inset-[4%] rounded-full blur-[40px]"
        style={{ background: color, opacity: 0.42 }}
      />

      <svg
        aria-hidden
        className="relative size-full overflow-visible drop-shadow-[0_12px_32px_rgba(0,0,0,0.55)]"
        viewBox={`${-pad} ${-pad} ${size + pad * 2} ${size + pad * 2}`}
      >
        <circle
          cx={cx}
          cy={cy}
          r={outerR}
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeDasharray="5 7"
          strokeWidth={1.5}
        />

        {Array.from({ length: won }, (_, i) => {
          const start = i * slice + gapDeg / 2
          const end = (i + 1) * slice - gapDeg / 2
          return (
            <path
              key={i}
              d={describeArc(cx, cy, arcR, start, end)}
              fill="none"
              stroke={color}
              strokeLinecap="round"
              strokeWidth={arcStroke}
              style={{ filter: `drop-shadow(0 0 10px ${color}) drop-shadow(0 0 20px ${color}88)` }}
            />
          )
        })}

        <text
          dominantBaseline="central"
          fill="rgba(255,255,255,0.97)"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontSize={scoreFontSize}
          fontWeight={900}
          letterSpacing="-0.04em"
          textAnchor="middle"
          x={cx}
          y={cy + 2}
          style={{ filter: `drop-shadow(0 0 16px ${color}66)` }
        }
        >
          {score}
        </text>
      </svg>
    </div>
  )
}

interface TopBarsProps {
  won: number
  target: number
  color: string
}

/** Horizontal rounded strips at card top — won colored, remainder gray. */
export const LegWinTopBars: FC<TopBarsProps> = ({ won, target, color }) => (
  <div className="relative z-10 flex gap-1.5 px-4 pt-4">
    {Array.from({ length: target }, (_, i) => {
      const isWon = i < won
      return (
        <div
          key={i}
          className="h-1.5 flex-1 rounded-full transition-colors"
          style={{
            backgroundColor: isWon ? color : 'rgba(255,255,255,0.12)',
            boxShadow: isWon ? `0 0 10px ${color}88` : undefined,
          }}
        />
      )
    })}
  </div>
)

interface SideLadderProps {
  won: number
  target: number
  color: string
}

/** Vertical rungs beside score — won colored, remainder gray. */
export const LegWinSideLadder: FC<SideLadderProps> = ({ won, target, color }) => (
  <div className="absolute inset-y-0 left-[clamp(0.75rem,6%,1.5rem)] flex flex-col justify-center gap-2.5 py-4">
    {Array.from({ length: target }, (_, i) => {
      const legIndex = target - 1 - i
      const isWon = legIndex < won
      return (
        <div key={legIndex} className="flex items-center gap-2">
          <div
            className="h-2.5 w-11 rounded-full"
            style={{
              backgroundColor: isWon ? color : 'rgba(255,255,255,0.14)',
              boxShadow: isWon ? `0 0 14px ${color}aa` : undefined,
            }}
          />
          <span
            className="text-[9px] font-bold tabular-nums"
            style={{ color: isWon ? color : 'rgba(255,255,255,0.25)' }}
          >
            L{legIndex + 1}
          </span>
        </div>
      )
    })}
  </div>
)

interface SplitRailProps {
  won: number
  target: number
  color: string
}

/** Split layout — numbered leg nodes in a vertical rail. */
export const LegWinSplitRail: FC<SplitRailProps> = ({ won, target, color }) => (
  <div className="flex flex-col justify-center gap-3">
    {Array.from({ length: target }, (_, i) => {
      const isWon = i < won
      const isNext = i === won
      return (
        <div key={i} className="flex items-center gap-2.5">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border text-xs font-black tabular-nums"
            style={{
              borderColor: isWon ? color : isNext ? `${color}88` : 'rgba(255,255,255,0.12)',
              backgroundColor: isWon ? `${color}33` : 'rgba(255,255,255,0.04)',
              color: isWon ? color : 'rgba(255,255,255,0.35)',
              boxShadow: isWon ? `0 0 16px ${color}66` : undefined,
            }}
          >
            {isWon ? '✓' : i + 1}
          </div>
          <div className="min-w-0">
            <p
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: isWon ? color : 'rgba(255,255,255,0.35)' }}
            >
              Leg {i + 1}
            </p>
            <p className="text-[9px] text-white/30">
              {isWon ? 'Won' : isNext ? 'In play' : 'Pending'}
            </p>
          </div>
        </div>
      )
    })}
  </div>
)

interface WedgeBurstProps {
  won: number
  target: number
  color: string
}

/** Radial wedge burst behind score — won slices only. */
export const LegWinWedgeBurst: FC<WedgeBurstProps> = ({ won, target, color }) => {
  const slice = 360 / target
  const gap = 8

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div
        className="relative aspect-square w-[min(100%,14rem)]"
        style={{ filter: `drop-shadow(0 0 24px ${color}44)` }}
      >
        {Array.from({ length: won }, (_, i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from ${i * slice - 90 + gap / 2}deg, ${color}55 0deg, ${color}22 ${slice - gap}deg, transparent ${slice - gap}deg)`,
            }}
          />
        ))}
        <div className="absolute inset-[18%] rounded-full bg-neutral-950/40 backdrop-blur-sm" />
      </div>
    </div>
  )
}

interface StadiumProps {
  won: number
  target: number
  color: string
}

/** Bottom semicircle stadium gauge — won colored, remainder gray. */
export const LegWinStadium: FC<StadiumProps> = ({ won, target, color }) => {
  const width = 220
  const height = 118
  const cx = width / 2
  const cy = height - 6
  const r = 76
  const slice = 180 / target
  const gap = 7

  return (
    <svg
      aria-hidden
      className="w-full max-w-[15rem]"
      viewBox={`0 0 ${width} ${height}`}
    >
      {Array.from({ length: target }, (_, i) => {
        const isWon = i < won
        const start = 270 + i * slice + gap / 2
        const end = 270 + (i + 1) * slice - gap / 2
        return (
          <path
            key={i}
            d={describeArc(cx, cy, r, start, end)}
            fill="none"
            stroke={isWon ? color : 'rgba(255,255,255,0.12)'}
            strokeLinecap="round"
            strokeWidth={isWon ? 11 : 7}
            style={isWon ? { filter: `drop-shadow(0 0 8px ${color})` } : undefined}
          />
        )
      })}
    </svg>
  )
}

interface LegChipsProps {
  won: number
  target: number
  color: string
}

/** Floating leg chips in a row below score. */
export const LegWinChips: FC<LegChipsProps> = ({ won, target, color }) => (
  <div className="flex flex-wrap items-center justify-center gap-2">
    {Array.from({ length: target }, (_, i) => {
      const isWon = i < won
      return (
        <span
          key={i}
          className="rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md"
          style={{
            borderColor: isWon ? `${color}aa` : 'rgba(255,255,255,0.1)',
            backgroundColor: isWon ? `${color}28` : 'rgba(255,255,255,0.04)',
            color: isWon ? color : 'rgba(255,255,255,0.3)',
            boxShadow: isWon ? `0 0 14px ${color}44` : undefined,
          }}
        >
          {isWon ? `Leg ${i + 1} ✓` : `Leg ${i + 1}`}
        </span>
      )
    })}
  </div>
)
