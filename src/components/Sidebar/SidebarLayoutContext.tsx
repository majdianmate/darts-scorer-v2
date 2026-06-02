import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { readSidebarCollapsed, writeSidebarCollapsed } from './sidebar-utils'

type SidebarLayoutContextValue = {
  collapsed: boolean
  toggleCollapsed: () => void
  pageTitleOverride: string | null
  setPageTitleOverride: (title: string | null) => void
  pageHeaderToolbar: ReactNode | null
  setPageHeaderToolbar: (toolbar: ReactNode | null) => void
}

const SidebarLayoutContext = createContext<SidebarLayoutContextValue | null>(
  null,
)

export function SidebarLayoutProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [pageTitleOverride, setPageTitleOverride] = useState<string | null>(
    null,
  )
  const [pageHeaderToolbar, setPageHeaderToolbar] = useState<ReactNode | null>(
    null,
  )

  useEffect(() => {
    setCollapsed(readSidebarCollapsed())
  }, [])

  const toggleCollapsed = useCallback(() => {
    setCollapsed((current) => {
      const next = !current
      writeSidebarCollapsed(next)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      collapsed,
      toggleCollapsed,
      pageTitleOverride,
      setPageTitleOverride,
      pageHeaderToolbar,
      setPageHeaderToolbar,
    }),
    [collapsed, toggleCollapsed, pageTitleOverride, pageHeaderToolbar],
  )

  return (
    <SidebarLayoutContext.Provider value={value}>
      {children}
    </SidebarLayoutContext.Provider>
  )
}

export function useSidebarLayout() {
  const context = useContext(SidebarLayoutContext)
  if (!context) {
    throw new Error('useSidebarLayout must be used within SidebarLayoutProvider')
  }
  return context
}
