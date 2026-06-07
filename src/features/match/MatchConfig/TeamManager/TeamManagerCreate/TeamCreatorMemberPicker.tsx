import { useMemo, type FC } from "react";
import UserPicker from "#/components/UserPicker";
import { cn } from "#/lib/utils.ts";
import type { ClubMember } from "../../../../../../types/club-types";
import type { User } from "../../../../../../types/user-types";
import {
  membersToPickerUsers,
  pickerUsersToMembers,
} from "../team-member-picker-utils";

interface TeamCreatorMemberPickerProps {
  members: ClubMember[];
  selectedMembers: ClubMember[];
  onSelectedMembersChange: (members: ClubMember[]) => void;
  className?: string;
}

const TeamCreatorMemberPicker: FC<TeamCreatorMemberPickerProps> = ({
  members,
  selectedMembers,
  onSelectedMembersChange,
  className,
}) => {
  const pickerSource = useMemo(() => membersToPickerUsers(members), [members]);
  const selectedPickerUsers = useMemo(
    () => membersToPickerUsers(selectedMembers),
    [selectedMembers],
  );

  const handleSelectionChange = (users: User[]) => {
    onSelectedMembersChange(pickerUsersToMembers(users, members));
  };

  return (
    <div className={cn("flex min-h-0 flex-col gap-2", className)}>
      <p className="text-xs text-muted-foreground">
        Pick players for this team. The name above fills in automatically as their names joined
        with <span className="font-medium text-foreground">&</span> (e.g. Anna & Béla).
      </p>

      {members.length === 0 ? (
        <div className="flex items-center justify-center rounded-lg border border-dashed border-border/60 px-3 py-8 text-center text-xs text-muted-foreground">
          No members in this club yet.
        </div>
      ) : (
        <UserPicker
          fillHeight
          className="min-h-[200px]"
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

export default TeamCreatorMemberPicker;
