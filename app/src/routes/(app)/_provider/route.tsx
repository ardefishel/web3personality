import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RootProvider } from "./-components/root-provider";

export const Route = createFileRoute("/(app)/_provider")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RootProvider>
      <Outlet />
    </RootProvider>
  );
}
