import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ClubMember } from "../types/club-types";
import {
  MatchStatus,
  type CreateMatchInput,
  type Leg,
  type Match,
  type MatchConfig,
  type MatchDoc,
  type Score,
  type Team,
} from "../types/match-types";

const matchesRef = () => collection(db, "matches");

function collectParticipantUserIds(teams: Team[]): string[] {
  const ids = new Set<string>();

  for (const team of teams) {
    for (const member of team.members) {
      if (member.userId) {
        ids.add(member.userId);
      }
    }
  }

  return [...ids];
}

function serializeMember(member: ClubMember): ClubMember {
  return {
    id: member.id,
    clubId: member.clubId,
    userId: member.userId,
    guestName: member.guestName,
    joinCode: member.joinCode,
    role: member.role,
    status: member.status,
    invitedById: member.invitedById,
    invitedAt: member.invitedAt,
    acceptedAt: member.acceptedAt,
    user: member.user,
    invitedBy: member.invitedBy ?? null,
  };
}

function resolveCurrentPlayerId(team: Team): string {
  const firstMember = team.members[0];
  if (!firstMember) return "";

  const { currentPlayerId, members } = team;
  if (!currentPlayerId) return firstMember.id;

  const member = members.find(
    (m) => m.id === currentPlayerId || m.userId === currentPlayerId,
  );
  return member?.id ?? firstMember.id;
}

function serializeTeam(team: Team): Team {
  return {
    id: team.id,
    name: team.name.trim(),
    color: team.color,
    icon: team.icon,
    currentPlayerId: resolveCurrentPlayerId(team),
    createdAt: team.createdAt,
    updatedAt: team.updatedAt,
    isSquad: team.isSquad,
    members: team.members.map(serializeMember),
  };
}

function validateCreateMatchInput(input: CreateMatchInput): void {
  const { clubId, matchConfig, teams } = input;

  if (!clubId) {
    throw new Error("Club is required to start a match.");
  }

  if (teams.length < 2) {
    throw new Error("At least two teams are required to start a match.");
  }

  if (!matchConfig.startingTeamId) {
    throw new Error("Select which team starts the match.");
  }

  if (!teams.some((team) => team.id === matchConfig.startingTeamId)) {
    throw new Error("The starting team must be one of the match teams.");
  }

  if (matchConfig.startingScore <= 0) {
    throw new Error("Starting score must be greater than zero.");
  }

  if (matchConfig.numberOfLegs <= 0) {
    throw new Error("Number of legs must be at least one.");
  }

  for (const team of teams) {
    if (!team.name.trim()) {
      throw new Error("Every team must have a name.");
    }

    if (team.members.length === 0) {
      throw new Error(`Team "${team.name}" must have at least one player.`);
    }
  }
}

export async function createMatchService(input: CreateMatchInput): Promise<Match> {
  validateCreateMatchInput(input);

  const now = Timestamp.now();
  const teams = input.teams.map(serializeTeam);
  const matchConfig: MatchConfig = {
    ...input.matchConfig,
    startingTeamId: input.matchConfig.startingTeamId,
  };

  const participantUserIds = collectParticipantUserIds(teams);
  if (!participantUserIds.includes(input.createdById)) {
    participantUserIds.push(input.createdById);
  }

  const matchDoc: Omit<MatchDoc, "createdAt" | "updatedAt"> & {
    createdAt: ReturnType<typeof serverTimestamp>;
    updatedAt: ReturnType<typeof serverTimestamp>;
  } = {
    clubId: input.clubId,
    createdById: input.createdById,
    participantUserIds,
    matchConfig,
    teams,
    legs: [],
    endedAt: null,
    status: MatchStatus.InProgress,
    winnerTeamId: null,
    currentTeamId: matchConfig.startingTeamId,
    currentLeg: 1,
    currentRound: 1,
    currentLegRound: 1,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(matchesRef(), matchDoc);
  const createdSnap = await getDoc(docRef);

  if (!createdSnap.exists()) {
    throw new Error("Failed to create the match.");
  }

  const data = createdSnap.data() as MatchDoc;

  return {
    id: createdSnap.id,
    ...data,
    createdAt: data.createdAt ?? now,
    updatedAt: data.updatedAt ?? now,
  };
}

export async function getClubMatchesService(clubId: string): Promise<Match[]> {
  if (!clubId) {
    return [];
  }

  const matchesQuery = query(matchesRef(), where("clubId", "==", clubId));
  const snapshot = await getDocs(matchesQuery);

  const matches = snapshot.docs.map((matchDoc) => {
    const data = matchDoc.data() as MatchDoc;

    return {
      id: matchDoc.id,
      ...data,
    };
  });

  return matches.sort(
    (a, b) => (b.updatedAt?.toMillis?.() ?? 0) - (a.updatedAt?.toMillis?.() ?? 0),
  );
}

export async function getUserMatchesService(userId: string): Promise<Match[]> {
  if (!userId) {
    return [];
  }

  const matchesQuery = query(
    matchesRef(),
    where("participantUserIds", "array-contains", userId),
  );
  const snapshot = await getDocs(matchesQuery);

  const matches = snapshot.docs.map((matchDoc) => {
    const data = matchDoc.data() as MatchDoc;

    return {
      id: matchDoc.id,
      ...data,
    };
  });

  return matches.sort(
    (a, b) => (b.updatedAt?.toMillis?.() ?? 0) - (a.updatedAt?.toMillis?.() ?? 0),
  );
}

export async function getMatchService(matchId: string): Promise<Match> {
  const matchSnap = await getDoc(doc(db, "matches", matchId));

  if (!matchSnap.exists()) {
    throw new Error(`Match not found: ${matchId}`);
  }

  const data = matchSnap.data() as MatchDoc;

  return {
    id: matchSnap.id,
    ...data,
  };
}

function serializeScoreForFirestore(score: Score): Score {
  return {
    id: score.id,
    matchId: score.matchId,
    legId: score.legId,
    teamId: score.teamId,
    playerId: score.playerId,
    score: score.score,
    remainingScore: score.remainingScore,
    createdAt: score.createdAt,
    updatedAt: score.updatedAt,
    isCheckoutAttempt: score.isCheckoutAttempt,
    isCheckedOut: score.isCheckedOut,
    ...(score.dartsThrown !== undefined ? { dartsThrown: score.dartsThrown } : {}),
    ...(score.checkoutAttempts !== undefined
      ? { checkoutAttempts: score.checkoutAttempts }
      : {}),
    ...(score.first ? { first: score.first } : {}),
    ...(score.second ? { second: score.second } : {}),
    ...(score.third ? { third: score.third } : {}),
  };
}

function serializeLegsForFirestore(legs: Leg[]): Leg[] {
  return legs.map((leg) => ({
    id: leg.id,
    matchId: leg.matchId,
    createdAt: leg.createdAt,
    endedAt: leg.endedAt,
    winnerTeamId: leg.winnerTeamId,
    scores: leg.scores.map(serializeScoreForFirestore),
  }));
}

export interface AddScoreMatchUpdate {
  legs: Leg[];
  teams: Team[];
  currentTeamId: string;
  currentLegRound: number;
  currentRound: number;
  currentLeg?: number;
  winnerTeamId?: string | null;
  status?: MatchStatus;
  endedAt?: Match["endedAt"];
}

export async function addScoreToMatchService(
  matchId: string,
  update: AddScoreMatchUpdate,
): Promise<void> {
  const ref = doc(db, "matches", matchId);

  await updateDoc(ref, {
    legs: serializeLegsForFirestore(update.legs),
    teams: update.teams.map(serializeTeam),
    currentTeamId: update.currentTeamId,
    currentLegRound: update.currentLegRound,
    currentRound: update.currentRound,
    ...(update.currentLeg !== undefined ? { currentLeg: update.currentLeg } : {}),
    ...(update.winnerTeamId !== undefined
      ? { winnerTeamId: update.winnerTeamId }
      : {}),
    ...(update.status !== undefined ? { status: update.status } : {}),
    ...(update.endedAt !== undefined ? { endedAt: update.endedAt } : {}),
    updatedAt: serverTimestamp(),
  });
}

export function subscribeToMatchService(
  matchId: string,
  onMatch: (match: Match) => void,
  onError?: (error: Error) => void,
): () => void {
  return onSnapshot(
    doc(db, "matches", matchId),
    (snapshot) => {
      if (!snapshot.exists()) return;

      const data = snapshot.data() as MatchDoc;
      onMatch({ id: snapshot.id, ...data });
    },
    (error) => onError?.(error),
  );
}
