import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createClub,
  getClub,
  getClubsForUser,
  updateClub,
  deleteClub,
  rejectClubInviteService,
  acceptClubInviteService,
  getIncomingClubInvitesService,
  leaveClubService,
  promoteClubMemberService,
  demoteClubMemberService,
  cancelInviteService,
  addClubMemberService,
  addClubGuestService,
  removeClubMemberService,
} from "../services/club-service";
import type { ClubDoc, ClubRole } from "../types/club-types";
import type { User } from "../types/user-types";

export const useClub = (clubId: string, userId?: string) => {
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

  const promoteClubMember = useMutation({
    mutationFn: ({ membershipId }: { membershipId: string; }) =>
      promoteClubMemberService(membershipId, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-club", clubId] });
      queryClient.invalidateQueries({ queryKey: ["get-clubs", userId] });
      toast.success("Member promoted.");
    },
  });
  
  const demoteClubMember = useMutation({
    mutationFn: ({ membershipId }: { membershipId: string }) =>
      demoteClubMemberService(membershipId, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-club", clubId] });
      queryClient.invalidateQueries({ queryKey: ["get-clubs", userId] });
      toast.success("Member demoted.");
    },
  });
  
  const cancelInvite = useMutation({
    mutationFn: ({ membershipId }: { membershipId: string }) =>
      cancelInviteService(membershipId, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-club", clubId] });
      queryClient.invalidateQueries({ queryKey: ["get-clubs", userId] });
      toast.success("Invitation cancelled.");
    },
  });

  const addMember = useMutation({
    mutationFn: (target: {
      userId?: string;
      guestName?: string;
      role: ClubRole;
    }) => addClubMemberService(clubId!, userId!, target),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-club", clubId] });
      queryClient.invalidateQueries({ queryKey: ["get-clubs", userId] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const addGuest = useMutation({
    mutationFn: (guestName: string) =>
      addClubGuestService(clubId!, userId!, guestName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-club", clubId] });
      queryClient.invalidateQueries({ queryKey: ["get-clubs", userId] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const removeMember = useMutation({
    mutationFn: (membershipId: string) => removeClubMemberService(membershipId, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-club", clubId] });
      queryClient.invalidateQueries({ queryKey: ["get-clubs", userId] });
      toast.success("Member removed.");
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

    promoteClubMember: promoteClubMember.mutate,
    isPromoteClubMemberPending: promoteClubMember.isPending,

    demoteClubMember: demoteClubMember.mutate,
    isDemoteClubMemberPending: demoteClubMember.isPending,

    cancelInvite: cancelInvite.mutate,
    isCancelInvitePending: cancelInvite.isPending,

    addMember: addMember.mutate,
    addMemberAsync: addMember.mutateAsync,
    isAddMemberPending: addMember.isPending || addGuest.isPending,

    addGuest: addGuest.mutate,
    addGuestAsync: addGuest.mutateAsync,

    removeMember: removeMember.mutate,
    removeMemberAsync: removeMember.mutateAsync,
    isRemoveMemberPending: removeMember.isPending,
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

  const getIncomingClubInvites = useQuery({
    queryKey: ["incomingClubInvites", userId],
    queryFn: () => getIncomingClubInvitesService(userId!),
    enabled: !!userId,
  });

  const acceptClubInvite = useMutation({
    mutationFn: (membershipId: string) => acceptClubInviteService(membershipId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["incomingClubInvites", userId],
      });
      queryClient.invalidateQueries({ queryKey: ["get-clubs", userId] });
      queryClient.invalidateQueries({ queryKey: ["get-club"] });
      toast.success("You joined the club.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not accept the invitation.");
    },
  });

  const rejectClubInvite = useMutation({
    mutationFn: (membershipId: string) => rejectClubInviteService(membershipId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["incomingClubInvites", userId],
      });
      toast.success("Invitation declined.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not decline the invitation.");
    },
  });

  const leaveClub = useMutation({
    mutationFn: ({ clubId }: { clubId: string }) =>
      leaveClubService(clubId, userId!),
    onSuccess: (_, { clubId }) => {
      queryClient.invalidateQueries({ queryKey: ["get-club", clubId] });
      queryClient.invalidateQueries({ queryKey: ["get-clubs", userId] });
      toast.success("You left the club.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not leave the club.");
    },
  });
  
  return {
    clubs: getClubsQuery.data ?? [],
    isGetClubsLoading: getClubsQuery.isLoading,
    isGetClubsError: getClubsQuery.isError,
    isGetClubsSuccess: getClubsQuery.isSuccess,

    incomingClubInvites: getIncomingClubInvites.data,
    isGettingIncomingClubInvites: getIncomingClubInvites.isLoading,

    acceptClubInvite: acceptClubInvite.mutate,
    isAcceptClubInvitePending: acceptClubInvite.isPending,

    rejectClubInvite: rejectClubInvite.mutate,
    isRejectClubInvitePending: rejectClubInvite.isPending,

    createClub: createClubMutation.mutate,
    isCreateClubPending: createClubMutation.isPending,

    leaveClub: leaveClub.mutate,
    isLeaveClubPending: leaveClub.isPending,
  };
};