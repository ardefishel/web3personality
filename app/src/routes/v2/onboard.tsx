import { createFileRoute } from "@tanstack/react-router";

import Type3Logo from "./-components/assets/type3-logo.png";
import Onboard01 from "./-components/assets/onboard-01.png";
import Onboard02 from "./-components/assets/onboard-02.png";
import Onboard03 from "./-components/assets/onboard-03.png";

export const Route = createFileRoute("/v2/onboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full p-4 text-white">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl mb-2">
            Welcome to
            <span className="break-keep font-bold ml-2">
              <img className="inline-block w-8" src={Type3Logo} alt="Typ3 Logo" />{" "}
              Typ3.xyz
            </span>
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


function OnBoardCarousel() {
  return (
    <div className="mb-8 py-12">
      <div className="carousel w-full rounded-xl overflow-hidden shadow-lg">
        <div id="item1" className="carousel-item w-full relative">
          <img
            src={Onboard01}
            className="w-full h-96 object-contain bg-white p-4"
            alt="Discover your quiz"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
            <p className="text-sm font-medium">Discover your quiz</p>
          </div>
        </div>
        <div id="item2" className="carousel-item w-full relative">
          <img
            src={Onboard02}
            className="w-full h-96 object-contain bg-white p-4"
            alt="Complete the quiz"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
            <p className="text-sm font-medium">
              Complete the quiz to get your result PFP NFT
            </p>
          </div>
        </div>
        <div id="item3" className="carousel-item w-full relative">
          <img
            src={Onboard03}
            className="w-full h-96 object-contain bg-white p-4"
            alt="Join the web3 world"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
            <p className="text-sm font-medium">
              Use the PFP to join the web3 world
            </p>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-center gap-2 py-4">
        <a
          href="#item1"
          className="btn btn-circle btn-sm bg-white/20 hover:bg-white/30 border-none text-white"
        >
          1
        </a>
        <a
          href="#item2"
          className="btn btn-circle btn-sm bg-white/20 hover:bg-white/30 border-none text-white"
        >
          2
        </a>
        <a
          href="#item3"
          className="btn btn-circle btn-sm bg-white/20 hover:bg-white/30 border-none text-white"
        >
          3
        </a>
      </div>
    </div>
  );
}
