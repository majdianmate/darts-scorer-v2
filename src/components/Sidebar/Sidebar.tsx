import { useSelector } from '@tanstack/react-store'
import { PanelLeftOpen } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'
import { UiStore } from '../../../store/store'
import {
  sidebarClosedWidthCss,
  sidebarOpenWidthCss,
} from '../../../utils/constants'
import SidebarFooter from './SidebarFooter'
import SidebarHeader from './SidebarHeader'
import SidebarMenu from './SidebarMenu'

const Sidebar = () => {
  const sidebarOpen = useSelector(UiStore, (state) => state.sidebarOpen)
  const setSidebarOpen = useSelector(UiStore, (state) => state.setSidebarOpen)

  return (
    <aside
      aria-hidden={!sidebarOpen}
      style={{
        width: sidebarOpen ? sidebarOpenWidthCss : sidebarClosedWidthCss,
      }}
      className="relative flex h-full shrink-0 flex-col overflow-hidden bg-background transition-[width] duration-300 ease-in-out"
    >
      <div
        className={cn(
          'absolute inset-y-0 left-0 flex flex-col transition-opacity duration-200',
          sidebarOpen
            ? 'pointer-events-none opacity-0'
            : 'opacity-100',
        )}
        style={{ width: sidebarClosedWidthCss }}
      >
        <div className="flex h-14 shrink-0 items-center justify-center">
          <Button
            variant="ghost"
            size="icon-sm"
            type="button"
            aria-label="Open sidebar"
            onClick={() => setSidebarOpen(true)}
          >
            <PanelLeftOpen className="size-4" />
          </Button>
        </div>
      </div>

      <div
        style={{ width: sidebarOpenWidthCss }}
        className={cn(
          'flex h-full flex-col transition-opacity duration-200',
          sidebarOpen
            ? 'opacity-100'
            : 'pointer-events-none opacity-0',
        )}
      >
        <SidebarHeader />
        <SidebarMenu />
        <SidebarFooter />
      </div>
    </aside>
  )
}

export default Sidebar
