import PersonalityToken from './PersonalityToken.json'

export default {
    address: import.meta.env.VITE_CONTRACT_PERSONALITY_TOKEN || "",
    contract: PersonalityToken
}