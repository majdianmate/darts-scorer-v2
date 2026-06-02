import { Timestamp } from "firebase/firestore";
import type { ClubMember } from "../../../../../../types/club-types";
import type { Team } from "../../../../../../types/match-types";

export function membersToTeam(
  name: string,
  color: string,
  icon: string,
  members: ClubMember[],
): Team {
  const now = Timestamp.now();
  const trimmedName = name.trim();
  const firstMember = members[0];

  return {
    id: crypto.randomUUID(),
    name: trimmedName,
    color,
    icon,
    currentPlayerId: firstMember?.id ?? "",
    createdAt: now,
    updatedAt: now,
    members,
    isSquad: false,
  };
}
