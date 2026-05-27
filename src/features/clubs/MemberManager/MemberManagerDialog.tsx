import { useMemo, useState, type ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { ScrollArea } from '#/components/ui/scroll-area'
import { Separator } from '#/components/ui/separator'
import { Loader2, UserPlus, Users } from 'lucide-react'
import { toast } from 'sonner'
import { dialogStore, setDialog } from '../../../../store/store'
import { useSelector } from '@tanstack/react-store'
import { useClub } from '../../../../hooks/use-club'
import { useUser } from '../../../../hooks/use-user'
import { ClubRole } from '../../../../types/club-types'
import {
  isUserPickerGuest,
  type UserPickerItem,
} from '#/components/UserPicker/user-picker-types'
import ClubCardMemberList from '../ClubCard/ClubCardMemberList'
import ClubCardInvitationList from '../ClubCard/ClubCardInvitationList'
import MemberManagerUserPicker from './MemberManagerUserPicker'
import { sortMembersByRole } from '../ClubCard/roles'

function RosterSection({
  icon,
  title,
  count,
  emptyMessage,
  children,
}: {
  icon: ReactNode
  title: string
  count: number
  emptyMessage: string
  children: ReactNode
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background/80 shadow-sm">
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
          {count}
        </Badge>
      </div>
      {count === 0 ? (
        <div className="rounded-lg border border-dashed border-border/60 bg-muted/10 px-4 py-6 text-center text-xs text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        children
      )}
    </section>
  )
}

const MemberManagerDialog = () => {
  const dialogs = useSelector(dialogStore, (s) => s.dialogs)
  const targetClubId = useSelector(dialogStore, (s) => s.targetClubId)
  const { user } = useUser()
  const { club, addMemberAsync, addGuestAsync, isAddMemberPending } = useClub(
    targetClubId ?? '',
    user?.id,
  )
  const [selectedItems, setSelectedItems] = useState<UserPickerItem[]>([])
  const [isSending, setIsSending] = useState(false)

  const sortedMembers = useMemo(
    () => (club ? sortMembersByRole(club.members) : []),
    [club],
  )
  const sortedInvitations = useMemo(
    () => (club ? sortMembersByRole(club.invitations) : []),
    [club],
  )

  const lockedUserIds = useMemo(() => {
    if (!club) return []
    return [
      ...club.members.map((m) => m.userId ?? ''),
      ...club.invitations.map((i) => i.userId ?? ''),
    ].filter(Boolean)
  }, [club])

  const handleOpenChange = (open: boolean) => {
    setDialog('memberManager', open)
    if (!open) setSelectedItems([])
  }

  const handleSendInvites = async () => {
    if (!selectedItems.length) return

    const count = selectedItems.length
    const guestCount = selectedItems.filter(isUserPickerGuest).length
    const inviteCount = count - guestCount
    setIsSending(true)
    try {
      await Promise.all(
        selectedItems.map((item) =>
          isUserPickerGuest(item)
            ? addGuestAsync(item.guestName)
            : addMemberAsync({ userId: item.id, role: ClubRole.MEMBER }),
        ),
      )
      setSelectedItems([])
      if (guestCount > 0 && inviteCount > 0) {
        toast.success(
          `${inviteCount} invitation${inviteCount === 1 ? '' : 's'} and ${guestCount} guest${guestCount === 1 ? '' : 's'} added.`,
        )
      } else if (guestCount > 0) {
        toast.success(
          guestCount === 1 ? 'Guest added.' : `${guestCount} guests added.`,
        )
      } else {
        toast.success(
          inviteCount === 1
            ? 'Invitation sent.'
            : `${inviteCount} invitations sent.`,
        )
      }
    } finally {
      setIsSending(false)
    }
  }

  const inviteCount = selectedItems.length
  const isBusy = isAddMemberPending || isSending

  if (!club) return null

  return (
    <Dialog open={dialogs.memberManager} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[min(720px,calc(100vh-2rem))] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="shrink-0 border-b border-border px-6 py-4">
          <DialogTitle>Manage members</DialogTitle>
          <DialogDescription>
            View the roster and invite players to{' '}
            <span className="font-medium text-foreground">{club.name}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden sm:flex-row sm:min-h-[400px]">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-b border-border sm:border-b-0">
            <ScrollArea className="min-h-0 flex-1">
              <div className="space-y-6 p-6">
                <RosterSection
                  icon={<Users className="size-4 text-muted-foreground" />}
                  title="Members"
                  count={sortedMembers.length}
                  emptyMessage="No members in this club yet."
                >
                  <ClubCardMemberList members={sortedMembers} />
                </RosterSection>

                <RosterSection
                  icon={<UserPlus className="size-4 text-muted-foreground" />}
                  title="Pending invitations"
                  count={sortedInvitations.length}
                  emptyMessage="No pending invitations."
                >
                  <ClubCardInvitationList invitations={sortedInvitations} />
                </RosterSection>
              </div>
            </ScrollArea>
          </div>

          <Separator orientation="vertical" className="hidden sm:block" />

          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-t border-border p-6 sm:max-w-[50%] sm:border-t-0">
            <MemberManagerUserPicker
              className="min-h-0 flex-1"
              selectedItems={selectedItems}
              onSelectedItemsChange={setSelectedItems}
              lockedUserIds={lockedUserIds}
            />
          </div>
        </div>

        <DialogFooter className="shrink-0 border-t border-border p-6">
          <p className="hidden text-xs text-muted-foreground sm:block">
            {inviteCount > 0
              ? `${inviteCount} player${inviteCount === 1 ? '' : 's'} selected`
              : 'Select players or guests to invite'}
          </p>
          <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isBusy}
            >
              Close
            </Button>
            <Button
              variant="default"
              disabled={inviteCount === 0 || isBusy}
              onClick={handleSendInvites}
            >
              {isBusy ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  Send invitation{inviteCount === 1 ? '' : 's'}
                  {inviteCount > 0 && ` (${inviteCount})`}
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default MemberManagerDialog
