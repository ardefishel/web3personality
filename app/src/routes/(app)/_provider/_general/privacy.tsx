import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/_provider/_general/privacy')({
  component: PrivacyPolicyPage,
})

function PrivacyPolicyPage() {
  return (
    <div className="prose prose-sm max-w-none">
      <Section title="Introduction">
        <p>
          This Privacy Policy explains how Web3 Personality collects, uses, and protects your information when you use our decentralized application.
        </p>
      </Section>

      <Section title="Information We Collect">
        <p>
          We collect minimal information to provide our services:
        </p>
        <ul>
          <li>Wallet addresses when you connect to our platform</li>
          <li>Quiz responses and results (stored on-chain when minted)</li>
          <li>Basic usage analytics to improve our service</li>
        </ul>
      </Section>

      <Section title="How We Use Your Information">
        <p>
          Your information is used to:
        </p>
        <ul>
          <li>Provide and improve our quiz services</li>
          <li>Process and mint your personality tokens</li>
          <li>Communicate updates and features</li>
          <li>Ensure platform security and prevent fraud</li>
        </ul>
      </Section>

      <Section title="Data Storage">
        <p>
          Quiz results that are minted as NFTs are stored permanently on the blockchain and are publicly visible. Personal wallet information and quiz responses are handled securely.
        </p>
      </Section>

      <Section title="Your Rights">
        <p>
          You have the right to:
        </p>
        <ul>
          <li>Disconnect your wallet at any time</li>
          <li>Request information about data we store</li>
          <li>Control which quizzes you take and mint</li>
        </ul>
      </Section>

      <Section title="Contact Us">
        <p>
          If you have questions about this Privacy Policy, please contact us through our official channels.
        </p>
      </Section>

      <div className="mt-8 p-4 bg-base-200 rounded-lg">
        <p className="text-xs text-base-content/60">
          Last updated: October 22, 2025
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
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      <div className="text-base-content/80 space-y-2">
        {children}
      </div>
    </div>
  )
}
