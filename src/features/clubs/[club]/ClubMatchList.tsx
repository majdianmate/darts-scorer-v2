import { Loader2, Target } from 'lucide-react'
import { type FC } from 'react'
import { useClubMatches } from '../../../../hooks/use-match'
import ClubMatchListItem from './ClubMatchListItem'

interface ClubMatchListProps {
  clubId: string
}

const ClubMatchList: FC<ClubMatchListProps> = ({ clubId }) => {
  const { matches, isGetClubMatchesLoading, isGetClubMatchesError } =
    useClubMatches(clubId)

  if (isGetClubMatchesLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading matches…
      </div>
    )
  }

  if (isGetClubMatchesError) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        Could not load club matches.
      </p>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
        <Target className="mb-3 size-10 text-muted-foreground/60" />
        <p className="font-medium text-foreground">No matches yet</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Start a match from this club to see it listed here.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {matches.map((match) => (
        <ClubMatchListItem key={match.id} match={match} />
      ))}
    </div>
  )
}

export default ClubMatchList
