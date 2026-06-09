import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

type ClubEmptyStateProps = {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}

const ClubEmptyState = ({
  icon: Icon,
  title,
  description,
  action,
}: ClubEmptyStateProps) => (
  <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
    <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted/50">
      <Icon className="size-5 text-muted-foreground" />
    </div>
    <p className="font-medium text-foreground">{title}</p>
    <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
    {action ? <div className="mt-5">{action}</div> : null}
  </div>
)

export default ClubEmptyState
