import { Timestamp } from "firebase/firestore";
import type { User } from "../../authentication/types/user-types";

export enum FriendshipStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  BLOCKED = "blocked",
}

export interface FriendshipDoc {
  id: string;
  senderId: string;
  receiverId: string;
  status: FriendshipStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userIds: [string, string];
}

export interface Friendship extends FriendshipDoc {
  id: string;
  friend: User;
}

export interface Friend {
  friend: User;
  friendship: Friendship;
}