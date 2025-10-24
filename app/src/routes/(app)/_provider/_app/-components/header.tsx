import { Brand } from "@/components/brand";
import { useRouterState, Link } from "@tanstack/react-router";
import { useAccount } from "wagmi";
import { Avatar } from "@coinbase/onchainkit/identity";
import { ConnectWallet } from "@coinbase/onchainkit/wallet";
import { base } from "viem/chains";

function AppHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAccountPage = pathname.includes("/account");
  const isQuizPage = pathname.includes("/quiz/");

  // Hide header on quiz page on mobile, as it has its own CustomTopBar
  if (isQuizPage) {
    return null;
  }

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
    <Link to="/account" className="hover:opacity-80 transition-opacity">
      <Avatar
        address={address}
        chain={base}
        className="mask mask-squircle w-10 h-10"
      />
    </Link>
  );
}

export default AppHeader;
