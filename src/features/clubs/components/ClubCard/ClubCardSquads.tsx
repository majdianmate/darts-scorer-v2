import { type FC, useMemo } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Plus } from 'lucide-react'
import type { Squad } from '#/features/clubs/types/club-types'
import { useStore } from '../../../../../store/store'
import ClubCardSquadList from './ClubCardSquadList'
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
import AvatarGroup from '#/components/AvatarGroup'

interface ClubCardSquadsProps {
  squads: Squad[]
  clubId: string
}

const ClubCardSquads: FC<ClubCardSquadsProps> = ({ squads, clubId }) => {
  const tone = getClubCardSectionTone('squads')
  const sortedSquads = useMemo(
    () => [...squads].sort((a, b) => a.name.localeCompare(b.name)),
    [squads],
  )

  const setTargetClubId = useStore((state) => state.setTargetClubId);
  const setDialogOpen = useStore((state) => state.setDialogOpen);

  const squadCount = squads.length

  const previewUsers = useMemo(() => {
    const seen = new Set()
    return sortedSquads
      .flatMap((squad) =>
        squad.members.map((squadMember) => squadMember.member.user),
      )
      .filter((user) => {
        if (!user?.id) return false
        if (seen.has(user.id)) return false
        seen.add(user.id)
        return true
      })
  }, [sortedSquads])

  if (squadCount === 0) {
    return (
      <div className={clubCardSectionShellClass}>
        <div className="relative flex items-center gap-3 bg-muted/40 px-3 py-3 pl-4">
          <span
            className={clubCardSectionStripeClass('squads')}
            aria-hidden
          />
          <div className={clubCardSectionIconWrapClass('squads')}>
            <tone.Icon className={clubCardSectionIconClass('squads')} />
          </div>

          <div className="min-w-0 text-left">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">Squads</p>
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                0
              </Badge>
            </div>
            <p className="truncate text-xs text-muted-foreground">
              No squads in this club
            </p>
          </div>
        </div>

        <div className={clubCardSectionEmptyFooterClass}>
          <p className="mb-3 text-center text-xs text-muted-foreground">
            Create squads to organize players for matches.
          </p>
          <div className="flex h-8 w-full items-center justify-center">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                setTargetClubId(clubId)
                setDialogOpen('createSquad', true)
              }}
            >
              <Plus className="size-4" />
              Create squad
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Accordion type="multiple" className={clubCardSectionShellClass}>
      <AccordionItem value="squads" className="border-0">
        <AccordionTrigger className={clubCardSectionTriggerClass}>
          <span
            className={clubCardSectionStripeClass('squads')}
            aria-hidden
          />
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className={clubCardSectionIconWrapClass('squads')}>
              <tone.Icon className={clubCardSectionIconClass('squads')} />
            </div>

            <div className="min-w-0 text-left">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground">Squads</p>
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                  {squadCount}
                </Badge>
              </div>
              <p className="truncate text-xs text-muted-foreground">
                {squadCount === 1
                  ? '1 squad in this club'
                  : `${squadCount} squads in this club`}
              </p>
            </div>
          </div>

          {previewUsers.length > 0 && (
            <AvatarGroup
              users={previewUsers}
              max={4}
              className="mr-1 hidden sm:flex"
            />
          )}
        </AccordionTrigger>

        <AccordionContent className={clubCardSectionContentClass}>
          <ClubCardSquadList squads={sortedSquads} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default ClubCardSquads
