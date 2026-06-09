import { Store } from '@tanstack/react-store'
import { useSelector } from '@tanstack/react-store'

const SIDEBAR_STORAGE_KEY = 'darts-scorer:sidebar-collapsed'

interface UiState {
  sidebarCollapsed: boolean
}

function readSidebarCollapsed(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true'
}

export const uiStore = new Store<UiState>({
  sidebarCollapsed: readSidebarCollapsed(),
})

export const setSidebarCollapsed = (collapsed: boolean) => {
  uiStore.setState((prev) => ({ ...prev, sidebarCollapsed: collapsed }))
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(collapsed))
  }
}

export const toggleSidebarCollapsed = () => {
  const next = !uiStore.state.sidebarCollapsed
  setSidebarCollapsed(next)
}

export const useSidebarCollapsed = () =>
  useSelector(uiStore, (state) => state.sidebarCollapsed)
