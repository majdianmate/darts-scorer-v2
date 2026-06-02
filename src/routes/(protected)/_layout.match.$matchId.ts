import { createFileRoute } from "@tanstack/react-router";
import Match from "@/features/match/[match]/Match";

export const Route = createFileRoute("/(protected)/_layout/match/$matchId")({
  component: Match,
});
