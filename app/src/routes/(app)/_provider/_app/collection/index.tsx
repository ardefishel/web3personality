import { createFileRoute } from '@tanstack/react-router'
import { useAccount } from 'wagmi'
import { ConnectWallet } from '@coinbase/onchainkit/wallet'
import { useState } from 'react'
import { useUserCollection, type PersonalityNFT } from '@/lib'
import { PersonalityDrawer } from '@/components/personality-drawer'

export const Route = createFileRoute('/(app)/_provider/_app/collection/')({
  component: CollectionPage,
})

function CollectionPage() {
  const { address, isConnected } = useAccount()
  const { nfts, isLoading } = useUserCollection(address)
  const [selectedNFT, setSelectedNFT] = useState<PersonalityNFT | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleNFTClick = (nft: PersonalityNFT) => {
    setSelectedNFT(nft)
    setIsDrawerOpen(true)
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="text-center space-y-3">
          <div className="text-6xl mb-4">🎨</div>
          <h2 className="text-3xl font-bold">Your Collection</h2>
          <p className="text-base-content/70 max-w-md">
            Connect your wallet to view your personality NFTs
          </p>
        </div>
        <ConnectWallet
          render={({ onClick, isLoading: connecting }) => (
            <button
              onClick={onClick}
              disabled={connecting}
              className="btn btn-accent btn-lg rounded-full px-8"
            >
              {connecting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Connecting...
                </>
              ) : (
                'Connect Wallet'
              )}
            </button>
          )}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="My Collection"
        subtitle={`${nfts.length} personality ${nfts.length === 1 ? 'NFT' : 'NFTs'}`}
      />

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-64 lg:h-72 rounded-2xl" />
          ))}
        </div>
      ) : nfts.length === 0 ? (
        <EmptyState />
      ) : (
        <NFTGrid nfts={nfts} onNFTClick={handleNFTClick} />
      )}

      <PersonalityDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        nft={selectedNFT}
      />
    </div>
  )
}

interface SectionHeaderProps {
  title: string
  subtitle?: string
}

function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="space-y-1">
      <h2 className="text-3xl font-bold">{title}</h2>
      {subtitle && <p className="text-base-content/70 text-sm">{subtitle}</p>}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
      <div className="text-6xl mb-2">📭</div>
      <h3 className="text-2xl font-bold">No NFTs Yet</h3>
      <p className="text-base-content/70 text-center max-w-md">
        Take a personality quiz to mint your first NFT and build your collection!
      </p>
      <a href="/" className="btn btn-accent rounded-full px-6 mt-4">
        Explore Quizzes
      </a>
    </div>
  )
}

interface NFTGridProps {
  nfts: PersonalityNFT[]
  onNFTClick: (nft: PersonalityNFT) => void
}

function NFTGrid({ nfts, onNFTClick }: NFTGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
      {nfts.map((nft) => (
        <NFTCard key={nft.tokenId} nft={nft} onClick={() => onNFTClick(nft)} />
      ))}
    </div>
  )
}

interface NFTCardProps {
  nft: PersonalityNFT
  onClick: () => void
}

function NFTCard({ nft, onClick }: NFTCardProps) {
  return (
    <article
      onClick={onClick}
      className="card bg-base-100 h-64 lg:h-72 relative overflow-hidden cursor-pointer transition-transform hover:scale-105 active:scale-95 shadow-lg"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${nft.personalityImage})` }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative h-full p-4 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <span className="badge badge-accent badge-sm">{nft.quizCategory}</span>
          <div className="bg-accent/20 backdrop-blur-sm rounded-full px-2 py-1">
            <span className="text-xs font-mono text-accent-content">#{nft.tokenId}</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-white/60">{nft.quizName}</div>
          <h4 className="text-lg lg:text-xl font-bold text-white leading-tight line-clamp-2">
            {nft.personalityName}
          </h4>
        </div>
      </div>

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </article>
  )
}
