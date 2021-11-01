import { beforeEach, describe, it, run } from "../deps.ts";
import { OracleModel } from "../models/oracle.model.ts";
import { SampleFtModel } from "../models/sample-ft.model.ts";
import { Context } from "../src/context.ts";

let ctx: Context;
let oracle: OracleModel;
let sampleFT: SampleFtModel;

beforeEach(() => {
  ctx = new Context();
  oracle = ctx.models.get(OracleModel);
  sampleFT = ctx.models.get(SampleFtModel);
});

describe("[ORACLE-ft]", () => {
  describe("is-ft-trusted()", () => {
    it("returns false for unknown ft", () => {
      const ft = sampleFT.address;

      oracle.isFtTrusted(ft).expectBool(false);
    });
  });

  describe("add-ft()", () => {
    it("fails when called by unauthorized principal", () => {
      const sender = ctx.accounts.get("wallet_7")!;
      const ft = sampleFT.address;
      const isTrusted = false;

      const receipt = ctx.chain.mineBlock([oracle.addFt(ft, isTrusted, sender)])
        .receipts[0];

      receipt.result.expectErr().expectUint(OracleModel.Err.ERR_NOT_AUTHORIZED);
    });

    it("succeeds when called by authorized principal", () => {
      const sender = ctx.deployer;
      const ft = sampleFT.address;
      const isTrusted = true;

      const receipt = ctx.chain.mineBlock([oracle.addFt(ft, isTrusted, sender)])
        .receipts[0];

      receipt.result.expectOk().expectBool(true);
    });

    it("successfully saves contract as trusted", () => {
      const sender = ctx.deployer;
      const ft = sampleFT.address;
      const isTrusted = true;

      const receipt = ctx.chain.mineBlock([oracle.addFt(ft, isTrusted, sender)])
        .receipts[0];

      receipt.result.expectOk().expectBool(true);
      oracle.isFtTrusted(ft).expectBool(isTrusted);
    });

    it("successfully saves contract as not trusted", () => {
      const sender = ctx.deployer;
      const ft = sampleFT.address;
      const isTrusted = false;

      const receipt = ctx.chain.mineBlock([oracle.addFt(ft, isTrusted, sender)])
        .receipts[0];

      receipt.result.expectOk().expectBool(true);
      oracle.isFtTrusted(ft).expectBool(isTrusted);
    });

    it("successfully marks contract as trusted that was previously not trusted", () => {
      const sender = ctx.deployer;
      const ft = sampleFT.address;
      const isTrusted = true;
      ctx.chain.mineBlock([oracle.addFt(ft, !isTrusted, sender)]);
      oracle.isFtTrusted(ft).expectBool(!isTrusted);

      const receipt = ctx.chain.mineBlock([oracle.addFt(ft, isTrusted, sender)])
        .receipts[0];

      receipt.result.expectOk().expectBool(true);
      oracle.isFtTrusted(ft).expectBool(isTrusted);
    });

    it("successfully marks contract as not trusted that was previously trusted", () => {
      const sender = ctx.deployer;
      const ft = sampleFT.address;
      const isTrusted = false;
      ctx.chain.mineBlock([oracle.addFt(ft, !isTrusted, sender)]);
      oracle.isFtTrusted(ft).expectBool(!isTrusted);

      const receipt = ctx.chain.mineBlock([oracle.addFt(ft, isTrusted, sender)])
        .receipts[0];

      receipt.result.expectOk().expectBool(true);
      oracle.isFtTrusted(ft).expectBool(isTrusted);
    });
  });
});

run();
