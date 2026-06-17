import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import { useStore } from '../store/store'
import type { DialogType } from '../store/ui-store'

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
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  )
}

export function useDialog() {
  const context = useContext(DialogContext)

  if (!context) {
    throw new Error('useDialog must be used inside DialogProvider')
  }

  return context
}
