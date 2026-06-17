import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Separator } from '#/components/ui/separator'
import { Button } from '#/components/ui/button'
import { Loader2, Plus } from 'lucide-react'
import { useStore } from '../../../../../../store/store'
import { useClub } from '#/features/clubs/hooks/use-club'
import { useAuthentication } from '#/features/authentication/hooks/use-authentication'
import type { ClubMember } from '#/features/clubs/types/club-types'
import { DEFAULT_COLOR } from '#/components/ui/color-picker'
import { DEFAULT_SQUAD_ICON, type SquadIconKey } from '#/components/IconPicker'
import SquadCreatorBase from './SquadCreatorBase'
import SquadCreatorUserPicker from './SquadCreatorUserPicker'

const SquadCreator = () => {
  const open = useStore((state) => state.dialogs['createSquad'])
  const targetClubId = useStore((state) => state.targetClubId)
  const setDialogOpen = useStore((state) => state.setDialogOpen)
  const { user } = useAuthentication()
  const { club, isGetClubLoading, createSquadAsync, isCreateSquadPending } = useClub(targetClubId ?? '');

  const [name, setName] = useState('')
  const [color, setColor] = useState<string>(DEFAULT_COLOR)
  const [icon, setIcon] = useState<SquadIconKey>(DEFAULT_SQUAD_ICON)
  const [selectedMembers, setSelectedMembers] = useState<ClubMember[]>([])

  useEffect(() => {
    if (!open) return
    setName('')
    setColor(DEFAULT_COLOR)
    setIcon(DEFAULT_SQUAD_ICON)
    setSelectedMembers([])
  }, [open, targetClubId])

  const handleOpenChange = (open: boolean) => {
    setDialogOpen('createSquad', open)
    if (!open) {
      setName('')
      setColor(DEFAULT_COLOR)
      setIcon(DEFAULT_SQUAD_ICON)
      setSelectedMembers([])
    }
  }

  const handleCreateSquad = async () => {
    if (!club || !user || !name.trim()) return

    await createSquadAsync({
      clubId: club.id,
      createdBy: user,
      data: {
        name: name.trim(),
        color,
        icon,
        members: selectedMembers,
      },
    })

    handleOpenChange(false)
  }

  const clubMembers = club?.members ?? []
  const isBusy = isCreateSquadPending

  return (
    <Dialog open={open} onOpenChange={(open) => setDialogOpen('createSquad', open)}>
      <DialogContent className="flex max-h-[min(720px,calc(100vh-2rem))] flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl xl:max-w-6xl">
        <DialogHeader className="shrink-0 border-b border-border px-6 py-4">
          <DialogTitle>Create squad</DialogTitle>
          <DialogDescription>
            {club
              ? `Add a squad to ${club.name} and pick its players.`
              : 'Name your squad and select club members.'}
          </DialogDescription>
        </DialogHeader>

        {isGetClubLoading ? (
          <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading club members…
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden sm:flex-row sm:min-h-[360px]">
            <div className="min-h-0 min-w-0 flex-1 overflow-y-auto p-6">
              <SquadCreatorBase
                name={name}
                color={color}
                icon={icon}
                onNameChange={setName}
                onColorChange={setColor}
                onIconChange={setIcon}
                disabled={isBusy}
              />
            </div>

            <Separator orientation="vertical" className="hidden sm:block" />

            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-t border-border p-6 sm:border-t-0">
              <SquadCreatorUserPicker
                className="min-h-0 flex-1"
                members={clubMembers}
                selectedMembers={selectedMembers}
                onSelectedMembersChange={setSelectedMembers}
              />
            </div>
          </div>
        )}

        <DialogFooter className="shrink-0 gap-2 border-t border-border p-6">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isBusy}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            className="gap-2"
            disabled={!name.trim() || isBusy || isGetClubLoading || !club}
            onClick={handleCreateSquad}
          >
            {isBusy ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creating…
              </>
            ) : (
              <>
                <Plus className="size-4" />
                Create squad
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SquadCreator
