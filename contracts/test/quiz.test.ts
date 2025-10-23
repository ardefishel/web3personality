import { describe, it } from "node:test";
import assert from "node:assert";
import { network } from "hardhat";

const TOKEN_CONTRACT_METADATA = process.env.TOKEN_CONTRACT_METADATA || ''
  

const QUIZ_MANAGER_ROLE =
  "8cbba69751e2ad12031a020b3cdf7f24f20225e09530064c9ad9fa187f4075ca";

describe("QuizManagerTest", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();

  console.log({env: process.env})

  async function deployQuizManager() {
    const quizPersonalityToken = await viem.deployContract(
      "QuizPersonalityToken",
      [TOKEN_CONTRACT_METADATA]
    );
    const quizManager = await viem.deployContract("QuizManager", [
      quizPersonalityToken.address,
    ]);

    // Grant QUIZ_MANAGER_ROLE to QuizManager contract
    const grantRoleHash = await quizPersonalityToken.write.grantRole([
      `0x${QUIZ_MANAGER_ROLE}`,
      quizManager.address,
    ]);
    await publicClient.waitForTransactionReceipt({ hash: grantRoleHash });

    return { quizPersonalityToken, quizManager };
  }

  it("should deploy contracts correctly", async () => {
    const { quizPersonalityToken, quizManager } = await deployQuizManager();

    const tokenAddress = quizPersonalityToken.address;
    const managerAddress = quizManager.address;
    const linkedTokenAddress =
      await quizManager.read.quizPersonalityTokenContract();

    assert.ok(tokenAddress, "QuizPersonalityToken not deployed");
    assert.ok(managerAddress, "QuizManager not deployed");
    assert.equal(
      linkedTokenAddress.toLowerCase(),
      tokenAddress.toLowerCase(),
      "Token address mismatch"
    );
  });

  it("should assign roles correctly", async () => {
    const { quizPersonalityToken, quizManager } = await deployQuizManager();
    const [deployer] = await viem.getWalletClients();

    const hasAdminRole = await quizPersonalityToken.read.hasRole([
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      deployer.account.address,
    ]);

    const hasQuizManagerRole = await quizPersonalityToken.read.hasRole([
      `0x${QUIZ_MANAGER_ROLE}`,
      quizManager.address,
    ]);

    assert.ok(hasAdminRole, "Admin role not assigned to deployer");
    assert.ok(
      hasQuizManagerRole,
      "Quiz manager role not assigned to QuizManager contract"
    );
  });

  it("should be able to create quiz", async () => {
    const { quizManager } = await deployQuizManager();

    const quizCid = "QmTestQuizHash";
    const personalities = ["Introvert", "Extrovert", "Ambivert"];

    const hash = await quizManager.write.createQuiz([quizCid, personalities]);
    await publicClient.waitForTransactionReceipt({ hash });

    const quizInfo = await quizManager.read.getQuizInfo([1n]);
    const [quizId, returnedCid, isActive] = quizInfo;

    assert.equal(quizId, 1n, "Quiz ID should be 1");
    assert.equal(returnedCid, quizCid, "Quiz CID mismatch");
    assert.equal(isActive, false, "Quiz should not be active by default");
  });

  it("should be able to complete quiz", async () => {
    const { quizPersonalityToken, quizManager } = await deployQuizManager();
    const [deployer, user] = await viem.getWalletClients();

    const quizCid = "QmTestQuizHash";
    const personalities = ["Introvert", "Extrovert", "Ambivert"];
    const selectedPersonality = "Introvert";

    // Create quiz
    const createHash = await quizManager.write.createQuiz([
      quizCid,
      personalities,
    ]);
    await publicClient.waitForTransactionReceipt({ hash: createHash });

    // Activate quiz
    const activateHash = await quizManager.write.activateQuiz([1n]);
    await publicClient.waitForTransactionReceipt({ hash: activateHash });

    // Complete quiz as user
    const completeHash = await quizManager.write.completeQuiz(
      [1n, selectedPersonality],
      { account: user.account }
    );
    await publicClient.waitForTransactionReceipt({ hash: completeHash });

    // Verify token was minted
    const tokenId = 1000n; // First quiz (1) * 1000 + personality index (0)
    const balance = await quizPersonalityToken.read.balanceOf([
      user.account.address,
      tokenId,
    ]);

    assert.equal(balance, 1n, "User should have received 1 token");

    // Verify participation status
    const participated = await quizManager.read.hasParticipated([
      user.account.address,
      1n,
    ]);
    assert.ok(participated, "User should be marked as participated");
  });

  it("should return correct URI format for tokens from multiple quizzes", async () => {
    const { quizPersonalityToken, quizManager } = await deployQuizManager();

    // Create first quiz
    const quiz1Cid = "QmFirstQuizHash123";
    const quiz1Personalities = ["Leader", "Follower", "Independent"];
    const createHash1 = await quizManager.write.createQuiz([
      quiz1Cid,
      quiz1Personalities,
    ]);
    await publicClient.waitForTransactionReceipt({ hash: createHash1 });

    // Create second quiz
    const quiz2Cid = "QmSecondQuizHash456";
    const quiz2Personalities = ["Creative", "Analytical"];
    const createHash2 = await quizManager.write.createQuiz([
      quiz2Cid,
      quiz2Personalities,
    ]);
    await publicClient.waitForTransactionReceipt({ hash: createHash2 });

    // Test URIs for quiz 1 tokens
    // Quiz 1: tokenId = 1 * 1000 + index
    const token1000 = await quizPersonalityToken.read.uri([1000n]); // Leader
    const token1001 = await quizPersonalityToken.read.uri([1001n]); // Follower
    const token1002 = await quizPersonalityToken.read.uri([1002n]); // Independent

    assert.equal(
      token1000,
      `https://ipfs.io/ipfs/${quiz1Cid}/1000.json`,
      "Quiz 1, Token 1000 URI mismatch"
    );
    assert.equal(
      token1001,
      `https://ipfs.io/ipfs/${quiz1Cid}/1001.json`,
      "Quiz 1, Token 1001 URI mismatch"
    );
    assert.equal(
      token1002,
      `https://ipfs.io/ipfs/${quiz1Cid}/1002.json`,
      "Quiz 1, Token 1002 URI mismatch"
    );

    // Test URIs for quiz 2 tokens
    // Quiz 2: tokenId = 2 * 1000 + index
    const token2000 = await quizPersonalityToken.read.uri([2000n]); // Creative
    const token2001 = await quizPersonalityToken.read.uri([2001n]); // Analytical

    assert.equal(
      token2000,
      `https://ipfs.io/ipfs/${quiz2Cid}/2000.json`,
      "Quiz 2, Token 2000 URI mismatch"
    );
    assert.equal(
      token2001,
      `https://ipfs.io/ipfs/${quiz2Cid}/2001.json`,
      "Quiz 2, Token 2001 URI mismatch"
    );
  });
});
