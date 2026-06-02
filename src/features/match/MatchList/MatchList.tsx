import { Link } from "@tanstack/react-router";
import { Loader2, Target } from "lucide-react";
import { useMemo } from "react";
import { ScrollArea } from "#/components/ui/scroll-area";
import { useClubs } from "../../../../hooks/use-club";
import { useUserMatches } from "../../../../hooks/use-match";
import { useUser } from "../../../../hooks/use-user";
import MatchListItem from "./MatchListItem";
import PageHeaderToolbar from "#/components/Sidebar/PageHeaderToolbar";

const MatchList = () => {
  const { user } = useUser();
  const { matches, isGetUserMatchesLoading, isGetUserMatchesError } =
    useUserMatches(user);
  const { clubs, isGetClubsLoading } = useClubs(user);

  const clubNameById = useMemo(
    () => new Map(clubs.map((club) => [club.id, club.name])),
    [clubs],
  );

  const isLoading = !user || isGetUserMatchesLoading || isGetClubsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading matches…
      </div>
    );
  }

  if (isGetUserMatchesError) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        Could not load your matches.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeaderToolbar>
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/30">
            <Target className="size-4 text-muted-foreground" />
          </div>
          <p className="truncate text-sm text-muted-foreground">
            {matches.length === 0
              ? "Matches you play in will show up here"
              : `${matches.length} match${matches.length === 1 ? "" : "es"}`}
          </p>
        </div>
      </PageHeaderToolbar>

      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
          <Target className="mb-3 size-10 text-muted-foreground/60" />
          <p className="font-medium text-foreground">No matches yet</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Start a match from a club to see it listed here.
          </p>
          <Link
            to="/clubs"
            className="mt-6 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Go to clubs
          </Link>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-100px)] [scrollbar-gutter:stable] pr-4">
          <div className="flex flex-col gap-3">
            {matches.map((match) => (
              <MatchListItem
                key={match.id}
                match={match}
                clubName={clubNameById.get(match.clubId)}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default MatchList;
