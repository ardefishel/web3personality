import { Brand } from "@/components/brand";
import { useRouterState, Link } from "@tanstack/react-router";
import { useAccount } from "wagmi";
import { useAvatar, useName } from "@coinbase/onchainkit/identity";
import { ConnectWallet } from "@coinbase/onchainkit/wallet";

function AppHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAccountPage = pathname.includes("/account");

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
  const { address, isConnected } = useAccount();
  const { data: ensName } = useName({ address });
  const { data: avatar } = useAvatar({ ensName: ensName || "" });

  if (!isConnected) {
    return (
      <ConnectWallet
        render={({ onClick, isLoading }) => (
          <button
            onClick={onClick}
            disabled={isLoading}
            className="btn btn-accent btn-sm rounded-full"
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              "Connect"
            )}
          </button>
        )}
      />
    );
  }

  return (
    <Link to="/account" className="avatar hover:opacity-80 transition-opacity">
      <div className="mask mask-squircle w-10">
        <img
          src={avatar || `https://api.dicebear.com/7.x/shapes/svg?seed=${address}`}
          alt="User avatar"
        />
      </div>
    </Link>
  );
}

export default AppHeader;
