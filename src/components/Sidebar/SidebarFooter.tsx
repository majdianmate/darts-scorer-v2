import { type FC } from 'react'
import SidebarThemeToggle from './SidebarThemeToggle'
import SidebarUser from './SidebarUser'

const SidebarFooter: FC = () => {
  return (
    <div className="flex shrink-0 flex-col gap-2 p-3 pt-0">
      <SidebarThemeToggle />
      <SidebarUser />
    </div>
  )
}

export default SidebarFooter
