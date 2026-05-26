import {
    createFriendshipService,
    deleteFriendshipService,
    getFriendsService,
  } from "../services/friend-service";
  import { type FriendshipDoc } from "../types/friend-types";
  import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
  import { toast } from "sonner";
  
  export const useFriends = (userId: string) => {
    const queryClient = useQueryClient();
  
    const getFriends = useQuery({
      queryKey: ["get-friends", userId],
      queryFn: () => getFriendsService(userId),
      enabled: !!userId,
    });

    const addFriend = useMutation({
        mutationFn: (friendship: FriendshipDoc) =>
          createFriendshipService(friendship),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["get-friends"] });
          queryClient.invalidateQueries({ queryKey: ["get-pending-requests"] });
          queryClient.invalidateQueries({ queryKey: ["get-blocked-friends"] });
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
  
    const deleteFriend = useMutation({
      mutationFn: (friendshipId: string) => deleteFriendshipService(friendshipId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["get-friends"] });
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
  
      addFriend: addFriend.mutate,
  
      deleteFriend: deleteFriend.mutateAsync,
    };
  };