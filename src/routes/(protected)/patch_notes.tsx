import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/layout/page-header";

export const Route = createFileRoute("/(protected)/patch_notes")({
  component: PatchNotesPage,
});

function PatchNotesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Patch Notes"
        description="Patch Notes a játékban."
      />
      <p className="text-sm text-muted-foreground">
        Hamarosan: patch notes a játékban.
      </p>
    </div>
  );
}
