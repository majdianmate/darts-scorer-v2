import { useEffect, useMemo, useState, type FC } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, LogOut, Save, Trash2 } from 'lucide-react'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import type { Club } from '#/features/clubs/types/club-types'
import { useClub, useClubs } from '#/features/clubs/hooks/use-club'
import { useAuthentication } from '#/features/authentication/hooks/use-authentication'
import ClubEditorForm from '../ClubEditor/ClubEditorForm'

interface ClubSettingsProps {
  club: Club
}

const ClubSettings: FC<ClubSettingsProps> = ({ club }) => {
  const navigate = useNavigate()
  const { user } = useAuthentication()
  const isOwner = user?.id === club.createdBy.id

  const { updateClub, isUpdateClubPending, deleteClub, isDeleteClubPending } =
    useClub(club.id, user?.id)
  const { leaveClub, isLeaveClubPending } = useClubs(user)

  const [name, setName] = useState(club.name)
  const [description, setDescription] = useState(club.description)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    setName(club.name)
    setDescription(club.description)
  }, [club.name, club.description])

  const isDirty = useMemo(
    () =>
      name.trim() !== club.name.trim() ||
      description.trim() !== club.description.trim(),
    [club, name, description],
  )

  const handleSave = () => {
    const trimmedName = name.trim()
    const trimmedDescription = description.trim()
    if (!trimmedName || !isDirty) return

    updateClub({
      name: trimmedName,
      description: trimmedDescription,
    })
  }

  const handleDelete = () => {
    deleteClub(undefined, {
      onSuccess: () => navigate({ to: '/clubs' }),
    })
  }

  const handleLeave = () => {
    leaveClub(
      { clubId: club.id },
      { onSuccess: () => navigate({ to: '/clubs' }) },
    )
  }

  return (
    <div className="flex flex-col gap-4 p-2">
      <Card>
        <CardContent className="pt-6">
          <ClubEditorForm
            name={name}
            description={description}
            onNameChange={setName}
            onDescriptionChange={setDescription}
            disabled={!isOwner || isUpdateClubPending}
          />
          {!isOwner ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Only the club owner can edit these details.
            </p>
          ) : null}
        </CardContent>
        {isOwner ? (
          <CardFooter className="justify-end gap-2 border-t border-border">
            <Button
              variant="outline"
              disabled={!isDirty || isUpdateClubPending}
              onClick={() => {
                setName(club.name)
                setDescription(club.description)
              }}
            >
              Reset
            </Button>
            <Button
              disabled={!name.trim() || !isDirty || isUpdateClubPending}
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
          </CardFooter>
        ) : null}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ownership</CardTitle>
          <CardDescription>Who created and runs this club.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium text-foreground">
            {club.createdBy.name}
          </p>
          <p className="text-sm text-muted-foreground">
            @{club.createdBy.username}
            {isOwner ? ' · You are the owner' : ''}
          </p>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Danger zone</CardTitle>
          <CardDescription>
            {isOwner
              ? 'Permanently remove this club and all related data.'
              : 'Leave this club if you no longer want to be a member.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isOwner ? (
            !confirmDelete ? (
              <Button
                variant="destructive"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className="size-4" />
                Delete club
              </Button>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">
                  Delete &quot;{club.name}&quot;? This cannot be undone.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    disabled={isDeleteClubPending}
                    onClick={() => setConfirmDelete(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    disabled={isDeleteClubPending}
                    onClick={handleDelete}
                  >
                    {isDeleteClubPending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Deleting…
                      </>
                    ) : (
                      <>
                        <Trash2 className="size-4" />
                        Yes, delete club
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )
          ) : (
            <Button
              variant="destructive"
              disabled={isLeaveClubPending}
              onClick={handleLeave}
            >
              {isLeaveClubPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Leaving…
                </>
              ) : (
                <>
                  <LogOut className="size-4" />
                  Leave club
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ClubSettings
