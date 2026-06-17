import type { StateCreator } from 'zustand'
import type { StoreProps } from './store'

export type DialogType =
  | 'memberManager'
  | 'createSquad'
  | 'matchConfig'
  | 'editClub'
  | 'editSquad'
  | 'createClub'
  | 'clubInvites';

export interface UiProps {
  sidebarOpen: boolean;
  dialogs: Record<DialogType, boolean>;

  targetClubId: string | null;
  targetSquadId: string | null;
}
export interface UiActions {
  setSidebarOpen: (sidebarOpen: boolean) => void;
  setDialogOpen: (dialogType: DialogType, open?: boolean) => void;

  setTargetClubId: (targetClubId: string) => void;
  setTargetSquadId: (targetSquadId: string) => void;
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
      'memberManager': false,
      'createSquad': false,
      'matchConfig': false,
      'editClub': false,
      'editSquad': false,
      'createClub': false,
      'clubInvites': false,
    },
    targetClubId: null,
    targetSquadId: null,
    setDialogOpen: (dialogType: DialogType, open?: boolean) => set({ dialogs: { ...get().dialogs, [dialogType]: open ?? !get().dialogs[dialogType] } }),
    setTargetClubId: (targetClubId: string) => set({ targetClubId }),
    setTargetSquadId: (targetSquadId: string) => set({ targetSquadId }),
})
