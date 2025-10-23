import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useReadContract } from 'wagmi'
import { useAccount } from 'wagmi'
import { useQuizIds, useQuiz } from '../../-hooks/useQuizzes'
import quizManagerContract from '../../-lib/contract/quizManager'
import type { Address } from 'viem'

export const Route = createFileRoute('/(deprecated)/legacy/_app/browse/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState('')
  const quizIds = useQuizIds()

  return (
    <div className="flex-1 flex flex-col gap-6 px-4 lg:px-8 py-6 lg:py-8">
      <div className="max-w-5xl lg:max-w-7xl mx-auto w-full">
        <h1 className="text-3xl lg:text-4xl font-bold mb-6 lg:mb-8">Browse Collections</h1>

        {/* Search Field */}
        <div className="mb-6 lg:mb-8">
          <input
            type="text"
            placeholder="Search collections..."
            className="input input-bordered w-full lg:max-w-md lg:text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-6">
          {quizIds.map((quizId) => (
            <QuizCard key={quizId} quizId={quizId} />
          ))}
        </div>

        {/* No Quizzes Available */}
        {quizIds.length === 0 && (
          <div className="text-center py-12 lg:py-20">
            <p className="text-lg lg:text-xl opacity-70">No quizzes available</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Individual Quiz Component that handles its own data fetching
function QuizCard({ quizId }: { quizId: number }) {
  const quiz = useQuiz(quizId)
  const { address: userAddress } = useAccount()
  
  // Check if user has participated in this quiz
  const { data: hasParticipated } = useReadContract({
    address: quizManagerContract.address as Address,
    abi: quizManagerContract.abi,
    functionName: 'hasParticipated',
    args: userAddress ? [userAddress, BigInt(quizId)] : undefined,
    query: {
      enabled: !!userAddress
    }
  })
  
  const title = quiz.detail?.title || `Quiz ${quiz.id}`
  const description = quiz.detail?.description || 'No description available'
  const image = quiz.detail?.image || 'https://via.placeholder.com/300x200?text=Quiz'
  const isActive = quiz.info?.[2] // Third element is isActive boolean
  const userHasParticipated = Boolean(hasParticipated)

  // Show loading spinner while fetching data
  if (quiz.isLoading) {
    return (
      <div className="card bg-base-100 shadow-xl flex flex-col">
        <div className="flex items-center justify-center h-32 lg:h-40 bg-base-200">
          <div className="loading loading-spinner loading-md text-primary"></div>
        </div>
        <div className="card-body p-3 lg:p-4 flex flex-col flex-grow">
          <div className="flex items-center justify-center flex-grow">
            <div className="text-center">
              <div className="loading loading-spinner loading-sm mb-2"></div>
              <p className="text-xs lg:text-sm opacity-50">Loading quiz...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (quiz.isError) {
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
    <div className="card bg-base-100 shadow-xl flex flex-col hover:shadow-2xl transition-shadow">
      <figure>
        <img
          src={image}
          alt={title}
          className="w-full h-32 lg:h-40 object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Quiz'
          }}
        />
      </figure>
      <div className="card-body p-3 lg:p-4 flex flex-col flex-grow">
        <h2 className="card-title text-sm lg:text-base leading-tight flex-grow">{title}</h2>
        <p className="text-xs lg:text-sm opacity-70 mb-2">{description}</p>
        
        {/* Quiz Status Badge */}
        <div className="mb-2">
          {userHasParticipated ? (
            <div className="badge badge-secondary badge-sm">Completed</div>
          ) : isActive ? (
            <div className="badge badge-success badge-sm">Active</div>
          ) : (
            <div className="badge badge-warning badge-sm">Inactive</div>
          )}
        </div>
        
        <div className="card-actions mt-2">
          {userHasParticipated ? (
            <button className="btn btn-disabled btn-sm w-full" disabled>
              Already Completed
            </button>
          ) : isActive ? (
            <Link 
              to="/legacy/take-quiz/$quizId" 
              params={{ quizId: quizId.toString() }}
              className="btn btn-primary btn-sm w-full"
            >
              Take Quiz
            </Link>
          ) : (
            <button className="btn btn-disabled btn-sm w-full" disabled>
              Quiz Inactive
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
