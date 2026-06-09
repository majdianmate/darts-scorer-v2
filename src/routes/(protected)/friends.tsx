import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/layout/page-header";
import Friends from "./friends/friends";

export const Route = createFileRoute("/(protected)/friends")({
  component: FriendsPage,
});

function FriendsPage() {
  return (
    <div className="space-y-6">
      <Friends />
    </div>
  );
}
