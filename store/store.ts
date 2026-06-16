// store/index.ts
import { createAuthenticationSlice, type AuthenticationSlice } from "#/features/authentication/store/authentication-store";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createUiSlice, type UiSlice } from "./ui-store";
import { createFriendSlice, type FriendSlice } from "#/features/friends/store/friend-store";

export type StoreProps = AuthenticationSlice & UiSlice & FriendSlice;

// ─── Store ────────────────────────────────────────────────────
export const useStore = create<StoreProps>()(
  devtools(
    (...a) => ({
      ...createAuthenticationSlice(...a),
      ...createUiSlice(...a),
      ...createFriendSlice(...a),
    }),
    { name: "AppStore" }
  )
);