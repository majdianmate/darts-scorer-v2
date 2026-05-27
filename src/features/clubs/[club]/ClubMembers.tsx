import { type FC } from 'react'
import type { ClubMember } from '../../../../types/club-types'
import ClubCardMemberList from '../ClubCard/ClubCardMemberList'

interface ClubMembersProps {
  members: ClubMember[]
}

const ClubMembers: FC<ClubMembersProps> = ({ members }) => {
  return <ClubCardMemberList members={members} />
}

export default ClubMembers
