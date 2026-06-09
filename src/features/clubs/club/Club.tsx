import { Link, useParams } from '@tanstack/react-router'
import { ArrowLeft, Loader2, Plus, UserPlus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { usePageHeader } from '#/components/Sidebar'
import { Button, buttonVariants } from '#/components/ui/button'
import { cn } from '#/lib/utils'
import { ScrollArea } from '#/components/ui/scroll-area'
import { useClub } from '../../../../hooks/use-club'
import { setDialog, setTargetClubId } from '../../../../store/store'
import ClubInvitationsSection from './ClubInvitationsSection'
import ClubMatchesSection from './ClubMatchesSection'
import ClubMembersSection from './ClubMembersSection'
import ClubNav from './ClubNav'
import ClubSettingsSection from './ClubSettingsSection'
import ClubSquadsSection from './ClubSquadsSection'
import type { ClubSection } from './types'

const Club = () => {
  const { club: clubId } = useParams({
    from: '/(protected)/_layout/clubs/$club',
  })
  const { club, isGetClubLoading, isGetClubError } = useClub(clubId)
  const [section, setSection] = useState<ClubSection>('members')

  const counts = useMemo(() => {
    if (!club) return { members: 0, invitations: 0, squads: 0 }
    return {
      members: club.members.length,
      invitations: club.invitations.length,
      squads: club.squads.length,
    }
  }, [club])

  const toolbar = useMemo(
    () => (
      <>
        <Link
          to="/clubs"
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-2')}
        >
          <ArrowLeft className="size-4" />
          Clubs
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => {
            setTargetClubId(clubId)
            setDialog('memberManager', true)
          }}
        >
          <UserPlus className="size-4" />
          Invite
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
          Squad
        </Button>
      </>
    ),
    [clubId],
  )

  usePageHeader({
    title: club?.name ?? 'Club',
    toolbar,
  })

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
      <div className="space-y-4">
        <Link
          to="/clubs"
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-2')}
        >
          <ArrowLeft className="size-4" />
          Back to clubs
        </Link>
        <p className="text-sm text-muted-foreground">Club not found.</p>
      </div>
    )
  }

  const renderSection = () => {
    switch (section) {
      case 'members':
        return <ClubMembersSection members={club.members} clubId={club.id} />
      case 'invitations':
        return (
          <ClubInvitationsSection
            invitations={club.invitations}
            clubId={club.id}
          />
        )
      case 'squads':
        return <ClubSquadsSection squads={club.squads} clubId={club.id} />
      case 'matches':
        return <ClubMatchesSection />
      case 'settings':
        return <ClubSettingsSection club={club} />
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
        <aside className="hidden w-48 shrink-0 lg:block">
          <ClubNav
            active={section}
            onChange={setSection}
            counts={counts}
          />
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-border/60 bg-background">
          <div className="shrink-0 border-b border-border/60 px-4 py-4 sm:px-6">
            <p className="text-sm text-muted-foreground">
              {club.description || 'No description yet.'}
            </p>
          </div>

          <div className="shrink-0 px-4 pt-4 lg:hidden">
            <ClubNav
              active={section}
              onChange={setSection}
              counts={counts}
              layout="horizontal"
            />
          </div>

          <ScrollArea className="min-h-0 flex-1 [scrollbar-gutter:stable]">
            {renderSection()}
          </ScrollArea>
        </div>
      </div>
  )
}

export default Club
