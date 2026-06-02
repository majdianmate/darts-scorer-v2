import { type FC, useMemo } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '#/components/ui/button'
import type { ClubMember } from '../../../../types/club-types'
import AvatarGroup from '#/components/AvatarGroup'
import { sortMembersByRole } from './roles'
import ClubCardInvitationList from './ClubCardInvitationList'
import { setDialog, setTargetClubId } from '../../../../store/store'
import { UserPlus } from 'lucide-react'
import {
  clubCardSectionContentClass,
  clubCardSectionEmptyFooterClass,
  clubCardSectionIconClass,
  clubCardSectionIconWrapClass,
  clubCardSectionShellClass,
  clubCardSectionStripeClass,
  clubCardSectionTriggerClass,
  getClubCardSectionTone,
} from './club-card-section-styles'

interface ClubCardInvitationsProps {
  invitations: ClubMember[]
  clubId: string
}

const ClubCardInvitations: FC<ClubCardInvitationsProps> = ({
  invitations,
  clubId,
}) => {
  const tone = getClubCardSectionTone('invitations')
  const sortedInvitations = useMemo(
    () => sortMembersByRole(invitations),
    [invitations],
  )

  const memberCount = invitations.length

  if (memberCount === 0) {
    return (
      <div className={clubCardSectionShellClass}>
        <div className="relative flex items-center gap-3 bg-muted/40 px-3 py-3 pl-4">
          <span
            className={clubCardSectionStripeClass('invitations')}
            aria-hidden
          />
          <div className={clubCardSectionIconWrapClass('invitations')}>
            <tone.Icon className={clubCardSectionIconClass('invitations')} />
          </div>

          <div className="min-w-0 text-left">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">
                Invitations
              </p>
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                0
              </Badge>
            </div>
            <p className="truncate text-xs text-muted-foreground">
              No pending invitations
            </p>
          </div>
        </div>

        <div className={clubCardSectionEmptyFooterClass}>
          <p className="mb-3 text-center text-xs text-muted-foreground">
            Invite players to join this club.
          </p>
          <div className="flex h-8 w-full items-center justify-center">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                setTargetClubId(clubId)
                setDialog('memberManager', true)
              }}
            >
              <UserPlus className="size-4" />
              Invite
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Accordion className={clubCardSectionShellClass}>
      <AccordionItem value="invitations" className="border-0">
        <AccordionTrigger className={clubCardSectionTriggerClass}>
          <span
            className={clubCardSectionStripeClass('invitations')}
            aria-hidden
          />
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className={clubCardSectionIconWrapClass('invitations')}>
              <tone.Icon className={clubCardSectionIconClass('invitations')} />
            </div>

            <div className="min-w-0 text-left">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground">
                  Invitations
                </p>
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                  {memberCount}
                </Badge>
              </div>
              <p className="truncate text-xs text-muted-foreground">
                {memberCount === 1
                  ? '1 invitation in this club'
                  : `${memberCount} invitations in this club`}
              </p>
            </div>
          </div>

          <AvatarGroup
            users={sortedInvitations.map((invitation) => invitation.user)}
            max={4}
            className="mr-1 hidden sm:flex"
          />
        </AccordionTrigger>

        <AccordionContent className={clubCardSectionContentClass}>
          <ClubCardInvitationList invitations={sortedInvitations} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default ClubCardInvitations
