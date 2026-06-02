import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createMatchService,
  getClubMatchesService,
  getMatchService,
  getUserMatchesService,
  subscribeToMatchService,
} from "../services/match-service";
import type { CreateMatchInput, Match } from "../types/match-types";
import type { User } from "../types/user-types";
import { hydrateMatchFromServer } from "../store/match-store";
import { useEffect } from "react";

export const useClubMatches = (clubId: string) => {
  const getClubMatchesQuery = useQuery({
    queryKey: ["get-club-matches", clubId],
    queryFn: () => getClubMatchesService(clubId),
    enabled: !!clubId,
  });

  return {
    matches: getClubMatchesQuery.data ?? [],
    isGetClubMatchesLoading: getClubMatchesQuery.isLoading,
    isGetClubMatchesError: getClubMatchesQuery.isError,
    getClubMatchesError: getClubMatchesQuery.error,
  };
};

export const useUserMatches = (user: User | null | undefined) => {
  const userId = user?.id ?? "";

  const getUserMatchesQuery = useQuery({
    queryKey: ["get-user-matches", userId],
    queryFn: () => getUserMatchesService(userId),
    enabled: !!userId,
  });

  return {
    matches: getUserMatchesQuery.data ?? [],
    isGetUserMatchesLoading: getUserMatchesQuery.isLoading,
    isGetUserMatchesError: getUserMatchesQuery.isError,
    getUserMatchesError: getUserMatchesQuery.error,
  };
};

export const useMatch = (matchId: string) => {
  const getMatchQuery = useQuery({
    queryKey: ["get-match", matchId],
    queryFn: () => getMatchService(matchId),
    enabled: !!matchId,
  });

  return {
    match: getMatchQuery.data ?? null,
    isGetMatchLoading: getMatchQuery.isLoading,
    isGetMatchError: getMatchQuery.isError,
    getMatchError: getMatchQuery.error,
  };
};

export const useCreateMatch = () => {
  const queryClient = useQueryClient();

  const createMatchMutation = useMutation({
    mutationFn: (input: CreateMatchInput) => createMatchService(input),
    onSuccess: (match: Match) => {
      queryClient.setQueryData(["get-match", match.id], match);
      queryClient.invalidateQueries({ queryKey: ["get-user-matches"] });
      toast.success("Match started.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not start the match.");
    },
  });

  return {
    createMatch: createMatchMutation.mutate,
    createMatchAsync: createMatchMutation.mutateAsync,
    isCreateMatchPending: createMatchMutation.isPending,
  };
};

export const useMatchSubscription = (matchId: string, enabled: boolean) => {
  useEffect(() => {
    if (!enabled || !matchId) return;

    const unsubscribe = subscribeToMatchService(
      matchId,
      (match) => hydrateMatchFromServer(match),
      (error) => toast.error(error.message || "Failed to sync match."),
    );

    return unsubscribe;
  }, [matchId, enabled]);
};
