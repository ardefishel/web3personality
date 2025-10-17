import { createFileRoute, Link } from "@tanstack/react-router";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { useAccount } from "wagmi";
import { useLatestQuizzes } from "@/hooks/useQuizzes";

export const Route = createFileRoute('/_app/')({
  component: RouteComponent,
})

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
  const latestQuizzes = useLatestQuizzes(3);

  // Show loading state while quizzes are loading
  const isLoading = latestQuizzes.some(quiz => quiz.isLoading);
  const hasQuizzes = latestQuizzes.length > 0;

  if (isLoading) {
    return (
      <section className="px-4">
        <h2 className="text-xl font-semibold mb-3">Latest Personality Tests</h2>
        <div className="w-full aspect-video rounded-box bg-base-200 flex items-center justify-center">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-primary mb-2"></div>
            <p className="text-sm opacity-70">Loading latest quizzes...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!hasQuizzes) {
    return (
      <section className="px-4">
        <h2 className="text-xl font-semibold mb-3">Latest Personality Tests</h2>
        <div className="w-full aspect-video rounded-box bg-base-200 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg opacity-70">No quizzes available yet</p>
            <p className="text-sm opacity-50 mt-2">Check back soon for new personality tests!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4">
      <h2 className="text-xl font-semibold mb-3">Latest Personality Tests</h2>
      <div className="carousel w-full aspect-video rounded-box bg-base-200">
        {latestQuizzes.map((quiz, index) => {
          const slideId = `slide${index + 1}`;
          const prevSlideId = index === 0 ? `slide${latestQuizzes.length}` : `slide${index}`;
          const nextSlideId = index === latestQuizzes.length - 1 ? `slide1` : `slide${index + 2}`;
          
          const title = quiz.detail?.title || `Quiz ${quiz.id}`;
          const image = quiz.detail?.image || 'https://via.placeholder.com/800x400?text=Quiz';
          
          return (
            <div key={quiz.id} id={slideId} className="carousel-item relative w-full">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Quiz'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <h3 className="text-lg font-medium mb-2">{title}</h3>
                <p className="text-sm opacity-90 mb-3">{quiz.detail?.description || 'No description available'}</p>
                <Link 
                  to="/take-quiz/$quizId" 
                  params={{ quizId: quiz.id.toString() }}
                  className="btn btn-primary btn-sm"
                >
                  Take Quiz
                </Link>
              </div>
              {latestQuizzes.length > 1 && (
                <div className="absolute inset-y-1/2 left-2 right-2 flex items-center justify-between">
                  <a href={`#${prevSlideId}`} className="btn btn-circle btn-sm bg-black/20 hover:bg-black/40 border-white/20">❮</a>
                  <a href={`#${nextSlideId}`} className="btn btn-circle btn-sm bg-black/20 hover:bg-black/40 border-white/20">❯</a>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Carousel indicators */}
      {latestQuizzes.length > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {latestQuizzes.map((_, index) => (
            <a
              key={index}
              href={`#slide${index + 1}`}
              className="w-3 h-3 rounded-full bg-white/30 hover:bg-white/60 transition-colors"
            />
          ))}
        </div>
      )}
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
