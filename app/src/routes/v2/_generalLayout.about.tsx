import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/v2/_generalLayout/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="w-24 h-24 mx-auto mb-4 bg-base-300 rounded-2xl flex items-center justify-center">
          <span className="text-4xl">🎭</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Web3 Personality</h2>
        <p className="text-base-content/70">Discover yourself on-chain</p>
      </div>

      <div className="prose prose-sm max-w-none space-y-6">
        <Section title="Our Mission">
          <p>
            Web3 Personality combines the fun of personality quizzes with the power of blockchain technology. We believe that your personality insights should be truly yours - owned, verifiable, and permanent.
          </p>
        </Section>

        <Section title="What We Do">
          <p>
            Our platform allows you to:
          </p>
          <ul>
            <li>Take engaging personality quizzes across various categories</li>
            <li>Receive detailed insights about your unique traits</li>
            <li>Mint your results as NFTs on the blockchain</li>
            <li>Build a collection of your personality tokens</li>
            <li>Share your results with friends on social media</li>
          </ul>
        </Section>

        <Section title="Why Blockchain?">
          <p>
            By storing personality results on the blockchain, we ensure:
          </p>
          <ul>
            <li><strong>True Ownership:</strong> Your results belong to you forever</li>
            <li><strong>Verifiable:</strong> Authentic and tamper-proof records</li>
            <li><strong>Portable:</strong> Take your personality tokens anywhere</li>
            <li><strong>Privacy:</strong> You control who sees your results</li>
          </ul>
        </Section>

        <Section title="Technology">
          <p>
            Built on Base Sepolia network, our platform leverages smart contracts to create a seamless and secure experience for discovering and owning your personality insights.
          </p>
        </Section>
      </div>

      <div className="mt-8 p-4 bg-base-200 rounded-lg text-center">
        <p className="text-sm font-semibold mb-1">Version 1.0.0</p>
        <p className="text-xs text-base-content/60">
          Built with ❤️ for the Web3 community
        </p>
      </div>
    </div>
  )
}

interface SectionProps {
  title: string
  children: React.ReactNode
}

function Section({ title, children }: SectionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <div className="text-base-content/80 space-y-2">
        {children}
      </div>
    </div>
  )
}
