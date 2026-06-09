import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { requireAuth } from "@/lib/auth";
import { useUser } from "../../../hooks/use-user";
import Sidebar from "#/components/Sidebar/Sidebar";

export const Route = createFileRoute("/(protected)")({
  beforeLoad: async ({ context, location }) => {
    await requireAuth(context.queryClient, location.href);
  },
  component: ProtectedLayout,
});

function ProtectedLayout() {
  const navigate = useNavigate();
  const { isUserLoading, isAuthenticated } = useUser();

  useEffect(() => {
    if (!isUserLoading && !isAuthenticated) {
      navigate({
        to: "/sign-in",
        search: { redirect: window.location.pathname },
      });
    }
  }, [isAuthenticated, isUserLoading, navigate]);

  if (isUserLoading) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-dvh w-full bg-background p-3">
      <Sidebar />
      <div className="relative flex min-w-0 flex-1 flex-col pl-3">
        <main className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-muted">
          <div className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
