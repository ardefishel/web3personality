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
            Welcome to{" "}
            <span className="break-keep font-bold ml-2">
              <img
                className="inline-block w-8"
                src={Type3Logo}
                alt="Typ3 Logo"
              />
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
  const carouselItems = [
    {
      id: "item1",
      image: Onboard01,
      alt: "Discover your quiz",
      text: "Discover your quiz",
    },
    {
      id: "item2",
      image: Onboard02,
      alt: "Complete the quiz",
      text: "Complete the quiz to get your result PFP NFT",
    },
    {
      id: "item3",
      image: Onboard03,
      alt: "Join the web3 world",
      text: "Use the PFP to join the web3 world",
    },
  ];

  return (
    <div className="mb-8 py-12">
      <div className="carousel w-full rounded-xl overflow-hidden shadow-lg">
        {carouselItems.map((item) => (
          <div
            key={item.id}
            id={item.id}
            className="carousel-item w-full relative"
          >
            <img
              src={item.image}
              className="w-full h-96 object-contain bg-white p-4"
              alt={item.alt}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
              <p className="text-sm font-medium">{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex w-full justify-center gap-2 py-4">
        {carouselItems.map((item, index) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="btn btn-circle btn-sm bg-white/20 hover:bg-white/30 border-none text-white"
          >
            {index + 1}
          </a>
        ))}
      </div>
    </div>
  );
}
