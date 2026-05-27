import React, { type FC } from 'react'
import type { ClubMember } from '../../../../types/club-types'
import ClubCardMemberItem from './ClubCardMemberItem'

interface ClubCardInvitationListProps {
  invitations: ClubMember[]
}

const ClubCardInvitationList: FC<ClubCardInvitationListProps> = ({
  invitations,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {invitations.map((invitation, index) => (
        <ClubCardMemberItem
          key={invitation.userId}
          member={invitation}
          rank={index + 1}
          isInvitation={true}
        />
      ))}
    </div>
  )
}

export default ClubCardInvitationList
