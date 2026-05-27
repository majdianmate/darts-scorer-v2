import { type FC, useMemo } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { cn } from '#/lib/utils.ts'
import { Users } from 'lucide-react'
import type { ClubMember } from '../../../../types/club-types'
import ClubCardMemberItem from './ClubCardMemberItem'
import AvatarGroup from '#/components/AvatarGroup'
import { sortMembersByRole } from './roles'

interface ClubCardMembersProps {
  members: ClubMember[]
}

const ClubCardMembers: FC<ClubCardMembersProps> = ({ members }) => {
  const sortedMembers = useMemo(
    () => sortMembersByRole(members),
    [members],
  )

  const memberCount = members.length

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
              <Users className="size-4 text-muted-foreground" />
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

        <AccordionContent className="px-3 pb-3">
          <div className="flex flex-col gap-1.5">
            {sortedMembers.map((member, index) => (
              <ClubCardMemberItem
                key={member.id}
                member={member}
                rank={index + 1}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default ClubCardMembers
