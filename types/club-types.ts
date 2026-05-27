import { Timestamp } from "firebase/firestore";
import type { User } from "./user-types";

export enum ClubRole {
  LEADER = "leader",
  CAPTAIN = "captain",
  MEMBER = "member",
  GUEST = "guest",
}

export const ROLE_RANK: Record<ClubRole, number> = {
  [ClubRole.LEADER]: 3,
  [ClubRole.CAPTAIN]: 2,
  [ClubRole.MEMBER]: 1,
  [ClubRole.GUEST]: 0,
};

export enum ClubMemberStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
}

export interface ClubDoc {
  name: string;
  description: string;
  createdById: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Club extends ClubDoc {
  id: string;
  createdBy: User;
  members: ClubMember[];
  invitations: ClubMember[];
  //squads: Squad[];
}

export interface ClubMemberDoc {
  clubId: string;
  user?: User;
  userId: string | null;
  guestName: string | null;
  joinCode: string | null;
  role: ClubRole;
  status: ClubMemberStatus;
  invitedById: string;
  invitedAt: Timestamp;
  acceptedAt: Timestamp | null;
}

export interface ClubMember extends ClubMemberDoc {
  id: string;
  user: User;
  invitedBy: User | null;
}

export interface ClubInvite {
  id: string;
  clubId: string;
  clubName: string;
  from: User;
  createdAt: Timestamp;
}

export interface SquadDoc {
  clubId: string;
  name: string;
  color: string;
  icon: string;
  createdById: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  memberIds: string[];
}

export interface SquadMemberDoc {
  squadId: string;
  clubId: string;
  membershipId: string;
  addedById: string;
  addedAt: Timestamp;
}

export interface SquadMember extends SquadMemberDoc {
  id: string;
  member: ClubMember;
  addedBy: User;
}

export interface Squad extends SquadDoc {
  id: string;
  members: SquadMember[];
  createdBy: User;
}