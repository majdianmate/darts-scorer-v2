import type { Friend } from "../../../../../types/friends-types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { FriendCardActions } from "./FriendCardActions";
import { FriendCardDetails } from "./FriendCardDetails";
import { FriendCardHeader } from "./FriendCardHeader";

export type FriendCardProps = {
  friend: Friend;
  currentUserId: string;
  onDelete?: (friendshipId: string) => void;
  isDeleting?: boolean;
};

export default function FriendCard({
  friend,
  currentUserId,
  onDelete,
  isDeleting = false,
}: FriendCardProps) {
  const { friend: user, friendship } = friend;

  return (
    <Card className="group/card h-full transition-shadow hover:shadow-md">
      <CardHeader className="border-b border-border/60 pb-4">
        <FriendCardHeader user={user} status={friendship.status} />
      </CardHeader>

      <CardContent>
        <FriendCardDetails
          email={user.email}
          friendship={friendship}
          currentUserId={currentUserId}
          memberSince={user.createdAt}
        />
      </CardContent>

      <CardFooter className="border-t border-border/60 bg-muted/20">
        <FriendCardActions
          friendshipId={friendship.id}
          friendName={user.displayName}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      </CardFooter>
    </Card>
  );
}
