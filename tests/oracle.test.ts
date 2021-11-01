import { describe, beforeEach, it, run } from "../deps.ts";
import { Context } from "../src/context.ts";
import { OracleModel } from "../models/oracle.model.ts";
import { SampleNftModel } from "../models/sample-nft.model.ts";

let ctx: Context;
let oracle: OracleModel;
let sampleNft: SampleNftModel;

beforeEach(() => {
  ctx = new Context();
  oracle = ctx.models.get(OracleModel);
  sampleNft = ctx.models.get(SampleNftModel);
});

describe("[ORACLE]", () => {
  describe("is-nft-trusted()", () => {
    it("returns false for unknown nft", () => {
      oracle.isNftTrusted(sampleNft.address).expectBool(false);
    });
  });

  describe("add-nft()", () => {
    it("fails when called by unauthorized principal", () => {
      const sender = ctx.accounts.get("wallet_3")!;
      const nft = sampleNft.address;
      const isTrusted = true;

      const receipt = ctx.chain.mineBlock([
        oracle.addNft(nft, isTrusted, sender),
      ]).receipts[0];

      receipt.result.expectErr().expectUint(OracleModel.Err.ERR_NOT_AUTHORIZED);
    });

    it("succeeds when called by authorized principal", () => {
      const sender = ctx.deployer;
      const nft = sampleNft.address;
      const isTrusted = true;

      const receipt = ctx.chain.mineBlock([
        oracle.addNft(nft, isTrusted, sender),
      ]).receipts[0];

      receipt.result.expectOk().expectBool(true);
    });

    it("successfully saves contract as trusted", () => {
      const sender = ctx.deployer;
      const nft = sampleNft.address;
      const isTrusted = true;

      const receipt = ctx.chain.mineBlock([
        oracle.addNft(nft, isTrusted, sender),
      ]).receipts[0];

      receipt.result.expectOk().expectBool(true);
      oracle.isNftTrusted(nft).expectBool(isTrusted);
    });

    it("successfully saves contract as not trusted", () => {
      const sender = ctx.deployer;
      const nft = sampleNft.address;
      const isTrusted = false;

      const receipt = ctx.chain.mineBlock([
        oracle.addNft(nft, isTrusted, sender),
      ]).receipts[0];

      receipt.result.expectOk().expectBool(true);
      oracle.isNftTrusted(nft).expectBool(isTrusted);
    });

    it("successfully marks contract as trusted that was previously not trusted", () => {
      const sender = ctx.deployer;
      const nft = sampleNft.address;
      const isTrusted = true;
      ctx.chain.mineBlock([oracle.addNft(nft, !isTrusted, sender)]);
      oracle.isNftTrusted(nft).expectBool(!isTrusted);

      const receipt = ctx.chain.mineBlock([
        oracle.addNft(nft, isTrusted, sender),
      ]).receipts[0];

      receipt.result.expectOk().expectBool(true);
      oracle.isNftTrusted(nft).expectBool(isTrusted);
    });

    it("successfully marks contract as not trusted that was previously trusted", () => {
      const sender = ctx.deployer;
      const nft = sampleNft.address;
      const isTrusted = false;
      ctx.chain.mineBlock([oracle.addNft(nft, !isTrusted, sender)]);
      oracle.isNftTrusted(nft).expectBool(!isTrusted);

      const receipt = ctx.chain.mineBlock([
        oracle.addNft(nft, isTrusted, sender),
      ]).receipts[0];

      receipt.result.expectOk().expectBool(true);
      oracle.isNftTrusted(nft).expectBool(isTrusted);
    });
  });
});

run();
