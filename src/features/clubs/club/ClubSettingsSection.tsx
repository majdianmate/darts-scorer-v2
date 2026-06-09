import { useEffect, useMemo, useState, type FC } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, LogOut, Save, Trash2 } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Separator } from '#/components/ui/separator'
import type { Club } from '../../../../types/club-types'
import { useClub, useClubs } from '../../../../hooks/use-club'
import { useUser } from '../../../../hooks/use-user'
import ClubEditorForm from '../ClubEditor/ClubEditorForm'

type ClubSettingsSectionProps = {
  club: Club
}

const ClubSettingsSection: FC<ClubSettingsSectionProps> = ({ club }) => {
  const navigate = useNavigate()
  const { user } = useUser()
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
    leaveClub({ clubId: club.id }, { onSuccess: () => navigate({ to: '/clubs' }) })
  }

  return (
    <div className="space-y-8 p-4 sm:p-6">
      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Club details</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isOwner
              ? 'Update how this club appears to members.'
              : 'Only the owner can edit club details.'}
          </p>
        </div>

        <ClubEditorForm
          name={name}
          description={description}
          onNameChange={setName}
          onDescriptionChange={setDescription}
          disabled={!isOwner || isUpdateClubPending}
          className="gap-4"
        />

        {isOwner ? (
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!isDirty || isUpdateClubPending}
              onClick={() => {
                setName(club.name)
                setDescription(club.description)
              }}
            >
              Reset
            </Button>
            <Button
              size="sm"
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
          </div>
        ) : null}
      </section>

      <Separator />

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-foreground">Owner</h2>
        <p className="text-sm font-medium text-foreground">{club.createdBy.name}</p>
        <p className="text-sm text-muted-foreground">
          @{club.createdBy.username}
          {isOwner ? ' · You' : ''}
        </p>
      </section>

      <Separator />

      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-destructive">Danger zone</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isOwner
              ? 'Permanently delete this club and all related data.'
              : 'Leave this club if you no longer want to be a member.'}
          </p>
        </div>

        {isOwner ? (
          !confirmDelete ? (
            <Button variant="destructive" size="sm" onClick={() => setConfirmDelete(true)}>
              <Trash2 className="size-4" />
              Delete club
            </Button>
          ) : (
            <div className="space-y-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-sm text-foreground">
                Delete &quot;{club.name}&quot;? This cannot be undone.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isDeleteClubPending}
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
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
                      Yes, delete
                    </>
                  )}
                </Button>
              </div>
            </div>
          )
        ) : (
          <Button
            variant="destructive"
            size="sm"
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
      </section>
    </div>
  )
}

export default ClubSettingsSection
