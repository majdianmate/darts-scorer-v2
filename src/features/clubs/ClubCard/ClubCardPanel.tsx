import type { ReactNode } from 'react'

import { cn } from '#/lib/utils'

type ClubCardPanelProps = {
  label: string
  count: number
  icon: ReactNode
  children: ReactNode
  className?: string
}

const ClubCardPanel = ({
  label,
  count,
  icon,
  children,
  className,
}: ClubCardPanelProps) => (
  <div
    className={cn(
      'flex min-h-[8.5rem] flex-col rounded-xl border border-border/60 bg-muted/20 p-3',
      className,
    )}
  >
    <div className="flex items-center gap-2 text-muted-foreground">
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </div>

    <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-foreground">
      {count}
    </p>

    <div className="mt-auto pt-3">{children}</div>
  </div>
)

export default ClubCardPanel
