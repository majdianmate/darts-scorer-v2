import { type FC } from "react";
import { Loader2, Shuffle } from "lucide-react";
import { useSelector } from "@tanstack/react-store";
import { toast } from "sonner";
import { useClub } from "../../../../../../hooks/use-club";
import {
  addTeam,
  getMaxRandomTeamCount,
  matchStore,
  MIN_RANDOM_TEAMS,
} from "../../../../../../store/match-store";
import TeamRandomMemberPicker from "./TeamRandomMemberPicker";
import TeamRandomSettings from "./TeamRandomSettings";
import { Button } from "#/components/ui/button";
import { generateRandomTeams } from "./randomTeamGeneartor";

interface TeamManagerRandomProps {
  clubId: string;
}

const TeamManagerRandom: FC<TeamManagerRandomProps> = ({ clubId }) => {
  const { club, isGetClubLoading } = useClub(clubId);
  const randomDraft = useSelector(matchStore, (state) => state.randomDraft);

  if (isGetClubLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-8 text-xs text-muted-foreground">
        <Loader2 className="size-3.5 animate-spin" />
        Loading members…
      </div>
    );
  }

  const playerCount = randomDraft.selectedMembers.length;
  const teamCount = randomDraft.teamCount;
  const maxTeams = getMaxRandomTeamCount(playerCount);
  const canGenerate =
    playerCount >= MIN_RANDOM_TEAMS &&
    teamCount >= MIN_RANDOM_TEAMS &&
    teamCount <= maxTeams;

  const handleGenerateTeams = () => {
    const teams = generateRandomTeams(randomDraft.selectedMembers, teamCount);

    if (teams.length === 0) {
      toast.error("Could not generate teams with the current selection.");
      return;
    }

    teams.forEach((team) => addTeam(team));
    toast.success(
      `${teams.length} random team${teams.length === 1 ? "" : "s"} added.`,
    );
  };

  return (
    <div className="flex min-h-0 flex-col gap-3">
      <TeamRandomMemberPicker members={club?.members ?? []} />

      <TeamRandomSettings membersCount={playerCount} />

      <p className="rounded-md border border-border/60 bg-muted/20 px-2.5 py-2 text-xs text-muted-foreground">
        {playerCount < 2
          ? "Select at least 2 players, then choose how many teams to generate (max 3)."
          : `${playerCount} player${playerCount === 1 ? "" : "s"} selected · ${teamCount} team${teamCount === 1 ? "" : "s"} will be generated`}
      </p>

      <Button
        type="button"
        variant="default"
        size="sm"
        className="w-full gap-1.5"
        disabled={!canGenerate}
        onClick={handleGenerateTeams}
      >
        <Shuffle className="size-3.5" />
        Generate teams
      </Button>
    </div>
  );
};

export default TeamManagerRandom;
