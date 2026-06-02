import { type FC, type MouseEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { Club } from '../../../../types/club-types'
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
import { useClub } from '../../../../hooks/use-club'
import { setDialog, setTargetClubId } from '../../../../store/store'
import { Target } from 'lucide-react'

interface ClubCardProps {
  club: Club
}

const ClubCard: FC<ClubCardProps> = ({ club }) => {
  const { deleteClub } = useClub(club.id)
  const navigate = useNavigate()

  const goToClub = () => {
    navigate({ to: '/clubs/$club', params: { club: club.id } })
  }

  const stopCardNavigation = (event: MouseEvent) => {
    event.stopPropagation()
  }

  const onManageMembers = () => {
    setTargetClubId(club.id)
    setDialog('memberManager', true)
  }

  const onEdit = () => {
    setTargetClubId(club.id)
    setDialog('editClub', true)
  }

  const onCreateSquad = () => {
    setTargetClubId(club.id)
    setDialog('createSquad', true)
  }

  const onStartMatch = () => {
    setTargetClubId(club.id)
    setDialog('matchConfig', true)
  }

  return (
    <Card
      className="flex h-full cursor-pointer flex-col transition-colors hover:bg-muted/20"
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

      <CardFooter className="mt-auto border-t border-border/60 bg-transparent p-4 pt-3">
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
