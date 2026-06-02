import type { PlayerLocal } from '../../../../../types/match-types'

export function getMemberDisplayName(member: PlayerLocal): string {
  return member.guestName?.trim() || member.user.name
}

export function isCurrentPlayer(
  member: PlayerLocal,
  currentPlayerId: string,
): boolean {
  return (
    member.id === currentPlayerId ||
    (member.userId != null && member.userId === currentPlayerId)
  )
}

export function getMemberFirstName(member: PlayerLocal): string {
  return getMemberDisplayName(member).split(' ')[0] ?? getMemberDisplayName(member)
}
