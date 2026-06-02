import { useEffect, useLayoutEffect, useState } from 'react'
import { useSelector } from '@tanstack/react-store'
import { Loader2, Settings, Undo2 } from 'lucide-react'
import { Route } from '@/routes/(protected)/_layout.match.$matchId'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'
import { isMatchEnded } from '#/utils/match-leg-utils'
import { useMatch, useMatchSubscription } from '../../../../hooks/use-match'
import { useUser } from '../../../../hooks/use-user'
import { useClub } from '../../../../hooks/use-club'
import {
  canUndoLastScore,
  clearMatchStore,
  loadMatch,
  matchStore,
  undoLastScore,
} from '../../../../store/match-store'
import TeamCard from './TeamCard/TeamCard'
import ScoreInput from './ScoreInput'
import MatchWinDialog from './MatchWinDialog'
import ScoreDisplay from './ScoreDisplay'

const Match = () => {
  const { matchId } = Route.useParams()
  const { match, isGetMatchLoading, isGetMatchError } = useMatch(matchId)
  const { user } = useUser()
  const { club } = useClub(match?.clubId ?? '')
  const storeMatch = useSelector(matchStore, (state) => state.match)
  const teams = useSelector(matchStore, (state) => state.teams)
  const [isUndoing, setIsUndoing] = useState(false)
  const [winDialogDismissed, setWinDialogDismissed] = useState(false)
  const canUndo = useSelector(matchStore, () => canUndoLastScore())
  const matchEnded = storeMatch ? isMatchEnded(storeMatch) : false
  const winnerTeam = storeMatch?.winnerTeamId
    ? teams.find((team) => team.id === storeMatch.winnerTeamId)
    : undefined
  useLayoutEffect(() => {
    if (!match) return
    loadMatch(match)
  }, [match])

  useMatchSubscription(matchId, !!match && !isGetMatchError)

  useEffect(() => {
    setWinDialogDismissed(false)
  }, [matchId])

  useEffect(() => {
    return () => clearMatchStore()
  }, [])

  const isStoreSynced = storeMatch?.id === matchId

  if (isGetMatchLoading || (match && !isStoreSynced)) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading match…
      </div>
    )
  }

  if (isGetMatchError || !match || !storeMatch) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        Match not found.
      </p>
    )
  }

  if (!club?.members.some((member) => member.userId === user?.id)) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
        You are not a member of this club.
      </div>
    )
  }

  return (
    <div
      className={cn(
        'mx-auto flex h-full w-full flex-col gap-2',
        teams.length === 2 && 'max-w-4xl',
      )}
    >
      <MatchWinDialog
        open={matchEnded && !!winnerTeam && !winDialogDismissed}
        match={storeMatch}
        winnerTeam={winnerTeam}
        onClose={() => setWinDialogDismissed(true)}
      />

      <div className="flex gap-2 self-end">
        <Button
          variant="outline"
          disabled={!canUndo || isUndoing || matchEnded}
          onClick={() => {
            setIsUndoing(true)
            void undoLastScore().finally(() => setIsUndoing(false))
          }}
        >
          <Undo2 className="size-4" />
          Undo last score
        </Button>
      </div>

      <div className="flex h-full w-full justify-center gap-4">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
      <ScoreInput disabled={matchEnded} />
      <ScoreDisplay />
    </div>
  )
}

export default Match
