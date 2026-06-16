import { type FC } from 'react'
import { useSelector } from '@tanstack/react-store'
import { PanelLeftClose, Target } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { useStore } from '../../../store/store'

const SidebarHeader: FC = () => {
  const setSidebarOpen = useStore((state) => state.setSidebarOpen)

  return (
    <div className="flex h-14 shrink-0 items-center justify-between gap-2 px-3">
      <div className="flex min-w-0 items-center gap-2.5 overflow-hidden">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Target className="size-4" />
        </div>
        <h2 className="truncate text-sm font-bold tracking-tight">Darts Scorer</h2>
      </div>

      <Button
        variant="ghost"
        size="icon-sm"
        type="button"
        aria-label="Close sidebar"
        onClick={() => setSidebarOpen(false)}
      >
        <PanelLeftClose className="size-4" />
      </Button>
    </div>
  )
}

export default SidebarHeader
