import { useState } from "react";
import {
  acceptFriendRequestService,
    createFriendshipsServices,
    deleteFriendshipService,
    getFriendsService,
    getIncomingFriendRequestsService,
    rejectFriendRequestService,
  } from "../services/friend-service";
  import { type FriendshipDoc } from "../types/friend-types";
  import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
  import { toast } from "sonner";
  
  export const useFriends = (userId: string) => {
    const queryClient = useQueryClient();
    const [deletingFriendshipId, setDeletingFriendshipId] = useState<string | null>(null);
  
    const getFriends = useQuery({
      queryKey: ["get-friends", userId],
      queryFn: () => getFriendsService(userId),
      enabled: !!userId,
    });

    const addFriends = useMutation({
        mutationFn: (friendships: FriendshipDoc[]) =>
            createFriendshipsServices(friendships),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["get-friends"] });
          queryClient.invalidateQueries({ queryKey: ["get-pending-requests"] });
          queryClient.invalidateQueries({ queryKey: ["get-blocked-friends"] });

          toast.success("Friends added successfully!");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
  
      const deleteFriendMutation = useMutation({
        mutationFn: (friendshipId: string) => {
          if (!friendshipId) {
            throw new Error('Friendship ID is missing')
          }
          setDeletingFriendshipId(friendshipId)
          return deleteFriendshipService(friendshipId)
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["get-friends"] });
        },
        onError: (error) => {
          toast.error(error.message);
        },
        onSettled: () => {
          setDeletingFriendshipId(null);
        },
      });

      const getPendingRequests = useQuery({
        queryKey: ["get-pending-requests", userId],
        queryFn: () => getIncomingFriendRequestsService(userId),
        enabled: !!userId,
      });

      const acceptFriendRequest = useMutation({
        mutationFn: (friendshipId: string) =>
          acceptFriendRequestService(friendshipId),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["get-pending-requests"] });
          queryClient.invalidateQueries({ queryKey: ["get-friends"] });
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
    
      const rejectFriendRequest = useMutation({
        mutationFn: (friendshipId: string) =>
          rejectFriendRequestService(friendshipId),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["get-pending-requests"] });
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
    
  
    return {
      friends: getFriends.data ?? [],
      isGetFriendsLoading: getFriends.isLoading,
      isGetFriendsError: getFriends.isError,
      isGetFriendsSuccess: getFriends.isSuccess,

      pendingRequests: getPendingRequests.data ?? [],
      isGetPendingRequestsLoading: getPendingRequests.isLoading,
      isGetPendingRequestsError: getPendingRequests.isError,
      isGetPendingRequestsSuccess: getPendingRequests.isSuccess,
  
      addFriends: addFriends.mutate,
  
      deleteFriend: deleteFriendMutation.mutate,
      deletingFriendshipId: deletingFriendshipId,

      acceptFriendRequest: acceptFriendRequest.mutate,
      rejectFriendRequest: rejectFriendRequest.mutate,
    };
  };