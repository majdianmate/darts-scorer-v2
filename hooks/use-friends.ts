import { useState } from "react";
import {
    createFriendshipsServices,
    deleteFriendshipService,
    getFriendsService,
  } from "../services/friends-service";
  import { type FriendshipDoc } from "../types/friends-types";
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
  
    return {
      friends: getFriends.data ?? [],
      isGetFriendsLoading: getFriends.isLoading,
      isGetFriendsError: getFriends.isError,
      isGetFriendsSuccess: getFriends.isSuccess,
  
      addFriends: addFriends.mutate,
  
      deleteFriend: deleteFriendMutation.mutate,
      deletingFriendshipId: deletingFriendshipId,
    };
  };