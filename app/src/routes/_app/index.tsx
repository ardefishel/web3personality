import { createFileRoute, Link } from "@tanstack/react-router";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { useAccount } from "wagmi";
import { useLatestQuizzes } from "@/hooks/useQuizzes";

export const Route = createFileRoute('/_app/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex-1 flex flex-col gap-10 lg:gap-16 lg:px-8 lg:py-8">
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
    <section className="px-4 lg:px-0">
      <h2 className="text-xl lg:text-3xl font-semibold mb-3 lg:mb-6">Latest Personality Tests</h2>
      <div className="w-full aspect-video lg:aspect-[21/9] rounded-box bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-2"></div>
          <p className="text-sm lg:text-base opacity-70">Loading latest quizzes...</p>
        </div>
      </div>
    </section>
  );
  }

  if (!hasQuizzes) {
  return (
    <section className="px-4 lg:px-0">
      <h2 className="text-xl lg:text-3xl font-semibold mb-3 lg:mb-6">Latest Personality Tests</h2>
      <div className="w-full aspect-video lg:aspect-[21/9] rounded-box bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg lg:text-xl opacity-70">No quizzes available yet</p>
          <p className="text-sm lg:text-base opacity-50 mt-2">Check back soon for new personality tests!</p>
        </div>
      </div>
    </section>
  );
  }

  return (
    <section className="px-4 lg:px-0">
      <h2 className="text-xl lg:text-3xl font-semibold mb-3 lg:mb-6">Latest Personality Tests</h2>
      <div className="carousel w-full aspect-video lg:aspect-[21/9] rounded-box bg-base-200">
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
              <div className="absolute inset-x-0 bottom-0 p-4 lg:p-8 text-white">
                <h3 className="text-lg lg:text-2xl font-medium mb-2">{title}</h3>
                <p className="text-sm lg:text-base opacity-90 mb-3">{quiz.detail?.description || 'No description available'}</p>
                <Link 
                  to="/take-quiz/$quizId" 
                  params={{ quizId: quiz.id.toString() }}
                  className="btn btn-primary btn-sm lg:btn-md"
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
    <section className="px-4 lg:px-0 flex flex-col gap-8 lg:gap-12">
      <div className="max-w-3xl lg:max-w-5xl">
        <h2 className="text-xl lg:text-3xl font-semibold mb-2 lg:mb-4">What is Web3Personality?</h2>
        <p className="opacity-80 mb-4 lg:mb-6 text-base lg:text-lg lg:leading-relaxed">
          Web3Personality lets you choose a personality test, complete it, and
          instantly mint a PFP NFT that reflects your result. Own your vibes on-chain.
        </p>
        {!isConnected && (
          <div className="space-y-3 lg:space-y-4">
            <p className="text-lg lg:text-xl font-medium">
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
    <div className="max-w-4xl lg:max-w-7xl">
      <h3 className="text-2xl lg:text-4xl font-bold mb-6 lg:mb-12 text-center">How It Works</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {/* Step 1 */}
        <div className="card bg-base-200 lg:shadow-lg">
          <div className="card-body items-center text-center lg:p-8">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-primary flex items-center justify-center text-primary-content text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">
              1
            </div>
            <h4 className="card-title text-lg lg:text-xl">Choose Your Test</h4>
            <p className="opacity-80 text-sm lg:text-base lg:leading-relaxed">
              Browse through various personality tests and select the one that interests you most.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="card bg-base-200 lg:shadow-lg">
          <div className="card-body items-center text-center lg:p-8">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-secondary flex items-center justify-center text-secondary-content text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">
              2
            </div>
            <h4 className="card-title text-lg lg:text-xl">Complete the Test</h4>
            <p className="opacity-80 text-sm lg:text-base lg:leading-relaxed">
              Answer the questions honestly to get an accurate personality assessment.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="card bg-base-200 lg:shadow-lg">
          <div className="card-body items-center text-center lg:p-8">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-accent flex items-center justify-center text-accent-content text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">
              3
            </div>
            <h4 className="card-title text-lg lg:text-xl">Receive Your NFT</h4>
            <p className="opacity-80 text-sm lg:text-base lg:leading-relaxed">
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
    <footer className="px-4 lg:px-0 pb-4">
      <div className="divider my-0"></div>
      <div className="mt-3 lg:mt-6 text-sm lg:text-base opacity-80 flex flex-col gap-2 lg:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <span>
          © 2025 Built with ♥ by ardefishel and his AI
        </span>
        <nav className="flex gap-4 lg:gap-6 underline underline-offset-4">
          <a href="https://github.com/ardefishel" target="_blank" rel="noreferrer" className="hover:opacity-100 transition-opacity">
            GitHub
          </a>
          <a href="https://x.com/ardefishel" target="_blank" rel="noreferrer" className="hover:opacity-100 transition-opacity">
            X
          </a>
          <a href="https://arde.work" target="_blank" rel="noreferrer" className="hover:opacity-100 transition-opacity">
            Website
          </a>
        </nav>
      </div>
    </footer>
  );
}
