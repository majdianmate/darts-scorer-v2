import type { StateCreator } from 'zustand'
import type { StoreProps } from './store'

export type DialogType = 'initial-setup';

export interface UiProps {
  sidebarOpen: boolean;
  dialogs: Record<DialogType, boolean>;
}
export interface UiActions {
  setSidebarOpen: (sidebarOpen: boolean) => void;
  setDialogOpen: (dialogType: DialogType, open?: boolean) => void;
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
    dialogs: {
      'initial-setup': false,
    },
    setDialogOpen: (dialogType: DialogType, open?: boolean) => set({ dialogs: { ...get().dialogs, [dialogType]: open ?? !get().dialogs[dialogType] } }),
})
