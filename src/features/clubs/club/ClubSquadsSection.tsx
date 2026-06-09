import { useMemo, type FC } from 'react'
import { Plus, UsersRound } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'
import type { Squad } from '../../../../types/club-types'
import { setDialog, setTargetClubId } from '../../../../store/store'
import ClubEmptyState from './ClubEmptyState'
import ClubSquadTile from './ClubSquadTile'

type ClubSquadsSectionProps = {
  squads: Squad[]
  clubId: string
}

const ClubSquadsSection: FC<ClubSquadsSectionProps> = ({ squads, clubId }) => {
  const sortedSquads = useMemo(
    () => [...squads].sort((a, b) => a.name.localeCompare(b.name)),
    [squads],
  )

  const openCreateSquad = () => {
    setTargetClubId(clubId)
    setDialog('createSquad', true)
  }

  if (squads.length === 0) {
    return (
      <ClubEmptyState
        icon={UsersRound}
        title="No squads yet"
        description="Group players into squads for matches and events."
        action={
          <Button size="sm" className="gap-2" onClick={openCreateSquad}>
            <Plus className="size-4" />
            Create squad
          </Button>
        }
      />
    )
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {sortedSquads.length} squad{sortedSquads.length === 1 ? '' : 's'}
        </p>
        <Button size="sm" variant="outline" className="gap-2" onClick={openCreateSquad}>
          <Plus className="size-4" />
          New squad
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {sortedSquads.map((squad) => (
          <ClubSquadTile key={squad.id} squad={squad} />
        ))}

        <button
          type="button"
          onClick={openCreateSquad}
          className={cn(
            'flex min-h-[8.5rem] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/70 bg-transparent p-4 text-sm text-muted-foreground transition-colors hover:border-border hover:bg-muted/20 hover:text-foreground',
          )}
        >
          <Plus className="size-5" />
          Add squad
        </button>
      </div>
    </div>
  )
}

export default ClubSquadsSection
