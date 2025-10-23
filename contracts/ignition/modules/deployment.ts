import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TOKEN_CONTRACT_METADATA = process.env.TOKEN_CONTRACT_METADATA || "";
const QUIZ_MANAGER_ROLE =
  "0x8cbba69751e2ad12031a020b3cdf7f24f20225e09530064c9ad9fa187f4075ca";

export default buildModule("QuizManager001", (m) => {
  const tokenContract = m.contract("QuizPersonalityToken", [
    TOKEN_CONTRACT_METADATA,
  ]);
  const managerContract = m.contract("QuizManager", [tokenContract], {
    after: [tokenContract],
  });
  m.call(tokenContract, "grantRole", [QUIZ_MANAGER_ROLE, managerContract], {
    after: [managerContract],
  });
  return {
    tokenContract,
    managerContract,
  };
});
