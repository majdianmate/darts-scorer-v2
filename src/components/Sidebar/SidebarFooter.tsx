import type { FC, ReactNode } from 'react'

import { cn } from '#/lib/utils'

type SidebarFooterProps = {
  children: ReactNode
  className?: string
}

const SidebarFooter: FC<SidebarFooterProps> = ({ children, className }) => (
  <div className={cn('mt-auto shrink-0', className)}>{children}</div>
)

export default SidebarFooter
