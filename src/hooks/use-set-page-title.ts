import { useEffect } from 'react'

import { useSidebarLayout } from '#/components/Sidebar/SidebarLayoutContext'

/** Override the global app header title for the current page. */
export function useSetPageTitle(title: string | null | undefined) {
  const { setPageTitleOverride } = useSidebarLayout()

  useEffect(() => {
    setPageTitleOverride(title?.trim() ? title.trim() : null)
    return () => setPageTitleOverride(null)
  }, [title, setPageTitleOverride])
}
