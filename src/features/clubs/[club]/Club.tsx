import { Link, useParams } from '@tanstack/react-router'
import {
  ArrowLeft,
  Building2,
  Loader2,
  Mail,
  Plus,
  Settings,
  Target,
  Users,
  UsersRound,
} from 'lucide-react'
import { useMemo } from 'react'
import { useClub } from '../../../../hooks/use-club'
import { Button, buttonVariants } from '#/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '#/components/ui/scroll-area'
import { cn } from '#/lib/utils'
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from '@/components/animate-ui/components/animate/tabs'
import ClubMembers from './ClubMembers'
import ClubInvitations from './ClubInvitations'
import ClubSquads from './ClubSquads'
import ClubMatchList from './ClubMatchList'
import ClubSettings from './ClubSettings'
import { setDialog, setTargetClubId } from '../../../../store/store'

const Club = () => {
  const { club: clubId } = useParams({
    from: '/(protected)/_layout/clubs/$club',
  })
  const { club, isGetClubLoading, isGetClubError } = useClub(clubId)

  const stats = useMemo(() => {
    if (!club) return null
    return {
      members: club.members.length,
      invitations: club.invitations.length,
      squads: club.squads.length,
    }
  }, [club])

  if (isGetClubLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading club…
      </div>
    )
  }

  if (isGetClubError || !club) {
    return (
      <div className="flex flex-col gap-4">
        <Link
          to="/clubs"
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'sm' }),
            'w-fit gap-2',
          )}
        >
          <ArrowLeft className="size-4" />
          Back to clubs
        </Link>
        <p className="text-sm text-muted-foreground">Club not found.</p>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-50px)] min-h-0 flex-col gap-5 overflow-hidden">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
        <Link
          to="/clubs"
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'sm' }),
            'w-fit gap-2',
          )}
        >
          <ArrowLeft className="size-4" />
          Back to clubs
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              setTargetClubId(clubId)
              setDialog('memberManager', true)
            }}
          >
            <Plus className="size-4" />
            Add member
          </Button>
          <Button
            size="sm"
            className="gap-2"
            onClick={() => {
              setTargetClubId(clubId)
              setDialog('createSquad', true)
            }}
          >
            <Plus className="size-4" />
            Add squad
          </Button>
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-3 rounded-xl border border-border/70 bg-linear-to-br from-muted/30 via-background to-background p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background/80 shadow-sm">
            <Building2 className="size-5 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl font-bold tracking-tight">{club.name}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
              {club.description || 'No description yet.'}
            </p>
          </div>
        </div>

        {stats ? (
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="gap-1.5 px-2.5 py-1">
              <Users className="size-3.5" />
              {stats.members} members
            </Badge>
            <Badge variant="secondary" className="gap-1.5 px-2.5 py-1">
              <Mail className="size-3.5" />
              {stats.invitations} invites
            </Badge>
            <Badge variant="secondary" className="gap-1.5 px-2.5 py-1">
              <UsersRound className="size-3.5" />
              {stats.squads} squads
            </Badge>
          </div>
        ) : null}
      </div>

      <Tabs className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <TabsList
          defaultValue="members"
          className="w-full shrink-0 justify-start"
        >
          <TabsTrigger value="members" className="gap-1.5">
            <Users className="size-3.5" />
            Members
            {stats ? (
              <span className="text-[10px] tabular-nums text-muted-foreground">
                {stats.members}
              </span>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="invitations" className="gap-1.5">
            <Mail className="size-3.5" />
            Invitations
            {stats && stats.invitations > 0 ? (
              <span className="text-[10px] tabular-nums text-muted-foreground">
                {stats.invitations}
              </span>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="squads" className="gap-1.5">
            <UsersRound className="size-3.5" />
            Squads
            {stats ? (
              <span className="text-[10px] tabular-nums text-muted-foreground">
                {stats.squads}
              </span>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="matches" className="gap-1.5">
            <Target className="size-3.5" />
            Matches
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-1.5">
            <Settings className="size-3.5" />
            Settings
          </TabsTrigger>
        </TabsList>
        <ScrollArea className="mt-4 min-h-0 flex-1 [scrollbar-gutter:stable] pr-2">
          <TabsContents className="pb-4">
            <TabsContent value="members">
              <ClubMembers members={club.members} />
            </TabsContent>
            <TabsContent value="invitations">
              <ClubInvitations
                invitations={club.invitations}
                clubId={club.id}
              />
            </TabsContent>
            <TabsContent value="squads">
              <ClubSquads squads={club.squads} clubId={club.id} />
            </TabsContent>
            <TabsContent value="matches">
              <ClubMatchList clubId={club.id} />
            </TabsContent>
            <TabsContent value="settings">
              <ClubSettings club={club} />
            </TabsContent>
          </TabsContents>
        </ScrollArea>
      </Tabs>
    </div>
  )
}

export default Club
