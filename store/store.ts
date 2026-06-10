// store/index.ts
import { createAuthenticationSlice, type AuthenticationSlice } from "#/features/authentication/store/authentication-store";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type StoreProps = AuthenticationSlice;

// ─── Store ────────────────────────────────────────────────────
export const useStore = create<StoreProps>()(
  devtools(
    (...a) => ({
      ...createAuthenticationSlice(...a),
    }),
    { name: "AppStore" }
  )
);