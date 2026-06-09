const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/matches': 'Matches',
  '/clubs': 'Clubs',
  '/friends': 'Friends',
  '/settings': 'Settings',
  '/feedback': 'Feedback',
  '/patch-notes': 'Patch Notes',
}

export function resolvePageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]

  for (const [path, title] of Object.entries(PAGE_TITLES)) {
    if (pathname.startsWith(`${path}/`)) return title
  }

  return 'Darts Scorer'
}
