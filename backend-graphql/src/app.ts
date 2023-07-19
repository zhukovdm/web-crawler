require("dotenv").config();

import cors from "cors";
import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./graphql/schema";
import { ModelFactory } from "./models";

const wapp = express();

wapp
  .use(cors());

const GRAPHQL_PORT = parseInt(process.env.GRAPHQL_PORT!);

wapp.all("/graphql", createHandler({
  schema: schema,
  context: { model: ModelFactory.getModel() }
}));

wapp.listen(GRAPHQL_PORT, () => {
  console.log(`backend-graphql is listening on port ${GRAPHQL_PORT}.`);
});
