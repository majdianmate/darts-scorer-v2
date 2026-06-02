import { StatsManager } from '#/utils/stats-engine'

type PlayerStatsMap = Map<string, StatsManager>

interface MatchStatsRegistry {
  teams: Map<string, StatsManager>
  players: Map<string, PlayerStatsMap>
}

let registry: MatchStatsRegistry | null = null

function createRegistry(): MatchStatsRegistry {
  return {
    teams: new Map(),
    players: new Map(),
  }
}

export function initMatchStatsRegistry(
  teams: { id: string; members: { id: string }[] }[],
) {
  registry = createRegistry()

  for (const team of teams) {
    registerTeamStats(team.id, team.members.map((member) => member.id))
  }
}

export function clearMatchStatsRegistry() {
  registry = null
}

export function registerTeamStats(teamId: string, playerIds: string[]) {
  if (!registry) registry = createRegistry()

  registry.teams.set(teamId, new StatsManager())

  const playerMap: PlayerStatsMap = new Map()
  for (const playerId of playerIds) {
    playerMap.set(playerId, new StatsManager())
  }

  registry.players.set(teamId, playerMap)
}

export function unregisterTeamStats(teamId: string) {
  if (!registry) return

  registry.teams.delete(teamId)
  registry.players.delete(teamId)
}

export function getTeamStatsManager(teamId: string): StatsManager | undefined {
  return registry?.teams.get(teamId)
}

export function getPlayerStatsManager(
  teamId: string,
  playerId: string,
): StatsManager | undefined {
  return registry?.players.get(teamId)?.get(playerId)
}

export function handleLegEndForAllTeams() {
  if (!registry) return

  for (const manager of registry.teams.values()) {
    manager.handleLegEnd()
  }

  for (const playerMap of registry.players.values()) {
    for (const manager of playerMap.values()) {
      manager.handleLegEnd()
    }
  }
}
