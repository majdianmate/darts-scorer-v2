import Avatar from '#/components/Avatar'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { ScrollArea } from '#/components/ui/scroll-area'
import { cn } from '#/lib/utils.ts'
import { Building2, Check, Inbox, Loader2, X } from 'lucide-react'
import { useState } from 'react'
import { useClubs } from '#/features/clubs/hooks/use-club'
import { useAuthentication } from '#/features/authentication/hooks/use-authentication'

interface ClubInvitesProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ClubInvites = ({ open, onOpenChange }: ClubInvitesProps) => {
  const { user } = useAuthentication()
  const {
    incomingClubInvites,
    isGettingIncomingClubInvites,
    acceptClubInvite,
    rejectClubInvite,
  } = useClubs(user)

  const [actingOn, setActingOn] = useState<{
    id: string
    action: 'accept' | 'reject'
  } | null>(null)

  const invites = incomingClubInvites ?? []
  const inviteCount = invites.length

  const handleAccept = (membershipId: string) => {
    setActingOn({ id: membershipId, action: 'accept' })
    acceptClubInvite(membershipId, {
      onSettled: () => setActingOn(null),
    })
  }

  const handleReject = (membershipId: string) => {
    setActingOn({ id: membershipId, action: 'reject' })
    rejectClubInvite(membershipId, {
      onSettled: () => setActingOn(null),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(640px,calc(100vh-2rem))] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl">
        <DialogHeader className="shrink-0 border-b border-border px-6 py-4">
          <DialogTitle className="flex items-center gap-2">
            <Inbox className="size-4 text-muted-foreground" />
            Incoming club invites
            {inviteCount > 0 && (
              <span className="ml-1.5 font-normal text-muted-foreground">
                ({inviteCount})
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            Review club invitations and choose which clubs you want to join.
          </DialogDescription>
        </DialogHeader>

        {isGettingIncomingClubInvites ? (
          <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading invitations…
          </div>
        ) : inviteCount === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center text-sm text-muted-foreground">
            <Inbox className="mb-3 size-8 text-muted-foreground/60" />
            No pending club invitations
          </div>
        ) : (
          <ScrollArea className="min-h-0 flex-1">
            <ul className="divide-y divide-border p-2">
              {invites.map((invite) => {
                const inviter = invite.from
                const isActing = actingOn?.id === invite.id
                const isAccepting = isActing && actingOn?.action === 'accept'
                const isRejecting = isActing && actingOn?.action === 'reject'

                return (
                  <li
                    key={invite.id}
                    className={cn(
                      'flex items-start gap-3 rounded-md px-3 py-3 transition-colors',
                      isActing && 'bg-muted/40',
                    )}
                  >
                    <Avatar
                      name={inviter?.name ?? 'Unknown'}
                      image={inviter?.image ?? ''}
                      size="sm"
                      className="mt-0.5"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {inviter?.name ?? 'Unknown user'}
                      </p>
                      {inviter?.username && (
                        <p className="truncate text-xs text-muted-foreground">
                          @{inviter.username}
                        </p>
                      )}
                      <p className="mt-1 flex items-center gap-1 truncate text-xs text-muted-foreground">
                        <Building2 className="size-3 shrink-0" />
                        <span className="truncate">
                          Invited you to{' '}
                          <span className="font-medium text-foreground">
                            {invite.clubName}
                          </span>
                        </span>
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1 pt-0.5">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`Accept invitation to ${invite.clubName}`}
                        disabled={isActing}
                        onClick={() => handleAccept(invite.id)}
                        className="text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                      >
                        {isAccepting ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Check className="size-3.5" />
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`Decline invitation to ${invite.clubName}`}
                        disabled={isActing}
                        onClick={() => handleReject(invite.id)}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        {isRejecting ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <X className="size-3.5" />
                        )}
                      </Button>
                    </div>
                  </li>
                )
              })}
            </ul>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ClubInvites
