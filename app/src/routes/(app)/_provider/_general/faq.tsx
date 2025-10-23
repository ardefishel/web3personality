import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/_provider/_general/faq')({
  component: FAQPage,
})

function FAQPage() {
  return (
    <div className="space-y-4">
      <FAQItem
        question="What is Web3 Personality?"
        answer="Web3 Personality is a decentralized platform that allows you to take personality quizzes and mint your results as NFTs on the blockchain."
      />
      <FAQItem
        question="How do I take a quiz?"
        answer="Browse the available quizzes on the home page, select one that interests you, and click 'Start Quiz'. Answer all questions honestly to get the most accurate result."
      />
      <FAQItem
        question="What happens after I complete a quiz?"
        answer="After completing a quiz, you'll receive your personality type result. You can then choose to mint it as an NFT to your wallet, making it permanently yours on the blockchain."
      />
      <FAQItem
        question="Do I need a wallet to use this app?"
        answer="Yes, you need a Web3 wallet like MetaMask or Coinbase Wallet to connect to the app and mint your personality tokens."
      />
      <FAQItem
        question="Which blockchain networks are supported?"
        answer="Currently, the app runs on Base Sepolia testnet. More networks may be added in the future."
      />
      <FAQItem
        question="Are there any fees?"
        answer="Gas fees may apply when minting your personality tokens on the blockchain. These fees go to the network validators, not to us."
      />
      <FAQItem
        question="Can I retake a quiz?"
        answer="Yes! You can retake any quiz as many times as you like. Each result can be minted as a separate NFT if you choose."
      />
    </div>
  )
}

interface FAQItemProps {
  question: string
  answer: string
}

function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <div className="collapse collapse-arrow bg-base-200 rounded-lg">
      <input type="checkbox" />
      <div className="collapse-title font-semibold">
        {question}
      </div>
      <div className="collapse-content">
        <p className="text-base-content/70">{answer}</p>
      </div>
    </div>
  )
}
