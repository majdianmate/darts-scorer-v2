import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/layout/page-header";

export const Route = createFileRoute("/(protected)/match")({
  component: MatchPage,
});

function MatchPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Meccsek"
        description="Aktív és befejezett meccsek, új meccs indítása, élő pontozás és statisztikák."
      />
      <p className="text-sm text-muted-foreground">
        Hamarosan: meccs lista, konfiguráció, élő scoring és statisztika tabok.
      </p>
    </div>
  );
}
