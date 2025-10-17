import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


export default buildModule("QuizModuleProject0001",  (m) => {

  const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6"; // keccak256 generated  
  
  const personalityTokenContract = m.contract("PersonalityToken",["https://ipfs.io/ipfs/bafybeic2lhp3yj3l3ejdeivebo7lb5cwoluqn4eqzk4witbc7azz3zsg3u/collection.json"]);

  const quizManagerContract = m.contract("QuizManager", [personalityTokenContract], {
    after: [personalityTokenContract]
  })

  m.call(personalityTokenContract, "grantRole", [MINTER_ROLE, quizManagerContract], {
    id: "grantMinterRoleQuizContract0001"
  });

  return { 
    personalityTokenContract,
    quizManagerContract
   };
});
