import { useMemo, type FC } from "react";
import { useSelector } from "@tanstack/react-store";
import UserPicker from "#/components/UserPicker";
import { cn } from "#/lib/utils.ts";
import type { ClubMember } from "../../../../../../types/club-types";
import type { User } from "../../../../../../types/user-types";
import {
  matchStore,
  setRandomDraftMembers,
} from "../../../../../../store/match-store";
import {
  membersToPickerUsers,
  pickerUsersToMembers,
} from "../team-member-picker-utils";

interface TeamRandomMemberPickerProps {
  members: ClubMember[];
  className?: string;
}

const TeamRandomMemberPicker: FC<TeamRandomMemberPickerProps> = ({
  members,
  className,
}) => {
  const selectedMembers = useSelector(
    matchStore,
    (state) => state.randomDraft.selectedMembers,
  );

  const pickerSource = useMemo(() => membersToPickerUsers(members), [members]);
  const selectedPickerUsers = useMemo(
    () => membersToPickerUsers(selectedMembers),
    [selectedMembers],
  );

  const handleSelectionChange = (users: User[]) => {
    setRandomDraftMembers(pickerUsersToMembers(users, members));
  };

  return (
    <div className={cn("flex min-h-0 flex-col gap-2", className)}>
      <p className="text-xs text-muted-foreground">
        Select players to include in the random draw.
      </p>

      {members.length === 0 ? (
        <div className="flex items-center justify-center rounded-lg border border-dashed border-border/60 px-3 py-8 text-center text-xs text-muted-foreground">
          No members in this club yet.
        </div>
      ) : (
        <UserPicker
          fillHeight
          className="min-h-[120px]"
          selectedUsers={selectedPickerUsers}
          onSelectionChange={handleSelectionChange}
          source={pickerSource}
          placeholder="Filter club members…"
          emptyMessage="No members match your search."
        />
      )}
    </div>
  );
};

export default TeamRandomMemberPicker;
