import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { Wallet } from '@coinbase/onchainkit/wallet'
import {
  Transaction,
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction,
} from '@coinbase/onchainkit/transaction'
import { useAccount } from 'wagmi'
import { useQuiz, quizManagerContract } from '@/lib'
import { Logo } from '@/components/brand'

// Type definitions
interface PersonalityResult {
  personality: string
  rationale: string
}

// Scale options for quiz questions
const SCALE_OPTIONS = [
  { value: 1, label: 'Very Agree', color: 'text-success' },
  { value: 2, label: 'Agree', color: 'text-success opacity-75' },
  { value: 3, label: 'Neutral', color: 'text-warning' },
  { value: 4, label: 'Disagree', color: 'text-error opacity-75' },
  { value: 5, label: 'Very Disagree', color: 'text-error' },
]

export const Route = createFileRoute('/(app)/_provider/_app/quiz/$quizId')({
  component: TakeQuizComponent,
})

function CustomTopBar() {
  const navigate = useNavigate()

  return (
    <div className="navbar bg-base-100/95 backdrop-blur-sm fixed top-0 left-0 right-0 px-4 py-2 border-b border-base-300 z-10">
      <div className="max-w-md mx-auto w-full flex items-center justify-between">
        <div className="flex-1 flex items-center gap-2">
          <button
            onClick={() => navigate({ to: '/' })}
            className="btn btn-ghost btn-circle"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <img src={Logo} alt="W3P" className="h-6 w-auto" />
          <span className="font-bold text-lg">Quiz</span>
        </div>
        <div className="flex-none">
          <Wallet />
        </div>
      </div>
    </div>
  )
}

function TakeQuizComponent() {
  const { quizId } = Route.useParams()
  const navigate = useNavigate()
  const { isConnected } = useAccount()
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [personalityResult, setPersonalityResult] = useState<PersonalityResult | null>(null)
  const [showResultModal, setShowResultModal] = useState(false)

  // Check wallet connection - redirect to onboard if not connected
  useEffect(() => {
    if (!isConnected) {
      navigate({ to: '/onboard' })
    }
  }, [isConnected, navigate])

  // Get quiz data using the useQuiz hook
  const { data: quizDetail, collectionData, isActive, isLoading, error } = useQuiz(Number(quizId))

  const handleAnswerChange = (questionIndex: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: value,
    }))
  }

  const handleSubmit = async () => {
    if (!quizDetail || !collectionData) return

    setIsSubmitting(true)

    // Create answers array
    const answersArray = quizDetail.questions.map((question, index) => ({
      questionIndex: index,
      question: question,
      answer: answers[index],
      answerLabel: SCALE_OPTIONS.find((opt) => opt.value === answers[index])?.label || '',
    }))

    // Prepare request payload
    const requestPayload = {
      quizId: quizId,
      personalities: collectionData.personalities.map((p) => p.name),
      answers: answersArray,
    }

    console.log('Submitting quiz to AI:', {
      quizId,
      totalQuestions: answersArray.length,
      availablePersonalities: requestPayload.personalities,
      answers: answersArray,
    })

    try {
      // Call the personality analysis API
      const response = await fetch('/api/ai/complete-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      })

      const result = (await response.json()) as PersonalityResult

      console.log('AI API Response:', {
        success: response.ok,
        status: response.status,
        result,
      })

      if (response.ok) {
        // Validate that the personality exists in the collection
        const validPersonalities = collectionData.personalities.map(p => p.name)
        const isValidPersonality = validPersonalities.includes(result.personality)

        if (!isValidPersonality) {
          console.error('AI returned invalid personality:', result.personality)
          console.error('Valid personalities:', validPersonalities)
          alert(`Error: AI returned an invalid personality "${result.personality}". Please try again or contact support.`)
          setIsSubmitting(false)
          return
        }

        console.log('Personality Analysis Result:', {
          quizId: quizId,
          quizTitle: quizDetail.title,
          selectedPersonality: result.personality,
          rationale: result.rationale,
          totalQuestions: quizDetail.questions.length,
          answers: answersArray,
          availablePersonalities: validPersonalities,
          personalityValid: isValidPersonality,
        })

        setPersonalityResult(result)
        setShowResultModal(true)
      } else {
        console.error('API Error:', result)
        alert('There was an error analyzing your personality. Please try again.')
      }
    } catch (error) {
      console.error('Failed to submit quiz:', error)
      alert('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const allQuestionsAnswered =
    quizDetail?.questions.every((_, index) => answers[index] !== undefined) || false

  // Prepare contract calls for minting NFT
  const contracts = personalityResult && collectionData
    ? [
        {
          address: quizManagerContract.address,
          abi: quizManagerContract.abi,
          functionName: 'completeQuiz',
          args: [BigInt(quizId), personalityResult.personality],
        },
      ]
    : []

  // Log when contracts are prepared
  if (contracts.length > 0 && personalityResult) {
    console.log('Contract prepared for minting:', {
      quizId,
      personalityToMint: personalityResult.personality,
      args: [BigInt(quizId), personalityResult.personality],
      availablePersonalities: collectionData?.personalities.map(p => p.name),
    })
  }

  // Show loading while checking wallet connection
  if (!isConnected) {
    return (
      <div className="min-h-dvh flex flex-col bg-base-100">
        <CustomTopBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg mb-4"></div>
            <p className="text-lg">Checking wallet connection...</p>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-dvh flex flex-col bg-base-100">
        <CustomTopBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg mb-4"></div>
            <p className="text-lg">Loading quiz...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !quizDetail) {
    return (
      <div className="min-h-dvh flex flex-col bg-base-100">
        <CustomTopBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-error text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-2">Error Loading Quiz</h2>
            <p className="text-lg opacity-70 mb-4">Unable to load quiz details</p>
            <button onClick={() => navigate({ to: '/' })} className="btn btn-accent">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!isActive) {
    return (
      <div className="min-h-dvh flex flex-col bg-base-100">
        <CustomTopBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-warning text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold mb-2">Quiz Not Active</h2>
            <p className="text-lg opacity-70 mb-4">This quiz is currently not available</p>
            <button onClick={() => navigate({ to: '/' })} className="btn btn-accent">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex flex-col bg-base-100">
      <CustomTopBar />

      <div className="flex-1 px-4 py-6 pt-20 max-w-md mx-auto w-full">
          {/* Quiz Header */}
          <div className="mb-8">
            <div className="card bg-base-100 shadow-xl">
              <figure>
                <img
                  src={quizDetail.featuredImage}
                  alt={quizDetail.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Quiz'
                  }}
                />
              </figure>
              <div className="card-body">
                <h1 className="card-title text-2xl">{quizDetail.title}</h1>
                <p className="text-base-content/70">{quizDetail.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="badge badge-accent">{quizDetail.questions.length} Questions</div>
                  <div className="badge badge-outline">
                    {Object.keys(answers).length}/{quizDetail.questions.length} Answered
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {quizDetail.questions.map((question, index) => (
              <div key={index} className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h3 className="card-title text-lg mb-4">
                    <span className="badge badge-accent mr-2">{index + 1}</span>
                    {question}
                  </h3>

                  {/* Rating Scale */}
                  <div className="space-y-3">
                    {SCALE_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-3 cursor-pointer hover:bg-base-200 p-2 rounded-lg transition-colors"
                      >
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option.value}
                          checked={answers[index] === option.value}
                          onChange={() => handleAnswerChange(index, option.value)}
                          className="radio radio-accent"
                        />
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{option.value}</span>
                          <span className={`${option.color} font-medium`}>{option.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="mt-8 mb-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Ready to Submit?</h3>
                    <p className="text-sm opacity-70">
                      {allQuestionsAnswered
                        ? 'All questions answered!'
                        : `${Object.keys(answers).length} of ${quizDetail.questions.length} questions answered`}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-accent">
                      {Math.round((Object.keys(answers).length / quizDetail.questions.length) * 100)}%
                    </div>
                    <div className="text-xs opacity-70">Complete</div>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!allQuestionsAnswered || isSubmitting}
                  className={`btn w-full rounded-full ${
                    allQuestionsAnswered ? 'btn-accent' : 'btn-disabled'
                  } ${isSubmitting ? 'loading' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Submitting...
                    </>
                  ) : (
                    'Submit Test'
                  )}
                </button>

                {!allQuestionsAnswered && (
                  <p className="text-sm text-warning text-center mt-2">
                    Please answer all questions before submitting
                  </p>
                )}
              </div>
            </div>
          </div>
      </div>

      {/* Personality Result Modal */}
      {personalityResult && collectionData && (
        <dialog className={`modal ${showResultModal ? 'modal-open' : ''}`}>
          <div className="modal-box w-11/12 max-w-md p-0 max-h-[90vh] overflow-y-auto">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-br from-accent to-accent/80 text-accent-content p-4 text-center relative sticky top-0 z-10">
              <button
                className="btn btn-xs btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => setShowResultModal(false)}
              >
                ✕
              </button>
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="font-bold text-xl mb-1">Quiz Completed!</h3>
              <p className="text-xs opacity-90">Discover your personality match</p>
            </div>

            <div className="p-5 space-y-4">
              {/* Personality Image & Name */}
              {(() => {
                const matchedPersonality = collectionData.personalities.find(
                  (p) => p.name === personalityResult.personality
                )
                return matchedPersonality ? (
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="w-36 h-36 rounded-2xl overflow-hidden shadow-lg ring-4 ring-accent/10">
                        <img
                          src={matchedPersonality.image}
                          alt={matchedPersonality.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-accent text-accent-content rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
                        <span className="text-xl">✨</span>
                      </div>
                    </div>
                    <h4 className="text-2xl font-bold text-accent text-center mt-4 mb-1">
                      {personalityResult.personality}
                    </h4>
                    <p className="text-xs opacity-60 uppercase tracking-wide">Your Personality Type</p>
                  </div>
                ) : (
                  <div className="card bg-base-200 rounded-xl">
                    <div className="card-body text-center py-4">
                      <h4 className="text-2xl font-bold text-accent mb-1">
                        {personalityResult.personality}
                      </h4>
                      <p className="text-xs opacity-60 uppercase tracking-wide">Your Personality Type</p>
                    </div>
                  </div>
                )
              })()}

              {/* Rationale */}
              <div className="space-y-2">
                <div className="divider my-2"></div>
                <p className="text-sm text-base-content/80 leading-relaxed text-center px-2">
                  {personalityResult.rationale}
                </p>
              </div>

              {/* Mint NFT Transaction */}
              <div className="space-y-2.5">
                <div className="divider my-2 text-xs opacity-60">Claim On-Chain</div>

                {/* Show what will be minted */}
                <div className="bg-base-200 rounded-lg p-3 text-center">
                  <p className="text-xs opacity-60 mb-1">You will mint:</p>
                  <p className="font-bold text-accent">{personalityResult.personality}</p>
                </div>

                {contracts.length > 0 ? (
                  <Transaction
                    calls={contracts}
                    onSuccess={(response) => {
                      console.log('NFT minted successfully!', response)
                      console.log('Minted personality:', personalityResult.personality)
                      // Redirect to collection page after successful mint
                      setTimeout(() => {
                        navigate({ to: '/collection' })
                      }, 1500)
                    }}
                    onError={(error) => {
                      console.error('Transaction failed:', error)
                      console.error('Transaction details:', {
                        quizId,
                        personality: personalityResult.personality,
                        contractAddress: quizManagerContract.address,
                        functionName: 'completeQuiz',
                        args: [BigInt(quizId), personalityResult.personality],
                        availablePersonalities: collectionData?.personalities.map(p => p.name),
                      })
                    }}
                  >
                    <TransactionButton
                      render={({ status, onSubmit, isDisabled }) => {
                        // Log when button is clicked
                        const handleClick = () => {
                          console.log('Mint button clicked! Minting:', personalityResult.personality)
                          onSubmit()
                        }

                        return (
                          <button
                            onClick={handleClick}
                            disabled={isDisabled}
                            className="btn btn-accent w-full rounded-full gap-2 shadow-lg"
                          >
                            {status === 'pending' ? (
                              <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Processing Transaction...
                              </>
                            ) : (
                              <>
                                <span>🎨</span>
                                <span>Mint Your Personality NFT</span>
                              </>
                            )}
                          </button>
                        )
                      }}
                    />
                    <TransactionSponsor />
                    <TransactionStatus>
                      <TransactionStatusLabel />
                      <TransactionStatusAction />
                    </TransactionStatus>
                  </Transaction>
                ) : (
                  <button className="btn btn-disabled w-full rounded-full" disabled>
                    <span className="loading loading-spinner loading-sm"></span>
                    Loading...
                  </button>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-center pt-2 pb-1">
                <button
                  className="btn btn-ghost btn-sm rounded-full px-8"
                  onClick={() => {
                    setShowResultModal(false)
                    navigate({ to: '/' })
                  }}
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowResultModal(false)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  )
}
