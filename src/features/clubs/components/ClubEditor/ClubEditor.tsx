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
import { useStore } from '../../../../../store/store'
import { useClub } from '#/features/clubs/hooks/use-club'
import ClubEditorForm from './ClubEditorForm'

const ClubEditor = () => {
  const open = useStore((state) => state.dialogs['editClub'])
  const targetClubId = useStore((state) => state.targetClubId)
  const setDialogOpen = useStore((state) => state.setDialogOpen)
  const { club, isGetClubLoading, updateClub, isUpdateClubPending } = useClub(targetClubId ?? '');

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (!open || !club) return

    setName(club.name)
    setDescription(club.description)
  }, [open, club])

  const isDirty = useMemo(() => {
    if (!club) return false

    return (
      name.trim() !== club.name.trim() ||
      description.trim() !== club.description.trim()
    )
  }, [club, name, description])

  const handleOpenChange = (open: boolean) => {
    setDialogOpen('editClub', open)

    if (!open && club) {
      setName(club.name)
      setDescription(club.description)
    }
  }

  const handleSave = () => {
    const trimmedName = name.trim()
    const trimmedDescription = description.trim()

    if (!trimmedName || !isDirty) return

    updateClub(
      { name: trimmedName, description: trimmedDescription },
      {
        onSuccess: () => setDialogOpen('editClub', false),
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={(open) => setDialogOpen('editClub', open)}>
      <DialogContent className="flex max-h-[min(90vh,calc(100vh-2rem))] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="shrink-0 border-b border-border px-6 py-4">
          <DialogTitle>Edit club</DialogTitle>
          <DialogDescription>
            {club
              ? `Update details for ${club.name}.`
              : 'Update the club name and description.'}
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          {isGetClubLoading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading club…
            </div>
          ) : club ? (
            <ClubEditorForm
              name={name}
              description={description}
              onNameChange={setName}
              onDescriptionChange={setDescription}
              disabled={isUpdateClubPending}
            />
          ) : (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Club not found.
            </p>
          )}
        </div>

        <DialogFooter className="shrink-0 gap-2 border-t border-border p-6">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isUpdateClubPending}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            disabled={
              !club ||
              !name.trim() ||
              !isDirty ||
              isUpdateClubPending ||
              isGetClubLoading
            }
            onClick={handleSave}
          >
            {isUpdateClubPending ? (
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

export default ClubEditor
