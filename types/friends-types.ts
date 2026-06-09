import { Timestamp } from "firebase/firestore";
import type { User } from "./user-types";

export enum FriendshipStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  BLOCKED = "blocked",
}

export interface FriendshipDoc {
  id?: string;
  senderId: string;
  receiverId: string;
  status: FriendshipStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userIds: [string, string];
}

export interface Friendship extends FriendshipDoc {
  id: string;
  sender: User;
  receiver: User;
}

export interface Friend {
  friend: User;
  friendship: Friendship;
}

// src/types/events.ts
export enum UserEventType {
  FRIEND_REQUEST_SENT = "friend_request_sent",
  FRIEND_REQUEST_ACCEPTED = "friend_request_accepted",
  FRIEND_REQUEST_REJECTED = "friend_request_rejected",
  USER_BLOCKED = "user_blocked",
  USER_UNBLOCKED = "user_unblocked",
}

export interface UserEventDoc {
  id?: string;
  userId: string;
  targetId: string;
  type: UserEventType;
  timestamp: Timestamp;
}

export interface UserEvent extends UserEventDoc {
  user: User;
  target: User;
}