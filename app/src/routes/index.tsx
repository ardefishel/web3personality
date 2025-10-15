import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CenterPlaceholder />;
}

function CenterPlaceholder() {
  return (
    <div className="flex-1 grid place-items-center">
      <img src="/w3p-logo.png" alt="W3P" className="opacity-20 h-24 w-auto" />
    </div>
  );
}
