import type { FC } from 'react'
import { Rocket, ScrollText } from 'lucide-react'

import PatchNoteReleaseCard from './PatchNoteReleaseCard'
import { PATCH_NOTE_RELEASES, PATCH_NOTES_HEADLINE } from './patch-notes-data'

const PatchNotes: FC = () => {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 pb-10">
      <header className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/40">
            <ScrollText className="size-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Release history for Darts Scorer — currently on{' '}
              <span className="font-medium text-foreground">
                v{PATCH_NOTES_HEADLINE.currentVersion}
              </span>
              .
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <Rocket className="mt-0.5 size-4 shrink-0 text-primary" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            {PATCH_NOTES_HEADLINE.tagline} Items marked{' '}
            <span className="font-medium text-foreground">Latest</span> reflect
            the most recent work; earlier versions map to major milestones from
            development.
          </p>
        </div>
      </header>

      <div className="relative space-y-5">
        <div
          className="absolute top-3 bottom-3 left-[1.125rem] w-px bg-border/80"
          aria-hidden
        />

        {PATCH_NOTE_RELEASES.map((release) => (
          <div key={release.version} className="relative pl-10">
            <span
              className="absolute top-6 left-3.5 z-10 size-2.5 -translate-x-1/2 rounded-full border-2 border-background bg-primary shadow-sm"
              aria-hidden
            />
            <PatchNoteReleaseCard release={release} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default PatchNotes
