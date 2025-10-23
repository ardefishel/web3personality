import { useAccount, usePublicClient, useReadContract } from 'wagmi'
import { useQuery } from '@tanstack/react-query'
import personalityTokenContract from '../-lib/contract/personalityToken'
import { parseAbiItem, type Address } from 'viem'


interface TokenMetadata {
  name: string
  description: string
  image: string
  attributes?: Array<{
    trait_type: string
    value: string
  }>
}

// Hook to get token balance for a specific token ID
export function useTokenBalance(address: Address | undefined, tokenId: number) {
  return useReadContract({
    address: personalityTokenContract.address as Address,
    abi: personalityTokenContract.abi,
    functionName: 'balanceOf',
    args: address ? [address, BigInt(tokenId)] : undefined,
    query: {
      enabled: !!address && !!personalityTokenContract.address
    }
  })
}

// Hook to get token URI for metadata
export function useTokenUri(tokenId: number) {
  return useReadContract({
    address: personalityTokenContract.address as Address,
    abi: personalityTokenContract.abi,
    functionName: 'uri',
    args: [BigInt(tokenId)],
    query: {
      enabled: !!personalityTokenContract.address
    }
  })
}


// Hook to get token metadata from IPFS
export function useTokenMetadata(tokenUri: string | undefined) {
  return useQuery<TokenMetadata>({
    queryKey: ['tokenMetadata', tokenUri],
    queryFn: async (): Promise<TokenMetadata> => {
      if (!tokenUri) throw new Error('No token URI provided')
      
      // Handle IPFS URI format
      let metadataUrl = tokenUri
      if (metadataUrl.startsWith('ipfs://')) {
        metadataUrl = metadataUrl.replace('ipfs://', 'https://ipfs.io/ipfs/')
      }
      
      const response = await fetch(metadataUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.statusText}`)
      }
      
      return await response.json()
    },
    enabled: !!tokenUri,
    staleTime: 300000, // Cache for 5 minutes
  })
}

// Combined hook for getting complete token info (balance + URI + metadata)
export function useTokenInfo(tokenId: number, userAddress?: Address) {
  const { data: balance, isLoading: balanceLoading } = useTokenBalance(userAddress, tokenId)
  const { data: tokenUri, isLoading: uriLoading } = useTokenUri(tokenId)
  const { data: metadata, isLoading: metadataLoading } = useTokenMetadata(tokenUri)
  
  return {
    tokenId,
    balance: balance ? Number(balance) : 0,
    tokenUri,
    metadata,
    isLoading: balanceLoading || uriLoading || metadataLoading,
    isOwned: balance ? Number(balance) > 0 : false
  }
}

// Hook to get owned tokens using wagmi's usePublicClient to fetch TokenMinted events
export function useOwnedTokensFromEvents(address: Address | undefined) {
  const publicClient = usePublicClient()
  
  return useQuery({
    queryKey: ['ownedTokensFromEvents', address, personalityTokenContract.address],
    queryFn: async (): Promise<number[]> => {
      if (!address || !personalityTokenContract.address || !publicClient) {
        console.log('❌ Missing address, contract address, or public client:', { 
          address, 
          contractAddress: personalityTokenContract.address,
          publicClient: !!publicClient
        })
        return []
      }
      
      console.log('🚀 Fetching TokenMinted events for:', {
        userAddress: address,
        contractAddress: personalityTokenContract.address
      })
      
      try {
        console.log('📡 Using wagmi public client')
        
        // Get TokenMinted events for this user
        const logs = await publicClient.getLogs({
          address: personalityTokenContract.address as Address,
          event: parseAbiItem('event TokenMinted(address indexed user, uint256 tokenId, uint256 quizId)'),
          args: {
            user: address
          },
          fromBlock: 'earliest',
          toBlock: 'latest'
        })
        
        console.log('📋 Raw TokenMinted logs:', {
          logsCount: logs.length,
          logs: logs.map((log, index) => ({
            index,
            blockNumber: log.blockNumber,
            transactionHash: log.transactionHash,
            address: log.address,
            args: log.args,
            topics: log.topics
          }))
        })
        
        // Extract and process token IDs
        const tokenIds = logs
          .map((log, index) => {
            console.log(`🔍 Processing log ${index + 1}/${logs.length}:`, {
              args: log.args,
              user: log.args?.user,
              tokenId: log.args?.tokenId,
              quizId: log.args?.quizId
            })
            
            if (log.args && log.args.tokenId) {
              const tokenId = Number(log.args.tokenId)
              const logUser = log.args.user?.toLowerCase()
              const targetUser = address.toLowerCase()
              
              console.log(`✅ Token ${tokenId} details:`, {
                tokenId,
                logUser,
                targetUser,
                matches: logUser === targetUser
              })
              
              return tokenId
            }
            
            console.log('❌ Invalid log args:', log.args)
            return null
          })
          .filter((id): id is number => id !== null)
        
        // Remove duplicates and sort (newest first)
        const uniqueTokenIds = [...new Set(tokenIds)].sort((a, b) => b - a)
        
        console.log('🎯 Final processed token IDs:', {
          rawTokenIds: tokenIds,
          uniqueTokenIds,
          totalFound: uniqueTokenIds.length
        })
        
        return uniqueTokenIds
        
      } catch (error) {
        console.error('🚨 Error fetching TokenMinted events:', error)
        
        // Check if it's an RPC error
        if (error instanceof Error) {
          if (error.message.includes('no backend is currently healthy') || 
              error.message.includes('503') ||
              error.message.includes('HTTP request failed')) {
            console.log('🚸 RPC endpoint is down or unhealthy, returning empty array for now')
            // Return empty array instead of throwing error when RPC is down
            return []
          }
        }
        
        throw new Error(`Failed to fetch TokenMinted events: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },
    enabled: !!address && !!personalityTokenContract.address && !!publicClient,
    staleTime: 60000, // Cache for 60 seconds (longer cache during RPC issues)
    refetchOnWindowFocus: false, // Don't refetch on window focus during RPC issues
    retry: (failureCount, error) => {
      // Don't retry RPC errors immediately
      if (error?.message?.includes('no backend is currently healthy') || 
          error?.message?.includes('503')) {
        return failureCount < 1 // Only retry once for RPC errors
      }
      return failureCount < 3 // Normal retry logic for other errors
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000) // Exponential backoff
  })
}

// Hook to get all owned tokens with their complete information
export function useOwnedTokensWithInfo() {
  const { address } = useAccount()
  const { data: ownedTokenIds = [], isLoading: tokensLoading, error } = useOwnedTokensFromEvents(address)
  
  // If we got an empty array but no error, and we have an address, it might be RPC issues
  const hasRpcIssues = !tokensLoading && !error && ownedTokenIds.length === 0 && !!address
  
  console.log('🔄 useOwnedTokensWithInfo:', {
    address,
    ownedTokenIds,
    tokensLoading,
    error,
    hasRpcIssues
  })
  
  return {
    ownedTokens: ownedTokenIds,
    isLoading: tokensLoading,
    error,
    hasRpcIssues
  }
}

// Fallback hook for demo purposes when RPC is down
export function useOwnedTokensDemo(address: Address | undefined) {
  return useQuery({
    queryKey: ['ownedTokensDemo', address],
    queryFn: async (): Promise<number[]> => {
      if (!address) return []
      
      console.log('🎭 Using demo tokens due to RPC issues')
      
      // Simulate some owned tokens based on address for demo
      const addressNumber = parseInt(address.slice(-4), 16)
      const tokenCount = (addressNumber % 3) + 1 // 1-3 tokens
      const demoTokens = Array.from({ length: tokenCount }, (_, i) => i + 1)
      
      return demoTokens
    },
    enabled: !!address,
    staleTime: 300000 // Cache demo data for 5 minutes
  })
}
