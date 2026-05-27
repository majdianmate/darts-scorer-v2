import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '#/components/ui/separator'
import ClubCreatorBase from './ClubCreatorBase'
import ClubCreatorMemberSelector from './ClubCreatorMemberSelector'
import type { User } from '../../../../types/user-types'
import { useUser } from '../../../../hooks/use-user'
import { useClubs } from '../../../../hooks/use-club'

const CreateClubDialog = () => {
  const { user } = useUser()
  const { createClub } = useClubs(user ?? null)

  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const [selectedUsers, setSelectedUsers] = useState<User[]>([])

  const handleCreateClub = () => {
    createClub({
      data: {
        name,
        description,
      },
      invitees: selectedUsers,
    });
    setName('')
    setDescription('')
    setSelectedUsers([])
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)

    if (!nextOpen) {
      setName('')
      setDescription('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="default">Create Club</Button>} />
      <DialogContent className="flex max-h-[min(720px,calc(100vh-2rem))] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="shrink-0 border-b border-border px-6 py-4">
          <DialogTitle>Create Club</DialogTitle>
          <DialogDescription>
            Create a new club for your friends to join.
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

        <DialogFooter className="shrink-0 border-t border-border p-6">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="default"
            disabled={!name.trim()}
            onClick={handleCreateClub}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateClubDialog
