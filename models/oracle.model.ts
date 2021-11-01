import { Account, types } from "../deps.ts";
import { Model } from "../src/model.ts";

enum Err {
  ERR_NOT_AUTHORIZED = 1001,
}

export class OracleModel extends Model {
  name: string = "oracle";

  static Err = Err;

  isNftTrusted(nft: string) {
    return this.callReadOnly("is-nft-trusted", [types.principal(nft)]).result
  }

  addNft(nft: string, isTrusted: boolean, sender: string | Account) {
    return this.callPublic("add-nft", [types.principal(nft), types.bool(isTrusted)], sender)
  }
}
