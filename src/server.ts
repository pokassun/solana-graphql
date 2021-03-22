import "reflect-metadata";
import { ApolloServer, PubSub } from "apollo-server";
import path from "path";
import { TransactionResolver } from "./graphql/transaction-resolver";
import { AccountResolver } from "./graphql/account-resolver";
import { buildSchema, emitSchemaDefinitionFile } from "type-graphql";
import { getConnection } from "./solana/connection";
import { Connection } from "@solana/web3.js";

export type AppContext = {
  pubSub: PubSub;
  conn: Connection;
};

async function bootstrap() {
  // Build the TypeGraphQL schema
  const schema = await buildSchema({
    resolvers: [AccountResolver, TransactionResolver],
  });

  await emitSchemaDefinitionFile(
    path.resolve(__dirname, "../", "schema", "schema.gql"),
    schema
  );

  const conn = await getConnection();

  const pubSub = new PubSub();

  // Create GraphQL server
  const server = new ApolloServer({
    schema,
    playground: true,
    context: {
      conn,
      pubSub,
    },
    // endpoint path for subscriptions
    subscriptions: "/subscriptions",
  });

  // Start the server
  const { url } = await server.listen(4000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap();
