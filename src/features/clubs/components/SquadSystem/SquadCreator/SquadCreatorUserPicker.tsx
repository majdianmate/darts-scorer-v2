import { useMemo, type FC } from 'react'
import UserPicker from '#/components/UserPicker'
import { cn } from '#/lib/utils.ts'
import type { ClubMember } from '#/features/clubs/types/club-types'
import type { User } from '#/features/authentication/types/user-types'
import { toast } from 'sonner'

const MAX_SQUAD_MEMBERS = 5

function membersToPickerUsers(members: ClubMember[]): User[] {
  return members.map((member) => ({
    ...member.user,
    id: member.id,
  }))
}

function pickerUsersToMembers(
  users: User[],
  members: ClubMember[],
): ClubMember[] {
  const memberById = new Map(members.map((member) => [member.id, member]))

  return users
    .map((user) => memberById.get(user.id))
    .filter((member): member is ClubMember => !!member)
}

interface SquadCreatorUserPickerProps {
  selectedMembers: ClubMember[]
  onSelectedMembersChange: (members: ClubMember[]) => void
  members: ClubMember[]
  className?: string
}

const SquadCreatorUserPicker: FC<SquadCreatorUserPickerProps> = ({
  selectedMembers,
  onSelectedMembersChange,
  members,
  className,
}) => {
  const pickerSource = useMemo(() => membersToPickerUsers(members), [members])

  const selectedPickerUsers = useMemo(
    () => membersToPickerUsers(selectedMembers),
    [selectedMembers],
  )

  const handleSelectionChange = (users: User[]) => {
    if (users.length > MAX_SQUAD_MEMBERS) {
      toast.error(`A squad can have at most ${MAX_SQUAD_MEMBERS} members.`)
      onSelectedMembersChange(
        pickerUsersToMembers(users.slice(0, MAX_SQUAD_MEMBERS), members),
      )
      return
    }

    onSelectedMembersChange(pickerUsersToMembers(users, members))
  }

  return (
    <div className={cn('flex h-full min-h-0 flex-col', className)}>
      <div className="shrink-0">
        <h3 className="text-sm font-semibold text-foreground">Squad members</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick from club members and guests. Up to {MAX_SQUAD_MEMBERS} players.
        </p>
      </div>

      {members.length === 0 ? (
        <div className="mt-4 flex flex-1 items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/10 px-4 py-12 text-center text-sm text-muted-foreground">
          No members in this club yet.
        </div>
      ) : (
        <div className="mt-4 flex min-h-0 flex-1 flex-col">
          <UserPicker
            fillHeight
            className="min-h-0 flex-1"
            selectedUsers={selectedPickerUsers}
            onSelectionChange={handleSelectionChange}
            source={pickerSource}
            placeholder="Filter club members…"
            emptyMessage="No members match your search."
          />
        </div>
      )}
    </div>
  )
}

export default SquadCreatorUserPicker
