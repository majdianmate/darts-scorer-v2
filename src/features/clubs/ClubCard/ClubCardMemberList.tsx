import React, { type FC } from 'react'
import type { ClubMember } from '../../../../types/club-types'
import ClubCardMemberItem from './ClubCardMemberItem'

interface ClubCardMemberListProps {
  members: ClubMember[]
}

const ClubCardMemberList: FC<ClubCardMemberListProps> = ({ members }) => {
  return (
    <div className="flex flex-col gap-1.5">
      {members.map((member, index) => (
        <ClubCardMemberItem key={member.id} member={member} rank={index + 1} />
      ))}
    </div>
  )
}

export default ClubCardMemberList
