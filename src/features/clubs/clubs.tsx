import { useMemo } from 'react'
import { Building2, Inbox, Loader2, Plus } from 'lucide-react'
import { useClubs } from '#/features/clubs/hooks/use-club'
import { Button } from '#/components/ui/button'
import ClubCard from './components/ClubCard/ClubCard'
import { useAuthentication } from '#/features/authentication/hooks/use-authentication'
import { usePageHeader } from '#/components/Header/Header'
import { useDialog } from '../../../providers/dialog-provider'

const Clubs = () => {
  const { user } = useAuthentication()
  const { clubs, incomingClubInvites, isGetClubsLoading } = useClubs(user)
  const { openDialog } = useDialog()
  const inviteCount = incomingClubInvites?.length ?? 0

  const header = useMemo(
    () => ({
      title: 'Clubs',
      buttons: [
        {
          icon: Inbox,
          label:
            inviteCount > 0
              ? `Incoming invites (${inviteCount})`
              : 'Incoming invites',
          variant: 'outline' as const,
          onClick: () => openDialog('clubInvites'),
        },
        {
          icon: Plus,
          label: 'New club',
          onClick: () => openDialog('createClub'),
        },
      ],
    }),
    [inviteCount, openDialog],
  )

  usePageHeader(header)

  if (!user) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading…
      </div>
    )
  }

  if (isGetClubsLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading clubs…
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {clubs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
          <Building2 className="mb-3 size-10 text-muted-foreground/60" />
          <p className="font-medium text-foreground">No clubs yet</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Create a club to organize members and start matches together.
          </p>
          <div className="mt-6">
            <Button onClick={() => openDialog('createClub')}>
              <Plus className="size-4" />
              New club
            </Button>
          </div>
        </div>
      ) : (
        <div className="pr-4 pb-10 overflow-y-auto h-full mb-4">
          {/* Custom columns layout (masonry-like, Pinterest style) */}
          <div
            className="
              columns-1
              gap-4
              [column-fill:_balance]
              p-2
              pb-4
              md:columns-2
              xl:columns-3
              2xl:columns-3
            "
          >
            {clubs.map((club) => (
              <div
                key={club.id}
                className="
                  mb-4
                  break-inside-avoid
                  rounded-xl
                  bg-background
                  shadow
                "
              >
                <ClubCard club={club} />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

export default Clubs
