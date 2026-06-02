import { useEffect, type FC, type ReactNode } from 'react'

import { useSidebarLayout } from './SidebarLayoutContext'

/** Renders page actions/meta into the global header row (same line as title). */
const PageHeaderToolbar: FC<{ children: ReactNode }> = ({ children }) => {
  const { setPageHeaderToolbar } = useSidebarLayout()

  useEffect(() => {
    setPageHeaderToolbar(children)
    return () => setPageHeaderToolbar(null)
  }, [children, setPageHeaderToolbar])

  return null
}

export default PageHeaderToolbar
