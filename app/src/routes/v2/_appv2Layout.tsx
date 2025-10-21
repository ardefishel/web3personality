import { SafeArea } from "@coinbase/onchainkit/minikit";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/v2/_appv2Layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h2>Hello from layout v2</h2>
      <Outlet />
    </div>
  );
}
