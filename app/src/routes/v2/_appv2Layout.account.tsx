import { createFileRoute, Link } from "@tanstack/react-router";
import {
  User2,
  ChevronRight,
  Shield,
  Info,
  LogOut,
  Network,
  HelpCircle,
  TwitterIcon,
  InstagramIcon,
  Instagram,
} from "lucide-react";

export const Route = createFileRoute("/v2/_appv2Layout/account")({
  component: AccountPage,
});

function AccountPage() {
  const appVersion = "1.0.0";

  return (
    <div className="space-y-6">
      <UserProfile />

      <div className="space-y-2">
        <MenuSection title="Account">
          <MenuLink
            icon={<User2 className="w-5 h-5" />}
            label="Profile Settings"
            to="/v2/profile"
          />
          <MenuLink
            icon={<Network className="w-5 h-5" />}
            label="Change Network"
            to="/v2/network"
          />
        </MenuSection>

        <MenuSection title="Information">
          <MenuLink
            icon={<HelpCircle className="w-5 h-5" />}
            label="FAQ"
            to="/v2/faq"
          />
          <MenuLink
            icon={<Shield className="w-5 h-5" />}
            label="Privacy Policy"
            to="/v2/privacy"
          />
          <MenuLink
            icon={<Info className="w-5 h-5" />}
            label="About"
            to="/v2/about"
          />
        </MenuSection>

        <MenuSection>
          <MenuItem
            icon={<LogOut className="w-5 h-5" />}
            label="Disconnect Wallet"
            onClick={() => {}}
            variant="danger"
          />
        </MenuSection>
      </div>

      <div className="text-center">
        <span className="badge badge-ghost badge-sm">v{appVersion}</span>
      </div>
    </div>
  );
}

function UserProfile() {
  const username = "0x1234...5678";

  return (
    <div className="bg-base-300 rounded-2xl p-6 space-y-6">
      <div className="flex items-center gap-4">
        <div className="avatar">
          <div className="mask mask-squircle w-20 ring-2 ring-primary ring-offset-2 ring-offset-base-100">
            <img
              src="https://img.daisyui.com/images/profile/demo/distracted1@192.webp"
              alt="User avatar"
            />
          </div>
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-xl">{username}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-warning"></span>
            </span>
            <span className="text-xs text-base-content/70">Base Sepolia</span>
          </div>
        </div>
      </div>

      <div className="divider my-0"></div>

      <div>
        <h3 className="text-sm font-semibold text-base-content/70 mb-3">
          Share Profile
        </h3>
        <div className="flex gap-3">
          <SocialButton
            name="Farcaster"
            icon={
              <svg
                viewBox="0 0 24 24"
                height="24"
                width="24"
              >
                <path
                  d="M18.24 0.24H5.76C2.5789 0.24 0 2.8188 0 6v12c0 3.1811 2.5789 5.76 5.76 5.76h12.48c3.1812 0 5.76 -2.5789 5.76 -5.76V6C24 2.8188 21.4212 0.24 18.24 0.24m0.8155 17.1662v0.504c0.2868 -0.0256 0.5458 0.1905 0.5439 0.479v0.5688h-5.1437v-0.5688c-0.0019 -0.2885 0.2576 -0.5047 0.5443 -0.479v-0.504c0 -0.22 0.1525 -0.402 0.358 -0.458l-0.0095 -4.3645c-0.1589 -1.7366 -1.6402 -3.0979 -3.4435 -3.0979 -1.8038 0 -3.2846 1.3613 -3.4435 3.0979l-0.0096 4.3578c0.2276 0.0424 0.5318 0.2083 0.5395 0.4648v0.504c0.2863 -0.0256 0.5457 0.1905 0.5438 0.479v0.5688H4.3915v-0.5688c-0.0019 -0.2885 0.2575 -0.5047 0.5438 -0.479v-0.504c0 -0.2529 0.2011 -0.4548 0.4536 -0.4724v-7.895h-0.4905L4.2898 7.008l2.6405 -0.0005V5.0419h9.9495v1.9656h2.8219l-0.6091 2.0314h-0.4901v7.8949c0.2519 0.0177 0.453 0.2195 0.453 0.4724"
                  fill="currentColor"
                  stroke-width="1"
                ></path>
              </svg>
            }
            onClick={() => {}}
          />
          <SocialButton name="X" icon={<TwitterIcon />} onClick={() => {}} />
          <SocialButton
            name="Instagram"
            icon={<Instagram />}
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

interface SocialButtonProps {
  name: string;
  icon: React.ReactNode;
  onClick: () => void;
}

function SocialButton({ name, icon, onClick }: SocialButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex-1 btn btn-outline hover:btn-accent h-12"
      aria-label={`Share on ${name}`}
    >
      {icon}
    </button>
  );
}

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
