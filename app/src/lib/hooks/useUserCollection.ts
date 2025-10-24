import { useReadContracts, useAccount } from 'wagmi'
import { useQuery } from '@tanstack/react-query'
import { quizManagerContract, quizPersonalityTokenContract } from '../contracts'
import { Address } from 'viem'

interface PersonalityNFT {
  tokenId: number
  quizId: number
  quizName: string
  quizCategory: string
  personalityName: string
  personalityImage: string
  attributes: Array<{ trait_type: string; value: string }>
  quizCid: string
}

interface IPFSPersonalityMetadata {
  tokenId: number
  name: string
  image: string
  attributes?: Array<{ trait_type: string; value: string }>
}

interface IPFSCollectionMetadata {
  name: string
  description: string
  category?: string
  personalities: Array<{
    name: string
    tokenId: number
    image: string
    attributes: Array<{ trait_type: string; value: string }>
  }>
}

async function fetchPersonalityMetadata(
  cid: string,
  tokenId: number
): Promise<IPFSPersonalityMetadata> {
  const response = await fetch(`https://ipfs.io/ipfs/${cid}/${tokenId}.json`)
  if (!response.ok) {
    throw new Error(`Failed to fetch personality metadata for token ${tokenId}`)
  }
  return response.json()
}

async function fetchCollectionMetadata(
  cid: string
): Promise<IPFSCollectionMetadata | null> {
  try {
    const response = await fetch(`https://ipfs.io/ipfs/${cid}/collection.json`)
    if (response.ok) {
      return response.json()
    }
  } catch {
    // Fall back to null
  }
  return null
}

export function useUserCollection(userAddress?: Address) {
  // Get quiz counter to know how many quizzes exist
  const { data: quizIdCounter } = useReadContracts({
    contracts: [
      {
        ...quizManagerContract,
        functionName: 'quizIdCounter',
      },
    ],
  })

  const totalQuizzes = quizIdCounter?.[0]?.result
    ? Number(quizIdCounter[0].result) - 1
    : 0

  const quizIds = Array.from({ length: totalQuizzes }, (_, i) => i + 1)

  // Get quiz info and participation status for all quizzes
  const { data: quizData, isLoading: isLoadingQuizData } = useReadContracts({
    contracts: quizIds.flatMap((quizId) => [
      {
        ...quizManagerContract,
        functionName: 'getQuizInfo',
        args: [BigInt(quizId)],
      },
      ...(userAddress
        ? [
            {
              ...quizManagerContract,
              functionName: 'hasParticipated',
              args: [userAddress, BigInt(quizId)],
            },
          ]
        : []),
    ]) as any,
  })

  // Find participated quizzes
  const participatedQuizzes = quizIds.filter((quizId, index) => {
    if (!userAddress || !quizData) return false
    const hasParticipatedIndex = index * 2 + 1
    const participated = quizData[hasParticipatedIndex]?.result
    return participated === true
  })

  // Get quiz info for participated quizzes
  const participatedQuizInfo = participatedQuizzes.map((quizId, index) => {
    const quizInfoIndex = (quizIds.indexOf(quizId)) * 2
    const quizInfo = quizData?.[quizInfoIndex]?.result as
      | [bigint, string, boolean]
      | undefined

    return quizInfo
      ? {
          quizId,
          cid: quizInfo[1],
          isActive: quizInfo[2],
        }
      : null
  }).filter((q): q is { quizId: number; cid: string; isActive: boolean } => q !== null)

  // Get all potential token IDs to check balances for
  const potentialTokenIds = participatedQuizInfo.flatMap(quiz => {
    const baseTokenId = quiz.quizId * 1000
    // Check up to 50 possible personalities per quiz
    return Array.from({ length: 50 }, (_, i) => ({
      quizId: quiz.quizId,
      tokenId: baseTokenId + i,
      cid: quiz.cid,
    }))
  })

  // Check balances for all potential tokens
  const { data: balances } = useReadContracts({
    contracts: userAddress
      ? potentialTokenIds.map(({ tokenId }) => ({
          ...quizPersonalityTokenContract,
          functionName: 'balanceOf',
          args: [userAddress, BigInt(tokenId)],
        }))
      : [],
  })

  // Find which tokens the user actually owns
  const ownedTokenIds = potentialTokenIds.filter((token, index) => {
    const balance = balances?.[index]?.result
    return balance && Number(balance) > 0
  })

  console.log('User Collection Debug:', {
    userAddress,
    participatedQuizzes: participatedQuizInfo.map(q => q.quizId),
    totalTokensChecked: potentialTokenIds.length,
    ownedTokens: ownedTokenIds.map(t => ({ quizId: t.quizId, tokenId: t.tokenId })),
  })

  // Fetch NFT data for owned tokens
  const { data: nftCollection, isLoading: isLoadingNFTs } = useQuery({
    queryKey: ['user-collection', userAddress, ownedTokenIds],
    queryFn: async (): Promise<PersonalityNFT[]> => {
      if (!userAddress || ownedTokenIds.length === 0) return []

      const nfts: PersonalityNFT[] = []

      for (const ownedToken of ownedTokenIds) {
        try {
          console.log(`Fetching metadata for token ${ownedToken.tokenId} from quiz ${ownedToken.quizId}`)

          // Fetch collection metadata
          const collectionData = await fetchCollectionMetadata(ownedToken.cid)

          // Fetch the specific personality metadata
          const personalityData = await fetchPersonalityMetadata(
            ownedToken.cid,
            ownedToken.tokenId
          )

          console.log(`Successfully fetched personality:`, {
            tokenId: ownedToken.tokenId,
            personalityName: personalityData.name,
            image: personalityData.image,
          })

          nfts.push({
            tokenId: ownedToken.tokenId,
            quizId: ownedToken.quizId,
            quizName: collectionData?.name || `Quiz #${ownedToken.quizId}`,
            quizCategory: collectionData?.category || 'General',
            personalityName: personalityData.name,
            personalityImage: personalityData.image,
            attributes: personalityData.attributes || [],
            quizCid: ownedToken.cid,
          })
        } catch (error) {
          console.error(`Failed to fetch token ${ownedToken.tokenId}:`, error)
        }
      }

      return nfts
    },
    enabled: !!userAddress && ownedTokenIds.length > 0,
    staleTime: 30 * 1000, // 30 seconds
  })

  return {
    nfts: nftCollection || [],
    isLoading: isLoadingQuizData || isLoadingNFTs,
    participatedQuizIds: participatedQuizzes,
  }
}

export type { PersonalityNFT }
