import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { useAccount } from "wagmi";


export const Route = createFileRoute("/")({
  component: RouteComponent,
  ssr: false
});

function RouteComponent() {
  return (
    <div className="flex-1 flex flex-col gap-10">
      <FeaturedCarousel />
      <IntroSection />
      <LocalFooter />
    </div>
  );
}

function FeaturedCarousel() {
  return (
    <section className="px-4">
      <h2 className="text-xl font-semibold mb-3">Featured Personality Tests</h2>
      <div className="carousel w-full aspect-video rounded-box bg-base-200">
        <div id="slide1" className="carousel-item relative w-full">
          <img
            src="https://img.tradeport.gg/?url=https%3A%2F%2Fwalrus.tusky.io%2FIYiaBFukGZBwMCBiQ5ya3Updq2onTJOSxqJtiIbT8zU&profile=c94c9db4-efda-42f1-9b6c-5b83d0340acd"
            alt="Walruz Personality Collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
            <h3 className="text-lg font-medium">Walruz Personality Collection</h3>
          </div>
          <div className="absolute inset-y-1/2 left-2 right-2 flex items-center justify-between">
            <a href="#slide3" className="btn btn-circle btn-sm">❮</a>
            <a href="#slide2" className="btn btn-circle btn-sm">❯</a>
          </div>
        </div>

        <div id="slide2" className="carousel-item relative w-full">
          <img
            src="https://img.tradeport.gg/?url=https%3A%2F%2Ftradeport.mypinata.cloud%2Fipfs%2Fbafybeibpm6pdsabp6zswzcimky6j6kc3m3urh4d34fxt5xh3ubzsvnnxfy%3FpinataGatewayToken%3D5Uc_j2QFWW75kVPmXB6eWCJ0aVZmc4o9QAq5TiuPfMHZQLKa_VNL3uaXj5NKrq0w%26img-width%3D700%26img-height%3D700%26img-fit%3Dcover%26img-quality%3D80%26img-onerror%3Dredirect%26img-fit%3Dpad%26img-format%3Dwebp&profile=39f29b4d-02ca-4157-a034-2686ee4a0e0f&mime-type=io%2Fipfs%2Fbafybeibpm6pdsabp6zswzcimky6j6kc3m3urh4d34fxt5xh3ubzsvnnxfy"
            alt="Tally Personality Collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
            <h3 className="text-lg font-medium">Tally Personality Collection</h3>
          </div>
          <div className="absolute inset-y-1/2 left-2 right-2 flex items-center justify-between">
            <a href="#slide1" className="btn btn-circle btn-sm">❮</a>
            <a href="#slide3" className="btn btn-circle btn-sm">❯</a>
          </div>
        </div>

        <div id="slide3" className="carousel-item relative w-full">
          <img
            src="https://img.tradeport.gg/?url=https%3A%2F%2Fwalrus.tusky.io%2FaCAL9atS22PWMs5Bv1C6x49YYTc5vxuDj9cfrd5ZH-8&profile=821b4657-5c30-4941-9b13-2b96b4af61f0"
            alt="Death Corp Personality Collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
            <h3 className="text-lg font-medium">Death Corp Personality Collection</h3>
          </div>
          <div className="absolute inset-y-1/2 left-2 right-2 flex items-center justify-between">
            <a href="#slide2" className="btn btn-circle btn-sm">❮</a>
            <a href="#slide1" className="btn btn-circle btn-sm">❯</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function IntroSection() {
  const { isConnected } = useAccount();
  return (
    <section className="px-4 flex flex-col gap-8">
      <div className="max-w-3xl">
        <h2 className="text-xl font-semibold mb-2">What is Web3Personality?</h2>
        <p className="opacity-80 mb-4">
          Web3Personality lets you choose a personality test, complete it, and
          instantly mint a PFP NFT that reflects your result. Own your vibes on-chain.
        </p>
        {!isConnected && (
          <div className="space-y-3">
            <p className="text-lg font-medium">
              🚀 Start your first NFT here! Connect your account to get started.
            </p>
            <Wallet/>
          </div>
        )}
      </div>

      <USPSection />
    </section>
  );
}

function USPSection() {
  return (
    <div className="max-w-4xl">
      <h3 className="text-2xl font-bold mb-6 text-center">How It Works</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1 */}
        <div className="card bg-base-200">
          <div className="card-body items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-content text-2xl font-bold mb-4">
              1
            </div>
            <h4 className="card-title text-lg">Choose Your Test</h4>
            <p className="opacity-80 text-sm">
              Browse through various personality tests and select the one that interests you most.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="card bg-base-200">
          <div className="card-body items-center text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-secondary-content text-2xl font-bold mb-4">
              2
            </div>
            <h4 className="card-title text-lg">Complete the Test</h4>
            <p className="opacity-80 text-sm">
              Answer the questions honestly to get an accurate personality assessment.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="card bg-base-200">
          <div className="card-body items-center text-center">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-accent-content text-2xl font-bold mb-4">
              3
            </div>
            <h4 className="card-title text-lg">Receive Your NFT</h4>
            <p className="opacity-80 text-sm">
              Get a unique PFP NFT that represents your personality test result on-chain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LocalFooter() {
  return (
    <footer className="px-4 pb-4">
      <div className="divider my-0"></div>
      <div className="mt-3 text-sm opacity-80 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span>
          © 2025 Built with ♥ by ardefishel and his AI
        </span>
        <nav className="flex gap-4 underline underline-offset-4">
          <a href="https://github.com/ardefishel" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://x.com/ardefishel" target="_blank" rel="noreferrer">X</a>
          <a href="https://arde.work" target="_blank" rel="noreferrer">Website</a>
        </nav>
      </div>
    </footer>
  );
}
