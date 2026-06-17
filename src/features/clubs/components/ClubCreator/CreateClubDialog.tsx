import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '#/components/ui/separator'
import { Plus } from 'lucide-react'
import ClubCreatorBase from './ClubCreatorBase'
import ClubCreatorMemberSelector from './ClubCreatorMemberSelector'
import type { User } from '#/features/authentication/types/user-types'
import { useAuthentication } from '#/features/authentication/hooks/use-authentication'
import { useClubs } from '#/features/clubs/hooks/use-club'
import { useStore } from '../../../../../store/store'

const CreateClubDialog = () => {
  const { user } = useAuthentication()
  const { createClub } = useClubs(user ?? null)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])

  const open = useStore((state) => state.dialogs['createClub'])
  const setDialogOpen = useStore((state) => state.setDialogOpen)

  const handleCreateClub = () => {
    createClub({
      data: {
        name: name.trim(),
        description: description.trim(),
      },
      invitees: selectedUsers,
    })
    setName('')
    setDescription('')
    setSelectedUsers([])
    setDialogOpen('createClub', false)
  }

  return (
    <Dialog open={open} onOpenChange={(open) => setDialogOpen('createClub', open)}>
      <DialogContent className="flex max-h-[min(720px,calc(100vh-2rem))] flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl xl:max-w-6xl">
        <DialogHeader className="shrink-0 border-b border-border px-6 py-4">
          <DialogTitle>Create club</DialogTitle>
          <DialogDescription>
            Set up your club and optionally invite friends right away.
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden sm:flex-row sm:min-h-[320px]">
          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto p-6">
            <ClubCreatorBase
              name={name}
              description={description}
              onNameChange={setName}
              onDescriptionChange={setDescription}
            />
          </div>

          <Separator orientation="vertical" className="hidden sm:block" />

          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-t border-border p-6 sm:border-t-0">
            <ClubCreatorMemberSelector
              className="min-h-0 flex-1"
              selectedUsers={selectedUsers}
              onSelectedUsersChange={setSelectedUsers}
            />
          </div>
        </div>

        <DialogFooter className="shrink-0 gap-2 border-t border-border p-6">
          <Button variant="outline" onClick={() => setDialogOpen('createClub', false)}>
            Cancel
          </Button>
          <Button
            variant="default"
            className="gap-2"
            disabled={!name.trim()}
            onClick={handleCreateClub}
          >
            <Plus className="size-4" />
            Create club
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateClubDialog
