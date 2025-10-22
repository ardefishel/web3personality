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
    <div className="min-h-dvh relative bg-base-100">
      <div className="max-w-md lg:max-w-6xl overflow-hidden mx-auto min-h-dvh relative">
        <AppHeader />
        <div className="lg:flex lg:gap-6 lg:pt-20">
          <SidebarNavigation />
          <main className="pt-20 md:pt-0 pb-24 px-4 lg:pb-8 lg:flex-1">
            <Outlet />
          </main>
        </div>
        <BottomNavigation />
      </div>
    </div>
  );
}

function SidebarNavigation() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isHome = pathname === "/v2" || pathname === "/v2/";
  const isCollection = pathname.includes("/v2/collection");
  const isProfile = pathname.includes("/v2/account");

  return (
    <aside className="hidden lg:block lg:w-64 lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:overflow-y-auto">
      <nav className="p-4 space-y-2" aria-label="Sidebar navigation">
        <SidebarNavButton icon={<HomeIcon />} label="Home" to="." active={isHome} />
        <SidebarNavButton
          icon={<Layers2 />}
          label="Collection"
          to="./collection"
          active={isCollection}
        />
        <SidebarNavButton
          icon={<User2 />}
          label="Profile"
          to="./account"
          active={isProfile}
        />
      </nav>
    </aside>
  );
}

interface SidebarNavButtonProps {
  icon: React.ReactNode;
  label: string;
  to?: string;
  active?: boolean;
}

function SidebarNavButton({ icon, label, to, active = false }: SidebarNavButtonProps) {
  return (
    <Link
      from="/v2"
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active
          ? "bg-accent text-accent-content"
          : "hover:bg-base-200"
      }`}
      aria-current={active ? "page" : undefined}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function AppHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAccountPage = pathname.includes("/v2/account");

  return (
    <header className="navbar bg-base-100/95 backdrop-blur-sm fixed top-0 left-0 right-0 shadow-sm px-4 lg:px-8 py-3 z-10 border-b border-base-300">
      <div className="max-w-md lg:max-w-6xl mx-auto w-full flex items-center justify-between">
        <div className="flex-1">
          <Brand />
        </div>
        {!isAccountPage && <UserAvatar />}
      </div>
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
      className="dock lg:hidden max-w-md mx-auto dock-xl bg-base-100/95 backdrop-blur-sm supports-[backdrop-filter]:bg-base-100/90 border-t border-base-300"
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
