import React, { type FC } from 'react'
import type { Club } from '../../../../types/club-types'
import { useUser } from '../../../../hooks/use-user'
import ClubCardMembers from './ClubCardMembers'
import ClubCardInvitations from './ClubCardInvitations'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import ClubDropdown from './ClubDropdown'
import { useClub } from '../../../../hooks/use-club'

interface ClubCardProps {
  club: Club
}

const ClubCard:FC<ClubCardProps> = ({ club }) => {
    const { deleteClub } = useClub(club.id)
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{club.name}</CardTitle>
          <ClubDropdown club={club} onRemove={() => deleteClub()} />
        </div>
        <CardDescription>{club.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
        <ClubCardMembers members={club.members} />
        <ClubCardInvitations invitations={club.invitations} />
        </div>
      </CardContent>
    </Card>
  )
}

export default ClubCard