import type { FC, ReactNode } from 'react'

import { cn } from '#/lib/utils'

type SidebarHeaderProps = {
  children: ReactNode
  className?: string
}

const SidebarHeader: FC<SidebarHeaderProps> = ({ children, className }) => (
  <div
    className={cn(
      'flex shrink-0 items-center gap-2 border-b border-sidebar-border px-3 py-3',
      className,
    )}
  >
    {children}
  </div>
)

export default SidebarHeader
