import { type FC, useMemo } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { cn } from '#/lib/utils.ts'
import { UserPlus } from 'lucide-react'
import type { ClubMember } from '../../../../types/club-types'
import ClubCardMemberItem from './ClubCardMemberItem'
import AvatarGroup from '#/components/AvatarGroup'
import { sortMembersByRole } from './roles'
import ClubCardInvitationList from './ClubCardInvitationList'
import { Button } from '#/components/ui/button'
import { setDialog, setTargetClubId } from '../../../../store/store'

interface ClubCardInvitationsProps {
  invitations: ClubMember[]
  clubId: string
}

const ClubCardInvitations: FC<ClubCardInvitationsProps> = ({ invitations, clubId }) => {
  const sortedInvitations = useMemo(
    () => sortMembersByRole(invitations),
    [invitations],
  )

  const memberCount = invitations.length

  if (memberCount === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-border/70 bg-linear-to-b from-muted/30 to-background shadow-sm">
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background/80 shadow-sm">
            <UserPlus className="size-4 text-muted-foreground" />
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

        <div className="border-t border-border/50 px-3 py-3">
          <p className="mb-3 text-center text-xs text-muted-foreground">
            Invite players to join this club.
          </p>
          <div className="h-8 w-full flex justify-center items-center">
            <Button
              variant="outline"
              size="sm"
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
    <Accordion className="overflow-hidden rounded-xl border border-border/70 bg-linear-to-b from-muted/30 to-background shadow-sm">
      <AccordionItem value="members" className="border-0">
        <AccordionTrigger
          className={cn(
            'items-center gap-3 px-3 py-3 hover:no-underline',
            '[&_[data-slot=accordion-trigger-icon]]:mt-0',
          )}
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background/80 shadow-sm">
              <UserPlus className="size-4 text-muted-foreground" />
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

        <AccordionContent className="px-3 pb-3">
          <ClubCardInvitationList invitations={sortedInvitations} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default ClubCardInvitations
