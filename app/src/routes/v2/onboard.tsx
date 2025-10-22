import { createFileRoute } from "@tanstack/react-router";

import Type3Logo from "./-components/assets/type3-logo.png";
import OnBoardCarousel from "./-components/onboard-carousel";
import { Brand } from "./-components/brand";

export const Route = createFileRoute("/v2/onboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full p-4 text-white">
        <div className="mb-8">
          <h1 className="text-2xl mb-2">
            Welcome to{" "}
            <Brand/>
          </h1>
          <p className="text-lg opacity-90">
            Your personality test quiz to onboard web3
          </p>
        </div>

        {/* Carousel */}
        <OnBoardCarousel />

        {/* Connect Wallet Section */}
        <div className="mt-8">
          <p className="text-sm mb-4 opacity-80">
            Connect your wallet to start the journey
          </p>
          <button className="btn font-bold btn-lg text-white btn-accent w-full">
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );
}


