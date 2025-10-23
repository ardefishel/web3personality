import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

interface MenuSectionProps {
  title?: string;
  children: React.ReactNode;
}

function MenuSection({ title, children }: MenuSectionProps) {
  return (
    <div className="bg-base-200 rounded-lg overflow-hidden">
      {title && (
        <div className="px-4 pt-3 pb-2">
          <h3 className="text-xs font-semibold text-base-content/60 uppercase tracking-wide">
            {title}
          </h3>
        </div>
      )}
      <div className="divide-y divide-base-300">{children}</div>
    </div>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
}

function MenuItem({
  icon,
  label,
  onClick,
  variant = "default",
}: MenuItemProps) {
  const textColor = variant === "danger" ? "text-error" : "text-base-content";

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-base-300 transition-colors"
    >
      <span className={textColor}>{icon}</span>
      <span className={`flex-1 text-left ${textColor}`}>{label}</span>
      <ChevronRight className="w-5 h-5 text-base-content/40" />
    </button>
  );
}

interface MenuLinkProps {
  icon: React.ReactNode;
  label: string;
  to: string;
}

function MenuLink({ icon, label, to }: MenuLinkProps) {
  return (
    <Link
      to={to}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-base-300 transition-colors"
    >
      <span className="text-base-content">{icon}</span>
      <span className="flex-1 text-left text-base-content">{label}</span>
      <ChevronRight className="w-5 h-5 text-base-content/40" />
    </Link>
  );
}

export {
  MenuSection,
  MenuLink,
  MenuItem,
};
