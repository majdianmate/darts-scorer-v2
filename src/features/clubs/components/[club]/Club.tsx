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
import { useMemo, useState } from 'react'
import { useClub } from '#/features/clubs/hooks/use-club'
import { Button, buttonVariants } from '#/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '#/components/ui/scroll-area'
import { cn } from '#/lib/utils'
import ClubMembers from './ClubMembers'
import ClubInvitations from './ClubInvitations'
import ClubSquads from './ClubSquads'
import ClubMatchList from './ClubMatchList'
import ClubSettings from './ClubSettings'
import { useStore } from '../../../../../store/store'

type ClubTab = 'members' | 'invitations' | 'squads' | 'matches' | 'settings'

const Club = () => {
  const { id: clubId } = useParams({
    from: '/_protected/clubs/$id',
  })
  const { club, isGetClubLoading, isGetClubError } = useClub(clubId);
  const [activeTab, setActiveTab] = useState<ClubTab>('members')

  const setTargetClubId = useStore((state) => state.setTargetClubId);
  const setDialogOpen = useStore((state) => state.setDialogOpen);

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
    <div className="flex h-full min-h-0 flex-col gap-5 overflow-hidden">
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
              setDialogOpen('memberManager', true)
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
              setDialogOpen('createSquad', true)
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
            <p className="text-sm text-muted-foreground line-clamp-2">
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

      <div className="flex min-h-0 flex-1 gap-4 overflow-hidden">
        <nav className="h-fit w-40 shrink-0 self-start rounded-lg border border-border/70 bg-muted/20 p-2">
          {[
            {
              value: 'members',
              label: 'Members',
              icon: Users,
              count: stats?.members,
            },
            {
              value: 'invitations',
              label: 'Invitations',
              icon: Mail,
              count: stats?.invitations,
            },
            {
              value: 'squads',
              label: 'Squads',
              icon: UsersRound,
              count: stats?.squads,
            },
            {
              value: 'matches',
              label: 'Matches',
              icon: Target,
            },
            {
              value: 'settings',
              label: 'Settings',
              icon: Settings,
            },
          ].map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.value

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setActiveTab(item.value as ClubTab)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                  isActive && 'bg-background text-foreground shadow-sm',
                )}
              >
                <Icon className="size-3.5 shrink-0" />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {item.count !== undefined ? (
                  <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                    {item.count}
                  </Badge>
                ) : null}
              </button>
            )
          })}
        </nav>
        <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-border/70 bg-background/95 shadow-sm">
          <ScrollArea className="h-full min-h-0 [scrollbar-gutter:stable]">
          <div className="p-4">
            {activeTab === 'members' ? (
              <ClubMembers members={club.members} />
            ) : null}
            {activeTab === 'invitations' ? (
              <ClubInvitations
                invitations={club.invitations}
                clubId={club.id}
              />
            ) : null}
            {activeTab === 'squads' ? (
              <ClubSquads squads={club.squads} clubId={club.id} />
            ) : null}
            {activeTab === 'matches' ? (
              <ClubMatchList clubId={club.id} />
            ) : null}
            {activeTab === 'settings' ? (
              <ClubSettings club={club} />
            ) : null}
          </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default Club
