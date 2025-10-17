import { createFileRoute } from '@tanstack/react-router'
import { useAccount, useReadContract } from 'wagmi'
import { Wallet } from '@coinbase/onchainkit/wallet'
import personalityTokenContract from '@/lib/contract/personalityToken'
import { useQuery } from '@tanstack/react-query'
import { useOwnedTokensReal } from '@/hooks/usePersonalityTokens'

export const Route = createFileRoute('/_app/collection/')({ 
  component: RouteComponent,
})

interface TokenMetadata {
  name: string
  description: string
  image: string
  attributes?: Array<{
    trait_type: string
    value: string
  }>
}

function RouteComponent() {
  const { address, isConnected } = useAccount()
  
  if (!isConnected) {
    return <WalletConnectionPrompt />
  }
  
  return (
    <div className="flex-1 flex flex-col gap-6 px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Collection</h1>
      </div>
      <NFTCollection address={address!} />
    </div>
  )
}

function WalletConnectionPrompt() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Connect Your Wallet</h1>
        <p className="text-base-content/70 mb-6">
          Connect your wallet to view your PersonalityToken NFT collection
        </p>
      </div>
      <div className="w-full max-w-sm">
        <Wallet />
      </div>
    </div>
  )
}

function NFTCollection({ address }: { address: `0x${string}` }) {
  const { ownedTokens, isLoading: isLoadingTokens, error } = useOwnedTokensReal(address)
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-24 h-24 rounded-full bg-error/20 flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-error" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">Error Loading Collection</h3>
        <p className="text-base-content/70 mb-4">{error}</p>
      </div>
    )
  }

  if (isLoadingTokens) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
        <p className="text-base-content/70">Loading your NFT collection...</p>
      </div>
    )
  }
  
  if (ownedTokens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-24 h-24 rounded-full bg-base-200 flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-base-content/30" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">No NFTs Found</h3>
        <p className="text-base-content/70 mb-4">
          You don't have any PersonalityToken NFTs yet.
        </p>
        <a href="/" className="btn btn-primary">
          Take Your First Quiz
        </a>
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {ownedTokens.map(tokenId => (
        <NFTCard key={tokenId} tokenId={tokenId} />
      ))}
    </div>
  )
}

function NFTCard({ tokenId }: { tokenId: number }) {
  // Get token URI from contract
  const { data: tokenUri } = useReadContract({
    address: personalityTokenContract.address as `0x${string}`,
    abi: personalityTokenContract.contract.abi,
    functionName: 'uri',
    args: [BigInt(tokenId)],
  })
  
  // Fetch metadata from IPFS
  const { data: metadata, isLoading } = useQuery<TokenMetadata>({
    queryKey: ['nft-metadata', tokenId, tokenUri],
    queryFn: async (): Promise<TokenMetadata> => {
      if (!tokenUri) throw new Error('No token URI')
      
      // Handle IPFS URI format
      let metadataUrl = tokenUri as string
      if (metadataUrl.startsWith('ipfs://')) {
        metadataUrl = metadataUrl.replace('ipfs://', 'https://ipfs.io/ipfs/')
      }
      
      const response = await fetch(metadataUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.statusText}`)
      }
      
      return await response.json()
    },
    enabled: !!tokenUri
  })
  
  if (isLoading) {
    return (
      <div className="card bg-base-200 animate-pulse">
        <div className="aspect-square bg-base-300 rounded-t-box"></div>
        <div className="card-body">
          <div className="h-4 bg-base-300 rounded mb-2"></div>
          <div className="h-3 bg-base-300 rounded w-2/3"></div>
        </div>
      </div>
    )
  }
  
  if (!metadata) {
    return (
      <div className="card bg-base-200">
        <div className="aspect-square bg-base-300 rounded-t-box flex items-center justify-center">
          <span className="text-base-content/50">Failed to load</span>
        </div>
        <div className="card-body">
          <h3 className="card-title text-sm">Token #{tokenId}</h3>
          <p className="text-xs text-base-content/70">Metadata unavailable</p>
        </div>
      </div>
    )
  }
  
  let imageUrl = metadata.image || ''
  if (imageUrl.startsWith('ipfs://')) {
    imageUrl = imageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/')
  }
  
  return (
    <div className="card bg-base-200 hover:shadow-lg transition-shadow">
      <figure className="aspect-square">
        <img 
          src={imageUrl} 
          alt={metadata.name || `Token #${tokenId}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x400?text=NFT'
          }}
        />
      </figure>
      <div className="card-body p-4">
        <h3 className="card-title text-sm">
          {metadata.name || `PersonalityToken #${tokenId}`}
        </h3>
        <p className="text-xs text-base-content/70 line-clamp-2">
          {metadata.description || 'Your unique personality NFT'}
        </p>
        
        {metadata.attributes && metadata.attributes.length > 0 && (
          <div className="mt-3">
            <h4 className="text-xs font-semibold mb-2">Traits:</h4>
            <div className="flex flex-wrap gap-1">
              {metadata.attributes.slice(0, 3).map((attr, index) => (
                <div key={index} className="badge badge-outline badge-xs">
                  {attr.trait_type}: {attr.value}
                </div>
              ))}
              {metadata.attributes.length > 3 && (
                <div className="badge badge-outline badge-xs">
                  +{metadata.attributes.length - 3} more
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="card-actions justify-end mt-3">
          <div className="badge badge-primary badge-outline text-xs">
            #{tokenId}
          </div>
        </div>
      </div>
    </div>
  )
}
