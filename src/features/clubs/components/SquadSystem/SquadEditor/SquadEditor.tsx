import { useEffect, useMemo, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { Loader2, Save } from 'lucide-react'
import {
  useStore,
} from '../../../../../../store/store'
import { useClub } from '#/features/clubs/hooks/use-club'
import { DEFAULT_COLOR } from '#/components/ui/color-picker'
import { DEFAULT_SQUAD_ICON, type SquadIconKey } from '#/components/IconPicker'
import SquadCreatorBase from '../SquadCreator/SquadCreatorBase'

const SquadEditor = () => {
  const open = useStore((state) => state.dialogs['editSquad'])
  const targetClubId = useStore((state) => state.targetClubId)
  const targetSquadId = useStore((state) => state.targetSquadId)
  const setDialogOpen = useStore((state) => state.setDialogOpen)
  const { club, isGetClubLoading, updateSquad, isUpdateSquadPending } = useClub(targetClubId ?? '');

  const squad = useMemo(
    () => club?.squads.find((item) => item.id === targetSquadId) ?? null,
    [club?.squads, targetSquadId],
  )

  const [name, setName] = useState('')
  const [color, setColor] = useState<string>(DEFAULT_COLOR)
  const [icon, setIcon] = useState<SquadIconKey>(DEFAULT_SQUAD_ICON)

  useEffect(() => {
    if (!open || !squad) return

    setName(squad.name)
    setColor(squad.color)
    setIcon(squad.icon as SquadIconKey)
  }, [open, squad])

  const isDirty = useMemo(() => {
    if (!squad) return false

    return (
      name.trim() !== squad.name.trim() ||
      color !== squad.color ||
      icon !== squad.icon
    )
  }, [squad, name, color, icon])

  const handleOpenChange = (open: boolean) => {
    setDialogOpen('editSquad', open)

    if (!open) {
      if (squad) {
        setName(squad.name)
        setColor(squad.color)
        setIcon(squad.icon as SquadIconKey)
      }
    }
  }

  const handleSave = () => {
    const trimmedName = name.trim()
    if (!squad || !trimmedName || !isDirty) return

    updateSquad(
      {
        squadId: squad.id,
        data: {
          name: trimmedName,
          color,
          icon,
        },
      },
      {
        onSuccess: () => handleOpenChange(false),
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={(open) => setDialogOpen('editSquad', open)}>
      <DialogContent className="flex max-h-[min(90vh,calc(100vh-2rem))] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="shrink-0 border-b border-border px-6 py-4">
          <DialogTitle>Edit squad</DialogTitle>
          <DialogDescription>
            {squad
              ? `Update details for ${squad.name}.`
              : 'Update the squad name, color, and icon.'}
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          {isGetClubLoading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading squad…
            </div>
          ) : squad ? (
            <SquadCreatorBase
              name={name}
              color={color}
              icon={icon}
              onNameChange={setName}
              onColorChange={setColor}
              onIconChange={setIcon}
              disabled={isUpdateSquadPending}
            />
          ) : (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Squad not found.
            </p>
          )}
        </div>

        <DialogFooter className="shrink-0 gap-2 border-t border-border p-6">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isUpdateSquadPending}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            disabled={
              !squad ||
              !name.trim() ||
              !isDirty ||
              isUpdateSquadPending ||
              isGetClubLoading
            }
            onClick={handleSave}
          >
            {isUpdateSquadPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="size-4" />
                Save changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SquadEditor
