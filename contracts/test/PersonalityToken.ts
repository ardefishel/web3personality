import assert from "node:assert/strict";
import { describe, it, before } from "node:test";

import { network } from "hardhat";
import { getAddress } from "viem";

describe("PersonalityToken", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  const wallets = await viem.getWalletClients();

  const deployer = wallets[0];
  const user = wallets[1];
  const other = wallets[2];

  const initialBaseUri = "ipfs://QmBase/";

  it("deploys with correct admin and base URIs", async function () {
    const token = await viem.deployContract("PersonalityToken", [initialBaseUri]);

    // DEFAULT_ADMIN_ROLE should be deployer
    const DEFAULT_ADMIN_ROLE = await token.read.DEFAULT_ADMIN_ROLE();
    const isAdminDeployer = await token.read.hasRole([
      DEFAULT_ADMIN_ROLE,
      deployer.account.address,
    ]);
    assert.equal(isAdminDeployer, true);

    // contractURI and token uri composition
    const expectedContractUri = `${initialBaseUri}collection.json`;
    assert.equal(await token.read.contractURI(), expectedContractUri);

    const sampleId = 1000n;
    const expectedTokenUri = `${initialBaseUri}${sampleId}.json`;
    assert.equal(await token.read.uri([sampleId]), expectedTokenUri);
  });

  it("grants MINTER_ROLE and mints, emitting TokenMinted", async function () {
    const token = await viem.deployContract("PersonalityToken", [initialBaseUri]);

    const MINTER_ROLE = await token.read.MINTER_ROLE();


    // Initially user is not a minter
    let hasMinter = await token.read.hasRole([
      MINTER_ROLE,
      user.account.address,
    ]);
    assert.equal(hasMinter, false);


    // Grant minter role from admin (deployer)
    await token.write.grantRole([MINTER_ROLE, user.account.address], {
      account: deployer.account,
    });

    hasMinter = await token.read.hasRole([
      MINTER_ROLE,
      user.account.address,
    ]);
    assert.equal(hasMinter, true);

    // Non-minter should be reverted when minting
    await assert.rejects(
      token.write.mint([other.account.address, 1000n, 42n], {
        account: other.account,
      }),
    );


    // Minter can mint
    await viem.assertions.emitWithArgs(
      token.write.mint([user.account.address, 1000n, 123n], {
        account: user.account,
      }),
      token,
      "TokenMinted",
      [getAddress(user.account.address), 1000n, 123n],
    );

    // Balance should reflect minted amount (ERC1155)
    const bal = await token.read.balanceOf([user.account.address, 1000n]);
    assert.equal(bal, 1n);
  });

  it("allows admin to update base URI and reflects in contractURI and uri()", async function () {
    const token = await viem.deployContract("PersonalityToken", [initialBaseUri]);

    const newBase = "ipfs://QmNewBase/";

    // Non-admin cannot update
    await assert.rejects(
      token.write.setURI([newBase], { account: user.account }),
    );

    // Admin updates
    await token.write.setURI([newBase], { account: deployer.account });

    assert.equal(await token.read.contractURI(), `${newBase}collection.json`);
    assert.equal(await token.read.uri([1n]), `${newBase}1.json`);
  });
});
