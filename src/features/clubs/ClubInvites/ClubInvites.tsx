import Avatar from '#/components/Avatar'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { ScrollArea } from '#/components/ui/scroll-area'
import { cn } from '#/lib/utils.ts'
import { Building2, Check, Loader2, Mail, X } from 'lucide-react'
import { useState } from 'react'
import { useClubs } from '../../../../hooks/use-club'
import { useUser } from '../../../../hooks/use-user'

const ClubInvites = () => {
  const { user } = useUser()
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
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" className="relative gap-1.5">
            <Mail className="size-4" />
            Invites
            {inviteCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex size-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {inviteCount > 9 ? '9+' : inviteCount}
              </span>
            )}
          </Button>
        }
      />

      <DropdownMenuContent align="end" className="w-80 p-0 sm:w-96">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="border-b border-border px-3 py-2.5">
            Club invitations
            {inviteCount > 0 && (
              <span className="ml-1.5 font-normal text-muted-foreground">
                ({inviteCount})
              </span>
            )}
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        {isGettingIncomingClubInvites ? (
          <div className="flex items-center justify-center gap-2 px-3 py-8 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading invitations…
          </div>
        ) : inviteCount === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-muted-foreground">
            No pending club invitations
          </div>
        ) : (
          <ScrollArea className="max-h-72">
            <ul className="divide-y divide-border p-1">
              {invites.map((invite) => {
                const inviter = invite.from
                const isActing = actingOn?.id === invite.id
                const isAccepting = isActing && actingOn?.action === 'accept'
                const isRejecting = isActing && actingOn?.action === 'reject'

                return (
                  <li
                    key={invite.id}
                    className={cn(
                      'flex items-center justify-center gap-2.5 rounded-md px-2 py-2.5 transition-colors',
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ClubInvites
