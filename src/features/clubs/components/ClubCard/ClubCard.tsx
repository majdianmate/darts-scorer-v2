import { type FC, type MouseEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { Club } from '#/features/clubs/types/club-types'
import ClubCardMembers from './ClubCardMembers'
import ClubCardInvitations from './ClubCardInvitations'
import ClubCardSquads from './ClubCardSquads'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Button } from '#/components/ui/button'
import ClubDropdown from './ClubDropdown'
import { useClub } from '#/features/clubs/hooks/use-club'
import { useStore } from '../../../../../store/store'
import { Target } from 'lucide-react'

interface ClubCardProps {
  club: Club
}

const ClubCard: FC<ClubCardProps> = ({ club }) => {
  const { deleteClub } = useClub(club.id)
  const navigate = useNavigate()

  const setTargetClubId = useStore((state) => state.setTargetClubId);
  const setDialogOpen = useStore((state) => state.setDialogOpen);

  const goToClub = () => {
    navigate({ to: '/clubs/$id', params: { id: club.id } })
  }

  const stopCardNavigation = (event: MouseEvent) => {
    event.stopPropagation()
  }

  const onManageMembers = () => {
    setTargetClubId(club.id)
    setDialogOpen('memberManager', true)
  }

  const onEdit = () => {
    setTargetClubId(club.id)
    setDialogOpen('editClub', true)
  }

  const onCreateSquad = () => {
    setTargetClubId(club.id)
    setDialogOpen('createSquad', true)
  }

  const onStartMatch = () => {
    setTargetClubId(club.id)
    setDialogOpen('matchConfig', true)
  }

  return (
    <Card
      className="cursor-pointer gap-3 py-4 transition-colors hover:bg-muted/20"
      onClick={goToClub}
    >
      <CardHeader>
        <CardTitle className="line-clamp-1 pr-1">{club.name}</CardTitle>
        <CardAction onClick={stopCardNavigation}>
          <ClubDropdown
            club={club}
            onRemove={() => deleteClub()}
            onManageMembers={onManageMembers}
            onEdit={onEdit}
            onCreateSquad={onCreateSquad}
          />
        </CardAction>
        <CardDescription className="line-clamp-2 min-h-10">
          {club.description || 'No description yet.'}
        </CardDescription>
      </CardHeader>

      <CardContent
        className="flex flex-1 flex-col gap-2"
        onClick={stopCardNavigation}
      >
        <ClubCardMembers members={club.members} />
        <ClubCardInvitations invitations={club.invitations} clubId={club.id} />
        <ClubCardSquads squads={club.squads} clubId={club.id} />
      </CardContent>

      <CardFooter className="border-t border-border/60 bg-transparent p-4 pt-3">
        <Button
          variant="default"
          className="w-full gap-2"
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onStartMatch()
          }}
        >
          <Target className="size-4" />
          Start match
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ClubCard
