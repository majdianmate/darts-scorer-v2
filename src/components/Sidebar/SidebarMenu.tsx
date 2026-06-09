import type { FC, ReactNode } from 'react'

import { cn } from '#/lib/utils'

type SidebarMenuProps = {
  label: string
  children: ReactNode
  className?: string
}

const SidebarMenu: FC<SidebarMenuProps> = ({ label, children, className }) => (
  <div className={cn('flex flex-col gap-1', className)}>
    <span className="px-2.5 text-[10px] font-semibold tracking-widest text-sidebar-foreground/60 uppercase">
      {label}
    </span>
    <nav className="flex flex-col gap-0.5">{children}</nav>
  </div>
)

export default SidebarMenu
