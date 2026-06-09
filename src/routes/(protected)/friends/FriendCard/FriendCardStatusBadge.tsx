import { FriendshipStatus } from "../../../../../types/friends-types";

const statusConfig: Record<
  FriendshipStatus,
  { label: string; dot: string; bg: string; text: string }
> = {
  [FriendshipStatus.ACCEPTED]: {
    label: "Accepted",
    dot: "bg-emerald-500",
    bg: "bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  [FriendshipStatus.PENDING]: {
    label: "Pending",
    dot: "bg-amber-500",
    bg: "bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-400",
  },
  [FriendshipStatus.BLOCKED]: {
    label: "Blocked",
    dot: "bg-red-500",
    bg: "bg-red-500/10",
    text: "text-red-700 dark:text-red-400",
  },
};

type FriendCardStatusBadgeProps = {
  status: FriendshipStatus;
};

export function FriendCardStatusBadge({ status }: FriendCardStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}
    >
      <span className={`size-1.5 shrink-0 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
