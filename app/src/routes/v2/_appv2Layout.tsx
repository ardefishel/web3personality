import {
  createFileRoute,
  Outlet,
  Link,
  useRouterState,
} from "@tanstack/react-router";
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
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAccountPage = pathname.includes("/v2/account");

  return (
    <header className="navbar bg-base-100/95 backdrop-blur-sm fixed top-0 max-w-md shadow-sm px-4 py-3 z-10 border-b border-base-300">
      <div className="flex-1">
        <Brand />
      </div>
      {!isAccountPage && <UserAvatar />}
    </header>
  );
}

function UserAvatar() {
  return (
    <button
      className="avatar hover:opacity-80 transition-opacity"
      aria-label="User profile"
    >
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
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isHome = pathname.startsWith("/v2");
  const isCollection = pathname.includes("/v2/collection");
  const isProfile = pathname.includes("/v2/account");

  return (
    <nav
      className="dock max-w-md mx-auto dock-xl bg-base-100/95 backdrop-blur-sm supports-[backdrop-filter]:bg-base-100/90 border-t border-base-300"
      aria-label="Main navigation"
    >
      <NavButton icon={<HomeIcon />} label="Home" to="." active={isHome} />
      <NavButton
        icon={<Layers2 />}
        label="Collection"
        to="./collection"
        active={isCollection}
      />
      <NavButton
        icon={<User2 />}
        label="Profile"
        to="./account"
        active={isProfile}
      />
    </nav>
  );
}

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  to?: string;
  active?: boolean;
}

function NavButton({ icon, label, to, active = false }: NavButtonProps) {
  return (
    <Link
      from="/v2"
      to={to}
      activeProps={{
        className: "dock-active",
      }}
      inactiveProps={{
        className: undefined,
      }}
      activeOptions={{
        exact: to == ".",
      }}
      aria-label={label}
      aria-current={active ? "page" : undefined}
    >
      {icon}
      <span className="dock-label">{label}</span>
    </Link>
  );
}
