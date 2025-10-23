import { useRouterState, Link } from "@tanstack/react-router";
import { HomeIcon, Layers2, User2 } from "lucide-react";

function SidebarNavigation() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isHome = pathname === "" || pathname === "/";
  const isCollection = pathname.includes("/collection");
  const isProfile = pathname.includes("/account");

  return (
    <aside className="hidden lg:block lg:w-64 lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:overflow-y-auto">
      <nav className="p-4 space-y-2" aria-label="Sidebar navigation">
        <SidebarNavButton
          icon={<HomeIcon />}
          label="Home"
          to="/"
          active={isHome}
        />
        <SidebarNavButton
          icon={<Layers2 />}
          label="Collection"
          to="/collection"
          active={isCollection}
        />
        <SidebarNavButton
          icon={<User2 />}
          label="Profile"
          to="/account"
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

function SidebarNavButton({
  icon,
  label,
  to,
  active = false,
}: SidebarNavButtonProps) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active ? "bg-accent text-accent-content" : "hover:bg-base-200"
      }`}
      aria-current={active ? "page" : undefined}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}

export default SidebarNavigation;
