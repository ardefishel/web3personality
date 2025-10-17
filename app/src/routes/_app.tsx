import AppLayout from "@/components/AppLayout";
import { RootProvider } from "@/components/RootProvider";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: MainLayout,
});

function MainLayout() {
  return (
    <RootProvider>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </RootProvider>
  );
}
