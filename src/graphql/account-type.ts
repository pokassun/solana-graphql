import { ObjectType, Field, ID, Int } from "type-graphql";

export type AccountChangedArgs = {
  account: string;
};

@ObjectType({ description: "Object representing account onChange data" })
export class AccountChangedResult {
  @Field(() => ID)
  id: number;

  @Field()
  owner: string;

  @Field(() => [Int])
  data: number[];

  @Field(() => Date)
  date: Date;
}
