import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Brand } from "./-components/brand";
import { HomeIcon, Layers2, User2 } from "lucide-react";

export const Route = createFileRoute("/v2/_appv2Layout")({
  component: MobileLayout,
});

function MobileLayout() {
  return (
    <div className="max-w-md overflow-hidden mx-auto min-h-dvh relative bg-base-100">
      <AppHeader />
      <main className="pt-20 pb-24 px-4">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
}

function AppHeader() {
  return (
    <header className="navbar bg-base-100/95 backdrop-blur-sm fixed top-0 max-w-md shadow-sm px-4 py-3 z-10 border-b border-base-300">
      <div className="flex-1">
        <Brand />
      </div>
      <UserAvatar />
    </header>
  );
}

function UserAvatar() {
  return (
    <button className="avatar hover:opacity-80 transition-opacity" aria-label="User profile">
      <div className="mask mask-squircle w-10">
        <img
          src="https://img.daisyui.com/images/profile/demo/distracted1@192.webp"
          alt="User avatar"
        />
      </div>
    </button>
  );
}

function BottomNavigation() {
  return (
    <nav className="dock max-w-md mx-auto dock-xl bg-base-100/95 backdrop-blur-sm supports-[backdrop-filter]:bg-base-100/90 border-t border-base-300" aria-label="Main navigation">
      <NavButton icon={<HomeIcon />} label="Home" active />
      <NavButton icon={<Layers2 />} label="Collection" />
      <NavButton icon={<User2 />} label="Profile" />
    </nav>
  );
}

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function NavButton({ icon, label, active = false }: NavButtonProps) {
  return (
    <button className={active ? "dock-active" : ""} aria-label={label} aria-current={active ? "page" : undefined}>
      {icon}
      <span className="dock-label">{label}</span>
    </button>
  );
}
