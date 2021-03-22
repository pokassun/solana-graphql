import { AccountInfo, PublicKey } from "@solana/web3.js";
import {
  Arg,
  Ctx,
  Int,
  Query,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";
import { AppContext } from "../server";
import { AccountChangedArgs, AccountChangedResult } from "./account-type";

@Resolver()
export class AccountResolver {
  @Subscription(() => AccountChangedResult, {
    subscribe: (
      _,
      { account }: AccountChangedArgs,
      { pubSub, conn }: AppContext
    ) => {
      const publicKey = new PublicKey(account);
      conn.onAccountChange(publicKey, (account) => {
        pubSub.publish("ACCOUNT_CHANGED", account);
      });
      return pubSub.asyncIterator("ACCOUNT_CHANGED");
    },
  })
  async AccountChanges(
    @Arg("account") account: string,
    @Root() data: AccountInfo<Buffer>
  ): Promise<AccountChangedResult> {
    const result: AccountChangedResult = {
      id: 1, // TODO: increment it? or just delete it
      data: data.data.toJSON().data,
      owner: data.owner.toBase58(),
      date: new Date(),
    };
    return result;
  }
}
