// Type definitions for quiz data structures
export interface PersonalityData {
  name: string
  id: number
  filename: string
  fullurl: string
}

export interface QuizDetailData {
  title: string
  description: string
  image: string
  questions: string[]
  personalities: PersonalityData[]
}

// Type for getQuizInfo contract function return
export type QuizInfo = [bigint, string, boolean] // [quizId, quizHash, isActive]

// Combined quiz data for easier use
export interface Quiz {
  id: number
  info?: QuizInfo
  detail?: QuizDetailData
  isLoading: boolean
  isError: boolean
}