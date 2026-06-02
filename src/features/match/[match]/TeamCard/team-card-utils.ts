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

export function accentAlpha(hex: string, alpha: string): string {
  if (!hex.startsWith('#') || hex.length < 7) return hex
  return `${hex.slice(0, 7)}${alpha}`
}

function teamCardShellBackground(accent: string, isCurrentTeam: boolean) {
  return isCurrentTeam
    ? `linear-gradient(165deg, rgba(255,255,255,0.07) 0%, transparent 38%), linear-gradient(180deg, ${accentAlpha(accent, '14')} 0%, rgb(12,12,14) 28%, rgb(9,9,11) 100%)`
    : `linear-gradient(165deg, rgba(255,255,255,0.05) 0%, transparent 36%), linear-gradient(180deg, rgba(18,18,20,0.96) 0%, rgba(9,9,11,0.99) 100%)`
}

/** Outer shell — layered depth, accent only when active. */
export function teamCardShellStyle(accent: string, isCurrentTeam: boolean) {
  return {
    borderColor: isCurrentTeam ? 'transparent' : 'rgba(255,255,255,0.07)',
    background: isCurrentTeam ? undefined : teamCardShellBackground(accent, false),
    boxShadow: isCurrentTeam
      ? `0 1px 0 rgba(255,255,255,0.09) inset, 0 24px 48px -20px rgba(0,0,0,0.65), 0 10px 24px -12px ${accentAlpha(accent, '40')}`
      : '0 1px 0 rgba(255,255,255,0.06) inset, 0 16px 36px -22px rgba(0,0,0,0.5)',
  } as const
}

/** Face fill above rotating border — opaque base + gradient overlay. */
export function teamCardShellFaceStyle(accent: string, isCurrentTeam: boolean) {
  if (!isCurrentTeam) return undefined
  return {
    background: `${teamCardShellBackground(accent, true)}, rgb(9,9,11)`,
  } as const
}

export function teamCardAccentRailStyle(accent: string, isCurrentTeam: boolean) {
  return {
    background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
    opacity: isCurrentTeam ? 0.95 : 0.35,
  } as const
}

export function teamCardInnerRingClass(isCurrentTeam: boolean) {
  return isCurrentTeam
    ? 'ring-1 ring-inset ring-white/[0.1]'
    : 'ring-1 ring-inset ring-white/[0.05]'
}

/** Frosted inset panels (stats rows, player cards). */
export function teamCardPanelStyle(accent: string, isActive = false) {
  return {
    borderColor: isActive
      ? accentAlpha(accent, '40')
      : 'rgba(255,255,255,0.06)',
    background: isActive
      ? `linear-gradient(135deg, ${accentAlpha(accent, '16')} 0%, rgba(255,255,255,0.04) 100%)`
      : 'rgba(255,255,255,0.025)',
    boxShadow: isActive
      ? `0 1px 0 rgba(255,255,255,0.06) inset, 0 4px 12px -6px ${accentAlpha(accent, '35')}`
      : '0 1px 0 rgba(255,255,255,0.04) inset',
  } as const
}

export function teamCardStatCellStyle(accent: string, isHighlighted = false) {
  return {
    borderColor: isHighlighted
      ? accentAlpha(accent, '35')
      : 'rgba(255,255,255,0.06)',
    background: isHighlighted
      ? `linear-gradient(160deg, ${accentAlpha(accent, '18')} 0%, rgba(255,255,255,0.03) 100%)`
      : 'rgba(255,255,255,0.03)',
    boxShadow: '0 1px 0 rgba(255,255,255,0.05) inset',
  } as const
}

export function teamCardIconBadgeStyle(accent: string) {
  return {
    borderColor: accentAlpha(accent, '35'),
    background: `linear-gradient(145deg, rgba(255,255,255,0.08) 0%, ${accentAlpha(accent, '18')} 100%)`,
    boxShadow: `0 1px 0 rgba(255,255,255,0.1) inset, 0 4px 10px -4px ${accentAlpha(accent, '45')}`,
    color: accent,
  } as const
}

export function teamCardScoreTextStyle(accent: string) {
  return {
    textShadow: `0 1px 0 rgba(255,255,255,0.08), 0 8px 24px rgba(0,0,0,0.35), 0 0 40px ${accentAlpha(accent, '22')}`,
  } as const
}

export function teamCardWatermarkStyle(accent: string, isCurrentTeam: boolean) {
  return {
    color: accent,
    opacity: isCurrentTeam ? 0.07 : 0.04,
  } as const
}

export function teamCardTabBarStyle(accent: string) {
  return {
    borderColor: 'rgba(255,255,255,0.06)',
    background:
      'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.2) 100%)',
    boxShadow: '0 -1px 0 rgba(255,255,255,0.04) inset',
  } as const
}

export function teamCardTabStyle(accent: string, isActive: boolean) {
  return isActive
    ? {
        color: accent,
        background: `linear-gradient(180deg, ${accentAlpha(accent, '20')} 0%, transparent 100%)`,
        boxShadow: `0 1px 0 ${accentAlpha(accent, '50')} inset`,
      }
    : { color: 'rgba(255,255,255,0.38)' }
}

/** Scrollable stats body — no visible scrollbar. */
export const teamCardStatsScrollClass =
  'min-h-0 max-h-[clamp(7.5rem,20vh,11.5rem)] flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'

export function teamCardPlayerRingStyle(accent: string, isActive: boolean) {
  return isActive
    ? {
        background: `linear-gradient(145deg, ${accent}, ${accentAlpha(accent, '55')})`,
        boxShadow: `0 0 0 1px ${accentAlpha(accent, '40')}, 0 6px 16px -6px ${accentAlpha(accent, '55')}`,
      }
    : {
        background: 'rgba(255,255,255,0.06)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset',
      }
}
