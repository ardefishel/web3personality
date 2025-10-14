import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";
import { decodeEventLog } from "viem";
// no extra imports

describe("QuizManager", async function () {
  const { viem } = await network.connect();
  // no need for public client in these tests
  const wallets = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  const deployer = wallets[0];
  const user = wallets[1];
  const other = wallets[2];

  const baseUri = "ipfs://QmBase/";

  it("creates quiz, toggles active, and completes with mint", async function () {
    // Deploy token
    const token = await viem.deployContract("PersonalityToken", [baseUri]);

    // Deploy manager with token address
    const manager = await viem.deployContract("QuizManager", [token.address]);

    // Grant MINTER_ROLE to manager so it can mint
    const MINTER_ROLE = await token.read.MINTER_ROLE();
    await token.write.grantRole([MINTER_ROLE, manager.address], {
      account: deployer.account,
    });

    // Create quiz by owner (deployer by default is owner of QuizManager via Ownable(msg.sender))
    const personalities = ["rebel", "visionary", "maverick"];
    const txHashCreate = await manager.write.createQuiz(["QmQuizHash123", personalities], {
      account: deployer.account,
    });

    // Assert QuizCreated event
    const receiptCreate = await publicClient.waitForTransactionReceipt({ hash: txHashCreate });
    let createdEventFound = false;
    for (const log of receiptCreate.logs.filter(l => l.address === manager.address)) {
      try {
        const ev = decodeEventLog({ abi: manager.abi, data: log.data, topics: log.topics });
        if ((ev as any).eventName === "QuizCreated") {
          createdEventFound = true;
          const { quizId, quizHash, personalitiesCount } = ev.args as unknown as { quizId: bigint; quizHash: string; personalitiesCount: bigint };
          assert.equal(quizId, 1n);
          assert.equal(quizHash, "QmQuizHash123");
          assert.equal(personalitiesCount, 3n);
          break;
        }
      } catch {}
    }
    assert.equal(createdEventFound, true);

    // quizIdCounter should increment to 2 after creating quizId 1
    const counterAfterFirst = (await (manager.read as any)["quizIdCounter"]()) as unknown as bigint;
    assert.equal(counterAfterFirst, 2n);

    // Newly created quiz has id 1 and is inactive
    let info: [bigint, string, boolean] = (await manager.read.getQuizInfo([
      1n,
    ])) as unknown as [bigint, string, boolean];
    assert.equal(info[0], 1n); // quizId
    assert.equal(info[1], "QmQuizHash123"); // quizHash
    assert.equal(info[2], false); // isActive

    // Non-owner cannot activate
    await assert.rejects(
      manager.write.activateQuiz([1n], { account: user.account }),
    );

    // Owner activates
    await manager.write.activateQuiz([1n], { account: deployer.account });
    info = (await manager.read.getQuizInfo([1n])) as unknown as [
      bigint,
      string,
      boolean
    ];
    assert.equal(info[2], true);

    // Complete quiz with valid personality
    // tokenId is quizId*1000 + index → for "visionary" (index 1) it's 1001
    await manager.write.completeQuiz([1n, "visionary"], { account: user.account });

    const balVisionary = await token.read.balanceOf([
      user.account.address,
      1001n,
    ]);
    assert.equal(balVisionary, 1n);

    // Same user can still call completeQuiz again but will mint the same id again?
    // Contract does not block repeat participation; assert idempotence via ERC1155 balance increments would break expectations.
    // The contract mints exactly 1 each time; ensure another personality works for another user only.

    await manager.write.completeQuiz([1n, "rebel"], { account: other.account });
    const balRebelOther = await token.read.balanceOf([
      other.account.address,
      1000n,
    ]);
    assert.equal(balRebelOther, 1n);

    // Owner can deactivate
    await manager.write.deactiveQuiz([1n], { account: deployer.account });
    info = (await manager.read.getQuizInfo([1n])) as unknown as [
      bigint,
      string,
      boolean
    ];
    assert.equal(info[2], false);

    // When inactive, completing should revert
    await assert.rejects(
      manager.write.completeQuiz([1n, "visionary"], { account: other.account }),
    );
  });

  it("reverts on invalid quiz or personality", async function () {
    const token = await viem.deployContract("PersonalityToken", [baseUri]);
    const manager = await viem.deployContract("QuizManager", [token.address]);

    const MINTER_ROLE = await token.read.MINTER_ROLE();
    await token.write.grantRole([MINTER_ROLE, manager.address], {
      account: deployer.account,
    });

    // invalid quiz id
    await assert.rejects(
      manager.read.getQuizInfo([99n]),
    );

    await manager.write.createQuiz(["QmX", ["alpha"]], { account: deployer.account });
    await manager.write.activateQuiz([1n], { account: deployer.account });

    // invalid personality
    await assert.rejects(
      manager.write.completeQuiz([1n, "beta"], { account: deployer.account }),
    );
  });

  it("reverts completing with invalid quiz id, wrong personality, and when inactive", async function () {
    const token = await viem.deployContract("PersonalityToken", [baseUri]);
    const manager = await viem.deployContract("QuizManager", [token.address]);

    const MINTER_ROLE = await token.read.MINTER_ROLE();
    await token.write.grantRole([MINTER_ROLE, manager.address], {
      account: deployer.account,
    });

    // Create quiz id 1 with a valid personality "alpha"
    await manager.write.createQuiz(["QmAnyHash", ["alpha"]], {
      account: deployer.account,
    });

    // 1) invalid quiz id
    await assert.rejects(
      manager.write.completeQuiz([999n, "alpha"], { account: deployer.account }),
    );

    // 2) wrong personality on an active quiz
    await manager.write.activateQuiz([1n], { account: deployer.account });
    await assert.rejects(
      manager.write.completeQuiz([1n, "wrong"], { account: deployer.account }),
    );

    // 3) inactive quiz
    await manager.write.deactiveQuiz([1n], { account: deployer.account });
    await assert.rejects(
      manager.write.completeQuiz([1n, "alpha"], { account: deployer.account }),
    );
  });

  it("supports multiple quizzes: id increments and tokenIds map per-quiz", async function () {
    const token = await viem.deployContract("PersonalityToken", [baseUri]);
    const manager = await viem.deployContract("QuizManager", [token.address]);

    const MINTER_ROLE = await token.read.MINTER_ROLE();
    await token.write.grantRole([MINTER_ROLE, manager.address], {
      account: deployer.account,
    });

    // Create first quiz (id = 1)
    const tx1 = await manager.write.createQuiz(["QmHash1", ["r", "v"]], {
      account: deployer.account,
    });
    const counterAfter1 = (await (manager.read as any)["quizIdCounter"]()) as unknown as bigint;
    assert.equal(counterAfter1, 2n);

    // Create second quiz (id = 2)
    const tx2 = await manager.write.createQuiz(["QmHash2", ["alpha", "beta", "gamma"]], {
      account: deployer.account,
    });
    const counterAfter2 = (await (manager.read as any)["quizIdCounter"]()) as unknown as bigint;
    assert.equal(counterAfter2, 3n);

    // Assert QuizCreated event for second quiz
    const receipt2 = await publicClient.waitForTransactionReceipt({ hash: tx2 });
    let created2Found = false;
    for (const log of receipt2.logs.filter(l => l.address === manager.address)) {
      try {
        const ev = decodeEventLog({ abi: manager.abi, data: log.data, topics: log.topics });
        if ((ev as any).eventName === "QuizCreated") {
          created2Found = true;
          const { quizId, quizHash, personalitiesCount } = ev.args as unknown as { quizId: bigint; quizHash: string; personalitiesCount: bigint };
          assert.equal(quizId, 2n);
          assert.equal(quizHash, "QmHash2");
          assert.equal(personalitiesCount, 3n);
          break;
        }
      } catch {}
    }
    assert.equal(created2Found, true);

    // Verify quiz 2 info
    const info2 = (await manager.read.getQuizInfo([2n])) as unknown as [
      bigint,
      string,
      boolean
    ];
    assert.equal(info2[0], 2n);
    assert.equal(info2[1], "QmHash2");
    assert.equal(info2[2], false);

    // Activate quiz 2 and complete with personality index 2 => tokenId = 2*1000 + 2 = 2002
    await manager.write.activateQuiz([2n], { account: deployer.account });
    await manager.write.completeQuiz([2n, "gamma"], { account: user.account });

    const balToken2002 = await token.read.balanceOf([
      user.account.address,
      2002n,
    ]);
    assert.equal(balToken2002, 1n);
  });
});


