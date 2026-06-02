import type { FC } from 'react'

import { Badge } from '#/components/ui/badge'
import { cn } from '#/lib/utils'

import type { PatchNoteRelease } from './patch-notes-data'

type PatchNoteReleaseCardProps = {
  release: PatchNoteRelease
}

const BADGE_LABELS: Record<NonNullable<PatchNoteRelease['badge']>, string> = {
  latest: 'Latest',
  upcoming: 'Coming soon',
  release: 'Released',
}

const PatchNoteReleaseCard: FC<PatchNoteReleaseCardProps> = ({ release }) => {
  return (
    <article className="relative rounded-xl border border-border/60 bg-card/40 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold tracking-tight">
              v{release.version}
            </h2>
            <span className="text-muted-foreground">·</span>
            <span className="text-sm font-medium text-muted-foreground">
              {release.title}
            </span>
            {release.badge ? (
              <Badge
                variant={release.badge === 'latest' ? 'default' : 'secondary'}
                className={cn(
                  release.badge === 'upcoming' && 'border-dashed',
                )}
              >
                {BADGE_LABELS[release.badge]}
              </Badge>
            ) : null}
          </div>
          {release.date ? (
            <p className="text-xs text-muted-foreground">{release.date}</p>
          ) : null}
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {release.summary}
      </p>

      <div className="mt-4 space-y-3">
        {release.changes.map((group) => (
          <div key={group.label}>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground/70">
              {group.label}
            </p>
            <ul className="mt-1.5 space-y-1.5">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm leading-snug text-foreground/85"
                >
                  <span
                    className="mt-2 size-1 shrink-0 rounded-full bg-primary/80"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </article>
  )
}

export default PatchNoteReleaseCard
