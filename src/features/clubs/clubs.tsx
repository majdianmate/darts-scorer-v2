import { Building2, Loader2, Plus } from 'lucide-react'
import { useUser } from '../../../hooks/use-user'
import { useClubs } from '../../../hooks/use-club'
import { ScrollArea } from '#/components/ui/scroll-area'
import { Button } from '#/components/ui/button'
import CreateClubDialog from './ClubCreator/CreateClubDialog'
import ClubCard from './ClubCard/ClubCard'
import ClubInvites from './ClubInvites/ClubInvites'
import MemberManagerDialog from './MemberManager/MemberManagerDialog'
import ClubEditor from './ClubEditor/ClubEditor'
import SquadCreator from './SquadSystem/SquadCreator/SquadCreator'
import SquadEditor from './SquadSystem/SquadEditor/SquadEditor'
import MatchConfigDialog from '../match/MatchConfig/MatchConfigDialog'

const Clubs = () => {
  const { user } = useUser()
  const { clubs, isGetClubsLoading } = useClubs(user);

  console.log(clubs);

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
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg border border-border/60 bg-muted/30">
            <Building2 className="size-4 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Clubs</h2>
            <p className="text-sm text-muted-foreground">
              {clubs.length === 0
                ? 'Create a club to play with your group'
                : `${clubs.length} club${clubs.length === 1 ? '' : 's'}`}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 justify-end gap-2">
          <ClubInvites />
          <CreateClubDialog />
        </div>
      </div>

      {clubs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
          <Building2 className="mb-3 size-10 text-muted-foreground/60" />
          <p className="font-medium text-foreground">No clubs yet</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Create a club to organize members and start matches together.
          </p>
          <div className="mt-6">
            <CreateClubDialog
              trigger={
                <Button variant="default" className="gap-2">
                  <Plus className="size-4" />
                  Create club
                </Button>
              }
            />
          </div>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-100px)] [scrollbar-gutter:stable] pr-4">
          <div className="grid grid-cols-1 gap-4 pb-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 p-2">
            {clubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        </ScrollArea>
      )}

      <MemberManagerDialog />
      <ClubEditor />
      <SquadCreator />
      <SquadEditor />
      <MatchConfigDialog />
    </div>
  )
}

export default Clubs
