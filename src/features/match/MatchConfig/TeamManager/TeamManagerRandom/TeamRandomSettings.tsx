import { useEffect, useMemo, type FC } from "react";
import { useSelector } from "@tanstack/react-store";
import { Label } from "#/components/ui/label";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/animate/tabs";
import {
  clampRandomTeamCount,
  getMaxRandomTeamCount,
  matchStore,
  MAX_RANDOM_TEAMS,
  MIN_RANDOM_TEAMS,
  setRandomTeamCount,
} from "../../../../../../store/match-store";
import { cn } from "#/lib/utils.ts";

interface TeamRandomSettingsProps {
  className?: string;
  membersCount: number;
}

const TeamRandomSettings: FC<TeamRandomSettingsProps> = ({
  className,
  membersCount,
}) => {
  const teamCount = useSelector(matchStore, (state) => state.randomDraft.teamCount);
  const maxTeams = getMaxRandomTeamCount(membersCount);

  const teamCountOptions = useMemo(() => {
    if (maxTeams < MIN_RANDOM_TEAMS) return [];

    return Array.from(
      { length: maxTeams - MIN_RANDOM_TEAMS + 1 },
      (_, index) => MIN_RANDOM_TEAMS + index,
    );
  }, [maxTeams]);

  useEffect(() => {
    const clamped = clampRandomTeamCount(teamCount, membersCount);
    if (clamped !== teamCount) {
      setRandomTeamCount(teamCount);
    }
  }, [membersCount, teamCount]);

  if (membersCount < MIN_RANDOM_TEAMS) {
    return (
      <div className={cn("space-y-1", className)}>
        <Label className="text-xs font-medium text-muted-foreground">
          Number of teams
        </Label>
        <p className="text-[11px] text-muted-foreground">
          Select at least {MIN_RANDOM_TEAMS} players to choose how many random
          teams to generate (max {MAX_RANDOM_TEAMS}).
        </p>
      </div>
    );
  }

  if (teamCountOptions.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div>
        <Label className="text-xs font-medium text-muted-foreground">
          Number of teams
        </Label>
        <p className="text-[11px] text-muted-foreground">
          Up to {maxTeams} team{maxTeams === 1 ? "" : "s"} from {membersCount}{" "}
          selected player{membersCount === 1 ? "" : "s"}.
        </p>
      </div>

      <Tabs
        value={String(teamCount)}
        onValueChange={(value) => setRandomTeamCount(Number(value))}
      >
        <TabsList
          className="relative grid h-8 w-full p-0.5"
          style={{
            gridTemplateColumns: `repeat(${teamCountOptions.length}, minmax(0, 1fr))`,
          }}
        >
          {teamCountOptions.map((count) => (
            <TabsTrigger
              key={count}
              value={String(count)}
              className="h-7 text-xs"
            >
              {count}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TeamRandomSettings;
