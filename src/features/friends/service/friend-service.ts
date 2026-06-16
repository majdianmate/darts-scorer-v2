import {
  type Friendship,
  type FriendshipDoc,
  FriendshipStatus,
} from '../types/friend-types'
import {
  doc,
  getDoc,
  deleteDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  getDocs,
  collection,
  query,
  where,
  Timestamp,
  writeBatch,
  orderBy,
} from 'firebase/firestore'

import { db } from '@/lib/firebase'
import { getUserData } from '#/features/authentication/service/auth-service'
import type { User } from '#/features/authentication/types/user-types'

//? ─── CRUD ────────────────────────────────────────────────────
//? ─── Add Friends ────────────────────────────────────────────────────

export const addFriendsService = async (
  userIds: string[],
  currentUserId: string,
) => {
  const batch = writeBatch(db)

  userIds.forEach((friendId) => {
    const sortedIds = [currentUserId, friendId].sort()
    const friendshipId = `${sortedIds[0]}_${sortedIds[1]}`

    const friendshipRef = doc(db, 'friendships', friendshipId)

    batch.set(
      friendshipRef,
      {
        senderId: currentUserId,
        receiverId: friendId,
        userIds: [currentUserId, friendId],
        status: FriendshipStatus.PENDING,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    )
  })

  await batch.commit()

  return { success: true, count: userIds.length }
}

//? ─── Get Friends ────────────────────────────────────────────────────
export const getFriendsService = async (
  userId: string,
): Promise<Friendship[]> => {
  const friendshipsRef = collection(db, 'friendships')
  const q = query(
    friendshipsRef,
    where('userIds', 'array-contains', userId),
    where('status', '==', FriendshipStatus.ACCEPTED),
    orderBy('createdAt', 'desc'),
  )

  const snapshot = await getDocs(q)
  if (snapshot.empty) return []

  const friendships: FriendshipDoc[] = snapshot.docs.map((doc) => ({
    ...(doc.data() as FriendshipDoc),
    id: doc.id,
  }))

  const friendshipsWithUsers: Friendship[] = await Promise.all(
    friendships.map(async (friendship) => {
      const sender = await getUserData(friendship.senderId)
      const receiver = await getUserData(friendship.receiverId)

      const friend = sender.id === userId ? receiver : (sender as User)
      return {
        ...friendship,
        friend,
      }
    }),
  )

  return friendshipsWithUsers
}

//? ─── Delete Friend Request ────────────────────────────────────────────────────
export const deleteFriendService = async (
  friendshipId: string,
  currentUserId: string,
) => {
  const friendshipRef = doc(db, 'friendships', friendshipId)
  const friendship = await getDoc(friendshipRef)
  if (!friendship.exists()) throw new Error('Friendship not found')
  const friendshipData = friendship.data() as FriendshipDoc
  if (
    friendshipData.senderId !== currentUserId &&
    friendshipData.receiverId !== currentUserId
  )
    throw new Error('You are not a part of this friendship')
  await deleteDoc(friendshipRef)
  return { success: true }
}

//? ─── Accept Friend Request ────────────────────────────────────────────────────
export const acceptFriendRequestService = async (
  friendshipId: string,
  currentUserId: string,
) => {
  const friendshipRef = doc(db, 'friendships', friendshipId)
  const friendship = await getDoc(friendshipRef)

  if (!friendship.exists()) throw new Error('Friendship not found')
  const friendshipData = friendship.data() as FriendshipDoc
  if (friendshipData.receiverId !== currentUserId)
    throw new Error('You are not the receiver of this friendship')
  await updateDoc(friendshipRef, {
    status: FriendshipStatus.ACCEPTED,
    updatedAt: serverTimestamp(),
  })
  return { success: true }
}

//? ─── Reject Friend Request ────────────────────────────────────────────────────
export const rejectFriendRequestService = async (
  friendshipId: string,
  currentUserId: string,
) => {
  await deleteFriendService(friendshipId, currentUserId)
}

//? ─── Cancel Friend Request ────────────────────────────────────────────────────
export const cancelFriendRequestService = async (
  friendshipId: string,
  currentUserId: string,
) => {
  await deleteFriendService(friendshipId, currentUserId)
}

//? ─── Get Friend Requests ────────────────────────────────────────────────────
export const getFriendRequestsService = async (
  userId: string,
): Promise<Friendship[]> => {
  const friendshipsRef = collection(db, 'friendships')

  const q = query(
    friendshipsRef,
    where('userIds', 'array-contains', userId),
    where('status', '==', FriendshipStatus.PENDING),
    orderBy('createdAt', 'desc'),
  )

  const snapshot = await getDocs(q)

  if (snapshot.empty) return []

  const friendships: FriendshipDoc[] = snapshot.docs.map((doc) => ({
    ...(doc.data() as FriendshipDoc),
    id: doc.id,
  }))

  const friendshipsWithUsers: Friendship[] = await Promise.all(
    friendships.map(async (friendship) => {
      const sender = await getUserData(friendship.senderId)
      const receiver = await getUserData(friendship.receiverId)

      const friend = sender.id === userId ? receiver : (sender as User)
      return {
        ...friendship,
        friend,
      }
    }),
  )
  return friendshipsWithUsers
}

//? ─── Get Sent Friend Requests ────────────────────────────────────────────────────
export const getSentFriendRequestsService = async (
  userId: string,
): Promise<Friendship[]> => {
  const friendshipsRef = collection(db, 'friendships')
  const q = query(
    friendshipsRef,
    where('senderId', '==', userId),
    where('status', '==', FriendshipStatus.PENDING),
    orderBy('createdAt', 'desc'),
  )
  const snapshot = await getDocs(q)
  if (snapshot.empty) return []
  const friendships: FriendshipDoc[] = snapshot.docs.map((doc) => ({
    ...(doc.data() as FriendshipDoc),
    id: doc.id,
  }))
  const friendshipsWithUsers: Friendship[] = await Promise.all(
    friendships.map(async (friendship) => {
      const sender = await getUserData(friendship.senderId)
      const receiver = await getUserData(friendship.receiverId)
      const friend = sender.id === userId ? receiver : (sender as User)
      return {
        ...friendship,
        friend,
      }
    }),
  )
  return friendshipsWithUsers
}

//? ─── Block Friend ────────────────────────────────────────────────────
export const blockFriendService = async (
  friendshipId: string,
  currentUserId: string,
) => {
  const friendshipRef = doc(db, 'friendships', friendshipId)
  const friendship = await getDoc(friendshipRef)
  if (!friendship.exists()) throw new Error('Friendship not found')
  const friendshipData = friendship.data() as FriendshipDoc
  if (
    friendshipData.senderId !== currentUserId &&
    friendshipData.receiverId !== currentUserId
  )
    throw new Error('You are not a part of this friendship')
  await updateDoc(friendshipRef, {
    status: FriendshipStatus.BLOCKED,
    updatedAt: serverTimestamp(),
  })
  return { success: true }
}

//? ─── Unblock Friend ────────────────────────────────────────────────────
export const unblockFriendService = async (
  friendshipId: string,
  currentUserId: string,
) => {
  await deleteFriendService(friendshipId, currentUserId)
}

//? ─── Get Blocked Friends ────────────────────────────────────────────────────
export const getBlockedFriendsService = async (
  userId: string,
): Promise<Friendship[]> => {
  const friendshipsRef = collection(db, 'friendships')
  const q = query(
    friendshipsRef,
    where('userIds', 'array-contains', userId),
    where('status', '==', FriendshipStatus.BLOCKED),
    orderBy('createdAt', 'desc'),
  )
  const snapshot = await getDocs(q)
  if (snapshot.empty) return []
  const friendships: FriendshipDoc[] = snapshot.docs.map((doc) => ({
    ...(doc.data() as FriendshipDoc),
    id: doc.id,
  }))
  const friendshipsWithUsers: Friendship[] = await Promise.all(
    friendships.map(async (friendship) => {
      const sender = await getUserData(friendship.senderId)
      const receiver = await getUserData(friendship.receiverId)
      const friend = sender.id === userId ? receiver : (sender as User)
      return {
        ...friendship,
        friend,
      }
    }),
  )
  return friendshipsWithUsers
}
