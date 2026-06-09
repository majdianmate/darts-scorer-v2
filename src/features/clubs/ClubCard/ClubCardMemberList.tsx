import React, { type FC } from 'react'
import type { ClubMember } from '../../../../types/club-types'
import ClubCardMemberItem from './ClubCardMemberItem'

interface ClubCardMemberListProps {
  members: ClubMember[]
  showRank?: boolean
}

const ClubCardMemberList: FC<ClubCardMemberListProps> = ({
  members,
  showRank = true,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {members.map((member, index) => (
        <ClubCardMemberItem
          key={member.id}
          member={member}
          rank={showRank ? index + 1 : undefined}
        />
      ))}
    </div>
  )
}

export default ClubCardMemberList
