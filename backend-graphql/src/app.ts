require("dotenv").config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./graphql/schema";
import { ModelFactory } from "./models";

const wapp = express();
wapp.disable("x-powered-by");

const GRAPHQL_PORT = parseInt(process.env.GRAPHQL_PORT!);

wapp
  .use(cors())
  .use(morgan("dev"));

wapp.get("/healthcheck", async (_, res) => {
  res.status(200).end();
});

wapp.all("/graphql", createHandler({
  schema: schema,
  context: { model: ModelFactory.getModel() }
}));

wapp.listen(GRAPHQL_PORT, () => {
  console.log(`backend-graphql is listening on port ${GRAPHQL_PORT}.`);
});
