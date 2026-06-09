import Avatar from "@/components/Avatar";
import type { User } from "../../../../../types/user-types";
import { FriendCardStatusBadge } from "./FriendCardStatusBadge";
import { FriendshipStatus } from "../../../../../types/friends-types";

type FriendCardHeaderProps = {
  user: User;
  status: FriendshipStatus;
};

export function FriendCardHeader({ user, status }: FriendCardHeaderProps) {
  const showFullName = user.name && user.name !== user.displayName;

  return (
    <div className="flex items-start gap-3">
      <Avatar user={user} size="lg" className="ring-2 ring-background" />

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-base font-semibold leading-tight">
            {user.displayName}
          </h3>
          <FriendCardStatusBadge status={status} />
        </div>

        {showFullName && (
          <p className="truncate text-sm text-muted-foreground">{user.name}</p>
        )}

        <p className="truncate text-sm font-medium text-primary">
          @{user.username}
        </p>
      </div>
    </div>
  );
}
