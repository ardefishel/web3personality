import { useReadContract, useReadContracts } from 'wagmi'
import { useQuery } from '@tanstack/react-query'
import { quizManagerContract } from '../contracts'
import { QuizData } from '@/components/list-quiz'

interface IPFSCollectionMetadata {
  name: string
  description: string
  quizId: number
  totalPersonalities: number
  questions: string[]
  attributes: string[]
  category?: string
  featuredImage?: string
  personalities: Array<{
    name: string
    tokenId: number
    image: string
    attributes: Array<{ trait_type: string; value: string }>
  }>
}

interface IPFSPersonalityMetadata {
  tokenId: number
  name: string
  image: string
  attributes?: Array<{ trait_type: string; value: string }>
}

interface ContractQuizInfo {
  quizId: number
  quizCid: string
  isActive: boolean
}

async function fetchQuizMetadataFromIPFS(
  cid: string,
  quizId: number
): Promise<IPFSCollectionMetadata> {
  try {
    const collectionResponse = await fetch(`https://ipfs.io/ipfs/${cid}/collection.json`)
    if (collectionResponse.ok) {
      const collectionData = await collectionResponse.json() as IPFSCollectionMetadata
      return collectionData
    }
  } catch {
  }

  try {
    const indexResponse = await fetch(`https://ipfs.io/ipfs/${cid}/index.json`)
    if (indexResponse.ok) {
      const indexData = await indexResponse.json()
      return {
        name: indexData.name || 'Quiz',
        description: indexData.description || '',
        quizId,
        totalPersonalities: indexData.personalities?.length || 0,
        questions: indexData.questions || [],
        attributes: indexData.attributes || [],
        category: indexData.category,
        featuredImage: indexData.featuredImage,
        personalities: indexData.personalities || [],
      }
    }
  } catch {
  }

  const personalities: IPFSPersonalityMetadata[] = []
  const tokenIdStart = quizId * 1000
  let index = 0

  while (index < 50) {
    const tokenId = tokenIdStart + index
    try {
      const response = await fetch(`https://ipfs.io/ipfs/${cid}/${tokenId}.json`)
      if (!response.ok) break

      const data = await response.json()
      personalities.push(data)
      index++
    } catch {
      break
    }
  }

  return {
    name: 'Quiz',
    description: '',
    quizId,
    totalPersonalities: personalities.length,
    questions: [],
    attributes: [],
    personalities: personalities.map(p => ({
      name: p.name,
      tokenId: p.tokenId,
      image: p.image,
      attributes: p.attributes || [],
    })),
  }
}

function transformToQuizData(
  quizId: number,
  collectionData: IPFSCollectionMetadata
): QuizData {
  return {
    id: String(quizId),
    title: collectionData.name || `Quiz #${quizId}`,
    category: collectionData.category || 'General',
    description: collectionData.description || '',
    featuredImage: collectionData.featuredImage || collectionData.personalities[0]?.image || '',
    personalityTypes: collectionData.personalities.map(p => ({
      id: String(p.tokenId),
      imageUrl: p.image,
      name: p.name,
    })),
    questions: collectionData.questions || [],
  }
}

function useQuizCounter() {
  return useReadContract({
    ...quizManagerContract,
    functionName: 'quizIdCounter',
  })
}

function useContractQuizInfo(quizId: number) {
  return useReadContract({
    ...quizManagerContract,
    functionName: 'getQuizInfo',
    args: [BigInt(quizId)],
  })
}

function useAllContractQuizzes() {
  const { data: quizIdCounter, isLoading: isLoadingCounter } = useQuizCounter()

  const quizIds = quizIdCounter
    ? Array.from({ length: Number(quizIdCounter) - 1 }, (_, i) => i + 1)
    : []

  const contracts = quizIds.map(id => ({
    ...quizManagerContract,
    functionName: 'getQuizInfo' as const,
    args: [BigInt(id)],
  }))

  const { data: quizInfos, isLoading: isLoadingInfos } = useReadContracts({
    contracts: contracts as any,
  })

  const quizzes: ContractQuizInfo[] = quizInfos?.map((result) => {
    if (result.status === 'success' && result.result) {
      const resultArray = result.result as [bigint, string, boolean]
      const [quizId, quizCid, isActive] = resultArray
      return {
        quizId: Number(quizId),
        quizCid,
        isActive,
      }
    }
    return null
  }).filter((quiz): quiz is ContractQuizInfo => quiz !== null) || []

  return {
    data: quizzes,
    isLoading: isLoadingCounter || isLoadingInfos,
  }
}

export function useQuiz(quizId: number) {
  const { data: quizInfo, isLoading: isLoadingInfo, error: infoError } = useContractQuizInfo(quizId)

  const resultArray = quizInfo as [bigint, string, boolean] | undefined
  const quizCid = resultArray?.[1]
  const isActive = resultArray?.[2]

  const { data: collectionData, isLoading: isLoadingIPFS, error: ipfsError } = useQuery({
    queryKey: ['quiz-data', quizId, quizCid],
    queryFn: () => fetchQuizMetadataFromIPFS(quizCid!, quizId),
    enabled: !!quizCid,
    staleTime: 5 * 60 * 1000,
  })

  const quizData = collectionData ? transformToQuizData(quizId, collectionData) : null

  return {
    data: quizData,
    collectionData,
    isActive,
    isLoading: isLoadingInfo || isLoadingIPFS,
    error: infoError || ipfsError,
  }
}

export function useQuizzes() {
  const { data: contractQuizzes, isLoading: isLoadingContract } = useAllContractQuizzes()

  const { data: quizzesData, isLoading: isLoadingData } = useQuery({
    queryKey: ['all-quizzes-data', contractQuizzes],
    queryFn: async () => {
      if (!contractQuizzes || contractQuizzes.length === 0) return []

      const results = await Promise.allSettled(
        contractQuizzes.map(async (quiz) => {
          const collectionData = await fetchQuizMetadataFromIPFS(quiz.quizCid, quiz.quizId)
          const quizData = transformToQuizData(quiz.quizId, collectionData)

          return {
            ...quizData,
            isActive: quiz.isActive,
            collectionData,
          }
        })
      )

      return results
        .filter((result): result is PromiseFulfilledResult<QuizData & { isActive: boolean; collectionData: IPFSCollectionMetadata }> =>
          result.status === 'fulfilled'
        )
        .map(result => result.value)
    },
    enabled: contractQuizzes.length > 0,
    staleTime: 5 * 60 * 1000,
  })

  return {
    data: quizzesData || [],
    isLoading: isLoadingContract || isLoadingData,
  }
}

export function useFeaturedQuiz(quizId?: number) {
  const { data: singleQuiz, collectionData: singleCollection, isActive: singleIsActive, isLoading: isLoadingSingle } = useQuiz(quizId ?? 0)
  const { data: allQuizzes, isLoading: isLoadingAll } = useQuizzes()

  const shouldFetchAll = quizId === undefined

  if (shouldFetchAll) {
    const featuredQuiz = allQuizzes.find(quiz => quiz.isActive) || allQuizzes[0]

    return {
      data: featuredQuiz || null,
      collectionData: featuredQuiz?.collectionData,
      isActive: featuredQuiz?.isActive,
      isLoading: isLoadingAll,
    }
  }

  return {
    data: singleQuiz,
    collectionData: singleCollection,
    isActive: singleIsActive,
    isLoading: isLoadingSingle,
  }
}

export function useActiveQuizzes() {
  const { data: allQuizzes, isLoading } = useQuizzes()

  return {
    data: allQuizzes.filter(quiz => quiz.isActive),
    isLoading,
  }
}

export type { IPFSCollectionMetadata }
