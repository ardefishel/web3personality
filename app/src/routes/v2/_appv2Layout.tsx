import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Brand } from "./-components/brand";
import { HomeIcon, Layers2, User2 } from "lucide-react";

export const Route = createFileRoute("/v2/_appv2Layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="max-w-md overflow-hidden mx-auto min-h-dvh relative">
      <Header />
      <main className="py-24 px-2">
        <Outlet />
      </main>
      <Dock />
    </div>
  );
}

function Header() {
  return (
    <div className="navbar bg-base-100 fixed max-w-md shadow-sm p-4">
      <div className="flex-1">
        <Brand />
      </div>
      <div className="flex  gap-2">
        <div className="avatar">
          <div className="mask mask-squircle w-12">
            <img src="https://img.daisyui.com/images/profile/demo/distracted1@192.webp" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Dock() {
  return (
    <div className="dock dock-xl bg-base-100/90 backdrop-blur supports-[backdrop-filter]:bg-base-100/75">
      <button className="dock-active">
        <HomeIcon />
        <span className="dock-label">Home</span>
      </button>

      <button className="">
        <Layers2 />
        <span className="dock-label">My Collection</span>
      </button>

      <button>
        <User2 />
        <span className="dock-label">Account</span>
      </button>
    </div>
  );
}
