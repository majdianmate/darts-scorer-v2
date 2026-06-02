import { createFileRoute, Outlet } from "@tanstack/react-router";
import { createElement } from "react";

export const Route = createFileRoute("/(protected)/_layout/match")({
  component: () => createElement(Outlet),
});
