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
  serverTimestamp,
  setDoc,
  writeBatch,
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
  type ClubInvite,
  type Squad,
  type SquadDoc,
  type SquadMember,
  type SquadMemberDoc,
} from "../types/club-types";

// ---------------------------------------------------------------------------
// Collection refs
// ---------------------------------------------------------------------------

const clubsRef = () => collection(db, "clubs");
const clubMembersRef = () => collection(db, "clubMembers");
const squadsRef = () => collection(db, "squads");
const squadMembersRef = () => collection(db, "squadMembers");
const clubRef = (clubId: string) => doc(db, "clubs", clubId);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchUser(userId: string): Promise<User> {
  if (!userId) {
    throw new Error("Invalid user ID");
  }
  const snap = await getDoc(doc(db, "users", userId));
  if (!snap.exists()) throw new Error(`User not found: ${userId}`);
  return { id: snap.id, ...snap.data() } as User;
}

function createGuestDisplayUser(
  guestName: string,
  joinCode?: string | null,
): User {
  const now = Timestamp.now();
  const slug = guestName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return {
    id: `guest-${slug || "member"}`,
    name: guestName.trim(),
    displayName: guestName.trim(),
    email: "",
    image: "",
    username: joinCode ?? slug ?? "guest",
    createdAt: now,
    updatedAt: now,
  };
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
    user: m.userId
      ? (userMap.get(m.userId) ??
        m.user ??
        createGuestDisplayUser(m.guestName ?? "Guest", m.joinCode))
      : createGuestDisplayUser(m.guestName ?? "Guest", m.joinCode),
    invitedBy: m.invitedById ? (userMap.get(m.invitedById) ?? null) : null,
  }));
}

async function assertCanManageSquads(
  clubId: string,
  currentUserId: string,
): Promise<void> {
  const roleSnap = await getDocs(
    query(
      clubMembersRef(),
      where("clubId", "==", clubId),
      where("userId", "==", currentUserId),
      where("status", "==", ClubMemberStatus.ACCEPTED),
    ),
  );

  if (roleSnap.empty) {
    throw new Error("You are not a member of this club.");
  }

  const role = roleSnap.docs[0].data() as ClubMemberDoc;
  if (role.role !== ClubRole.LEADER && role.role !== ClubRole.CAPTAIN) {
    throw new Error("Only leaders and captains can manage squads.");
  }
}

async function fetchSquadMembers(
  squadId: string,
  clubId: string,
): Promise<SquadMember[]> {
  const q = query(
    squadMembersRef(),
    where("squadId", "==", squadId),
    where("clubId", "==", clubId),
  );
  const snap = await getDocs(q);

  if (snap.empty) return [];

  const raw = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as SquadMemberDoc),
  }));

  const addedByMap = await fetchUsers(
    [...new Set(raw.map((s) => s.addedById))],
  );

  return raw.map((sm) => ({
    ...sm,
    addedBy: addedByMap.get(sm.addedById)!,
    member: {
      ...sm.member,
      id: sm.member.id ?? sm.membershipId,
      user:
        sm.member.user ??
        createGuestDisplayUser(
          sm.member.guestName ?? "Guest",
          sm.member.joinCode,
        ),
      invitedBy: sm.member.invitedBy ?? null,
    },
  }));
}

export async function getSquads(clubId: string): Promise<Squad[]> {
  const q = query(squadsRef(), where("clubId", "==", clubId));
  const snap = await getDocs(q);

  if (snap.empty) return [];

  return Promise.all(
    snap.docs.map(async (squadDoc) => {
      const data = squadDoc.data() as SquadDoc;
      const squadId = squadDoc.id;

      const [createdBy, members] = await Promise.all([
        fetchUser(data.createdById),
        fetchSquadMembers(squadId, clubId),
      ]);

      return {
        id: squadId,
        clubId: data.clubId,
        name: data.name,
        color: data.color,
        icon: data.icon,
        createdById: data.createdById,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        memberIds: members.map((m) => m.membershipId),
        createdBy,
        members,
      };
    }),
  );
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

export async function getClub(clubId: string): Promise<Club> {
  const [clubSnap, members, invitations, squads] = await Promise.all([
    getDoc(clubRef(clubId)),
    fetchClubMembersByStatus(clubId, ClubMemberStatus.ACCEPTED),
    fetchClubMembersByStatus(clubId, ClubMemberStatus.PENDING),
    getSquads(clubId),
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
    squads,
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

export async function acceptClubInviteService(membershipId: string): Promise<void> {
  const ref = doc(db, "clubMembers", membershipId);
  await updateDoc(ref, {
    status: ClubMemberStatus.ACCEPTED,
    acceptedAt: serverTimestamp(),
  });
}

export async function rejectClubInviteService(membershipId: string): Promise<void> {
  await deleteDoc(doc(db, "clubMembers", membershipId));
}

export async function getIncomingClubInvitesService(userId: string): Promise<ClubInvite[]> {
  // 1. Lekérjük azokat a tagságokat, amik PENDING állapotúak az adott usernek
  const q = query(
    collection(db, "clubMembers"),
    where("userId", "==", userId),
    where("status", "==", ClubMemberStatus.PENDING)
  );

  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return [];

  const memberDocs = querySnapshot.docs.map(d => ({ 
    id: d.id, 
    ...d.data() 
  } as ClubMemberDoc & { id: string }));

  const inviterIds = Array.from(new Set(memberDocs.map(m => m.invitedById)));
  const clubIds = Array.from(new Set(memberDocs.map(m => m.clubId)));

  const usersMap = await fetchUsers(inviterIds);

  const clubSnaps = await Promise.all(
    clubIds.map((clubId) => getDoc(doc(db, "clubs", clubId))),
  );
  const clubNameById: Record<string, string> = {};
  for (const snap of clubSnaps) {
    if (snap.exists()) {
      clubNameById[snap.id] = (snap.data() as ClubDoc).name;
    }
  }

  return memberDocs.map((m) => ({
    id: m.id,
    clubId: m.clubId,
    clubName: clubNameById[m.clubId] ?? "Club",
    from: usersMap.get(m.invitedById) as User,
    createdAt: m.invitedAt,
  }));
}

export async function leaveClubService(
  clubId: string,
  userId: string
): Promise<void> {
  const q = query(
    collection(db, "clubMembers"),
    where("clubId", "==", clubId),
    where("userId", "==", userId)
  );
  const snap = await getDocs(q);

  if (snap.empty) throw new Error("You are not a member of the club.");
  
  const memberDoc = snap.docs[0];
  const memberData = memberDoc.data() as ClubMemberDoc;

  // 1. Leader nem léphet ki (át kell adnia a klubot vagy törölnie kell)
  if (memberData.role === ClubRole.LEADER) {
    throw new Error("You cannot leave as a leader. You need to transfer the leadership or delete the club.");
  }

  await deleteDoc(memberDoc.ref);
}

export async function promoteClubMemberService(
  membershipId: string, 
  currentUserId: string
): Promise<void> {
  // 1. Lekérjük a célszemély tagsági adatait, hogy tudjuk, melyik klubról van szó
  const targetMemberRef = doc(db, "clubMembers", membershipId);
  const targetMemberSnap = await getDoc(targetMemberRef);

  if (!targetMemberSnap.exists()) {
    throw new Error("The target user is not a member of the club.");
  }

  const { clubId } = targetMemberSnap.data() as ClubMemberDoc;

  // 2. Ellenőrizzük, hogy a JELENLEGI user LEADER-e a klubnak
  // Olyan dokumentumot keresünk a clubMembers-ben, ahol a clubId egyezik, 
  // a userId a miénk, és a role LEADER
  const leaderQuery = query(
    collection(db, "clubMembers"),
    where("clubId", "==", clubId),
    where("userId", "==", currentUserId),
    where("role", "==", ClubRole.LEADER)
  );

  const leaderSnap = await getDocs(leaderQuery);

  if (leaderSnap.empty) {
    throw new Error("You don't have permission to promote members (only Leaders can do this).");
  }

  // 3. Ha minden oké, jöhet a promote
  await updateDoc(targetMemberRef, {
    role: ClubRole.CAPTAIN,
    updatedAt: serverTimestamp(), // Érdemes ezt is frissíteni
  });
}

export async function demoteClubMemberService(
  membershipId: string, 
  currentUserId: string
): Promise<void> {
  // 1. Célszemély lekérése a klub azonosításához
  const targetMemberRef = doc(db, "clubMembers", membershipId);
  const targetMemberSnap = await getDoc(targetMemberRef);

  if (!targetMemberSnap.exists()) {
    throw new Error("The target user is not a member of the club.");
  }

  const { clubId, role: targetRole } = targetMemberSnap.data() as ClubMemberDoc;

  // 2. Extra biztonság: Ne lehessen a Leader-t demotolni (vagy saját magát, ha ő az egyetlen leader)
  if (targetRole === ClubRole.LEADER) {
    throw new Error("The Leader role cannot be demoted using this method.");
  }

  // 3. Jogosultság ellenőrzése (Csak Leader demotolhat)
  const leaderQuery = query(
    collection(db, "clubMembers"),
    where("clubId", "==", clubId),
    where("userId", "==", currentUserId),
    where("role", "==", ClubRole.LEADER)
  );

  const leaderSnap = await getDocs(leaderQuery);

  if (leaderSnap.empty) {
    throw new Error("You don't have permission to demote members (only Leaders can do this).");
  }

  // 4. Visszafokozás MEMBER rangra
  await updateDoc(targetMemberRef, {
    role: ClubRole.MEMBER,
    updatedAt: serverTimestamp(),
  });
}

export async function cancelInviteService(
  membershipId: string,
  currentUserId: string
): Promise<void> {
  // 1. Lekérjük a kérdéses tagsági/meghívó adatot
  const memberRef = doc(db, "clubMembers", membershipId);
  const memberSnap = await getDoc(memberRef);

  if (!memberSnap.exists()) {
    throw new Error("The invite is not found.");
  }

  const memberData = memberSnap.data() as ClubMemberDoc;

  // Csak PENDING (vagy GUEST) állapotú meghívót lehessen visszavonni
  if (memberData.status !== ClubMemberStatus.PENDING && memberData.role !== ClubRole.GUEST) {
    throw new Error("Only pending invites or guests can be cancelled.");
  }

  // 2. JOGOSULTSÁG ELLENŐRZÉSE
  
  // A - Ő maga hívta meg?
  const isInviter = memberData.invitedById === currentUserId;

  if (isInviter) {
    // Ha ő hívta meg, törölhetjük
    await deleteDoc(memberRef);
    return;
  }

  // B - Ha nem ő hívta meg, ellenőrizzük a rangját a klubban
  const currentUserRoleQuery = query(
    collection(db, "clubMembers"),
    where("clubId", "==", memberData.clubId),
    where("userId", "==", currentUserId)
  );

  const roleSnap = await getDocs(currentUserRoleQuery);
  
  if (roleSnap.empty) {
    throw new Error("You are not a member of this club.");
  }

  const currentUserData = roleSnap.docs[0].data() as ClubMemberDoc;
  const hasAuthority = 
    currentUserData.role === ClubRole.LEADER || 
    currentUserData.role === ClubRole.CAPTAIN;

  if (!hasAuthority) {
    throw new Error("You don't have permission to cancel this invite.");
  }

  // 3. Törlés
  await deleteDoc(memberRef);
}

export async function addClubMemberService(
  clubId: string,
  invitedById: string,
  target: { userId?: string; guestName?: string; role: ClubRole },
): Promise<void> {
  const guestName = target.guestName?.trim();
  if (guestName) {
    await addClubGuestService(clubId, invitedById, guestName);
    return;
  }

  if (!target.userId) {
    throw new Error("User ID is required");
  }

  const memberId = `${clubId}_${target.userId}`;
  const memberRef = doc(db, "clubMembers", memberId);

  const existing = await getDoc(memberRef);
  if (existing.exists()) {
    throw new Error("User already in club");
  }

  const invitedUser = await fetchUser(target.userId);

  const newMember: ClubMemberDoc = {
    clubId,
    user: invitedUser,
    userId: target.userId,
    guestName: null,
    joinCode: null,
    role: target.role,
    status: ClubMemberStatus.PENDING,
    invitedById,
    invitedAt: serverTimestamp() as Timestamp,
    acceptedAt: null,
  };

  await setDoc(memberRef, newMember);
}

export async function addClubGuestService(
  clubId: string,
  invitedById: string,
  guestName: string
): Promise<string> { // Visszaadjuk a kódot, hogy kiírhassuk a UI-on
  const trimmedName = guestName.trim();
  if (!trimmedName) {
    throw new Error("Guest name is required");
  }

  const memberRef = doc(collection(db, "clubMembers"));
  
  // Generálunk egy egyedi kódot (pl: G-X89K2)
  const initial = trimmedName[0]?.toUpperCase() ?? "G";
  const registrationId = `${initial}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  const newGuest: ClubMemberDoc = {
    clubId,
    userId: null,
    guestName: trimmedName,
    joinCode: registrationId, // Ez a regisztrációs ID
    role: ClubRole.GUEST,
    status: ClubMemberStatus.ACCEPTED,
    invitedById,
    invitedAt: serverTimestamp() as Timestamp,
    acceptedAt: serverTimestamp() as Timestamp,
  };

  await setDoc(memberRef, newGuest);
  return registrationId;
}

export async function removeClubMemberService(
  membershipId: string,
  currentUserId: string
): Promise<void> {
  const memberRef = doc(db, "clubMembers", membershipId);
  const memberSnap = await getDoc(memberRef);

  if (!memberSnap.exists()) throw new Error("The member is not found.");
  const memberData = memberSnap.data() as ClubMemberDoc;

  // 1. Leadert nem lehet kirúgni
  if (memberData.role === ClubRole.LEADER) {
    throw new Error("The leader cannot be removed.");
  }

  // 2. Jogosultság ellenőrzése (Leader vagy Captain)
  const currentUserRoleQuery = query(
    collection(db, "clubMembers"),
    where("clubId", "==", memberData.clubId),
    where("userId", "==", currentUserId)
  );
  const roleSnap = await getDocs(currentUserRoleQuery);
  
  if (roleSnap.empty) throw new Error("You are not a member of the club.");
  
  const currentUserData = roleSnap.docs[0].data() as ClubMemberDoc;
  const canRemove = 
    currentUserData.role === ClubRole.LEADER || 
    (currentUserData.role === ClubRole.CAPTAIN && (memberData.role === ClubRole.MEMBER || memberData.role === ClubRole.GUEST)) ||
    (currentUserData.role === ClubRole.MEMBER && memberData.role === ClubRole.GUEST);

  if (!canRemove) {
    throw new Error("You don't have permission to remove the member.");
  }

  await deleteDoc(memberRef);
}

export async function createSquadService(
  clubId: string,
  createdBy: User,
  data: { name: string; color: string; icon: string; members?: ClubMember[] }
) {
  const batch = writeBatch(db);
  
  // 1. Squad dokumentum létrehozása
  const squadRef = doc(collection(db, "squads"));
  const squadId = squadRef.id;
  
  batch.set(squadRef, {
    clubId,
    name: data.name,
    color: data.color,
    icon: data.icon,
    createdBy,
    createdById: createdBy.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // 2. Tagok hozzáadása (ha vannak) - Max 5 fő limitet a UI-on is kezeljük!
  if (data.members && data.members.length > 0) {
    const limitedMembers = data.members.slice(0, 5);
    limitedMembers.forEach((member) => {
      const smRef = doc(collection(db, "squadMembers"));
      batch.set(smRef, {
        squadId,
        clubId,
        member: member,
        membershipId: member.id,
        addedById: createdBy.id,
        addedAt: serverTimestamp(),
      });
    });
  }

  await batch.commit();
  return squadId;
}

export async function updateSquadService(
  squadId: string,
  clubId: string,
  currentUserId: string,
  data: Partial<Pick<SquadDoc, "name" | "color" | "icon">>,
): Promise<void> {
  await assertCanManageSquads(clubId, currentUserId);

  const squadRef = doc(db, "squads", squadId);
  const squadSnap = await getDoc(squadRef);

  if (!squadSnap.exists()) {
    throw new Error("Squad not found.");
  }

  const squadData = squadSnap.data() as SquadDoc;
  if (squadData.clubId !== clubId) {
    throw new Error("Squad does not belong to this club.");
  }

  const updates: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };

  if (data.name !== undefined) {
    const trimmedName = data.name.trim();
    if (!trimmedName) {
      throw new Error("Squad name is required.");
    }
    updates.name = trimmedName;
  }
  if (data.color !== undefined) updates.color = data.color;
  if (data.icon !== undefined) updates.icon = data.icon;

  await updateDoc(squadRef, updates);
}

export async function deleteSquadService(
  squadId: string,
  clubId: string,
  currentUserId: string,
): Promise<void> {
  await assertCanManageSquads(clubId, currentUserId);

  const squadRef = doc(db, "squads", squadId);
  const squadSnap = await getDoc(squadRef);

  if (!squadSnap.exists()) {
    throw new Error("Squad not found.");
  }

  const squadData = squadSnap.data() as SquadDoc;
  if (squadData.clubId !== clubId) {
    throw new Error("Squad does not belong to this club.");
  }

  const membersSnap = await getDocs(
    query(
      squadMembersRef(),
      where("squadId", "==", squadId),
      where("clubId", "==", clubId),
    ),
  );

  const batch = writeBatch(db);
  membersSnap.docs.forEach((memberDoc) => batch.delete(memberDoc.ref));
  batch.delete(squadRef);
  await batch.commit();
}

export async function removeSquadMemberService(
  squadMemberId: string,
  currentUserId: string,
): Promise<void> {
  const squadMemberRef = doc(db, "squadMembers", squadMemberId);
  const squadMemberSnap = await getDoc(squadMemberRef);

  if (!squadMemberSnap.exists()) {
    throw new Error("Squad member not found.");
  }

  const { clubId } = squadMemberSnap.data() as SquadMemberDoc;
  await assertCanManageSquads(clubId, currentUserId);
  await deleteDoc(squadMemberRef);
}
