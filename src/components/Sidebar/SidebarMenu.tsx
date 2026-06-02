import type { FC, ReactNode } from 'react'

import { cn } from '#/lib/utils'

type SidebarMenuProps = {
  label?: string
  children: ReactNode
  className?: string
}

const SidebarMenu: FC<SidebarMenuProps> = ({ label, children, className }) => (
  <nav className={cn('flex flex-col gap-0.5', className)} aria-label={label}>
    {label ? (
      <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/45">
        {label}
      </p>
    ) : null}
    {children}
  </nav>
)

export default SidebarMenu
