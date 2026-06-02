export type PatchNoteChange = {
  label: string
  items: string[]
}

export type PatchNoteRelease = {
  version: string
  title: string
  date?: string
  badge?: 'latest' | 'upcoming' | 'release'
  summary: string
  changes: PatchNoteChange[]
}

/** Release history derived from project milestones and git history. */
export const PATCH_NOTE_RELEASES: PatchNoteRelease[] = [
  {
    version: '1.0.0',
    title: 'First stable release',
    date: 'June 2026',
    badge: 'latest',
    summary:
      'Darts Scorer 1.0 brings a polished match experience, club management, and in-match analytics — ready for everyday use.',
    changes: [
      {
        label: 'Added',
        items: [
          'Match Statistics tab: bar and area charts with team colours',
          'Stats comparison modes: single team, head-to-head, or all players',
          'Match stats table with per-player metrics and best-value highlights',
          'Segmented controls for team, player, chart type, and comparison',
          'Rich chart tooltips with side-by-side player stat cards',
          'Global page header: sidebar toggle, page title, and toolbar on one row',
          'Club page title synced to the app header',
          'Expanded squad icon picker (~70 Lucide icons)',
        ],
      },
      {
        label: 'Improved',
        items: [
          'Live match team cards: minimalist layout, depth, and team-coloured accents',
          'Active team card: rotating accent border and ambient colour orbs',
          'Active player: team-coloured ring plus rotating dashed turn indicator',
          'Scrollable stats area on team cards with hidden scrollbar',
          'Club cards: accordion sections with distinct colours (members, invites, squads)',
          'Sidebar user menu opens upward; grouped menu items',
          'Match first-9 dart average computed across all legs (not only the current leg)',
          'Help and Patch notes pages kept in sync with the app shell',
        ],
      },
      {
        label: 'Fixed',
        items: [
          'Rotating team-card border clipped to the card edge (no bleed on page background)',
          'Vertical separator alignment in the page header',
          'Dropdown menu context error in the sidebar user panel',
        ],
      },
    ],
  },
  {
    version: '0.9.0',
    title: 'Navigation & polish',
    date: 'June 2026',
    badge: 'release',
    summary:
      'App shell improvements before 1.0: sidebar navigation, theme switching, and clearer entry points across the app.',
    changes: [
      {
        label: 'Added',
        items: [
          'Collapsible sidebar on all protected pages',
          'Main navigation: Match, Clubs, Friends, Settings',
          'Clubs section in sidebar with quick links (up to 5 clubs)',
          'Create club from sidebar (+) or empty-state prompt',
          'Notification badges on Clubs and Friends when invites or requests are pending',
          'Help and Patch notes pages',
          'Light, Dark, and Auto theme switcher',
          'Expandable user panel in the footer with logout',
        ],
      },
      {
        label: 'Improved',
        items: [
          'Protected layout: sidebar + scrollable content area',
          'Create club dialog can open from sidebar without a page trigger button',
        ],
      },
    ],
  },
  {
    version: '0.8.0',
    title: 'Live matches',
    date: 'May–June 2026',
    badge: 'release',
    summary:
      'First playable match experience: score entry, legs, stats, and syncing matches through Firebase.',
    changes: [
      {
        label: 'Added',
        items: [
          'Live match screen with team cards and turn indicator',
          'Keyboard-driven score input (visit score, remaining, force, advanced formats)',
          'Two-step checkout prompts: darts thrown, then darts at double',
          'Optional full-screen score display with confetti (match config)',
          'Match configuration: game mode, legs, starting score, checkout mode, starting team',
          'Team manager when setting up a match (squads, manual teams, random split)',
          'Undo last score',
          'Match win dialog when a team reaches the leg target',
          'Statistics: 3-dart leg/game averages, first 9 dart average, checkout rate, 60+/120+/180+',
          'Club match list and start match from a club',
          'Firebase Hosting configuration and match persistence',
        ],
      },
      {
        label: 'Improved',
        items: [
          'Stats engine uses standard 3-dart average: (points ÷ darts thrown) × 3',
          'Checkout darts count toward averages when provided',
        ],
      },
    ],
  },
  {
    version: '0.7.0',
    title: 'Club pages',
    badge: 'release',
    summary: 'Each club has its own page with members, invites, squads, and settings.',
    changes: [
      {
        label: 'Added',
        items: [
          'Dedicated club route and layout',
          'Club overview with tabs for members, invitations, squads, and settings',
          'Navigate to a club from the clubs grid',
        ],
      },
    ],
  },
  {
    version: '0.6.0',
    title: 'Squads',
    badge: 'release',
    summary: 'Organise club members into squads for matches and line-ups.',
    changes: [
      {
        label: 'Added',
        items: [
          'Create, rename, and delete squads within a club',
          'Add and remove squad members',
          'Squad picker when building teams for a match',
        ],
      },
    ],
  },
  {
    version: '0.5.0',
    title: 'Club management UI',
    badge: 'release',
    summary: 'Richer club cards, editing, and clearer empty states.',
    changes: [
      {
        label: 'Added',
        items: [
          'Edit club name and description',
          'Start match and manage members from club cards',
        ],
      },
      {
        label: 'Improved',
        items: [
          'Loading states on the clubs page',
          'Empty state when you have no clubs yet',
          'Club card actions and dropdown menu',
        ],
      },
    ],
  },
  {
    version: '0.4.0',
    title: 'Members & guests',
    badge: 'release',
    summary: 'Invite players and track guests inside a club.',
    changes: [
      {
        label: 'Added',
        items: [
          'Add members from search or friends list',
          'Add guest players by name',
          'Member manager dialog on club cards',
        ],
      },
    ],
  },
  {
    version: '0.3.0',
    title: 'Club invitations',
    badge: 'release',
    summary: 'Invite flow and roles for club membership.',
    changes: [
      {
        label: 'Added',
        items: [
          'Send, accept, and decline club invitations',
          'Incoming invites panel',
          'Promote and demote members (leader, captain, member, guest)',
          'Cancel pending invitations',
        ],
      },
    ],
  },
  {
    version: '0.2.0',
    title: 'Clubs',
    badge: 'release',
    summary: 'Create clubs and manage them from a central list.',
    changes: [
      {
        label: 'Added',
        items: [
          'Create club with optional friend invites',
          'Clubs list and club cards',
          'Update and delete clubs',
        ],
      },
    ],
  },
  {
    version: '0.1.0',
    title: 'Friends',
    badge: 'release',
    summary: 'Connect with other players before joining clubs together.',
    changes: [
      {
        label: 'Added',
        items: [
          'Send and accept friend requests',
          'Friends list with pending requests',
          'User search to find players',
          'Remove friends',
        ],
      },
    ],
  },
  {
    version: '0.0.1',
    title: 'Foundation',
    badge: 'release',
    summary: 'Project bootstrap and authentication.',
    changes: [
      {
        label: 'Added',
        items: [
          'Vite + TanStack Start & Router',
          'Firebase authentication (email and Google)',
          'Sign up, sign in, and forgot password',
          'Base UI components and design tokens',
        ],
      },
    ],
  },
]

export const PATCH_NOTES_HEADLINE = {
  currentVersion: '1.0.0',
  tagline:
    'First stable release — live scoring, clubs, squads, and match analytics.',
}
