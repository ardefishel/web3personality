import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useReadContract } from 'wagmi'
import quizManagerContract from '@/lib/contract/quizManager'
import { useQuery } from 'wagmi/query'
import { ArrowLeft } from 'lucide-react'
import { SafeArea } from '@coinbase/onchainkit/minikit'
import { Wallet } from '@coinbase/onchainkit/wallet'
import { RootProvider } from '@/components/RootProvider'

// Type definitions
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

type QuizInfo = [bigint, string, boolean] // [quizId, quizHash, isActive]

// Scale options for quiz questions
const SCALE_OPTIONS = [
  { value: 1, label: 'Very Agree', color: 'text-success' },
  { value: 2, label: 'Agree', color: 'text-success opacity-75' },
  { value: 3, label: 'Neutral', color: 'text-warning' },
  { value: 4, label: 'Disagree', color: 'text-error opacity-75' },
  { value: 5, label: 'Very Disagree', color: 'text-error' },
]

export const Route = createFileRoute('/take-quiz/$quizId')({
  component: () => (
    <RootProvider>
      <TakeQuizComponent />
    </RootProvider>
  ),
})

function CustomTopBar() {
  const navigate = useNavigate()
  
  return (
    <div className="navbar px-4 py-2">
      <div className="flex-none">
        <button 
          onClick={() => navigate({ to: '/browse' })}
          className="btn btn-ghost btn-circle"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center gap-1">
        <img src="/w3p-logo.png" alt="W3P" className="h-8 w-auto" />
        <h2 className="text-white font-bold">Quiz</h2>
      </div>
      <div className="flex-none">
        <Wallet />
      </div>
    </div>
  )
}

function TakeQuizComponent() {
  const { quizId } = Route.useParams()
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleAnswerChange = (questionIndex: number, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: value
    }))
  }

  const handleSubmit = () => {
    if (!quizDetail) return

    setIsSubmitting(true)
    
    // Create result mapping
    const results = quizDetail.questions.map((question, index) => ({
      questionIndex: index,
      question: question,
      answer: answers[index] || null,
      answerLabel: answers[index] ? SCALE_OPTIONS.find(opt => opt.value === answers[index])?.label : 'Not answered'
    }))

    console.log('Quiz Results:', {
      quizId: quizId,
      quizTitle: quizDetail.title,
      totalQuestions: quizDetail.questions.length,
      answeredQuestions: Object.keys(answers).length,
      results: results
    })

    setIsSubmitting(false)
    
    // Show success message
    alert('Quiz submitted successfully! Check the console for detailed results.')
  }

  const allQuestionsAnswered = quizDetail?.questions.every((_, index) => answers[index] !== undefined) || false

  if (isLoading) {
    return (
      <div className="min-h-dvh flex flex-col">
        <SafeArea>
          <CustomTopBar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="loading loading-spinner loading-lg mb-4"></div>
              <p className="text-lg">Loading quiz...</p>
            </div>
          </div>
        </SafeArea>
      </div>
    )
  }

  if (isError || !quizDetail) {
    return (
      <div className="min-h-dvh flex flex-col">
        <SafeArea>
          <CustomTopBar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-error text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold mb-2">Error Loading Quiz</h2>
              <p className="text-lg opacity-70 mb-4">Unable to load quiz details</p>
              <button 
                onClick={() => navigate({ to: '/browse' })}
                className="btn btn-primary"
              >
                Back to Browse
              </button>
            </div>
          </div>
        </SafeArea>
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <SafeArea>
        <CustomTopBar />
        
        <div className="flex-1 px-4 py-6">
          <div className="max-w-2xl mx-auto">
            {/* Quiz Header */}
            <div className="mb-8">
              <div className="card bg-base-100 shadow-xl">
                <figure>
                  <img
                    src={quizDetail.image}
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
                    <div className="badge badge-info">{quizDetail.questions.length} Questions</div>
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
                      <span className="badge badge-primary mr-2">{index + 1}</span>
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
                            className="radio radio-primary"
                          />
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{option.value}</span>
                            <span className={`${option.color} font-medium`}>
                              {option.label}
                            </span>
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
                          : `${Object.keys(answers).length} of ${quizDetail.questions.length} questions answered`
                        }
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {Math.round((Object.keys(answers).length / quizDetail.questions.length) * 100)}%
                      </div>
                      <div className="text-xs opacity-70">Complete</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSubmit}
                    disabled={!allQuestionsAnswered || isSubmitting}
                    className={`btn w-full ${
                      allQuestionsAnswered 
                        ? 'btn-primary' 
                        : 'btn-disabled'
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
        </div>
      </SafeArea>
    </div>
  )
}