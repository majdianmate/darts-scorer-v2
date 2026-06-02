import { type FC } from 'react'

import { Target } from 'lucide-react'

import Avatar from '#/components/Avatar'
import { cn } from '#/lib/utils'

import type { Score, TeamLocal } from '../../../../../types/match-types'

import {
  getMemberDisplayName,
  getMemberFirstName,
  isCurrentPlayer,
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
      className={cn(
        'flex items-center gap-2 rounded-lg border px-2.5 py-2 transition-all',
        isActive
          ? 'border-white/20 bg-white/[0.07]'
          : 'border-white/6 bg-white/[0.02]',
      )}
      style={
        isActive
          ? {
              borderColor: `${accent}55`,
              boxShadow: `inset 3px 0 0 ${accent}`,
            }
          : undefined
      }
    >
      {player ? (
        <Avatar
          name={name}
          image={player.user.image}
          size="xs"
          className={cn(
            'shrink-0 border border-white/10',
            !isActive && 'opacity-55',
          )}
        />
      ) : (
        <div className="size-5 shrink-0 rounded-full bg-white/10" />
      )}

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'truncate text-[10px] font-medium',
            isActive ? 'text-white/80' : 'text-white/40',
          )}
        >
          {firstName}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span
            className={cn(
              'text-lg font-black tabular-nums leading-none',
              isActive ? 'text-white' : 'text-white/70',
            )}
            style={isActive ? { color: accent } : undefined}
          >
            {score.score}
          </span>
          <span className="text-[10px] tabular-nums text-white/30">
            → {score.remainingScore}
          </span>
        </div>
        <p
          className={cn(
            'mt-0.5 text-[9px] tabular-nums',
            isActive ? 'text-white/45' : 'text-white/25',
          )}
        >
          {dartsThrown} dart{dartsThrown === 1 ? '' : 's'}
          {' · '}
          {checkoutAttempts} checkout
        </p>
      </div>

      {score.isCheckedOut && (
        <span
          className="flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide"
          style={{
            backgroundColor: `${accent}22`,
            color: accent,
          }}
        >
          <Target className="size-2.5" />
          Out
        </span>
      )}

      {!score.isCheckedOut && score.isCheckoutAttempt && (
        <span className="shrink-0 text-[8px] font-semibold uppercase tracking-wide text-white/25">
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
      <div className="flex min-h-[8rem] items-center justify-center py-6 text-xs text-white/30">
        No scores yet
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
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
