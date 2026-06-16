// store/index.ts
import { createAuthenticationSlice, type AuthenticationSlice } from "#/features/authentication/store/authentication-store";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createUiSlice, type UiSlice } from "./ui-store";

export type StoreProps = AuthenticationSlice & UiSlice;

// ─── Store ────────────────────────────────────────────────────
export const useStore = create<StoreProps>()(
  devtools(
    (...a) => ({
      ...createAuthenticationSlice(...a),
      ...createUiSlice(...a),
    }),
    { name: "AppStore" }
  )
);