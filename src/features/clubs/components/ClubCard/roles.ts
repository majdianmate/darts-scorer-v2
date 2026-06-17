import { ClubRole } from '#/features/clubs/types/club-types'

export const roleOrder: ClubRole[] = [
  ClubRole.LEADER,
  ClubRole.CAPTAIN,
  ClubRole.MEMBER,
  ClubRole.GUEST,
]

export const roleStyles: Record<ClubRole | 'PENDING' | 'SELF', string> = {
  [ClubRole.LEADER]:
    'border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300',
  [ClubRole.CAPTAIN]:
    'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  [ClubRole.MEMBER]:
    'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300',
  [ClubRole.GUEST]:
    'border-lime-500/30 bg-lime-500/10 text-lime-700 dark:text-lime-300',
  ['PENDING']:
    'border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
  ['SELF']:
    'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300',
}

export const roleLabels: Record<ClubRole | 'PENDING' | 'SELF', string> = {
  [ClubRole.LEADER]: 'Leader',
  [ClubRole.CAPTAIN]: 'Captain',
  [ClubRole.MEMBER]: 'Member',
  [ClubRole.GUEST]: 'Guest',
  ['PENDING']: 'Pending',
  ['SELF']: 'Self',
}

export const roleAvatarRings: Record<ClubRole, string> = {
  [ClubRole.LEADER]: 'ring-violet-500/40',
  [ClubRole.CAPTAIN]: 'ring-emerald-500/40',
  [ClubRole.MEMBER]: 'ring-sky-500/40',
  [ClubRole.GUEST]: 'ring-lime-500/40',
}

export const roleRowStyles: Record<ClubRole, string> = {
  [ClubRole.LEADER]:
    'border-violet-500/20 bg-violet-500/[0.06] hover:bg-violet-500/10',
  [ClubRole.CAPTAIN]:
    'border-emerald-500/15 bg-background hover:bg-emerald-500/[0.06]',
  [ClubRole.MEMBER]: 'border-border/60 bg-background hover:bg-muted/40',
  [ClubRole.GUEST]: 'border-border/60 bg-background hover:bg-muted/40',
}

export function sortMembersByRole<T extends { role: ClubRole }>(members: T[]) {
  return [...members].sort(
    (a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role),
  )
}
