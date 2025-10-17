import { QUIZ_MANAGER_ABI } from "./abis/quizManager";


export default {
    address: import.meta.env.VITE_CONTRACT_QUIZ_MANAGER || "",
    abi: QUIZ_MANAGER_ABI
}