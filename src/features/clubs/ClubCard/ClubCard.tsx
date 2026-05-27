import React, { type FC } from 'react'
import type { Club } from '../../../../types/club-types'
import { useUser } from '../../../../hooks/use-user'
import ClubCardMembers from './ClubCardMembers'
import ClubCardInvitations from './ClubCardInvitations'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import ClubDropdown from './ClubDropdown'
import { useClub } from '../../../../hooks/use-club'
import { dialogStore, setDialog, setTargetClubId } from '../../../../store/store'

interface ClubCardProps {
  club: Club
}

const ClubCard:FC<ClubCardProps> = ({ club }) => {
    const { deleteClub } = useClub(club.id)
    
    const onManageMembers = () => {
      setTargetClubId(club.id);
      setDialog('memberManager', true);
    }
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{club.name}</CardTitle>
          <ClubDropdown club={club} onRemove={() => deleteClub()} onManageMembers={onManageMembers} />
        </div>
        <CardDescription>{club.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
        <ClubCardMembers members={club.members} />
        <ClubCardInvitations invitations={club.invitations} clubId={club.id} />
        </div>
      </CardContent>
    </Card>
  )
}

export default ClubCard