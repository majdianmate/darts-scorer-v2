import { usePageHeader } from '#/components/Sidebar'
import { ScrollArea } from '#/components/ui/scroll-area'
import { useClubs } from '../../../hooks/use-club'
import { useUser } from '../../../hooks/use-user'
import ClubCard from './ClubCard/ClubCard'
import CreateClubDialog from './ClubCreator/CreateClubDialog'
import ClubInvites from './ClubInvites/ClubInvites'

const Clubs = () => {
  const { user } = useUser()
  const { clubs, isGetClubsLoading } = useClubs(user)

  usePageHeader({
    title: 'Clubs',
    toolbar: (
      <>
        <ClubInvites />
        <CreateClubDialog />
      </>
    ),
  })

  if (!user) {
    return <p className="text-sm text-muted-foreground">Loading…</p>
  }

  if (isGetClubsLoading) {
    return <p className="text-sm text-muted-foreground">Loading clubs…</p>
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ScrollArea className="min-h-0 flex-1 [scrollbar-gutter:stable]">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {clubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export default Clubs
