export function resolvePageTitle(pathname: string): string {
  if (pathname === '/match' || pathname === '/match/') return 'Matches'
  if (pathname.startsWith('/match/')) return 'Match'

  if (pathname === '/clubs' || pathname === '/clubs/') return 'Clubs'
  if (pathname.startsWith('/clubs/')) return 'Club'

  if (pathname.startsWith('/friends')) return 'Friends'
  if (pathname.startsWith('/settings')) return 'Settings'
  if (pathname.startsWith('/help')) return 'Help'
  if (pathname.startsWith('/patch-notes')) return 'Patch notes'
  if (pathname.startsWith('/test')) return 'Design test'

  return 'Darts Scorer'
}
