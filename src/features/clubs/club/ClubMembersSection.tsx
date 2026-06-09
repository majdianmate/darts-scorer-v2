import { useMemo, type FC } from 'react'
import { UserPlus, Users } from 'lucide-react'
import { Button } from '#/components/ui/button'
import type { ClubMember } from '../../../../types/club-types'
import { setDialog, setTargetClubId } from '../../../../store/store'
import ClubCardMemberList from '../ClubCard/ClubCardMemberList'
import { sortMembersByRole } from '../ClubCard/roles'
import ClubEmptyState from './ClubEmptyState'

type ClubMembersSectionProps = {
  members: ClubMember[]
  clubId: string
}

const ClubMembersSection: FC<ClubMembersSectionProps> = ({
  members,
  clubId,
}) => {
  const sortedMembers = useMemo(
    () => sortMembersByRole(members),
    [members],
  )

  if (members.length === 0) {
    return (
      <ClubEmptyState
        icon={Users}
        title="No members yet"
        description="Invite players to build your club roster."
        action={
          <Button
            size="sm"
            className="gap-2"
            onClick={() => {
              setTargetClubId(clubId)
              setDialog('memberManager', true)
            }}
          >
            <UserPlus className="size-4" />
            Invite members
          </Button>
        }
      />
    )
  }

  return (
    <div className="p-4 sm:p-6">
      <ClubCardMemberList members={sortedMembers} showRank={false} />
    </div>
  )
}

export default ClubMembersSection
