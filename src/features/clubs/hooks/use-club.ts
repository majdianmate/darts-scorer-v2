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
  createSquadService,
  updateSquadService,
  deleteSquadService,
  removeSquadMemberService,
} from "../service/club-service";
import type { ClubDoc, ClubMember, ClubRole } from "../types/club-types";
import type { User } from "#/features/authentication/types/user-types";
import { useAuthentication } from "#/features/authentication/hooks/use-authentication";

export const useClub = (clubId: string, userId?: string) => {
  const queryClient = useQueryClient();
  const { user: authUser } = useAuthentication();
  const currentUserId = userId ?? authUser?.id ?? "";

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
      promoteClubMemberService(membershipId, currentUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-club", clubId] });
      queryClient.invalidateQueries({ queryKey: ["get-clubs", currentUserId] });
      toast.success("Member promoted.");
    },
  });
  
  const demoteClubMember = useMutation({
    mutationFn: ({ membershipId }: { membershipId: string }) =>
      demoteClubMemberService(membershipId, currentUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-club", clubId] });
      queryClient.invalidateQueries({ queryKey: ["get-clubs", currentUserId] });
      toast.success("Member demoted.");
    },
  });
  
  const cancelInvite = useMutation({
    mutationFn: ({ membershipId }: { membershipId: string }) =>
      cancelInviteService(membershipId, currentUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-club", clubId] });
      queryClient.invalidateQueries({ queryKey: ["get-clubs", currentUserId] });
      toast.success("Invitation cancelled.");
    },
  });

  const addMember = useMutation({
    mutationFn: (target: {
      userId?: string;
      guestName?: string;
      role: ClubRole;
    }) => addClubMemberService(clubId, currentUserId, target),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-club", clubId] });
      queryClient.invalidateQueries({ queryKey: ["get-clubs", currentUserId] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const addGuest = useMutation({
    mutationFn: (guestName: string) =>
      addClubGuestService(clubId, currentUserId, guestName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-club", clubId] });
      queryClient.invalidateQueries({ queryKey: ["get-clubs", currentUserId] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const removeMember = useMutation({
    mutationFn: (membershipId: string) => removeClubMemberService(membershipId, currentUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-club", clubId] });
      queryClient.invalidateQueries({ queryKey: ["get-clubs", currentUserId] });
      toast.success("Member removed.");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const createSquad = useMutation({
    mutationFn: (data: {
      clubId: string;
      createdBy: User;
      data: { name: string; color: string; icon: string; members?: ClubMember[] };
    }) => createSquadService(data.clubId, data.createdBy, data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-club", clubId] });
      queryClient.invalidateQueries({ queryKey: ["get-clubs", currentUserId] });
      toast.success("Squad created.");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateSquad = useMutation({
    mutationFn: ({
      squadId,
      data,
    }: {
      squadId: string;
      data: Partial<{ name: string; color: string; icon: string }>;
    }) => updateSquadService(squadId, clubId, currentUserId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-club", clubId] });
      queryClient.invalidateQueries({ queryKey: ["get-clubs", currentUserId] });
      toast.success("Squad updated.");
    },
    onError: (error: Error) => {
      toast.error(error.message + "asd");
    },
  });

  const deleteSquad = useMutation({
    mutationFn: ({ squadId }: { squadId: string }) =>
      deleteSquadService(squadId, clubId, currentUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-club", clubId] });
      queryClient.invalidateQueries({ queryKey: ["get-clubs", currentUserId] });
      toast.success("Squad deleted.");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const removeSquadMember = useMutation({
    mutationFn: (squadMemberId: string) =>
      removeSquadMemberService(squadMemberId, currentUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-club", clubId] });
      queryClient.invalidateQueries({ queryKey: ["get-clubs", currentUserId] });
      toast.success("Player removed from squad.");
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

    createSquad: createSquad.mutate,
    createSquadAsync: createSquad.mutateAsync,
    isCreateSquadPending: createSquad.isPending,

    updateSquad: updateSquad.mutate,
    updateSquadAsync: updateSquad.mutateAsync,
    isUpdateSquadPending: updateSquad.isPending,

    deleteSquad: deleteSquad.mutate,
    isDeleteSquadPending: deleteSquad.isPending,

    removeSquadMember: removeSquadMember.mutate,
    isRemoveSquadMemberPending: removeSquadMember.isPending,
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