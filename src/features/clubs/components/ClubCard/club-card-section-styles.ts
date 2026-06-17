import type { LucideIcon } from 'lucide-react'
import { Layers, MailPlus, Users } from 'lucide-react'

import { cn } from '#/lib/utils'

export type ClubCardSectionTone = 'members' | 'invitations' | 'squads'

const TONE_CONFIG: Record<
  ClubCardSectionTone,
  {
    stripe: string
    iconWrap: string
    icon: string
    Icon: LucideIcon
  }
> = {
  members: {
    stripe: 'bg-sky-500',
    iconWrap: 'border-sky-500/25 bg-sky-500/10',
    icon: 'text-sky-600 dark:text-sky-400',
    Icon: Users,
  },
  invitations: {
    stripe: 'bg-amber-500',
    iconWrap: 'border-amber-500/25 bg-amber-500/10',
    icon: 'text-amber-600 dark:text-amber-400',
    Icon: MailPlus,
  },
  squads: {
    stripe: 'bg-violet-500',
    iconWrap: 'border-violet-500/25 bg-violet-500/10',
    icon: 'text-violet-600 dark:text-violet-400',
    Icon: Layers,
  },
}

export function getClubCardSectionTone(tone: ClubCardSectionTone) {
  return TONE_CONFIG[tone]
}

/** Flat card shell — no gradient on the whole block. */
export const clubCardSectionShellClass =
  'overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm ring-1 ring-foreground/5'

export const clubCardSectionEmptyFooterClass =
  'border-t border-border/50 bg-muted/20 px-3 py-3'

export const clubCardSectionTriggerClass = cn(
  'group relative items-center gap-3 rounded-none border-0 px-3 py-3 pl-4',
  'bg-muted/40 hover:bg-muted/55 hover:no-underline',
  'group-aria-expanded/accordion-trigger:bg-background',
  'group-aria-expanded/accordion-trigger:shadow-[inset_0_-1px_0_0_var(--border)]',
  '[&_[data-slot=accordion-trigger-icon]]:mt-0',
  '[&_[data-slot=accordion-trigger-icon]]:size-4',
  '[&_[data-slot=accordion-trigger-icon]]:rounded-md',
  '[&_[data-slot=accordion-trigger-icon]]:border',
  '[&_[data-slot=accordion-trigger-icon]]:border-border/50',
  '[&_[data-slot=accordion-trigger-icon]]:bg-muted/60',
  '[&_[data-slot=accordion-trigger-icon]]:p-0.5',
)

export const clubCardSectionContentClass =
  'border-t border-border/50 bg-muted/20 px-3 pb-3 pt-2'

export function clubCardSectionStripeClass(tone: ClubCardSectionTone) {
  return cn(
    'pointer-events-none absolute top-2.5 bottom-2.5 left-1.5 w-1 rounded-full',
    TONE_CONFIG[tone].stripe,
  )
}

export function clubCardSectionIconWrapClass(tone: ClubCardSectionTone) {
  return cn(
    'flex size-9 shrink-0 items-center justify-center rounded-lg border shadow-sm',
    TONE_CONFIG[tone].iconWrap,
  )
}

export function clubCardSectionIconClass(tone: ClubCardSectionTone) {
  return cn('size-4', TONE_CONFIG[tone].icon)
}

/** Nested squad row inside squads accordion. */
export const clubCardSquadItemClass =
  'overflow-hidden rounded-lg border border-border/50 bg-background shadow-sm transition-colors'

export const clubCardSquadTriggerClass = cn(
  'relative group items-center justify-start gap-2 rounded-none px-2.5 py-2.5 hover:no-underline',
  'bg-muted/25 hover:bg-muted/40',
  'group-aria-expanded/accordion-trigger:bg-muted/15',
  '[&_[data-slot=accordion-trigger-icon]]:mt-0',
  '[&_[data-slot=accordion-trigger-icon]]:size-3.5',
)

export const clubCardSquadContentClass =
  'border-t border-border/40 bg-muted/15 px-2 pb-2 pt-1.5 [&_p]:mb-0'
