import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createClub,
  getClub,
  getClubsForUser,
  updateClub,
  deleteClub,
} from "../services/club-service";
import type { ClubDoc } from "../types/club-types";
import type { User } from "../types/user-types";

export const useClub = (clubId: string) => {
  const queryClient = useQueryClient();

  const getClubQuery = useQuery({
    queryKey: ["get-club", clubId],
    queryFn: () => getClub(clubId),
    enabled: !!clubId,
  });

  const updateClubMutation = useMutation({
    mutationFn: (data: Partial<Pick<ClubDoc, "name" | "description">>) =>
      updateClub(clubId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-club", clubId] });
      queryClient.invalidateQueries({ queryKey: ["get-clubs"] });
      toast.success("Club updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteClubMutation = useMutation({
    mutationFn: () => deleteClub(clubId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-clubs"] });
      toast.success("Club deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    club: getClubQuery.data ?? null,
    isGetClubLoading: getClubQuery.isLoading,
    isGetClubError: getClubQuery.isError,
    isGetClubSuccess: getClubQuery.isSuccess,

    updateClub: updateClubMutation.mutate,
    isUpdateClubPending: updateClubMutation.isPending,

    deleteClub: deleteClubMutation.mutate,
    isDeleteClubPending: deleteClubMutation.isPending,
  };
};

export const useClubs = (currentUser: User | null | undefined) => {
  const queryClient = useQueryClient();
  const userId = currentUser?.id ?? "";

  const getClubsQuery = useQuery({
    queryKey: ["get-clubs", userId],
    queryFn: () => getClubsForUser(userId),
    enabled: !!userId,
  });

  const createClubMutation = useMutation({
    mutationFn: ({
      data,
      invitees = [],
    }: {
      data: Pick<ClubDoc, "name" | "description">;
      invitees?: User[];
    }) => {
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      return createClub(currentUser, data, invitees);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-clubs"] });
      toast.success("Club created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    clubs: getClubsQuery.data ?? [],
    isGetClubsLoading: getClubsQuery.isLoading,
    isGetClubsError: getClubsQuery.isError,
    isGetClubsSuccess: getClubsQuery.isSuccess,

    createClub: createClubMutation.mutate,
    isCreateClubPending: createClubMutation.isPending,
  };
};