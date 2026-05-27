import { Store } from "@tanstack/react-store";
import { useSelector } from "@tanstack/react-store";

type DialogName = "memberManager" | "editClub";

interface DialogsState {
  dialogs: Record<DialogName, boolean>;
  targetClubId: string | null;
}

export const dialogStore = new Store<DialogsState>({
  dialogs: {
    memberManager: false,
    editClub: false,
  },
  targetClubId: null,
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