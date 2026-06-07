import { useEffect, useState, type FC, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { useSidebarLayout } from './SidebarLayoutContext'

/** Portals children into the global header center slot (keeps React context). */
const PageHeaderCenter: FC<{ children: ReactNode }> = ({ children }) => {
  const { pageHeaderCenterEl } = useSidebarLayout()
  const [, setMountTick] = useState(0)

  useEffect(() => {
    setMountTick((tick) => tick + 1)
  }, [pageHeaderCenterEl])

  if (!pageHeaderCenterEl) return null

  return createPortal(children, pageHeaderCenterEl)
}

export default PageHeaderCenter
