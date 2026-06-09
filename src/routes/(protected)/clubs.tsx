import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/layout/page-header";

export const Route = createFileRoute("/(protected)/clubs")({
  component: ClubsPage,
});

function ClubsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Klubok"
        description="Klubok kezelése, tagok, squadok, meghívók és klub beállítások."
      />
      <p className="text-sm text-muted-foreground">
        Hamarosan: klub lista, klub részletek (tagok, squadok, meccsek,
        beállítások).
      </p>
    </div>
  );
}
