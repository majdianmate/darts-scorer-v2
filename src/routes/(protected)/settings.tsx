import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/layout/page-header";

export const Route = createFileRoute("/(protected)/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Beállítások"
        description="Profil szerkesztése, jelszó módosítása és fiók beállítások."
      />
      <p className="text-sm text-muted-foreground">
        Hamarosan: név szerkesztése, jelszó változtatás és egyéb fiókbeállítások.
      </p>
    </div>
  );
}
