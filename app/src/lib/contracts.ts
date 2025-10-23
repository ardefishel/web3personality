import { Address } from 'viem'
import QuizManagerArtifact from './abis/QuizManager.json'
import QuizPersonalityTokenArtifact from './abis/QuizPersonalityToken.json'

/**
 * Base Sepolia chain ID
 */
export const BASE_SEPOLIA_CHAIN_ID = 84532

/**
 * Contract addresses from environment variables
 */
export const CONTRACT_ADDRESSES = {
  QuizManager: import.meta.env.VITE_CONTRACT_MANAGER as Address,
  QuizPersonalityToken: import.meta.env.VITE_CONTRACT_TOKEN as Address,
} as const

/**
 * QuizManager contract configuration
 */
export const quizManagerContract = {
  address: CONTRACT_ADDRESSES.QuizManager,
  abi: QuizManagerArtifact.abi,
} as const

/**
 * QuizPersonalityToken contract configuration
 */
export const quizPersonalityTokenContract = {
  address: CONTRACT_ADDRESSES.QuizPersonalityToken,
  abi: QuizPersonalityTokenArtifact.abi,
} as const

/**
 * Type-safe contract configuration
 */
export const contracts = {
  quizManager: quizManagerContract,
  quizPersonalityToken: quizPersonalityTokenContract,
} as const

export type ContractName = keyof typeof contracts
