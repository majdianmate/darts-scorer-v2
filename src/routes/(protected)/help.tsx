import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/layout/page-header";

export const Route = createFileRoute("/(protected)/help")({
  component: HelpPage,
});

function HelpPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Súgó"
        description="Gyors útmutató, GYIK és használati tippek."
      />
      <p className="text-sm text-muted-foreground">
        Hamarosan: dokumentáció, GYIK és patch notes.
      </p>
    </div>
  );
}
