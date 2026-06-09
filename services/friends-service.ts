import {
    type Friendship,
    type FriendshipDoc,
    FriendshipStatus,
  } from "../types/friends-types";
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
  } from "firebase/firestore";
  
  import { db } from "@/lib/firebase";
  import { getUserData, getUsersData } from "./user-service";

  export const createFriendshipsServices = async (friendships: FriendshipDoc[]) => {
    for (const friendship of friendships) {
      await createFriendshipService(friendship);
    }
  }
  
  export const createFriendshipService = async (friendship: FriendshipDoc) => {
    const friendshipId = friendship.senderId + "_" + friendship.receiverId;
    const friendshipRef = doc(db, "friendships", friendshipId);
  
    const existingFriendship = await getDoc(friendshipRef);
  
    if (existingFriendship.exists()) {
      const data = existingFriendship.data() as Friendship;
      if (data.status === FriendshipStatus.ACCEPTED)
        throw new Error("Already friends!");
      if (data.status === FriendshipStatus.PENDING)
        throw new Error("Request already pending!");
      if (data.status === FriendshipStatus.BLOCKED)
        throw new Error("Something went wrong!");
    }
  
    const friendshipData: Friendship = {
      id: friendshipId,
      senderId: friendship.senderId,
      sender: await getUserData(friendship.senderId),
      receiverId: friendship.receiverId,
      receiver: await getUserData(friendship.receiverId),
      status: FriendshipStatus.PENDING,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
      userIds: [friendship.senderId, friendship.receiverId],
    };
  
    await setDoc(friendshipRef, friendshipData);
  };
  export const getFriendsService = async (userId: string) => {
    const friendshipsRef = collection(db, "friendships");
    const q = query(
      friendshipsRef,
      where("userIds", "array-contains", userId),
      where("status", "==", FriendshipStatus.ACCEPTED),
    );
  
    const snap = await getDocs(q);
    if (snap.empty) return [];
  
    const friendships = snap.docs.map((d) => ({
      ...(d.data() as Friendship),
      id: d.id,
    }));
  
    const userIds = Array.from(
      new Set(friendships.flatMap((f) => [f.senderId, f.receiverId])),
    );
  
    const usersMap = await getUsersData(userIds);
  
    return friendships
      .map((fs) => {
        const friendId = fs.userIds.find((id: string) => id !== userId)!;
  
        return {
          friend: usersMap[friendId],
          friendship: {
            ...fs,
            sender: usersMap[fs.senderId],
            receiver: usersMap[fs.receiverId],
          },
        };
      })
      .filter((f) => f.friend && f.friendship.sender && f.friendship.receiver);
  };
  export const deleteFriendshipService = async (friendshipId: string) => {
    const friendshipRef = doc(db, "friendships", friendshipId);
    await deleteDoc(friendshipRef);
  };