import { useEffect, useLayoutEffect, useState } from 'react'
import { useSelector } from '@tanstack/react-store'
import { Loader2, Undo2 } from 'lucide-react'
import PageHeaderCenter from '#/components/Sidebar/PageHeaderCenter'
import PageHeaderToolbar from '#/components/Sidebar/PageHeaderToolbar'
import { Route } from '@/routes/(protected)/_layout.match.$matchId'
import { Button } from '#/components/ui/button'
import { isMatchEnded } from '#/utils/match-leg-utils'
import { useMatch, useMatchSubscription } from '../../../../hooks/use-match'
import { useUser } from '../../../../hooks/use-user'
import { useClub } from '../../../../hooks/use-club'
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from '@/components/animate-ui/components/animate/tabs'
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
import MatchStatistics from './Statistics/MatchStatistics'

const Match = () => {
  const { matchId } = Route.useParams()
  const { match, isGetMatchLoading, isGetMatchError } = useMatch(matchId)
  const { user } = useUser()
  const { club } = useClub(match?.clubId ?? '')
  const storeMatch = useSelector(matchStore, (state) => state.match)
  const teams = useSelector(matchStore, (state) => state.teams)
  const [activeTab, setActiveTab] = useState('match')
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
    setActiveTab('match')
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
    <div className="mx-auto flex h-full min-h-0 w-full flex-col">
      <MatchWinDialog
        open={matchEnded && !!winnerTeam && !winDialogDismissed}
        match={storeMatch}
        winnerTeam={winnerTeam}
        onClose={() => setWinDialogDismissed(true)}
      />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex min-h-0 flex-1 flex-col"
      >
        <PageHeaderCenter>
          <TabsList className="shrink-0">
            <TabsTrigger value="match">Match</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>
        </PageHeaderCenter>

        <PageHeaderToolbar>
          <Button
            variant="outline"
            size="sm"
            disabled={!canUndo || isUndoing || matchEnded}
            onClick={() => {
              setIsUndoing(true)
              void undoLastScore().finally(() => setIsUndoing(false))
            }}
          >
            <Undo2 className="size-4" />
            Undo last score
          </Button>
        </PageHeaderToolbar>

        <TabsContents fill className="min-h-0 flex-1">
          <TabsContent
            value="match"
            className="flex h-full min-h-0 flex-col gap-2"
          >
            <div className="flex min-h-0 flex-1 justify-center gap-4">
              {teams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
            <ScoreInput disabled={matchEnded} />
            <ScoreDisplay />
          </TabsContent>
          <TabsContent value="statistics" className="h-full min-h-0">
            <MatchStatistics match={storeMatch} />
          </TabsContent>
        </TabsContents>
      </Tabs>
    </div>
  )
}

export default Match
