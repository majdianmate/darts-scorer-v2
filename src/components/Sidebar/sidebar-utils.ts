const COLLAPSED_KEY = 'sidebar-collapsed'

export function readSidebarCollapsed(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(COLLAPSED_KEY) === '1'
}

export function writeSidebarCollapsed(collapsed: boolean) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(COLLAPSED_KEY, collapsed ? '1' : '0')
}

export function isNavActive(pathname: string, href: string): boolean {
  if (href === '/match') return pathname === '/match' || pathname.startsWith('/match/')
  if (href === '/clubs') return pathname === '/clubs' || pathname.startsWith('/clubs/')
  if (href === '/friends') return pathname.startsWith('/friends')
  if (href === '/settings') return pathname.startsWith('/settings')
  if (href === '/help') return pathname.startsWith('/help')
  if (href === '/patch-notes') return pathname.startsWith('/patch-notes')
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function formatBadgeCount(count: number): string {
  if (count <= 0) return ''
  if (count > 9) return '9+'
  return String(count)
}
