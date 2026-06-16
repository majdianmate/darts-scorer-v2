import type { StateCreator } from 'zustand'
import type { StoreProps } from './store'

export interface UiProps {
  sidebarOpen: boolean;
}
export interface UiActions {
  setSidebarOpen: (sidebarOpen: boolean) => void;
}
export type UiSlice = UiProps & UiActions

export const createUiSlice: StateCreator<
  StoreProps,
  [],
  [],
  UiSlice
> = (set, get) => ({
    sidebarOpen: false,
    setSidebarOpen: (sidebarOpen: boolean) => set({ sidebarOpen }),
})
