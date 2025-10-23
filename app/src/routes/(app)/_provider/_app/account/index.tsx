import { createFileRoute } from "@tanstack/react-router";
import { User2, Shield, Info, LogOut, Network, HelpCircle } from "lucide-react";
import UserProfile from "./-components/user-profile";
import { MenuSection, MenuLink, MenuItem } from "./-components/menu";

export const Route = createFileRoute("/(app)/_provider/_app/account/")({
  component: AccountPage,
});

function AccountPage() {
  const appVersion = "1.0.0";

  return (
    <div className="space-y-6 max-w-2xl lg:mx-auto">
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
