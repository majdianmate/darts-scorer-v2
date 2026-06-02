import type { ClubMember } from "../../../../../types/club-types";
import type { User } from "../../../../../types/user-types";

export function membersToPickerUsers(members: ClubMember[]): User[] {
  return members.map((member) => ({
    ...member.user,
    id: member.id,
  }));
}

export function pickerUsersToMembers(
  users: User[],
  members: ClubMember[],
): ClubMember[] {
  const memberById = new Map(members.map((member) => [member.id, member]));

  return users
    .map((user) => memberById.get(user.id))
    .filter((member): member is ClubMember => !!member);
}
