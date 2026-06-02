import { type FC } from "react";
import { Check } from "lucide-react";
import type { Team } from "../../../../types/match-types";
import { Label } from "#/components/ui/label";
import { cn } from "#/lib/utils.ts";
import { getSquadIcon } from "#/components/IconPicker";

interface StartingTeamPickerProps {
  teams: Team[];
  startingTeamId: string;
  onStartingTeamChange: (teamId: string) => void;
  disabled?: boolean;
}

const StartingTeamPicker: FC<StartingTeamPickerProps> = ({
  teams,
  startingTeamId,
  onStartingTeamChange,
  disabled = false,
}) => {
  if (teams.length === 0) return null;

  return (
    <div
      className={cn(
        "space-y-2 border-b border-border/50 pb-3",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <Label className="text-xs font-medium text-muted-foreground">
        Starting team
      </Label>
      <p className="text-[11px] text-muted-foreground">
        Who throws first in the first leg.
      </p>

      <div className="flex flex-col gap-1.5">
        {teams.map((team) => {
          const TeamIcon = getSquadIcon(team.icon);
          const isSelected = startingTeamId === team.id;

          return (
            <button
              key={team.id}
              type="button"
              onClick={() => onStartingTeamChange(team.id)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left transition-all",
                isSelected
                  ? "ring-2 ring-offset-1 ring-offset-background"
                  : "hover:bg-muted/40",
              )}
              style={{
                borderColor: `${team.color}${isSelected ? "70" : "35"}`,
                backgroundColor: `${team.color}${isSelected ? "22" : "0c"}`,
                ...(isSelected ? { ringColor: team.color } : {}),
              }}
              aria-pressed={isSelected}
              aria-label={`${team.name} starts first`}
            >
              <div
                className="flex size-8 shrink-0 items-center justify-center rounded-md border"
                style={{
                  backgroundColor: `${team.color}28`,
                  borderColor: `${team.color}50`,
                  color: team.color,
                }}
              >
                <TeamIcon className="size-4" />
              </div>

              <div className="min-w-0 flex-1 leading-none">
                <p className="truncate text-sm font-medium text-foreground">
                  {team.name}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                  {team.members.length === 1
                    ? "1 player"
                    : `${team.members.length} players`}
                </p>
              </div>

              {isSelected && (
                <span
                  className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{
                    backgroundColor: `${team.color}25`,
                    color: team.color,
                  }}
                >
                  <Check className="size-3" />
                  Starts
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StartingTeamPicker;
