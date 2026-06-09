import { createFileRoute, redirect } from "@tanstack/react-router";

import { resolveAuthUser } from "@/lib/auth";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context }) => {
    const user = await resolveAuthUser(context.queryClient);

    if (user) {
      throw redirect({ to: "/match" });
    }

    throw redirect({ to: "/sign-in" });
  },
});
