import type { FC, ReactNode } from 'react'

import { cn } from '#/lib/utils'

type SidebarContentProps = {
  children: ReactNode
  className?: string
}

const SidebarContent: FC<SidebarContentProps> = ({ children, className }) => (
  <div
    className={cn(
      'flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-2 py-3 [scrollbar-width:thin]',
      className,
    )}
  >
    {children}
  </div>
)

export default SidebarContent
