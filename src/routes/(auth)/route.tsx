import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-transparent">
      <Outlet />
    </div>
  );
}
