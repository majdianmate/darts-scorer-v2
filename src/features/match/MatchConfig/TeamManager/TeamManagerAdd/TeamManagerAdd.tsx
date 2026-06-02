import { type FC } from "react";
import { Loader2 } from "lucide-react";
import { useClub } from "../../../../../../hooks/use-club";
import SquadSelector from "./SquadSelector";

interface TeamManagerAddProps {
  clubId: string;
}

const TeamManagerAdd: FC<TeamManagerAddProps> = ({ clubId }) => {
  const { club, isGetClubLoading } = useClub(clubId);

  if (isGetClubLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-8 text-xs text-muted-foreground">
        <Loader2 className="size-3.5 animate-spin" />
        Loading squads…
      </div>
    );
  }

  return <SquadSelector squads={club?.squads ?? []} />;
};

export default TeamManagerAdd;
