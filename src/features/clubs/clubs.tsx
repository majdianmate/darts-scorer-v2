import { useUser } from '../../../hooks/use-user'
import { useClubs } from '../../../hooks/use-club'
import { ScrollArea } from '#/components/ui/scroll-area'
import CreateClubDialog from './ClubCreator/CreateClubDialog'
import ClubCard from './ClubCard/ClubCard'
import ClubInvites from './ClubInvites/ClubInvites'
import MemberManagerDialog from './MemberManager/MemberManagerDialog'

const Clubs = () => {
  const { user } = useUser()
  const { clubs, isGetClubsLoading } = useClubs(user)

  if (!user) {
    return <p className="text-sm text-muted-foreground">Loading…</p>
  }

  if (isGetClubsLoading) {
    return <p className="text-sm text-muted-foreground">Loading clubs…</p>
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Clubs</h2>
        <div className="flex justify-end gap-2">
          <ClubInvites />
          <CreateClubDialog />
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-100px)] [scrollbar-gutter:stable] overflow-y-hidden pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pl-4">
          {clubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      </ScrollArea>
      <MemberManagerDialog  />
    </div>
  )
}

export default Clubs
