import { QUIZ_MANAGER_ABI } from "./abis/quizManager";
import type {Address} from 'viem'


export default {
    address: import.meta.env.VITE_CONTRACT_QUIZ_MANAGER || "" as Address,
    abi: QUIZ_MANAGER_ABI
}