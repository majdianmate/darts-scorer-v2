import { Loader2, Users } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { useFriends } from "../../../../hooks/use-friends";
import { useUser } from "../../../../hooks/use-user";
import FriendCard from "./FriendCard/FriendCard";
import NewFriendDialog from "./NewFriends";
import FriendRequests from "./FriendRequests";

function Friends() {
  const { user } = useUser();
  const userId = user?.id ?? "";
  const {
    friends,
    isGetFriendsLoading,
    deleteFriend,
    deletingFriendshipId,
  } = useFriends(userId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Friends"
        description="Manage your friends list, relationships, and quick actions."
      />
      <div className="flex justify-end gap-2">
      <FriendRequests/>
      <NewFriendDialog />
      </div>
      {isGetFriendsLoading ? (
        <div className="flex min-h-48 items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 size-5 animate-spin" />
          Friends loading…
        </div>
      ) : friends.length === 0 ? (
        <div className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
          <Users className="size-8 text-muted-foreground" />
          <p className="font-medium">You don't have any friends yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            When someone accepts your friend request, their profile will appear here.
          </p>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {friends.map((friend) => (
            <FriendCard
              key={friend.friendship.id}
              friend={friend}
              currentUserId={userId}
              onDelete={deleteFriend}
              isDeleting={deletingFriendshipId === friend.friendship.id}
            />
          ))}
        </div>
        </div>
      )}
    </div>
  );
}

export default Friends;