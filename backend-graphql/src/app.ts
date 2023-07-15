import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { getSchema } from "./graphql-schema";
import { ModelFactory } from "./models";

const wapp = express()
  .all("/graphql", createHandler({ schema: getSchema(ModelFactory.getModel()) }));

wapp.listen(4000, () => {
  console.log(`backend-graphql is listening on port 4000.`);
});
