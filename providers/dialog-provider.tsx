import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import { useStore } from '../store/store'
import type { DialogType } from '../store/ui-store'
import ClubEditor from '../src/features/clubs/components/ClubEditor/ClubEditor'
import CreateClubDialog from '../src/features/clubs/components/ClubCreator/CreateClubDialog'
import ClubInvites from '../src/features/clubs/components/ClubInvites/ClubInvites'
import MemberManagerDialog from '../src/features/clubs/components/MemberManager/MemberManagerDialog'
import SquadCreator from '../src/features/clubs/components/SquadSystem/SquadCreator/SquadCreator'
import SquadEditor from '../src/features/clubs/components/SquadSystem/SquadEditor/SquadEditor'

interface DialogContextValue {
  dialogs: Record<DialogType, boolean>
  openDialog: (dialogType: DialogType) => void
  closeDialog: (dialogType: DialogType) => void
  toggleDialog: (dialogType: DialogType) => void
  setDialogOpen: (dialogType: DialogType, open?: boolean) => void
}

const DialogContext = createContext<DialogContextValue | null>(null)

export function DialogProvider({ children }: { children: ReactNode }) {
  const dialogs = useStore((state) => state.dialogs)
  const setDialogOpen = useStore((state) => state.setDialogOpen)

  const value = useMemo<DialogContextValue>(
    () => ({
      dialogs,
      openDialog: (dialogType) => setDialogOpen(dialogType, true),
      closeDialog: (dialogType) => setDialogOpen(dialogType, false),
      toggleDialog: (dialogType) => setDialogOpen(dialogType),
      setDialogOpen,
    }),
    [dialogs, setDialogOpen],
  )

  return (
    <DialogContext.Provider value={value}>
      {children}
      <ClubInvites
        open={dialogs.clubInvites}
        onOpenChange={(open) => setDialogOpen('clubInvites', open)}
      />
      <CreateClubDialog />
      <MemberManagerDialog />
      <ClubEditor />
      <SquadCreator />
      <SquadEditor />
    </DialogContext.Provider>
  )
}

export function useDialog() {
  const context = useContext(DialogContext)

  if (!context) {
    throw new Error('useDialog must be used inside DialogProvider')
  }

  return context
}
