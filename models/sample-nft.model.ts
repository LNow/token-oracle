import { Account, types } from "../deps.ts";
import { Model } from "../src/model.ts";

enum Err {
  ERR_NOT_AUTHORIZED = 1001,
}

export class SampleNftModel extends Model {
  name: string = "sample-nft";

  static Err = Err;
}
