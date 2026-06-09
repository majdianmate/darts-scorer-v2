import type { ReactNode } from "react";
import {
  CalendarDays,
  Mail,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import type { Timestamp } from "firebase/firestore";

import type { Friendship } from "../../../../../types/friends-types";
import {
  formatFriendshipDate,
  formatFriendshipRelative,
} from "./format-friend-date";

type FriendCardDetailsProps = {
  email: string;
  friendship: Friendship;
  currentUserId: string;
  memberSince: Timestamp;
};

type DetailRowProps = {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
};

function DetailRow({ icon, label, value, hint }: DetailRowProps) {
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="truncate font-medium text-foreground">{value}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}

export function FriendCardDetails({
  email,
  friendship,
  currentUserId,
  memberSince,
}: FriendCardDetailsProps) {
  const initiatedByCurrentUser = friendship.senderId === currentUserId;
  const friendsSince = friendship.updatedAt ?? friendship.createdAt;

  return (
    <div className="space-y-3 rounded-lg bg-muted/40 p-3">
      <DetailRow
        icon={<Mail className="size-4" />}
        label="E-mail"
        value={email}
      />

      <DetailRow
        icon={<Users className="size-4" />}
        label="Friends Since"
        value={formatFriendshipDate(friendsSince)}
        hint={formatFriendshipRelative(friendsSince)}
      />
    </div>
  );
}
