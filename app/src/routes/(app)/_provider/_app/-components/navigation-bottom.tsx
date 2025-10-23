import { Link, useRouterState } from "@tanstack/react-router";
import { HomeIcon, Layers2, User2 } from "lucide-react";

function BottomNavigation() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isHome = pathname.startsWith("");
  const isCollection = pathname.includes("/collection");
  const isProfile = pathname.includes("/account");

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

export default BottomNavigation;
