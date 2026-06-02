import type { FC } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { CircleHelp, ScrollText } from 'lucide-react'

import SidebarMenu from './SidebarMenu'
import SidebarMenuItem from './SidebarMenuItem'
import SidebarThemeToggle from './SidebarThemeToggle'
import { isNavActive } from './sidebar-utils'

type SidebarSecondaryMenuProps = {
  collapsed?: boolean
}

const SidebarSecondaryMenu: FC<SidebarSecondaryMenuProps> = ({ collapsed }) => {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return (
    <div className="flex flex-col gap-3 border-t border-sidebar-border pt-3">
      <SidebarMenu label={collapsed ? undefined : 'More'}>
        <SidebarMenuItem
          to="/help"
          label="Help"
          icon={<CircleHelp className="size-4" />}
          isActive={isNavActive(pathname, '/help')}
          collapsed={collapsed}
        />
        <SidebarMenuItem
          to="/patch-notes"
          label="Patch notes"
          icon={<ScrollText className="size-4" />}
          isActive={isNavActive(pathname, '/patch-notes')}
          collapsed={collapsed}
        />
      </SidebarMenu>

      <SidebarThemeToggle collapsed={collapsed} />
    </div>
  )
}

export default SidebarSecondaryMenu
