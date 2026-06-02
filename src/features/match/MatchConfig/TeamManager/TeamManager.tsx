import { type FC } from "react";
import { useSelector } from "@tanstack/react-store";
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/animate/tabs";
import { matchStore, removeTeam } from "../../../../../store/match-store";
import TeamManagerCreate from "./TeamManagerCreate/TeamManagerCreate";
import TeamManagerAdd from "./TeamManagerAdd/TeamManagerAdd";
import TeamManagerRandom from "./TeamManagerRandom/TeamManagerRandom";
import TeamSelectedTags from "./TeamSelectedTags";
import { cn } from "#/lib/utils.ts";

interface TeamManagerProps {
  clubId: string;
  className?: string;
}

const TeamManager: FC<TeamManagerProps> = ({ clubId, className }) => {
  const teams = useSelector(matchStore, (state) => state.teams);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div>
        <h3 className="text-sm font-semibold text-foreground">Teams</h3>
        <p className="text-xs text-muted-foreground">
          {teams.length === 0
            ? "Add at least one team to start."
            : `${teams.length} team${teams.length === 1 ? "" : "s"} added`}
        </p>
      </div>

      <TeamSelectedTags teams={teams} onRemove={removeTeam} />

      <Tabs>
        <TabsList defaultValue="add" className="relative h-8 w-full">
          <TabsTrigger value="create" className="h-7 text-xs">
            Create
          </TabsTrigger>
          <TabsTrigger value="add" className="h-7 text-xs">
            Squads
          </TabsTrigger>
          <TabsTrigger value="random" className="h-7 text-xs">
            Random
          </TabsTrigger>
        </TabsList>

        <TabsContents>
          <TabsContent value="create" className="pt-3">
            <TeamManagerCreate clubId={clubId} />
          </TabsContent>
          <TabsContent value="add" className="pt-3">
            <TeamManagerAdd clubId={clubId} />
          </TabsContent>
          <TabsContent value="random" className="pt-3">
            <TeamManagerRandom clubId={clubId} />
          </TabsContent>
        </TabsContents>
      </Tabs>
    </div>
  );
};

export default TeamManager;
