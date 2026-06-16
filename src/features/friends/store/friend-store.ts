import type { StateCreator } from 'zustand'
import type { StoreProps } from '../../../../store/store'
import type { Friend, Friendship } from '../types/friend-types'

export interface FriendProps {
    friends: Friendship[];
    pendingFriendRequests: Friendship[];
    sentFriendRequests: Friendship[];
    blockedFriends: Friendship[];
}
export interface FriendActions {
  setFriends: (friends: Friendship[]) => void;
  setPendingFriendRequests: (pendingFriendRequests: Friendship[]) => void;
  setSentFriendRequests: (sentFriendRequests: Friendship[]) => void;
  setBlockedFriends: (blockedFriends: Friendship[]) => void;
}
export type FriendSlice = FriendProps & FriendActions

const initialState: FriendSlice = {
  friends: [],
  pendingFriendRequests: [],
  sentFriendRequests: [],
  blockedFriends: [],
  setFriends: () => {},
  setPendingFriendRequests: () => {},
  setSentFriendRequests: () => {},
  setBlockedFriends: () => {},
}

export const createFriendSlice: StateCreator<
  StoreProps,
  [],
  [],
  FriendSlice
> = (set, get) => ({
    ...initialState,
    setFriends: (friends: Friendship[]) => set({ friends }),
    setPendingFriendRequests: (pendingFriendRequests: Friendship[]) => set({ pendingFriendRequests }),
    setSentFriendRequests: (sentFriendRequests: Friendship[]) => set({ sentFriendRequests }),
    setBlockedFriends: (blockedFriends: Friendship[]) => set({ blockedFriends }),
})
