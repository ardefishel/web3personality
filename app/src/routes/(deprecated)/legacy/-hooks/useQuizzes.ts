import { useReadContract } from 'wagmi'
import { useQuery } from '@tanstack/react-query'
import quizManagerContract from '../-lib/contract/quizManager'
import { QuizInfo, QuizDetailData, Quiz } from '@/types/quiz'

// Hook to get the total number of quizzes
export function useQuizCount() {
  return useReadContract({
    address: quizManagerContract.address,
    abi: quizManagerContract.abi,
    functionName: 'quizIdCounter'
  })
}

// Hook to get quiz info for a specific quiz
export function useQuizInfo(quizId: number) {
  return useReadContract({
    address: quizManagerContract.address,
    abi: quizManagerContract.abi,
    functionName: 'getQuizInfo',
    args: [BigInt(quizId)],
  }) as {
    data: QuizInfo | undefined
    isLoading: boolean
    isError: boolean
    error: Error | null
  }
}

// Hook to get quiz detail from IPFS
export function useQuizDetail(ipfsHash: string) {
  return useQuery<QuizDetailData>({
    queryKey: ['quizDetail', ipfsHash],
    queryFn: async (): Promise<QuizDetailData> => {
      const response = await fetch(`https://ipfs.io/ipfs/${ipfsHash}/info.json`)
      if (!response.ok) {
        throw new Error(`Failed to fetch quiz detail: ${response.statusText}`)
      }
      const data = await response.json() as QuizDetailData
      return data
    },
    enabled: !!ipfsHash
  })
}

// Hook to get complete quiz data (info + detail)
export function useQuiz(quizId: number): Quiz {
  const { data: quizInfo, isLoading: infoLoading, isError: infoError } = useQuizInfo(quizId)
  const ipfsHash = quizInfo?.[1] || ''
  const { data: quizDetail, isLoading: detailLoading, isError: detailError } = useQuizDetail(ipfsHash)

  return {
    id: quizId,
    info: quizInfo,
    detail: quizDetail,
    isLoading: infoLoading || detailLoading,
    isError: infoError || detailError
  }
}

// Hook to get all available quiz IDs
export function useQuizIds() {
  const { data: quizIdCounter } = useQuizCount()
  
  // Generate array of quiz IDs from 1 to quizIdCounter-1 (newest first)
  const quizIds = quizIdCounter ? 
    Array.from({length: Number(quizIdCounter) - 1}, (_, i) => Number(quizIdCounter) - 1 - i) : []
  
  return quizIds
}

// Hook to get the latest N quizzes (max 5 to comply with Rules of Hooks)
export function useLatestQuizzes(count: number = 3): Quiz[] {
  const quizIds = useQuizIds()
  
  // Always call the same number of hooks (max 5) to comply with Rules of Hooks
  const quiz1 = useQuiz(quizIds[0] || 0)
  const quiz2 = useQuiz(quizIds[1] || 0)
  const quiz3 = useQuiz(quizIds[2] || 0)
  const quiz4 = useQuiz(quizIds[3] || 0)
  const quiz5 = useQuiz(quizIds[4] || 0)
  
  // Collect all quizzes and filter/slice based on what's available
  const allQuizzes = [quiz1, quiz2, quiz3, quiz4, quiz5]
  const validQuizzes = allQuizzes.filter((quiz, index) => {
    return index < quizIds.length && quiz.id > 0
  })
  
  // Return only the requested count
  return validQuizzes.slice(0, Math.min(count, 5))
}
