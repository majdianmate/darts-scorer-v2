import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog";
import { Button } from "#/components/ui/button";
import { Loader2 } from "lucide-react";
import { useSelector } from "@tanstack/react-store";
import { toast } from "sonner";
import { dialogStore, setDialog } from "../../../../store/store";
import {
  matchStore,
  patchMatchConfig,
  resetMatchDraft,
  setMatchConfig,
} from "../../../../store/match-store";
import { useClub } from "../../../../hooks/use-club";
import { useCreateMatch } from "../../../../hooks/use-match";
import { useUser } from "../../../../hooks/use-user";
import { Separator } from "#/components/ui/separator";
import MatchConfigBase from "./MatchConfigBase";
import TeamManager from "./TeamManager/TeamManager";

const MatchConfigDialog = () => {
  const navigate = useNavigate();
  const open = useSelector(dialogStore, (state) => state.dialogs.matchConfig);
  const targetClubId = useSelector(dialogStore, (state) => state.targetClubId);
  const matchConfig = useSelector(matchStore, (state) => state.matchConfig);
  const teams = useSelector(matchStore, (state) => state.teams);
  const { user } = useUser();
  const { club, isGetClubLoading } = useClub(targetClubId ?? "");
  const { createMatchAsync, isCreateMatchPending } = useCreateMatch();

  useEffect(() => {
    if (!open || !targetClubId) return;
    resetMatchDraft(targetClubId);
  }, [open, targetClubId]);

  useEffect(() => {
    if (teams.length === 0) return;
    if (!teams.some((team) => team.id === matchConfig.startingTeamId)) {
      patchMatchConfig({ startingTeamId: teams[0].id });
    }
  }, [teams, matchConfig.startingTeamId]);

  const handleOpenChange = (nextOpen: boolean) => {
    setDialog("matchConfig", nextOpen);
  };

  const canStartMatch =
    teams.length >= 2 &&
    !!matchConfig.startingTeamId &&
    teams.some((team) => team.id === matchConfig.startingTeamId);

  const handleStartMatch = async () => {
    if (!targetClubId || !user) {
      toast.error("You must be signed in to start a match.");
      return;
    }

    if (!canStartMatch) {
      toast.error("Add at least two teams and pick who starts.");
      return;
    }

    try {
      const match = await createMatchAsync({
        clubId: targetClubId,
        matchConfig,
        teams,
        createdById: user.id,
      });

      handleOpenChange(false);
      navigate({
        to: "/match/$matchId",
        params: { matchId: match.id },
      });
    } catch {
      // Toast is handled in the mutation.
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[min(92vh,calc(100vh-1.5rem))] w-[calc(100vw-1.5rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-6xl">
        <DialogHeader className="shrink-0 border-b border-border px-5 py-3">
          <DialogTitle>
            {club ? `Start match · ${club.name}` : "Start match"}
          </DialogTitle>
          <DialogDescription>
            Configure settings and add teams before you begin.
          </DialogDescription>
        </DialogHeader>

        {isGetClubLoading ? (
          <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading club…
          </div>
        ) : !club ? (
          <p className="px-6 py-16 text-center text-sm text-muted-foreground">
            Club not found.
          </p>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden sm:flex-row">
            <div className="min-h-0 min-w-0 flex-1 overflow-y-auto border-b border-border p-4 [scrollbar-gutter:stable] sm:w-[min(360px,38%)] sm:shrink-0 sm:flex-none sm:border-b-0 sm:border-r">
              <MatchConfigBase
                matchConfig={matchConfig}
                teams={teams}
                onMatchConfigChange={setMatchConfig}
              />
            </div>

            <Separator orientation="vertical" className="hidden sm:block" />

            <div className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4 [scrollbar-gutter:stable]">
              <TeamManager clubId={club.id} />
            </div>
          </div>
        )}

        <DialogFooter className="shrink-0 gap-2 border-t border-border p-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isCreateMatchPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            disabled={!canStartMatch || isCreateMatchPending || !club}
            onClick={handleStartMatch}
          >
            {isCreateMatchPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Starting…
              </>
            ) : (
              "Start match"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MatchConfigDialog;
