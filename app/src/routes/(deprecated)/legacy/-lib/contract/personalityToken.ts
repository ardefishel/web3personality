import { PERSONALITY_TOKEN_ABI } from "./abis/personalityToken";

export default {
    address: import.meta.env.VITE_CONTRACT_PERSONALITY_TOKEN || "",
    abi: PERSONALITY_TOKEN_ABI
}