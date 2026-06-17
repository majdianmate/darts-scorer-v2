// store/index.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createUiSlice, type UiSlice } from "./ui-store";

export type StoreProps = UiSlice;

// ─── Store ────────────────────────────────────────────────────
export const useStore = create<StoreProps>()(
  devtools(
    (...a) => ({
      ...createUiSlice(...a),
    }),
    { name: "AppStore" }
  )
);