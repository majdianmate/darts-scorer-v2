import { createFileRoute } from "@tanstack/react-router";
import MatchList from "@/features/match/MatchList/MatchList";

export const Route = createFileRoute("/(protected)/_layout/match/")({
  component: MatchList,
});
