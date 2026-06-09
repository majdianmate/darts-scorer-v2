import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type SidebarLayoutContextValue = {
  pageTitleOverride: string | null
  setPageTitleOverride: (title: string | null) => void
  pageHeaderToolbar: ReactNode | null
  setPageHeaderToolbar: (toolbar: ReactNode | null) => void
}

const SidebarLayoutContext = createContext<SidebarLayoutContextValue | null>(
  null,
)

export function SidebarLayoutProvider({ children }: { children: ReactNode }) {
  const [pageTitleOverride, setPageTitleOverride] = useState<string | null>(
    null,
  )
  const [pageHeaderToolbar, setPageHeaderToolbar] = useState<ReactNode | null>(
    null,
  )

  const value = useMemo(
    () => ({
      pageTitleOverride,
      setPageTitleOverride,
      pageHeaderToolbar,
      setPageHeaderToolbar,
    }),
    [pageTitleOverride, pageHeaderToolbar],
  )

  return (
    <SidebarLayoutContext.Provider value={value}>
      {children}
    </SidebarLayoutContext.Provider>
  )
}

export function useSidebarLayout() {
  const ctx = useContext(SidebarLayoutContext)
  if (!ctx) {
    throw new Error('useSidebarLayout must be used within SidebarLayoutProvider')
  }
  return ctx
}

export function usePageHeader(config: {
  title?: string
  toolbar?: ReactNode
}) {
  const { setPageTitleOverride, setPageHeaderToolbar } = useSidebarLayout()

  useEffect(() => {
    setPageTitleOverride(config.title ?? null)
    setPageHeaderToolbar(config.toolbar ?? null)
    return () => {
      setPageTitleOverride(null)
      setPageHeaderToolbar(null)
    }
  }, [
    config.title,
    config.toolbar,
    setPageTitleOverride,
    setPageHeaderToolbar,
  ])
}
