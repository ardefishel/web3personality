import { useReadContract } from 'wagmi'
import { useState, useEffect } from 'react'
import personalityTokenContract from '@/lib/contract/personalityToken'

interface TokenBalance {
  tokenId: number
  balance: number
}

// Hook to check balance of a specific token
export function useTokenBalance(address: `0x${string}` | undefined, tokenId: number) {
  const result = useReadContract({
    address: personalityTokenContract.address as `0x${string}`,
    abi: personalityTokenContract.contract.abi,
    functionName: 'balanceOf',
    args: [address!, BigInt(tokenId)],
    query: {
      enabled: !!address && !!personalityTokenContract.address,
    },
  })
  
  // Debug logging
  if (result.error) {
    console.warn(`Token ${tokenId} balance check error:`, result.error)
  }
  
  return result
}

// Hook to get all owned tokens for an address
export function useOwnedTokens(address: `0x${string}` | undefined, maxTokens: number = 50) {
  const [ownedTokens, setOwnedTokens] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!address) {
      setOwnedTokens([])
      setIsLoading(false)
      return
    }

    const checkTokens = async () => {
      setIsLoading(true)
      setError(null)
      const owned: number[] = []

      try {
        // In a production app, you'd want to:
        // 1. Use contract events to find minted tokens
        // 2. Use a multicall contract to batch balance checks
        // 3. Use an indexing service like The Graph
        
        // For now, we'll check a reasonable range sequentially
        for (let tokenId = 1; tokenId <= maxTokens; tokenId++) {
          try {
            // Note: This is not optimal for production as it makes many individual calls
            // but serves as a demonstration
            const response = await fetch('/api/check-token-balance', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                address,
                tokenId,
                contractAddress: personalityTokenContract.address
              })
            })

            if (response.ok) {
              const { balance } = await response.json()
              if (balance > 0) {
                owned.push(tokenId)
              }
            }
          } catch (tokenError) {
            console.warn(`Failed to check token ${tokenId}:`, tokenError)
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check tokens')
      }

      setOwnedTokens(owned)
      setIsLoading(false)
    }

    checkTokens()
  }, [address, maxTokens])

  return { ownedTokens, isLoading, error }
}

// Hook to get owned tokens using real contract calls
export function useOwnedTokensReal(address: `0x${string}` | undefined, maxTokens: number = 20) {
  const [ownedTokens, setOwnedTokens] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check balances for tokens 1-maxTokens
  const token1Balance = useTokenBalance(address, 1)
  const token2Balance = useTokenBalance(address, 2)
  const token3Balance = useTokenBalance(address, 3)
  const token4Balance = useTokenBalance(address, 4)
  const token5Balance = useTokenBalance(address, 5)
  const token6Balance = useTokenBalance(address, 6)
  const token7Balance = useTokenBalance(address, 7)
  const token8Balance = useTokenBalance(address, 8)
  const token9Balance = useTokenBalance(address, 9)
  const token10Balance = useTokenBalance(address, 10)
  
  const balanceChecks = [
    { id: 1, ...token1Balance },
    { id: 2, ...token2Balance },
    { id: 3, ...token3Balance },
    { id: 4, ...token4Balance },
    { id: 5, ...token5Balance },
    { id: 6, ...token6Balance },
    { id: 7, ...token7Balance },
    { id: 8, ...token8Balance },
    { id: 9, ...token9Balance },
    { id: 10, ...token10Balance },
  ]

  useEffect(() => {
    if (!address) {
      setOwnedTokens([])
      setIsLoading(false)
      return
    }

    const allLoaded = balanceChecks.every(check => !check.isLoading)
    const anyError = balanceChecks.some(check => check.isError)
    
    // Debug logging
    console.log('PersonalityToken Debug:', {
      address,
      contractAddress: personalityTokenContract.address,
      allLoaded,
      anyError,
      balanceChecks: balanceChecks.map(c => ({
        id: c.id,
        data: c.data ? Number(c.data) : 'no data',
        isLoading: c.isLoading,
        isError: c.isError,
        error: c.error?.message
      }))
    })

    if (allLoaded) {
      if (anyError) {
        setError('Failed to check some token balances')
      } else {
        const owned = balanceChecks
          .filter(check => check.data && Number(check.data) > 0)
          .map(check => check.id)
        console.log('Owned tokens found:', owned)
        setOwnedTokens(owned)
        setError(null)
      }
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
  }, [address, ...balanceChecks.map(c => `${c.isLoading}-${c.data}-${c.isError}`)])

  return { ownedTokens, isLoading, error }
}

// Simulated hook for demo purposes - remove in production
export function useOwnedTokensDemo(address: `0x${string}` | undefined) {
  const [ownedTokens, setOwnedTokens] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!address) {
      setOwnedTokens([])
      setIsLoading(false)
      return
    }

    // Simulate loading time
    const timer = setTimeout(() => {
      // Simulate some owned tokens based on address
      const addressHash = parseInt(address.slice(-4), 16)
      const numTokens = addressHash % 5 // 0-4 tokens
      const tokens = Array.from({ length: numTokens }, (_, i) => i + 1)
      
      setOwnedTokens(tokens)
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [address])

  return { ownedTokens, isLoading, error: null }
}
