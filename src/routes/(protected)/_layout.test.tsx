import { createFileRoute } from '@tanstack/react-router'
import type { ComponentType } from 'react'
import TeamCardArena from '#/features/match/TeamCards/TeamCardArena'
import TeamCardBento from '#/features/match/TeamCards/TeamCardBento'
import TeamCardBoard from '#/features/match/TeamCards/TeamCardBoard'
import TeamCardCrest from '#/features/match/TeamCards/TeamCardCrest'
import TeamCardDial from '#/features/match/TeamCards/TeamCardDial'
import TeamCardFlight from '#/features/match/TeamCards/TeamCardFlight'
import TeamCardGlass from '#/features/match/TeamCards/TeamCardGlass'
import TeamCardOche from '#/features/match/TeamCards/TeamCardOche'
import TeamCardPodium from '#/features/match/TeamCards/TeamCardPodium'
import TeamCardRibbon from '#/features/match/TeamCards/TeamCardRibbon'
import TeamCardSplit from '#/features/match/TeamCards/TeamCardSplit'
import TeamCardHeavy from '#/features/match/TeamCards/TeamCardHeavy'
import TeamCardKillshot from '#/features/match/TeamCards/TeamCardKillshot'
import TeamCardNexus from '#/features/match/TeamCards/TeamCardNexus'
import TeamCardOverdrive from '#/features/match/TeamCards/TeamCardOverdrive'
import TeamCardScatter from '#/features/match/TeamCards/TeamCardScatter'
import TeamCardStack from '#/features/match/TeamCards/TeamCardStack'
import TeamCardStackFanLegArc from '#/features/match/TeamCards/TeamCardStackFanLegArc'
import TeamCardStackFanLegBar from '#/features/match/TeamCards/TeamCardStackFanLegBar'
import TeamCardStackFanLegPips from '#/features/match/TeamCards/TeamCardStackFanLegPips'
import TeamCardStackFanLegSteps from '#/features/match/TeamCards/TeamCardStackFanLegSteps'
import TeamCardStackFan from '#/features/match/TeamCards/TeamCardStackFan'
import TeamCardWide from '#/features/match/TeamCards/TeamCardWide'
import TeamCardEditorial from '#/features/match/TeamCards/TeamCardEditorial'
import TeamCardFlux from '#/features/match/TeamCards/TeamCardFlux'
import TeamCardGhost from '#/features/match/TeamCards/TeamCardGhost'
import TeamCardGloss from '#/features/match/TeamCards/TeamCardGloss'
import TeamCardLanes from '#/features/match/TeamCards/TeamCardLanes'
import TeamCardNoir from '#/features/match/TeamCards/TeamCardNoir'
import TeamCardShowcaseGlass from '#/features/match/TeamCards/TeamCardShowcaseGlass'
import TeamCardShowcaseRayLegs from '#/features/match/TeamCards/TeamCardShowcaseRayLegs'
import TeamCardShowcaseScoreRing from '#/features/match/TeamCards/TeamCardShowcaseScoreRing'
import TeamCardShowcaseSplit from '#/features/match/TeamCards/TeamCardShowcaseSplit'
import TeamCardShowcaseStadium from '#/features/match/TeamCards/TeamCardShowcaseStadium'
import TeamCardShowcaseTopBars from '#/features/match/TeamCards/TeamCardShowcaseTopBars'
import TeamCardShowcaseWedge from '#/features/match/TeamCards/TeamCardShowcaseWedge'
import type { MockTeamCardData } from '#/utils/mock'
import { getMockTeam, getShowcaseTeams, mockMatchPreview } from '#/utils/mock'

export const Route = createFileRoute('/(protected)/_layout/test')({
  component: TeamCardsTestPage,
})

type DesignEntry = {
  name: string
  Component: ComponentType<{ team: MockTeamCardData }>
}

const designs: DesignEntry[] = [
  { name: 'Glass', Component: TeamCardGlass },
  { name: 'Oche — TV Broadcast', Component: TeamCardOche },
  { name: 'Board — Dartboard', Component: TeamCardBoard },
  { name: 'Arena — Spotlight', Component: TeamCardArena },
]

const designsAlt: DesignEntry[] = [
  { name: 'Split — Color block', Component: TeamCardSplit },
  { name: 'Flight — Angular', Component: TeamCardFlight },
  { name: 'Podium — Tiered', Component: TeamCardPodium },
  { name: 'Ribbon — Tag', Component: TeamCardRibbon },
]

const designsMore: DesignEntry[] = [
  { name: 'Bento — Grid', Component: TeamCardBento },
  { name: 'Dial — Progress ring', Component: TeamCardDial },
  { name: 'Crest — Shield', Component: TeamCardCrest },
  { name: 'Stack — Fan cards', Component: TeamCardStack },
]

const designsBrutal: DesignEntry[] = [
  { name: 'Killshot — Checkout zone', Component: TeamCardKillshot },
  { name: 'Overdrive — Momentum', Component: TeamCardOverdrive },
  { name: 'Heavy — Industrial', Component: TeamCardHeavy },
  { name: 'Nexus — Data HUD', Component: TeamCardNexus },
]

const designsBold: DesignEntry[] = [
  { name: 'Wide — Landscape strip', Component: TeamCardWide },
  { name: 'Ghost — Watermark', Component: TeamCardGhost },
  { name: 'Lanes — Racing rows', Component: TeamCardLanes },
  { name: 'Scatter — Free float', Component: TeamCardScatter },
]

const designsPremium: DesignEntry[] = [
  { name: 'Gloss — Wet glass', Component: TeamCardGloss },
  { name: 'Noir — Luxury dial', Component: TeamCardNoir },
  { name: 'Flux — Aurora ring', Component: TeamCardFlux },
  { name: 'Editorial — Magazine', Component: TeamCardEditorial },
  { name: 'Stack Fan — Spread on hover', Component: TeamCardStackFan },
]

function DesignGrid({
  title,
  team,
  items,
  keyPrefix = '',
}: {
  title: string
  team: MockTeamCardData
  items: DesignEntry[]
  keyPrefix?: string
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
        {title}
      </h2>
      <div className="grid gap-8 md:grid-cols-2">
        {items.map(({ name, Component }) => (
          <div key={`${keyPrefix}${name}`} className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground">{name}</p>
            <Component team={team} />
          </div>
        ))}
      </div>
    </section>
  )
}

function DesignSection({
  heading,
  items,
  currentTeam,
  opponentTeam,
  keyPrefix,
}: {
  heading: string
  items: DesignEntry[]
  currentTeam: MockTeamCardData
  opponentTeam: MockTeamCardData
  keyPrefix: string
}) {
  return (
    <div className="space-y-10">
      <h2 className="display-title text-xl font-semibold">{heading}</h2>
      <DesignGrid title={`Active · ${currentTeam.name}`} team={currentTeam} items={items} keyPrefix={`${keyPrefix}a-`} />
      <DesignGrid title={`Waiting · ${opponentTeam.name}`} team={opponentTeam} items={items} keyPrefix={`${keyPrefix}w-`} />
    </div>
  )
}

const designsLegWin: DesignEntry[] = [
  { name: 'Pips — glowing dots', Component: TeamCardStackFanLegPips },
  { name: 'Bar — progress track', Component: TeamCardStackFanLegBar },
  { name: 'Steps — leg blocks', Component: TeamCardStackFanLegSteps },
  { name: 'Arc — ring counter', Component: TeamCardStackFanLegArc },
]

function TeamCardsTestPage() {
  const currentTeam = getMockTeam(mockMatchPreview.currentTeamId)
  const opponentTeam = getMockTeam(
    mockMatchPreview.teams.find((t) => t.id !== mockMatchPreview.currentTeamId)?.id,
  )
  const showcaseTeams = getShowcaseTeams()

  return (
    <div className="h-[calc(100dvh-3rem)] overflow-y-auto">
      <div className="mx-auto max-w-[100rem] space-y-10 pb-12">
        <header className="space-y-2">
          <h1 className="display-title text-3xl font-bold tracking-tight">
            Team Card Designs
          </h1>
          <p className="text-muted-foreground">
            Darts-themed variants — active team vs. waiting opponent.
          </p>
        </header>

        <section className="space-y-4">
          <div>
            <h2 className="display-title text-xl font-semibold">Match floor</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Primary layout — frosty glass, blurred team gradient, watermark icon, hover player fan.
            </p>
          </div>
          <div className="grid h-[min(720px,calc(100dvh-5rem))] min-h-[560px] grid-cols-1 gap-4 lg:grid-cols-3">
            {showcaseTeams.map((team) => (
              <TeamCardShowcaseGlass key={team.id} team={team} />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="display-title text-xl font-semibold">Match floor — inline players</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Same frosty layout as above — TeamCardGlass-style player row instead of hover fan.
            </p>
          </div>
          <div className="grid h-[min(720px,calc(100dvh-5rem))] min-h-[560px] grid-cols-1 gap-4 lg:grid-cols-3">
            {showcaseTeams.map((team) => (
              <TeamCardShowcaseGlass key={`${team.id}-row`} team={team} playersVariant="row" />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="display-title text-xl font-semibold">Match floor — checkout under score</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Inline players — glass checkout pill below score, last dart highlighted editorial-style.
            </p>
          </div>
          <div className="grid h-[min(720px,calc(100dvh-5rem))] min-h-[560px] grid-cols-1 gap-4 lg:grid-cols-3">
            {showcaseTeams.map((team) => (
              <TeamCardShowcaseGlass
                key={`${team.id}-checkout`}
                team={team}
                playersVariant="row"
                checkoutVariant="underScore"
              />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="display-title text-xl font-semibold">Match floor — full stats</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Inline players, tabbed stats panel, bottom menubar — game / player / score history.
            </p>
          </div>
          <div className="grid h-[min(720px,calc(100dvh-5rem))] min-h-[560px] grid-cols-1 gap-4 lg:grid-cols-3">
            {showcaseTeams.map((team) => (
              <TeamCardShowcaseGlass
                key={`${team.id}-stats`}
                team={team}
                playersVariant="row"
                checkoutVariant="underScore"
                extendedStats
              />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="display-title text-xl font-semibold">Leg win — test row</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Three leg indicator concepts on the frosty base — score dial, top bars, side ladder.
            </p>
          </div>
          <div className="grid h-[min(720px,calc(100dvh-5rem))] min-h-[560px] grid-cols-1 gap-4 lg:grid-cols-3">
            <TeamCardShowcaseScoreRing team={showcaseTeams[0]!} />
            <TeamCardShowcaseTopBars team={showcaseTeams[1]!} />
            <TeamCardShowcaseRayLegs team={showcaseTeams[2]!} />
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="display-title text-xl font-semibold">Leg win — round 2</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Fresh concepts — split rail, wedge burst, stadium gauge + chips.
            </p>
          </div>
          <div className="grid h-[min(720px,calc(100dvh-5rem))] min-h-[560px] grid-cols-1 gap-4 lg:grid-cols-3">
            <TeamCardShowcaseSplit team={showcaseTeams[0]!} />
            <TeamCardShowcaseWedge team={showcaseTeams[1]!} />
            <TeamCardShowcaseStadium team={showcaseTeams[2]!} />
          </div>
        </section>

        <DesignGrid title={`Active · ${currentTeam.name}`} team={currentTeam} items={designs} />
        <DesignGrid title={`Waiting · ${opponentTeam.name}`} team={opponentTeam} items={designs} keyPrefix="opp-" />

        <div className="space-y-10 border-t border-border pt-10">
          <section className="space-y-10">
            <div>
              <h2 className="display-title text-xl font-semibold">Leg win indicators</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Stack Fan base — each variant shown at match height (active vs waiting).
              </p>
            </div>
            {designsLegWin.map(({ name, Component }) => (
              <div key={name} className="space-y-3">
                <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                  {name}
                </p>
                <div className="grid h-[min(680px,calc(100dvh-6rem))] min-h-[520px] grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="flex min-h-0 flex-col gap-1">
                    <p className="shrink-0 text-[10px] uppercase text-muted-foreground">
                      Active · {currentTeam.name}
                    </p>
                    <div className="min-h-0 flex-1">
                      <Component team={currentTeam} />
                    </div>
                  </div>
                  <div className="flex min-h-0 flex-col gap-1">
                    <p className="shrink-0 text-[10px] uppercase text-muted-foreground">
                      Waiting · {opponentTeam.name}
                    </p>
                    <div className="min-h-0 flex-1">
                      <Component team={opponentTeam} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section className="space-y-4">
            <h2 className="display-title text-xl font-semibold">Stack Fan — fullscreen</h2>
            <p className="text-sm text-muted-foreground">
              Match layout preview — cards fill available height.
            </p>
            <div className="grid h-[min(680px,calc(100dvh-6rem))] min-h-[520px] grid-cols-1 gap-4 lg:grid-cols-2">
              <TeamCardStackFan team={currentTeam} />
              <TeamCardStackFan team={opponentTeam} />
            </div>
          </section>

          <DesignSection heading="Alternative layouts" items={designsAlt} currentTeam={currentTeam} opponentTeam={opponentTeam} keyPrefix="alt-" />
          <DesignSection heading="More layouts" items={designsMore} currentTeam={currentTeam} opponentTeam={opponentTeam} keyPrefix="more-" />
          <DesignSection heading="Brutal" items={designsBrutal} currentTeam={currentTeam} opponentTeam={opponentTeam} keyPrefix="brutal-" />
          <DesignSection heading="Bold — different layouts" items={designsBold} currentTeam={currentTeam} opponentTeam={opponentTeam} keyPrefix="bold-" />
          <DesignSection heading="Premium" items={designsPremium} currentTeam={currentTeam} opponentTeam={opponentTeam} keyPrefix="premium-" />
        </div>
      </div>
    </div>
  )
}
