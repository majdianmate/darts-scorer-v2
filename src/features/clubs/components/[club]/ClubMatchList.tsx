import { Target } from 'lucide-react'
import { type FC } from 'react'

interface ClubMatchListProps {
  clubId: string
}

const ClubMatchList: FC<ClubMatchListProps> = () => {
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

export default ClubMatchList
