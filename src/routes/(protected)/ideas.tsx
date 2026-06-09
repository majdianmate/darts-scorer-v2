import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/layout/page-header";

export const Route = createFileRoute("/(protected)/ideas")({
  component: IdeasPage,
});

function IdeasPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Ötletek"
        description="Küldj ötleteket és visszajelzést az alkalmazás fejlesztéséhez."
      />
      <p className="text-sm text-muted-foreground">
        Hamarosan: ötlet beküldő űrlap. Addig is írj bátran a csapatnak, ha van
        javaslatod!
      </p>
    </div>
  );
}
