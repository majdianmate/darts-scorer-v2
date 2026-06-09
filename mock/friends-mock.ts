import { Timestamp } from "firebase/firestore";

import {
  FriendshipStatus,
  type Friend,
  type Friendship,
  type FriendshipDoc,
} from "../types/friends-types";
import type { User } from "../types/user-types";

const ts = (iso: string) => Timestamp.fromDate(new Date(iso));

export const MOCK_CURRENT_USER_ID = "user_current_001";

export const mockCurrentUser: User = {
  id: MOCK_CURRENT_USER_ID,
  name: "Majdi Teszt",
  displayName: "Majdi",
  email: "majdi@example.com",
  image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Majdi",
  username: "majdi",
  createdAt: ts("2025-01-10T10:00:00Z"),
  updatedAt: ts("2026-03-01T08:00:00Z"),
};

const mockUsersById: Record<string, User> = {
  [MOCK_CURRENT_USER_ID]: mockCurrentUser,
  user_friend_001: {
    id: "user_friend_001",
    name: "Anna Kovács",
    displayName: "Anna",
    email: "anna.kovacs@example.com",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Anna",
    username: "anna_k",
    createdAt: ts("2025-02-14T12:00:00Z"),
    updatedAt: ts("2026-02-20T14:30:00Z"),
  },
  user_friend_002: {
    id: "user_friend_002",
    name: "Péter Nagy",
    displayName: "Péter",
    email: "peter.nagy@example.com",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Peter",
    username: "petern",
    createdAt: ts("2025-03-05T09:15:00Z"),
    updatedAt: ts("2026-01-18T11:00:00Z"),
  },
  user_friend_003: {
    id: "user_friend_003",
    name: "Zsófi Varga",
    displayName: "Zsófi",
    email: "zsofi.varga@example.com",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Zsofi",
    username: "zsofi_v",
    createdAt: ts("2025-04-22T16:45:00Z"),
    updatedAt: ts("2026-02-28T09:20:00Z"),
  },
  user_friend_004: {
    id: "user_friend_004",
    name: "Márk Horváth",
    displayName: "Márk",
    email: "mark.horvath@example.com",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Mark",
    username: "markh",
    createdAt: ts("2025-05-30T08:30:00Z"),
    updatedAt: ts("2026-03-05T17:10:00Z"),
  },
  user_friend_005: {
    id: "user_friend_005",
    name: "Luca Szabó",
    displayName: "Luca",
    email: "luca.szabo@example.com",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Luca",
    username: "lucas",
    createdAt: ts("2025-06-12T13:00:00Z"),
    updatedAt: ts("2026-02-10T10:45:00Z"),
  },
  user_pending_001: {
    id: "user_pending_001",
    name: "Bence Tóth",
    displayName: "Bence",
    email: "bence.toth@example.com",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Bence",
    username: "bence_t",
    createdAt: ts("2025-08-01T11:20:00Z"),
    updatedAt: ts("2026-03-08T12:00:00Z"),
  },
  user_pending_002: {
    id: "user_pending_002",
    name: "Eszter Balogh",
    displayName: "Eszter",
    email: "eszter.balogh@example.com",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Eszter",
    username: "eszterb",
    createdAt: ts("2025-09-19T07:40:00Z"),
    updatedAt: ts("2026-03-07T15:30:00Z"),
  },
  user_blocked_001: {
    id: "user_blocked_001",
    name: "Gábor Molnár",
    displayName: "Gábor",
    email: "gabor.molnar@example.com",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Gabor",
    username: "gaborm",
    createdAt: ts("2025-07-03T18:00:00Z"),
    updatedAt: ts("2026-01-05T20:15:00Z"),
  },
};

function buildFriendship(
  senderId: string,
  receiverId: string,
  status: FriendshipStatus,
  createdAt: string,
  updatedAt: string,
): Friendship {
  const id = `${senderId}_${receiverId}`;

  return {
    id,
    senderId,
    receiverId,
    sender: mockUsersById[senderId],
    receiver: mockUsersById[receiverId],
    status,
    createdAt: ts(createdAt),
    updatedAt: ts(updatedAt),
    userIds: [senderId, receiverId],
  };
}

/** Elfogadott barátságok (Firestore friendships kollekció). */
export const mockAcceptedFriendships: Friendship[] = [
  buildFriendship(
    MOCK_CURRENT_USER_ID,
    "user_friend_001",
    FriendshipStatus.ACCEPTED,
    "2025-11-01T10:00:00Z",
    "2025-11-01T10:05:00Z",
  ),
  buildFriendship(
    "user_friend_002",
    MOCK_CURRENT_USER_ID,
    FriendshipStatus.ACCEPTED,
    "2025-11-08T14:20:00Z",
    "2025-11-08T14:25:00Z",
  ),
  buildFriendship(
    MOCK_CURRENT_USER_ID,
    "user_friend_003",
    FriendshipStatus.ACCEPTED,
    "2025-12-02T09:00:00Z",
    "2025-12-02T09:10:00Z",
  ),
  buildFriendship(
    "user_friend_004",
    MOCK_CURRENT_USER_ID,
    FriendshipStatus.ACCEPTED,
    "2026-01-15T16:30:00Z",
    "2026-01-15T16:35:00Z",
  ),
  buildFriendship(
    MOCK_CURRENT_USER_ID,
    "user_friend_005",
    FriendshipStatus.ACCEPTED,
    "2026-02-20T11:45:00Z",
    "2026-02-20T11:50:00Z",
  ),
];

/** Kimenő függőben lévő kérések (a current user küldte). */
export const mockPendingOutgoingFriendships: Friendship[] = [
  buildFriendship(
    MOCK_CURRENT_USER_ID,
    "user_pending_001",
    FriendshipStatus.PENDING,
    "2026-03-08T08:00:00Z",
    "2026-03-08T08:00:00Z",
  ),
];

/** Bejövő függőben lévő kérések (a current user kapta). */
export const mockPendingIncomingFriendships: Friendship[] = [
  buildFriendship(
    "user_pending_002",
    MOCK_CURRENT_USER_ID,
    FriendshipStatus.PENDING,
    "2026-03-07T19:30:00Z",
    "2026-03-07T19:30:00Z",
  ),
];

/** Blokkolt kapcsolatok. */
export const mockBlockedFriendships: Friendship[] = [
  buildFriendship(
    MOCK_CURRENT_USER_ID,
    "user_blocked_001",
    FriendshipStatus.BLOCKED,
    "2026-01-20T13:00:00Z",
    "2026-01-20T13:00:00Z",
  ),
];

export const mockFriendships: Friendship[] = [
  ...mockAcceptedFriendships,
  ...mockPendingOutgoingFriendships,
  ...mockPendingIncomingFriendships,
  ...mockBlockedFriendships,
];

/** A getFriendsService által visszaadott forma a current userhez. */
export const mockFriends: Friend[] = mockAcceptedFriendships.map((friendship) => {
  const friendId = friendship.userIds.find((id) => id !== MOCK_CURRENT_USER_ID)!;

  return {
    friend: mockUsersById[friendId],
    friendship,
  };
});

/** createFriendshipsServices / addFriends mutationhöz. */
export const mockFriendshipDocs: FriendshipDoc[] = [
  {
    senderId: MOCK_CURRENT_USER_ID,
    receiverId: "user_pending_001",
    status: FriendshipStatus.PENDING,
    createdAt: ts("2026-03-08T08:00:00Z"),
    updatedAt: ts("2026-03-08T08:00:00Z"),
    userIds: [MOCK_CURRENT_USER_ID, "user_pending_001"],
  },
];

/** Összes mock user (current user + barátok + pending + blocked). */
export const mockFriendUsers: User[] = Object.values(mockUsersById).filter(
  (user) => user.id !== MOCK_CURRENT_USER_ID,
);

export function getMockFriendsForUser(userId: string): Friend[] {
  return mockAcceptedFriendships
    .filter((friendship) => friendship.userIds.includes(userId))
    .map((friendship) => {
      const friendId = friendship.userIds.find((id) => id !== userId)!;

      return {
        friend: mockUsersById[friendId],
        friendship,
      };
    });
}
