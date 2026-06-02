import { PRESET_COLORS } from "#/components/ui/color-picker";
import { SQUAD_ICON_KEYS, type SquadIconKey } from "#/components/IconPicker";
import type { ClubMember } from "../../../../../../types/club-types";
import type { Team } from "../../../../../../types/match-types";
import {
  clampRandomTeamCount,
  MIN_RANDOM_TEAMS,
} from "../../../../../../store/match-store";
import { membersToTeam } from "../TeamManagerCreate/members-to-team";

function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

function pickRandomUnique<T>(pool: readonly T[], count: number): T[] {
  return shuffle(pool).slice(0, Math.min(count, pool.length));
}

function getFirstName(member: ClubMember): string {
  const trimmed = member.user.name.trim();
  if (!trimmed) return "Player";

  return trimmed.split(/\s+/)[0] ?? trimmed;
}

export function generateTeamName(members: ClubMember[]): string {
  const firstNames = members.map(getFirstName);

  if (firstNames.length === 0) return "Team";
  if (firstNames.length === 1) return firstNames[0];
  if (firstNames.length === 2) return `${firstNames[0]} & ${firstNames[1]}`;

  return `${firstNames[0]}, ${firstNames[1]} +${firstNames.length - 2}`;
}

function distributeMembers(
  members: ClubMember[],
  teamCount: number,
): ClubMember[][] {
  const shuffled = shuffle(members);
  const groups = Array.from({ length: teamCount }, () => [] as ClubMember[]);

  shuffled.forEach((member, index) => {
    groups[index % teamCount].push(member);
  });

  return groups.filter((group) => group.length > 0);
}

export function generateRandomTeams(
  members: ClubMember[],
  teamCount: number,
): Team[] {
  const clampedTeamCount = clampRandomTeamCount(teamCount, members.length);

  if (members.length < MIN_RANDOM_TEAMS || clampedTeamCount < MIN_RANDOM_TEAMS) {
    return [];
  }

  const memberGroups = distributeMembers(members, clampedTeamCount);
  const colors = pickRandomUnique(PRESET_COLORS, memberGroups.length);
  const icons = pickRandomUnique(SQUAD_ICON_KEYS, memberGroups.length);

  return memberGroups.map((groupMembers, index) =>
    membersToTeam(
      generateTeamName(groupMembers),
      colors[index] ?? PRESET_COLORS[0],
      (icons[index] ?? SQUAD_ICON_KEYS[0]) as SquadIconKey,
      groupMembers,
    ),
  );
}
