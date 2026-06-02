import { Timestamp } from "firebase/firestore";
import type { Squad } from "../../../../../../types/club-types";
import type { Team } from "../../../../../../types/match-types";

export function squadToTeam(squad: Squad): Team {
  const now = Timestamp.now();
  const members = squad.members.map((squadMember) => squadMember.member);
  const firstMember = members[0];

  return {
    id: squad.id,
    name: squad.name,
    color: squad.color,
    icon: squad.icon,
    currentPlayerId: firstMember?.id ?? "",
    createdAt: now,
    updatedAt: now,
    members,
    isSquad: true,
  };
}
