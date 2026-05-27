import { type FC } from 'react'
import type { ClubMember } from '../../../../types/club-types'
import ClubCardInvitationList from '../ClubCard/ClubCardInvitationList'

interface ClubInvitationsProps {
  invitations: ClubMember[]
  clubId: string
}

const ClubInvitations: FC<ClubInvitationsProps> = ({ invitations, clubId }) => {
  return (
    <ClubCardInvitationList invitations={invitations} />
  )
}

export default ClubInvitations
