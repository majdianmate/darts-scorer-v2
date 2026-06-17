import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { type FC, useMemo } from 'react'
import { Badge } from '#/components/ui/badge'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { MatchStatus, type Match } from '../../../../types/match-types'

interface ClubMatchListItemProps {
  match: Match
}

function formatMatchDate(match: Match): string {
  const date = match.updatedAt?.toDate?.() ?? match.createdAt?.toDate?.()
  if (!date) return ''

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function statusVariant(
  status: MatchStatus,
): 'default' | 'secondary' | 'outline' {
  switch (status) {
    case MatchStatus.InProgress:
      return 'default'
    case MatchStatus.Ended:
      return 'secondary'
    default:
      return 'outline'
  }
}

const ClubMatchListItem: FC<ClubMatchListItemProps> = ({ match }) => {
  const teamNames = useMemo(
    () => match.teams.map((team) => team.name).join(' vs '),
    [match.teams],
  )

  return (
    <Link
      to="/match/$matchId"
      params={{ matchId: match.id }}
      className="block transition-opacity hover:opacity-90"
    >
      <Card className="group">
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <CardTitle className="truncate text-base">{teamNames}</CardTitle>
            <CardDescription className="line-clamp-2">
              {match.matchConfig.startingScore} ·{' '}
              {match.matchConfig.numberOfLegs} legs · leg {match.currentLeg}
            </CardDescription>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Badge variant={statusVariant(match.status)}>{match.status}</Badge>
            <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </div>
        </CardHeader>
        {formatMatchDate(match) ? (
          <p className="px-6 pb-4 text-xs text-muted-foreground">
            {formatMatchDate(match)}
          </p>
        ) : null}
      </Card>
    </Link>
  )
}

export default ClubMatchListItem
