import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/layout/page-header";

export const Route = createFileRoute("/(protected)/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Dashboard a játékban."
      />
      <p className="text-sm text-muted-foreground">
        Hamarosan: dashboard a játékban.
      </p>
    </div>
  );
}
