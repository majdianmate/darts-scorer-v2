export function isNavActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === '/dashboard'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function formatBadge(count: number) {
  if (count > 9) return '9+'
  return String(count)
}
