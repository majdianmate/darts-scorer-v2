import { type FC } from 'react'

import { Target } from 'lucide-react'

import Avatar from '#/components/Avatar'
import { cn } from '#/lib/utils'

import type { Score, TeamLocal } from '../../../../../types/match-types'

import {
  accentAlpha,
  getMemberDisplayName,
  getMemberFirstName,
  isCurrentPlayer,
  teamCardPanelStyle,
} from './team-card-utils'

interface TeamCardScoreHistoryProps {
  team: TeamLocal
  accent: string
}

function resolveScoreDartsThrown(score: Score) {
  return score.dartsThrown ?? 3
}

function resolveScoreCheckoutAttempts(score: Score) {
  return score.checkoutAttempts ?? 0
}

const ScoreHistoryRow: FC<{
  score: Score
  team: TeamLocal
  accent: string
  memberLookup: Map<string, TeamLocal['members'][number]>
}> = ({ score, team, accent, memberLookup }) => {
  const player = memberLookup.get(score.playerId)
  const isActive = player
    ? isCurrentPlayer(player, team.currentPlayerId)
    : score.playerId === team.currentPlayerId
  const name = player ? getMemberDisplayName(player) : 'Unknown'
  const firstName = player ? getMemberFirstName(player) : '?'
  const dartsThrown = resolveScoreDartsThrown(score)
  const checkoutAttempts = resolveScoreCheckoutAttempts(score)

  return (
    <div
      className="flex items-center gap-2 rounded-xl border px-2.5 py-2 transition-all duration-200"
      style={{
        ...teamCardPanelStyle(accent, isActive),
        ...(isActive
          ? {
              borderLeftWidth: 2,
              borderLeftColor: accent,
              paddingLeft: '0.55rem',
            }
          : {}),
      }}
    >
      {player ? (
        <Avatar
          name={name}
          image={player.user.image}
          size="xs"
          className={cn(
            'shrink-0 border-2 border-zinc-950/80',
            !isActive && 'opacity-60',
          )}
        />
      ) : (
        <div className="size-5 shrink-0 rounded-full bg-white/[0.06]" />
      )}

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'truncate text-[10px] font-medium tracking-tight',
            isActive ? 'text-white/70' : 'text-white/35',
          )}
        >
          {firstName}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span
            className={cn(
              'text-lg font-bold tabular-nums leading-none',
              !isActive && 'text-white/65',
            )}
            style={isActive ? { color: accent } : undefined}
          >
            {score.score}
          </span>
          <span className="text-[10px] tabular-nums text-white/25">
            → {score.remainingScore}
          </span>
        </div>
        <p
          className={cn(
            'mt-0.5 text-[9px] tabular-nums',
            isActive ? 'text-white/40' : 'text-white/22',
          )}
        >
          {dartsThrown} dart{dartsThrown === 1 ? '' : 's'}
          {' · '}
          {checkoutAttempts} checkout
        </p>
      </div>

      {score.isCheckedOut && (
        <span
          className="flex shrink-0 items-center gap-0.5 rounded-md border px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide"
          style={{
            borderColor: accentAlpha(accent, '40'),
            backgroundColor: accentAlpha(accent, '18'),
            color: accent,
            boxShadow: `0 1px 0 rgba(255,255,255,0.06) inset`,
          }}
        >
          <Target className="size-2.5" />
          Out
        </span>
      )}

      {!score.isCheckedOut && score.isCheckoutAttempt && (
        <span className="shrink-0 text-[8px] font-medium uppercase tracking-wide text-white/22">
          CO try
        </span>
      )}
    </div>
  )
}

const TeamCardScoreHistory: FC<TeamCardScoreHistoryProps> = ({ team, accent }) => {
  const memberLookup = new Map(team.members.map((member) => [member.id, member]))
  const scores = [...team.scores].reverse()

  if (scores.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-xs text-white/25">
        No scores yet
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5 pt-1">
      {scores.map((score) => (
        <ScoreHistoryRow
          key={score.id}
          score={score}
          team={team}
          accent={accent}
          memberLookup={memberLookup}
        />
      ))}
    </div>
  )
}

export default TeamCardScoreHistory
