import AppLayout from "@/components/AppLayout";
import { RootProvider } from "@/components/RootProvider";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

// const RootProvider = lazy(() =>
//   import("@/components/RootProvider").then((m) => ({ default: m.RootProvider }))
// );
// const AppLayout = lazy(() =>
//   import("@/components/AppLayout").then((m) => ({ default: m.default }))
// );

export const Route = createFileRoute("/_app")({
  component: MainLayout,
});

function MainLayout() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <RootProvider>
        <Suspense fallback={null}>
          <AppLayout>
            <Outlet />
          </AppLayout>
        </Suspense>
      </RootProvider>
    </Suspense>
  );
}
