import { type FC, useMemo } from "react";
import type { Squad } from "../../../../../../types/club-types";
import { useSelector } from "@tanstack/react-store";
import { Minus, Plus } from "lucide-react";
import { Button } from "#/components/ui/button";
import { cn } from "#/lib/utils.ts";
import { getSquadIcon } from "#/components/IconPicker";
import AvatarGroup from "#/components/AvatarGroup";
import {
  addTeam,
  matchStore,
  removeTeam,
} from "../../../../../../store/match-store";
import { squadToTeam } from "./squad-to-team";

interface SquadSelectorProps {
  squads: Squad[];
  className?: string;
}

const SquadSelector: FC<SquadSelectorProps> = ({ squads, className }) => {
  const teams = useSelector(matchStore, (state) => state.teams);

  const addedTeamIds = useMemo(
    () => new Set(teams.map((team) => team.id)),
    [teams],
  );

  const sortedSquads = useMemo(
    () => [...squads].sort((a, b) => a.name.localeCompare(b.name)),
    [squads],
  );

  const handleToggleSquad = (squad: Squad) => {
    if (addedTeamIds.has(squad.id)) {
      removeTeam(squad.id);
      return;
    }
    addTeam(squadToTeam(squad));
  };

  if (sortedSquads.length === 0) {
    return (
      <p className="py-6 text-center text-xs text-muted-foreground">
        No squads in this club. Create a squad first.
      </p>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className="text-xs text-muted-foreground">
        Add or remove squads from the match.
      </p>

      <ul className="flex flex-col gap-1.5">
        {sortedSquads.map((squad) => {
          const SquadIcon = getSquadIcon(squad.icon);
          const memberCount = squad.members.length;
          const isAdded = addedTeamIds.has(squad.id);

          return (
            <li key={squad.id}>
              <div
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-2 py-1.5 transition-colors",
                  !isAdded && "hover:bg-muted/40",
                )}
                style={
                  isAdded
                    ? {
                        borderColor: `${squad.color}55`,
                        backgroundColor: `${squad.color}18`,
                        boxShadow: `inset 0 0 0 1px ${squad.color}30`,
                      }
                    : {
                        borderColor: `${squad.color}35`,
                        backgroundColor: `${squad.color}0a`,
                      }
                }
              >
                <div
                  className="flex size-7 shrink-0 items-center justify-center rounded-md border"
                  style={{
                    backgroundColor: `${squad.color}22`,
                    borderColor: `${squad.color}45`,
                    color: squad.color,
                  }}
                >
                  <SquadIcon className="size-3.5" />
                </div>

                <div className="min-w-0 flex-1 leading-none">
                  <p className="truncate text-sm font-medium text-foreground">
                    {squad.name}
                  </p>
                  <div className="mt-1 flex min-w-0 items-center gap-2">
                    {memberCount > 0 ? (
                      <AvatarGroup
                        users={squad.members.map(
                          (squadMember) => squadMember.member.user,
                        )}
                        max={4}
                      />
                    ) : (
                      <span className="text-[11px] text-muted-foreground">
                        No players
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  type="button"
                  variant={isAdded ? "destructive" : "default"}
                  size="sm"
                  className="h-8 shrink-0 gap-1 px-2.5 text-xs"
                  onClick={() => handleToggleSquad(squad)}
                >
                  {isAdded ? (
                    <>
                      <Minus className="size-3.5" />
                      Remove
                    </>
                  ) : (
                    <>
                      <Plus className="size-3.5" />
                      Add
                    </>
                  )}
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SquadSelector;
