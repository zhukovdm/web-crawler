import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./graphql/schema";
import { ModelFactory } from "./models";

const wapp = express();

wapp.all("/graphql", createHandler({
  schema: schema,
  context: { model: ModelFactory.getModel() }
}));

wapp.listen(4000, () => {
  console.log(`backend-graphql is listening on port 4000.`);
});
