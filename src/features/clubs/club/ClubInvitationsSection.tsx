import { useMemo, type FC } from 'react'
import { Mail, UserPlus } from 'lucide-react'
import { Button } from '#/components/ui/button'
import type { ClubMember } from '../../../../types/club-types'
import { setDialog, setTargetClubId } from '../../../../store/store'
import ClubCardInvitationList from '../ClubCard/ClubCardInvitationList'
import { sortMembersByRole } from '../ClubCard/roles'
import ClubEmptyState from './ClubEmptyState'

type ClubInvitationsSectionProps = {
  invitations: ClubMember[]
  clubId: string
}

const ClubInvitationsSection: FC<ClubInvitationsSectionProps> = ({
  invitations,
  clubId,
}) => {
  const sortedInvitations = useMemo(
    () => sortMembersByRole(invitations),
    [invitations],
  )

  if (invitations.length === 0) {
    return (
      <ClubEmptyState
        icon={Mail}
        title="No pending invitations"
        description="Players you invite will appear here until they accept."
        action={
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            onClick={() => {
              setTargetClubId(clubId)
              setDialog('memberManager', true)
            }}
          >
            <UserPlus className="size-4" />
            Send invitation
          </Button>
        }
      />
    )
  }

  return (
    <div className="p-4 sm:p-6">
      <ClubCardInvitationList invitations={sortedInvitations} />
    </div>
  )
}

export default ClubInvitationsSection
