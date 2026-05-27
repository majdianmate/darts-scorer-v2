import { type FC, useMemo } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils.ts'
import { Layers, Plus } from 'lucide-react'
import type { Squad } from '../../../../types/club-types'
import AvatarGroup from '#/components/AvatarGroup'
import { setDialog, setTargetClubId } from '../../../../store/store'
import ClubCardSquadList from './ClubCardSquadList'

interface ClubCardSquadsProps {
  squads: Squad[]
  clubId: string
}

const ClubCardSquads: FC<ClubCardSquadsProps> = ({ squads, clubId }) => {
  const sortedSquads = useMemo(
    () => [...squads].sort((a, b) => a.name.localeCompare(b.name)),
    [squads],
  )

  const squadCount = squads.length

  const previewUsers = useMemo(
    () =>
      sortedSquads.flatMap((squad) =>
        squad.members.map((squadMember) => squadMember.member.user),
      ),
    [sortedSquads],
  )

  if (squadCount === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-border/70 bg-linear-to-b from-muted/30 to-background shadow-sm">
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background/80 shadow-sm">
            <Layers className="size-4 text-muted-foreground" />
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

        <div className="border-t border-border/50 px-3 py-3">
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
                setDialog('createSquad', true)
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
    <Accordion className="overflow-hidden rounded-xl border border-border/70 bg-linear-to-b from-muted/30 to-background shadow-sm">
      <AccordionItem value="squads" className="border-0">
        <AccordionTrigger
          className={cn(
            'items-center gap-3 px-3 py-3 hover:no-underline',
            '[&_[data-slot=accordion-trigger-icon]]:mt-0',
          )}
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background/80 shadow-sm">
              <Layers className="size-4 text-muted-foreground" />
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

        <AccordionContent className="px-3 pb-3">
          <ClubCardSquadList squads={sortedSquads} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default ClubCardSquads
