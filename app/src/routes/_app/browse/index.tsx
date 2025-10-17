import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useReadContract } from 'wagmi'
import quizManagerContract from '@/lib/contract/quizManager'
import { useQuery } from 'wagmi/query'
import type { Address } from 'viem'

// Type definitions based on ABI and IPFS structure
interface PersonalityData {
  name: string
  id: number
  filename: string
  fullurl: string
}

interface QuizDetailData {
  title: string
  description: string
  image: string
  questions: string[]
  personalities: PersonalityData[]
}

// Type for getQuizInfo contract function return
type QuizInfo = [bigint, string, boolean] // [quizId, quizHash, isActive]

// Complete quiz structure type
interface Quiz {
  id: number
  info: QuizInfo | undefined
  detail: {
    data: QuizDetailData | undefined
    isLoading: boolean
    isError: boolean
    error: Error | null
  }
  isLoading: boolean
  isError: boolean
  error: Error | null
}

export const Route = createFileRoute('/_app/browse/')({
  component: RouteComponent,
})


function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState('')


  const {data: quizIdCounter} = useReadContract({
    address: quizManagerContract.address,
    abi: quizManagerContract.abi,
    functionName: 'quizIdCounter'
  })

  // Generate array of quiz IDs from 1 to quizIdCounter-1
  const quizIds = quizIdCounter ? Array.from({length: Number(quizIdCounter) - 1}, (_, i) => i + 1) : []

// Individual Quiz Component that handles its own data fetching
function QuizCard({ quizId }: { quizId: number }) {
  // Get quiz info for this specific quiz
  const { data: quizInfo, isLoading: infoLoading, isError: infoError } = useReadContract({
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

  // Get quiz detail from IPFS
  const ipfsHash = quizInfo?.[1] || ''
  const { data: quizDetail, isLoading: detailLoading, isError: detailError } = useQuery<QuizDetailData>({
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

  const isLoading = infoLoading || detailLoading
  const isError = infoError || detailError
  const title = quizDetail?.title || `Quiz ${quizId}`
  const description = quizDetail?.description || 'No description available'
  const image = quizDetail?.image || 'https://via.placeholder.com/300x200?text=Quiz'

  // Show loading spinner while fetching data
  if (isLoading) {
    return (
      <div className="card bg-base-100 shadow-xl flex flex-col">
        <div className="flex items-center justify-center h-32 bg-base-200">
          <div className="loading loading-spinner loading-md text-primary"></div>
        </div>
        <div className="card-body p-3 flex flex-col flex-grow">
          <div className="flex items-center justify-center flex-grow">
            <div className="text-center">
              <div className="loading loading-spinner loading-sm mb-2"></div>
              <p className="text-xs opacity-50">Loading quiz...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (isError) {
    return (
      <div className="card bg-base-100 shadow-xl flex flex-col">
        <div className="flex items-center justify-center h-32 bg-error/10">
          <div className="text-error text-2xl">⚠️</div>
        </div>
        <div className="card-body p-3 flex flex-col flex-grow">
          <h2 className="card-title text-sm text-error">Error Loading Quiz</h2>
          <p className="text-xs opacity-70 mb-2">Unable to load quiz data</p>
          <div className="card-actions mt-2">
            <button className="btn btn-disabled btn-sm w-full">
              Unavailable
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show loaded quiz card
  return (
    <div className="card bg-base-100 shadow-xl flex flex-col">
      <figure>
        <img
          src={image}
          alt={title}
          className="w-full h-32 object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Quiz'
          }}
        />
      </figure>
      <div className="card-body p-3 flex flex-col flex-grow">
        <h2 className="card-title text-sm leading-tight flex-grow">{title}</h2>
        <p className="text-xs opacity-70 mb-2">{description}</p>
        
        {/* Quiz Ready Badge */}
        <div className="mb-2">
          <div className="badge badge-success badge-sm">Ready</div>
        </div>
        
        <div className="card-actions mt-2">
          <Link 
            to="/take-quiz/$quizId" 
            params={{ quizId: quizId.toString() }}
            className="btn btn-primary btn-sm w-full"
          >
            Take Quiz
          </Link>
        </div>
      </div>
    </div>
  )
}


  return (
    <div className="flex-1 flex flex-col gap-6 px-4 py-6">
      <div className="max-w-5xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-6">Browse Collections</h1>

        {/* Search Field */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search collections..."
            className="input input-bordered w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-2 gap-3">
          {quizIds.map((quizId) => (
            <QuizCard key={quizId} quizId={quizId} />
          ))}
        </div>

        {/* No Quizzes Available */}
        {quizIds.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg opacity-70">No quizzes available</p>
          </div>
        )}
      </div>
    </div>
  )
}
