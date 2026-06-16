import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useStore } from "../../../../store/store";
import { acceptFriendRequestService, addFriendsService, blockFriendService, getBlockedFriendsService, getFriendRequestsService, getFriendsService, getSentFriendRequestsService, rejectFriendRequestService, unblockFriendService } from "../service/friend-service";
import { toast } from "sonner";


export const useFriend = () => {
    const queryClient = useQueryClient();

    const user = useStore((state) => state.user);
    
    const friends = useStore((state) => state.friends);
    const setFriends = useStore((state) => state.setFriends);
    const pendingFriendRequests = useStore((state) => state.pendingFriendRequests);
    const setPendingFriendRequests = useStore((state) => state.setPendingFriendRequests);
    const sentFriendRequests = useStore((state) => state.sentFriendRequests);
    const setSentFriendRequests = useStore((state) => state.setSentFriendRequests);
    const blockedFriends = useStore((state) => state.blockedFriends);
    const setBlockedFriends = useStore((state) => state.setBlockedFriends);

    const getFriends = useQuery({
        queryKey: ['get-friends', user?.id],
        queryFn: () => getFriendsService(user?.id!),
        enabled: !!user?.id,
        select(data) {
            setFriends(data);
            return data;
        },
    });

    const getFriendRequests = useQuery({
        queryKey: ['get-friend-requests', user?.id],
        queryFn: () => getFriendRequestsService(user?.id!),
        enabled: !!user?.id,
        select(data) {
            setPendingFriendRequests(data);
            return data;
        },
    });

    const getSentFriendRequests = useQuery({
        queryKey: ['get-sent-friend-requests', user?.id],
        queryFn: () => getSentFriendRequestsService(user?.id!),
        enabled: !!user?.id,
        select(data) {
            setSentFriendRequests(data);
            return data;
        },
    });

    const getBlockedFriends = useQuery({
        queryKey: ['get-blocked-friends', user?.id],
        queryFn: () => getBlockedFriendsService(user?.id!),
        enabled: !!user?.id,
        select(data) {
            setBlockedFriends(data);
            return data;
        },
    });

    const addFriends = useMutation({
        mutationKey: ['add-friends'],
        mutationFn: (userIds: string[]) => {
            if (!user?.id) throw new Error('User not found');
            return addFriendsService(userIds, user?.id);
        },
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['get-friends', user?.id] }),
                queryClient.invalidateQueries({ queryKey: ['get-friend-requests', user?.id] }),
                queryClient.invalidateQueries({ queryKey: ['get-sent-friend-requests', user?.id] }),
                queryClient.invalidateQueries({ queryKey: ['get-blocked-friends', user?.id] })
            ]);
    
            toast.success('Friends added successfully');
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const acceptFriendRequest = useMutation({
        mutationKey: ['accept-friend-request'],
        mutationFn: (friendshipId: string) => {
            if (!user?.id) throw new Error('User not found');
            return acceptFriendRequestService(friendshipId, user?.id);
        },
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['get-friend-requests', user?.id] }),
                queryClient.invalidateQueries({ queryKey: ['get-friends', user?.id] }),
                queryClient.invalidateQueries({ queryKey: ['get-sent-friend-requests', user?.id] }),
                queryClient.invalidateQueries({ queryKey: ['get-blocked-friends', user?.id] })
            ]);

            toast.success('Friend request accepted successfully');
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const rejectFriendRequest = useMutation({
        mutationKey: ['reject-friend-request'],
        mutationFn: (friendshipId: string) => {
            if (!user?.id) throw new Error('User not found');
            return rejectFriendRequestService(friendshipId, user?.id);
        },
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['get-friend-requests', user?.id] }),
                queryClient.invalidateQueries({ queryKey: ['get-friends', user?.id] }),
                queryClient.invalidateQueries({ queryKey: ['get-sent-friend-requests', user?.id] }),
                queryClient.invalidateQueries({ queryKey: ['get-blocked-friends', user?.id] })
            ]);

            toast.success('Friend request rejected successfully');
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const blockFriend = useMutation({
        mutationKey: ['block-friend'],
        mutationFn: (friendshipId: string) => {
            if (!user?.id) throw new Error('User not found');
            return blockFriendService(friendshipId, user?.id);
        },
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['get-friend-requests', user?.id] }),
                queryClient.invalidateQueries({ queryKey: ['get-friends', user?.id] }),
                queryClient.invalidateQueries({ queryKey: ['get-sent-friend-requests', user?.id] }),
                queryClient.invalidateQueries({ queryKey: ['get-blocked-friends', user?.id] })
            ]);
        },
        onError: (error) => {
            toast.error(error.message)
        }
    });

    const unblockFriend = useMutation({
        mutationKey: ['unblock-friend'],
        mutationFn: (friendshipId: string) => {
            if (!user?.id) throw new Error('User not found');
            return unblockFriendService(friendshipId, user?.id);
        },
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['get-friend-requests', user?.id] }),
                queryClient.invalidateQueries({ queryKey: ['get-friends', user?.id] }),
                queryClient.invalidateQueries({ queryKey: ['get-sent-friend-requests', user?.id] }),
                queryClient.invalidateQueries({ queryKey: ['get-blocked-friends', user?.id] })
            ]);
        },
        onError: (error) => {
            toast.error(error.message)
        }
    });

    return {
        addFriends: addFriends.mutateAsync,
        acceptFriendRequest: acceptFriendRequest.mutateAsync,
        rejectFriendRequest: rejectFriendRequest.mutateAsync,
        blockFriend: blockFriend.mutateAsync,
        unblockFriend: unblockFriend.mutateAsync,
    }
}