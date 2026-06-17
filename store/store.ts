// store/index.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type StoreProps = Record<string, never>;

// ─── Store ────────────────────────────────────────────────────
export const useStore = create<StoreProps>()(
  devtools(
    () => ({
    }),
    { name: "AppStore" }
  )
);