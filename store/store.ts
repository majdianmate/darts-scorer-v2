import { Store } from "@tanstack/react-store";
import { useSelector } from "@tanstack/react-store";

type DialogName = "memberManager" | "editClub" | "createSquad" | "editSquad" | "matchConfig";

interface DialogsState {
  dialogs: Record<DialogName, boolean>;
  targetClubId: string | null;
  targetSquadId: string | null;
}

export const dialogStore = new Store<DialogsState>({
  dialogs: {
    memberManager: false,
    editClub: false,
    createSquad: false,
    editSquad: false,
    matchConfig: false,
  },
  targetClubId: null,
  targetSquadId: null,
});

export const setDialog = (name: DialogName, open: boolean) => {
  dialogStore.setState((prev) => ({
    ...prev,
    dialogs: {
      ...prev.dialogs,
      [name]: open,
    },
  }));
};

export const setTargetClubId = (clubId: string) => {
  dialogStore.setState((prev) => ({
    ...prev,
    targetClubId: clubId,
  }));
};

export const setTargetSquadId = (squadId: string | null) => {
  dialogStore.setState((prev) => ({
    ...prev,
    targetSquadId: squadId,
  }));
};