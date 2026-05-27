import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    Timestamp,
  } from "firebase/firestore";
  import { db } from "@/lib/firebase";
  import type { User } from "../types/user-types";
  import {
    type ClubDoc,
    type Club,
    type ClubMemberDoc,
    type ClubMember,
    ClubRole,
    ClubMemberStatus,
  } from "../types/club-types";
  
  // ---------------------------------------------------------------------------
  // Collection refs
  // ---------------------------------------------------------------------------
  
  const clubsRef = () => collection(db, "clubs");
  const clubMembersRef = () => collection(db, "clubMembers");
  const clubRef = (clubId: string) => doc(db, "clubs", clubId);
  
  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  
  async function fetchUser(userId: string): Promise<User> {
    const snap = await getDoc(doc(db, "users", userId));
    if (!snap.exists()) throw new Error(`User not found: ${userId}`);
    return { id: snap.id, ...snap.data() } as User;
  }
  
  async function fetchUsers(userIds: string[]): Promise<Map<string, User>> {
    const unique = [...new Set(userIds)];
    const users = await Promise.all(unique.map(fetchUser));
    return new Map(users.map((u) => [u.id, u]));
  }
  
  async function fetchClubMembersByStatus(
    clubId: string,
    status: ClubMemberStatus
  ): Promise<ClubMember[]> {
    const q = query(
      clubMembersRef(),
      where("clubId", "==", clubId),
      where("status", "==", status)
    );
    const snap = await getDocs(q);
    const raw = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as ClubMemberDoc),
    }));
  
    const userIds = [
      ...raw.map((m) => m.userId),
      ...raw.map((m) => m.invitedById),
    ].filter(Boolean) as string[];
  
    const userMap = await fetchUsers(userIds);
  
    return raw.map((m) => ({
      ...m,
      user: userMap.get(m.userId ?? "") ?? m.user,
      invitedBy: m.invitedById ? (userMap.get(m.invitedById) ?? null) : null,
    }));
  }
  
  // ---------------------------------------------------------------------------
  // CRUD
  // ---------------------------------------------------------------------------
  
  export async function getClub(clubId: string): Promise<Club> {
    const [clubSnap, members, invitations] = await Promise.all([
      getDoc(clubRef(clubId)),
      fetchClubMembersByStatus(clubId, ClubMemberStatus.ACCEPTED),
      fetchClubMembersByStatus(clubId, ClubMemberStatus.PENDING),
    ]);
  
    if (!clubSnap.exists()) throw new Error(`Club not found: ${clubId}`);
  
    const clubDoc = clubSnap.data() as ClubDoc;
    const createdBy = await fetchUser(clubDoc.createdById);
  
    return {
      id: clubSnap.id,
      ...clubDoc,
      createdBy,
      members,
      invitations,
    };
  }
  
  export async function createClub(
    createdBy: User,
    data: Pick<ClubDoc, "name" | "description">,
    invitees: User[] = []
  ): Promise<Club> {
    const now = Timestamp.now();
  
    const leaderUser = await fetchUser(createdBy.id);
    const inviteeUsers = await Promise.all(
      invitees.map((invitee) => fetchUser(invitee.id))
    );
  
    const clubDocRef = await addDoc(clubsRef(), {
      ...data,
      createdById: leaderUser.id,
      createdAt: now,
      updatedAt: now,
    } satisfies ClubDoc);
  
    const leaderMember: ClubMemberDoc = {
      clubId: clubDocRef.id,
      user: leaderUser,
      userId: leaderUser.id,
      guestName: null,
      joinCode: null,
      role: ClubRole.LEADER,
      status: ClubMemberStatus.ACCEPTED,
      invitedById: leaderUser.id,
      invitedAt: now,
      acceptedAt: now,
    };
  
    const inviteMembers: ClubMemberDoc[] = inviteeUsers.map((user) => ({
      clubId: clubDocRef.id,
      user,
      userId: user.id,
      guestName: null,
      joinCode: null,
      role: ClubRole.MEMBER,
      status: ClubMemberStatus.PENDING,
      invitedById: leaderUser.id,
      invitedAt: now,
      acceptedAt: null,
    }));
  
    await Promise.all(
      [leaderMember, ...inviteMembers].map((member) =>
        addDoc(clubMembersRef(), member)
      )
    );
  
    return getClub(clubDocRef.id);
  }
  
  export async function getClubsForUser(userId: string): Promise<Club[]> {
    const q = query(
      clubMembersRef(),
      where("userId", "==", userId),
      where("status", "==", ClubMemberStatus.ACCEPTED)
    );
    const snap = await getDocs(q);
    const clubIds = snap.docs.map((d) => (d.data() as ClubMemberDoc).clubId);
    return Promise.all(clubIds.map(getClub));
  }
  
  export async function updateClub(
    clubId: string,
    data: Partial<Pick<ClubDoc, "name" | "description">>
  ): Promise<void> {
    await updateDoc(clubRef(clubId), { ...data, updatedAt: Timestamp.now() });
  }
  
  export async function deleteClub(clubId: string): Promise<void> {
    const membersSnap = await getDocs(
      query(clubMembersRef(), where("clubId", "==", clubId))
    );
  
    await Promise.all([
      deleteDoc(clubRef(clubId)),
      ...membersSnap.docs.map((d) => deleteDoc(d.ref)),
    ]);
  }