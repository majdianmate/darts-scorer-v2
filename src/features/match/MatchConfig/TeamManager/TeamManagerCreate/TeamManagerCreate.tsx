import { useEffect, useRef, useState, type FC } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import { DEFAULT_COLOR } from "#/components/ui/color-picker";
import { DEFAULT_SQUAD_ICON, type SquadIconKey } from "#/components/IconPicker";
import { useClub } from "../../../../../../hooks/use-club";
import { addTeam } from "../../../../../../store/match-store";
import type { ClubMember } from "../../../../../../types/club-types";
import TeamCreatorBase from "./TeamCreatorBase";
import TeamCreatorMemberPicker from "./TeamCreatorMemberPicker";
import { membersToDefaultTeamName, membersToTeam } from "./members-to-team";

interface TeamManagerCreateProps {
  clubId: string;
}

const TeamManagerCreate: FC<TeamManagerCreateProps> = ({ clubId }) => {
  const { club, isGetClubLoading } = useClub(clubId);
  const [name, setName] = useState("");
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [icon, setIcon] = useState<SquadIconKey>(DEFAULT_SQUAD_ICON);
  const [selectedMembers, setSelectedMembers] = useState<ClubMember[]>([]);
  const nameIsManualRef = useRef(false);
  const lastAutoNameRef = useRef("");

  useEffect(() => {
    if (nameIsManualRef.current) return;

    const autoName = membersToDefaultTeamName(selectedMembers);
    lastAutoNameRef.current = autoName;
    setName(autoName);
  }, [selectedMembers]);

  const handleNameChange = (value: string) => {
    if (value !== lastAutoNameRef.current) {
      nameIsManualRef.current = true;
    } else if (!value.trim()) {
      nameIsManualRef.current = false;
    }
    setName(value);
  };

  const resetForm = () => {
    nameIsManualRef.current = false;
    lastAutoNameRef.current = "";
    setName("");
    setColor(DEFAULT_COLOR);
    setIcon(DEFAULT_SQUAD_ICON);
    setSelectedMembers([]);
  };

  const handleAddTeam = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("Enter a team name.");
      return;
    }

    if (selectedMembers.length === 0) {
      toast.error("Select at least one player.");
      return;
    }

    addTeam(membersToTeam(trimmedName, color, icon, selectedMembers));
    toast.success("Team added.");
    resetForm();
  };

  if (isGetClubLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-8 text-xs text-muted-foreground">
        <Loader2 className="size-3.5 animate-spin" />
        Loading members…
      </div>
    );
  }

  const clubMembers = club?.members ?? [];
  const canAdd = !!name.trim() && selectedMembers.length > 0;

  return (
    <div className="space-y-3">
      <TeamCreatorBase
        name={name}
        color={color}
        icon={icon}
        onNameChange={handleNameChange}
        onColorChange={setColor}
        onIconChange={setIcon}
      />

      <TeamCreatorMemberPicker
        members={clubMembers}
        selectedMembers={selectedMembers}
        onSelectedMembersChange={setSelectedMembers}
      />

      <div className="sticky bottom-0 border-t border-border/60 bg-background/95 pt-3 backdrop-blur-sm">
        <Button
          type="button"
          className="w-full gap-1.5"
          disabled={!canAdd}
          onClick={handleAddTeam}
        >
          <Plus className="size-4" />
          Add team
        </Button>
      </div>
    </div>
  );
};

export default TeamManagerCreate;
