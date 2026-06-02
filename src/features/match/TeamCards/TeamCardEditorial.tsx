import { type FC } from 'react'
import Avatar from '#/components/Avatar'
import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'
import { cn } from '#/lib/utils'
import type { MockTeamCardData } from '#/utils/mock'

interface Props {
  team: MockTeamCardData
}

/** Magazine cover — asymmetric editorial layout, no centered column. */
const TeamCardEditorial: FC<Props> = ({ team }) => {
  const TeamIcon = getSquadIcon(team.icon)
  const active = team.members.find((m) => m.id === team.currentPlayerId)
  const others = team.members.filter((m) => m.id !== team.currentPlayerId)

  return (
    <div
      className={cn(
        'relative grid min-h-[480px] grid-cols-12 grid-rows-[auto_1fr_auto] overflow-hidden bg-[#f4f1ec] text-[#111] transition-all dark:bg-[#111] dark:text-[#f4f1ec]',
        !team.isCurrentTeam && 'opacity-75',
      )}
    >
      <div
        className="col-span-5 row-span-3 flex flex-col justify-between p-6"
        style={{ backgroundColor: team.isCurrentTeam ? team.color : `${team.color}cc` }}
      >
        <div>
          <TeamIcon className="mb-6 size-8 text-white/90" strokeWidth={1.5} />
          <h3 className="display-title text-3xl font-bold leading-[0.95] text-white">
            {team.name}
          </h3>
          <p className="mt-3 text-xs font-medium uppercase tracking-[0.3em] text-white/60">
            {team.isCurrentTeam ? 'At the oche' : 'Waiting'}
          </p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">To go</p>
          <p className="text-[88px] font-black leading-[0.85] tabular-nums text-white">
            {team.remainingScore}
          </p>
        </div>

        <div className="space-y-1 text-xs text-white/70">
          <p>{team.stats.matchAverage.toFixed(1)} match avg</p>
          <p>{team.stats.winProbability}% win prob</p>
          <p>{team.stats.ton80s} × 180</p>
        </div>
      </div>

      <div className="col-span-7 flex flex-col border-b border-black/10 p-5 dark:border-white/10">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.35em] opacity-40">
          Checkout route
        </p>
        <div className="flex items-baseline gap-4">
          {team.recommendedCheckout.map((d, i) => (
            <span key={`${d}-${i}`} className="flex items-baseline gap-4">
              {i > 0 && <span className="text-2xl font-thin opacity-20">/</span>}
              <span
                className={cn(
                  'font-black tabular-nums',
                  i === team.recommendedCheckout.length - 1 ? 'text-4xl' : 'text-2xl opacity-50',
                )}
                style={i === team.recommendedCheckout.length - 1 ? { color: team.color } : undefined}
              >
                {d}
              </span>
            </span>
          ))}
        </div>
        <p className="mt-auto text-xs opacity-40">
          {team.legsWon} of {team.legsTarget} legs · CO {team.stats.checkoutRate}%
        </p>
      </div>

      <div className="col-span-7 flex flex-col justify-center gap-4 p-5">
        {active && (
          <div className="flex items-center gap-4 border-l-4 pl-4" style={{ borderColor: team.color }}>
            <Avatar name={active.name} image={active.image} size="lg" className="rounded-none" />
            <div>
              <p className="text-lg font-bold">{active.name}</p>
              <p className="text-sm opacity-50">
                {active.matchAverage.toFixed(1)} · leg {active.legAverage.toFixed(1)} · last {active.lastVisit}
              </p>
              <div className="mt-2 flex gap-2">
                {active.visitHistory.map((v, i) => (
                  <span
                    key={i}
                    className="px-1.5 py-px text-xs font-bold tabular-nums"
                    style={v >= 100 ? { backgroundColor: `${team.color}25`, color: team.color } : { opacity: 0.4 }}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-6 pl-4">
          {others.map((m) => (
            <div key={m.id} className="flex items-center gap-2 opacity-45">
              <Avatar name={m.name} image={m.image} size="xs" className="rounded-none" />
              <div>
                <p className="text-[11px] font-medium">{m.name.split(' ')[0]}</p>
                <p className="text-[10px] tabular-nums">{m.matchAverage.toFixed(1)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-7 grid grid-cols-4 gap-px bg-black/10 dark:bg-white/10">
        {[
          ['Leg', team.stats.legAverage.toFixed(1)],
          ['Dbl', `${team.stats.doublesRate}%`],
          ['Hi', String(team.stats.highestVisit)],
          ['Darts', String(team.stats.dartsThrown)],
        ].map(([k, v]) => (
          <div key={k} className="bg-[#f4f1ec] px-3 py-3 dark:bg-[#111]">
            <p className="text-[9px] uppercase opacity-40">{k}</p>
            <p className="text-lg font-black tabular-nums">{v}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeamCardEditorial
