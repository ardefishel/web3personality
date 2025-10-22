import { createFileRoute, Link } from '@tanstack/react-router'
import { User2, ChevronRight, Shield, Info, LogOut, Network, HelpCircle } from 'lucide-react'

export const Route = createFileRoute('/v2/_appv2Layout/account')({
  component: AccountPage,
})

function AccountPage() {
  const appVersion = '1.0.0'

  return (
    <div className="space-y-6">
      <UserProfile />
      
      <div className="space-y-2">
        <MenuSection title="Account">
          <MenuItem
            icon={<User2 className="w-5 h-5" />}
            label="Profile Settings"
            onClick={() => {}}
          />
          <MenuItem
            icon={<Network className="w-5 h-5" />}
            label="Change Network"
            onClick={() => {}}
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
  )
}

function UserProfile() {
  const username = '0x1234...5678'

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
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
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
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.5 5h-19A.5.5 0 0 0 2 5.5v13a.5.5 0 0 0 .5.5H6v-8h2.5v8h7V11H18v7.5h3.5a.5.5 0 0 0 .5-.5v-13a.5.5 0 0 0-.5-.5zM9 9H7V7h2v2z"/>
              </svg>
            }
            onClick={() => {}}
          />
          <SocialButton
            name="X"
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            }
            onClick={() => {}}
          />
          <SocialButton
            name="Instagram"
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
              </svg>
            }
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  )
}

interface SocialButtonProps {
  name: string
  icon: React.ReactNode
  onClick: () => void
}

function SocialButton({ name, icon, onClick }: SocialButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex-1 btn btn-outline hover:btn-primary h-12"
      aria-label={`Share on ${name}`}
    >
      {icon}
    </button>
  )
}

interface MenuSectionProps {
  title?: string
  children: React.ReactNode
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
      <div className="divide-y divide-base-300">
        {children}
      </div>
    </div>
  )
}

interface MenuItemProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  variant?: 'default' | 'danger'
}

function MenuItem({ icon, label, onClick, variant = 'default' }: MenuItemProps) {
  const textColor = variant === 'danger' ? 'text-error' : 'text-base-content'
  
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-base-300 transition-colors"
    >
      <span className={textColor}>{icon}</span>
      <span className={`flex-1 text-left ${textColor}`}>{label}</span>
      <ChevronRight className="w-5 h-5 text-base-content/40" />
    </button>
  )
}

interface MenuLinkProps {
  icon: React.ReactNode
  label: string
  to: string
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
  )
}
