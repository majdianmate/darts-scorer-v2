export interface MockPlayer {
  id: string
  name: string
  image: string
  matchAverage: number
  legAverage: number
  lastVisit: number
  visitHistory: number[]
}

export interface MockTeamStats {
  matchAverage: number
  legAverage: number
  previousLegAverage: number
  checkoutRate: number
  highestCheckout: number
  first9Average: number
  dartsThrown: number
  ton80s: number
  scores60Plus: number
  scores120Plus: number
  scores180Plus: number
  highestVisit: number
  doublesRate: number
  checkoutAttempts: number
  checkoutsHit: number
  lastVisits: number[]
  scoreHistory: number[]
  visitAverage: number
  winProbability: number
  momentum: 'hot' | 'steady' | 'cold'
}

export interface MockTeamCardData {
  id: string
  name: string
  color: string
  icon: string
  remainingScore: number
  recommendedCheckout: string[]
  members: MockPlayer[]
  currentPlayerId: string
  stats: MockTeamStats
  isCurrentTeam: boolean
  isNextTeam: boolean
  legsWon: number
  legsTarget: number
}

export interface MockMatchPreview {
  currentTeamId: string
  nextTeamId: string
  teams: MockTeamCardData[]
}

export const mockMatchPreview: MockMatchPreview = {
  currentTeamId: 'team-red',
  nextTeamId: 'team-blue',
  teams: [
    {
      id: 'team-red',
      name: 'Crimson Arrows',
      color: '#ff2d55',
      icon: 'flame',
      remainingScore: 141,
      recommendedCheckout: ['T20', 'T19', 'D12'],
      currentPlayerId: 'player-2',
      isCurrentTeam: true,
      isNextTeam: false,
      legsWon: 2,
      legsTarget: 3,
      stats: {
        matchAverage: 87.4,
        legAverage: 92.1,
        previousLegAverage: 88.6,
        checkoutRate: 42,
        highestCheckout: 132,
        first9Average: 98.6,
        dartsThrown: 147,
        ton80s: 2,
        scores60Plus: 14,
        scores120Plus: 5,
        scores180Plus: 2,
        highestVisit: 140,
        doublesRate: 38,
        checkoutAttempts: 5,
        checkoutsHit: 2,
        lastVisits: [100, 85, 60],
        scoreHistory: [100, 85, 60, 140, 45, 85, 100, 55],
        visitAverage: 81.7,
        winProbability: 68,
        momentum: 'hot',
      },
      members: [
        {
          id: 'player-1',
          name: 'Alex Morgan',
          image: 'https://i.pravatar.cc/150?u=alex-morgan',
          matchAverage: 84.2,
          legAverage: 88.0,
          lastVisit: 100,
          visitHistory: [85, 100, 45],
        },
        {
          id: 'player-2',
          name: 'Sam Rivera',
          image: 'https://i.pravatar.cc/150?u=sam-rivera',
          matchAverage: 91.8,
          legAverage: 96.4,
          lastVisit: 85,
          visitHistory: [140, 85, 100],
        },
        {
          id: 'player-3',
          name: 'Jordan Lee',
          image: 'https://i.pravatar.cc/150?u=jordan-lee',
          matchAverage: 79.5,
          legAverage: 82.3,
          lastVisit: 60,
          visitHistory: [60, 95, 55],
        },
      ],
    },
    {
      id: 'team-blue',
      name: 'Blue Bulls',
      color: '#0ea5ff',
      icon: 'shield',
      remainingScore: 224,
      recommendedCheckout: ['T20', 'T20', 'D22'],
      currentPlayerId: 'player-4',
      isCurrentTeam: false,
      isNextTeam: false,
      legsWon: 1,
      legsTarget: 3,
      stats: {
        matchAverage: 79.2,
        legAverage: 81.4,
        previousLegAverage: 76.8,
        checkoutRate: 28,
        highestCheckout: 100,
        first9Average: 85.3,
        dartsThrown: 162,
        ton80s: 0,
        scores60Plus: 8,
        scores120Plus: 1,
        scores180Plus: 0,
        highestVisit: 100,
        doublesRate: 22,
        checkoutAttempts: 4,
        checkoutsHit: 1,
        lastVisits: [45, 60, 85],
        scoreHistory: [45, 60, 85, 80, 55, 100, 45, 60],
        visitAverage: 63.3,
        winProbability: 32,
        momentum: 'cold',
      },
      members: [
        {
          id: 'player-4',
          name: 'Chris Nolan',
          image: 'https://i.pravatar.cc/150?u=chris-nolan',
          matchAverage: 82.1,
          legAverage: 84.5,
          lastVisit: 75,
          visitHistory: [45, 80, 60],
        },
        {
          id: 'player-5',
          name: 'Taylor Brooks',
          image: 'https://i.pravatar.cc/150?u=taylor-brooks',
          matchAverage: 76.4,
          legAverage: 78.0,
          lastVisit: 60,
          visitHistory: [60, 55, 85],
        },
      ],
    },
    {
      id: 'team-violet',
      name: 'Violet Vipers',
      color: '#e040ff',
      icon: 'zap',
      remainingScore: 67,
      recommendedCheckout: ['T19', 'D15'],
      currentPlayerId: 'player-7',
      isCurrentTeam: false,
      isNextTeam: false,
      legsWon: 2,
      legsTarget: 3,
      stats: {
        matchAverage: 94.6,
        legAverage: 97.2,
        previousLegAverage: 91.5,
        checkoutRate: 55,
        highestCheckout: 132,
        first9Average: 102.4,
        dartsThrown: 128,
        ton80s: 3,
        scores60Plus: 18,
        scores120Plus: 9,
        scores180Plus: 3,
        highestVisit: 140,
        doublesRate: 44,
        checkoutAttempts: 4,
        checkoutsHit: 2,
        lastVisits: [140, 100, 85],
        scoreHistory: [140, 100, 85, 95, 180, 100, 88, 140],
        visitAverage: 108.3,
        winProbability: 58,
        momentum: 'hot',
      },
      members: [
        {
          id: 'player-6',
          name: 'Morgan Lee',
          image: 'https://i.pravatar.cc/150?u=morgan-lee',
          matchAverage: 96.2,
          legAverage: 99.1,
          lastVisit: 140,
          visitHistory: [140, 95, 100],
        },
        {
          id: 'player-7',
          name: 'Riley Chen',
          image: 'https://i.pravatar.cc/150?u=riley-chen',
          matchAverage: 92.8,
          legAverage: 94.5,
          lastVisit: 100,
          visitHistory: [100, 88, 140],
        },
      ],
    },
  ],
}

export function getShowcaseTeams(): MockTeamCardData[] {
  return mockMatchPreview.teams.map((t) => getMockTeam(t.id))
}

export function getMockTeam(teamId?: string): MockTeamCardData {
  const team =
    mockMatchPreview.teams.find((t) => t.id === teamId) ??
    mockMatchPreview.teams.find((t) => t.id === mockMatchPreview.currentTeamId)!

  return {
    ...team,
    isCurrentTeam: team.id === mockMatchPreview.currentTeamId,
    isNextTeam:
      team.id === mockMatchPreview.nextTeamId &&
      team.id !== mockMatchPreview.currentTeamId,
  }
}
