import { type FC } from 'react'
import { Separator } from '#/components/ui/separator'
import SidebarMenuItem from './SidebarMenuItem'
import { SidebarMenuItems, SidebarMenuItems2 } from './SidebarMenuItems'

const SidebarMenu: FC = () => {
  const mainItems = SidebarMenuItems.filter((item) => item.render !== false)
  const secondaryItems = SidebarMenuItems2.filter((item) => item.render !== false)

  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2">
      <div className="flex flex-col gap-0.5">
        {mainItems.map((item) => (
          <SidebarMenuItem key={item.href} item={item} />
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-0.5 pt-2">
        <Separator className="mb-2" />
        {secondaryItems.map((item) => (
          <SidebarMenuItem key={item.href} item={item} />
        ))}
      </div>
    </nav>
  )
}

export default SidebarMenu
