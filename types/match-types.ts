import type { Timestamp } from "firebase/firestore";
import type { ClubMember } from "./club-types";

export enum GameMode {
    FirstTo = "First to",
    BestOf = "Best of",
}

export enum CheckoutMode {
    Single = "Single",
    Double = "Double",
    Master = "Master",
}

export enum DartMultiplier {
    Single = 1,
    Double = 2,
    Triple = 3,
}

export enum MatchStatus {
    Pending = "Pending",
    InProgress = "InProgress",
    Ended = "Ended",
}

export interface Dart{
    score: number;
    multiplier: DartMultiplier;
}

export interface MatchConfig {
    gameMode: GameMode;
    checkoutMode: CheckoutMode;
    startingScore: number;
    numberOfLegs: number;
    startingTeamId: string;

    displayScore: boolean;
    aiVoice: boolean;
}

export interface Team{
    id: string;
    name: string;
    color: string;
    icon: string;
    currentPlayerId: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    members: ClubMember[];
    isSquad: boolean;
}

export interface TeamLocal extends Team {
    statistics: TeamStatistics;
    scores: Score[];
    members: PlayerLocal[];
}

export interface PlayerLocal extends ClubMember {
    legAverage: number;
    gameAverage: number;
    statistics: PlayerStatistics;
}

export interface Statistic {
    legAverage: number;
    gameAverage: number;
    legAverages: number[];
    firstNineDartsAverage: number;
    bestCheckout: number;
    checkoutRate: number;
    sixtyPlus: number;
    hundredTwentyPlus: number;
    hundredEightyPlus: number;
}

export interface PlayerStatistics extends Statistic {}

export interface TeamStatistics extends Statistic {}

export const defaultTeamStatistics: TeamStatistics = {
    legAverage: 0,
    gameAverage: 0,
    legAverages: [],
    firstNineDartsAverage: 0,
    bestCheckout: 0,
    checkoutRate: 0,
    sixtyPlus: 0,
    hundredTwentyPlus: 0,
    hundredEightyPlus: 0,
};

export const defaultPlayerStatistics: PlayerStatistics = {
    legAverage: 0,
    gameAverage: 0,
    legAverages: [],
    firstNineDartsAverage: 0,
    bestCheckout: 0,
    checkoutRate: 0,
    sixtyPlus: 0,
    hundredTwentyPlus: 0,
    hundredEightyPlus: 0,
};

export interface Score {
    id: string;
    matchId: string;
    legId: string;
    teamId: string;
    playerId: string;
    score: number;
    remainingScore: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;


    isCheckoutAttempt: boolean;
    isCheckedOut: boolean;

    dartsThrown?: number;
    checkoutAttempts?: number;

    first?: Dart;
    second?: Dart;
    third?: Dart;
}

export interface Leg {
    id: string;
    matchId: string;
    createdAt: Timestamp;
    endedAt: Timestamp | null;
    scores: Score[];
    winnerTeamId: string | null;
}

export interface MatchDoc {
    clubId: string;
    createdById: string;
    participantUserIds: string[];
    matchConfig: MatchConfig;
    teams: Team[];
    legs: Leg[];
    createdAt: Timestamp;
    updatedAt: Timestamp;
    endedAt: Timestamp | null;
    status: MatchStatus;

    winnerTeamId: string | null;
    currentTeamId: string;
    currentLeg: number;
    currentRound: number;
    currentLegRound: number;
}

export interface Match extends MatchDoc {
    id: string;
}

export interface CreateMatchInput {
    clubId: string;
    matchConfig: MatchConfig;
    teams: Team[];
    createdById: string;
}
