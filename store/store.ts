// store/index.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createUiSlice, type UiSlice } from "./ui-store";

export type StoreProps = Record<string, never>;

// ─── Store ────────────────────────────────────────────────────
export const useStore = create<StoreProps>()(
  devtools(
    () => ({
    }),
    { name: "AppStore" }
  ), { name: "AppStore" })
);