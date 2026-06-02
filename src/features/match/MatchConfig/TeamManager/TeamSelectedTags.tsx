import { type FC } from "react";
import { X } from "lucide-react";
import type { Team } from "../../../../../types/match-types";
import { getSquadIcon } from "#/components/IconPicker";

interface TeamSelectedTagsProps {
  teams: Team[];
  onRemove: (teamId: string) => void;
}

const TeamSelectedTags: FC<TeamSelectedTagsProps> = ({ teams, onRemove }) => {
  if (teams.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {teams.map((team) => {
        const TeamIcon = getSquadIcon(team.icon);

        return (
          <button
            key={team.id}
            type="button"
            onClick={() => onRemove(team.id)}
            className="group flex cursor-pointer items-center gap-1.5 rounded-full border py-0.5 pl-1.5 pr-2 text-xs font-medium transition-colors hover:opacity-90"
            style={{
              borderColor: `${team.color}45`,
              backgroundColor: `${team.color}18`,
              color: team.color,
            }}
            aria-label={`Remove team ${team.name}`}
          >
            <span
              className="flex size-5 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: `${team.color}28` }}
            >
              <TeamIcon className="size-3" />
            </span>
            <span>{team.name}</span>
            <X className="size-3 shrink-0 opacity-60 transition-opacity group-hover:opacity-100" />
          </button>
        );
      })}
    </div>
  );
};

export default TeamSelectedTags;
