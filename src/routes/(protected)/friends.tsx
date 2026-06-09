import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/layout/page-header";

export const Route = createFileRoute("/(protected)/friends")({
  component: FriendsPage,
});

function FriendsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Barátok"
        description="Barátlista, új barát hozzáadása és függőben lévő meghívók kezelése."
      />
      <p className="text-sm text-muted-foreground">
        Hamarosan: barátlista, keresés, meghívók elfogadása és elutasítása.
      </p>
    </div>
  );
}
