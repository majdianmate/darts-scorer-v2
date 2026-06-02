import { type FC } from 'react'
import Avatar from '#/components/Avatar'
import { getSquadIcon } from '#/components/IconPicker/squad-icon-registry'
import { cn } from '#/lib/utils'
import type { MockTeamCardData } from '#/utils/mock'

interface Props {
  team: MockTeamCardData
}

const TeamCardNexus: FC<Props> = ({ team }) => {
  const TeamIcon = getSquadIcon(team.icon)
  const active = team.members.find((m) => m.id === team.currentPlayerId)

  return (
    <div
      className={cn(
        'relative flex min-h-[480px] flex-col overflow-hidden bg-[#050508] font-mono transition-all',
        !team.isCurrentTeam && 'opacity-75',
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(0deg, transparent 50%, rgba(255,255,255,0.5) 50%)',
          backgroundSize: '100% 4px',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${team.color}40, transparent 55%)`,
        }}
      />

      <div className="relative border-b border-white/10 px-4 py-2">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-white/40">
          <span>SYS/MATCH/LIVE</span>
          <span className="tabular-nums">{team.stats.dartsThrown} darts thrown</span>
        </div>
        <div className="mt-1 flex items-center gap-3">
          <TeamIcon className="size-4" style={{ color: team.color }} />
          <span className="text-sm font-bold uppercase text-white">{team.name}</span>
          {team.isCurrentTeam && (
            <span
              className="ml-auto animate-pulse px-2 py-0.5 text-[9px] font-bold text-black"
              style={{ backgroundColor: team.color }}
            >
              ACTIVE
            </span>
          )}
        </div>
      </div>

      <div className="relative grid grid-cols-[1fr_auto] gap-4 px-4 py-4">
        <div>
          <p className="text-[9px] text-white/30">TARGET_REMAINING</p>
          <p
            className="text-7xl font-bold tabular-nums leading-none"
            style={{ color: team.color, textShadow: `0 0 20px ${team.color}80` }}
          >
            {team.remainingScore}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
            <span className="text-white/30">leg_win</span>
            <span className="text-right font-bold tabular-nums text-white/80">
              {team.stats.winProbability}%
            </span>
            <span className="text-white/30">visit_3avg</span>
            <span className="text-right font-bold tabular-nums text-white/80">
              {team.stats.visitAverage.toFixed(1)}
            </span>
            <span className="text-white/30">momentum</span>
            <span
              className="text-right font-bold uppercase"
              style={{ color: team.stats.momentum === 'hot' ? team.color : undefined }}
            >
              {team.stats.momentum}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-[9px] text-white/30">CHECKOUT_PATH</p>
          {team.recommendedCheckout.map((dart, i) => (
            <div
              key={`${dart}-${i}`}
              className="flex items-center gap-2 border border-white/10 px-2 py-1"
            >
              <span className="text-[8px] text-white/25">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-sm font-bold tabular-nums" style={{ color: team.color }}>
                {dart}
              </span>
            </div>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="relative mx-4 mb-3 border border-white/10 p-3"
          style={{ borderColor: `${team.color}50`, backgroundColor: `${team.color}08` }}
        >
          <div className="mb-2 flex items-center gap-2 text-[9px] uppercase tracking-widest text-white/40">
            <span style={{ color: team.color }}>▶</span> Current operator
          </div>
          <div className="flex items-center gap-3">
            <Avatar name={active.name} image={active.image} size="sm" className="rounded-none" />
            <div className="flex-1">
              <p className="text-xs font-bold uppercase">{active.name}</p>
              <div className="mt-1 flex gap-3 text-[10px]">
                <span>
                  <span className="text-white/30">m_avg </span>
                  <span className="font-bold tabular-nums">{active.matchAverage.toFixed(1)}</span>
                </span>
                <span>
                  <span className="text-white/30">l_avg </span>
                  <span className="font-bold tabular-nums">{active.legAverage.toFixed(1)}</span>
                </span>
                <span>
                  <span className="text-white/30">last </span>
                  <span className="font-bold tabular-nums" style={{ color: team.color }}>
                    {active.lastVisit}
                  </span>
                </span>
              </div>
            </div>
            <div className="flex gap-1">
              {active.visitHistory.map((v, i) => (
                <div
                  key={i}
                  className="flex size-8 flex-col items-center justify-center border border-white/10 text-[10px]"
                >
                  <span className="text-[7px] text-white/25">v{i + 1}</span>
                  <span className="font-bold tabular-nums">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="relative mx-4 mb-3 space-y-1">
        {team.members
          .filter((m) => m.id !== team.currentPlayerId)
          .map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-2 border-l border-white/10 py-1 pl-2 text-[10px] opacity-50"
            >
              <Avatar name={member.name} image={member.image} size="xs" className="rounded-none" />
              <span className="flex-1 truncate uppercase">{member.name}</span>
              <span className="tabular-nums">{member.matchAverage.toFixed(1)}</span>
              <span className="tabular-nums text-white/30">{member.lastVisit}</span>
            </div>
          ))}
      </div>

      <div className="relative mt-auto grid grid-cols-4 border-t border-white/10 bg-black/40 text-[10px]">
        {[
          ['M.AVG', team.stats.matchAverage.toFixed(1)],
          ['L.AVG', team.stats.legAverage.toFixed(1)],
          ['CO%', `${team.stats.checkoutRate}%`],
          ['180', String(team.stats.ton80s)],
          ['DBL%', `${team.stats.doublesRate}%`],
          ['HI.CO', String(team.stats.highestCheckout)],
          ['HI.V', String(team.stats.highestVisit)],
          ['LEGS', `${team.legsWon}/${team.legsTarget}`],
        ].map(([k, v]) => (
          <div key={k} className="border-r border-b border-white/5 px-2 py-2 last:border-r-0">
            <p className="text-[7px] text-white/25">{k}</p>
            <p className="font-bold tabular-nums text-white/90">{v}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeamCardNexus
