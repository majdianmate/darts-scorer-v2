import { type FC, useMemo } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import type { ClubMember } from '#/features/clubs/types/club-types'
import { sortMembersByRole } from './roles'
import ClubCardMemberList from './ClubCardMemberList'
import {
  clubCardSectionContentClass,
  clubCardSectionIconClass,
  clubCardSectionIconWrapClass,
  clubCardSectionShellClass,
  clubCardSectionStripeClass,
  clubCardSectionTriggerClass,
  getClubCardSectionTone,
} from './club-card-section-styles'
import AvatarGroup from '#/components/AvatarGroup'

interface ClubCardMembersProps {
  members: ClubMember[]
}

const ClubCardMembers: FC<ClubCardMembersProps> = ({ members }) => {
  const tone = getClubCardSectionTone('members')
  const sortedMembers = useMemo(
    () => sortMembersByRole(members),
    [members],
  )

  const memberCount = members.length

  return (
    <Accordion type="multiple" className={clubCardSectionShellClass}>
      <AccordionItem value="members" className="border-0">
        <AccordionTrigger className={clubCardSectionTriggerClass}>
          <span
            className={clubCardSectionStripeClass('members')}
            aria-hidden
          />
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className={clubCardSectionIconWrapClass('members')}>
              <tone.Icon className={clubCardSectionIconClass('members')} />
            </div>

            <div className="min-w-0 text-left">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground">Members</p>
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                  {memberCount}
                </Badge>
              </div>
              <p className="truncate text-xs text-muted-foreground">
                {memberCount === 1
                  ? '1 player in this club'
                  : `${memberCount} players in this club`}
              </p>
            </div>
          </div>

          <AvatarGroup
            users={sortedMembers.map((member) => member.user)}
            max={4}
            className="mr-1 hidden sm:flex"
          />
        </AccordionTrigger>

        <AccordionContent className={clubCardSectionContentClass}>
          <ClubCardMemberList members={sortedMembers} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default ClubCardMembers
