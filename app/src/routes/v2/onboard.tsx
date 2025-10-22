import { createFileRoute, Link } from "@tanstack/react-router";

import OnBoardCarousel from "./-components/onboard-carousel";
import { Brand } from "./-components/brand";

export const Route = createFileRoute("/v2/onboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-dvh flex items-center justify-center p-4 bg-gradient-to-b from-base-300 to-base-100">
      <div className="max-w-md w-full px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold leading-tight">
            Welcome to <span className="align-middle"><Brand /></span>
          </h1>
          <p className="text-base-content/70 mt-2">
            Discover your on-chain personality and join the web3 world.
          </p>
        </header>

        <OnBoardCarousel />

        <section className="mt-8 space-y-3">
          <p className="text-sm text-base-content/70">
            Connect your wallet to start the journey
          </p>
          <button className="btn btn-accent btn-lg w-full rounded-full font-semibold">
            Connect Wallet
          </button>
          <Link
            to="/v2"
            className="btn btn-ghost w-full rounded-full"
          >
            Explore without wallet
          </Link>
          <p className="text-xs text-base-content/60 text-center">
            By connecting a wallet, you agree to our terms and privacy policy.
          </p>
        </section>
      </div>
    </div>
  );
}


