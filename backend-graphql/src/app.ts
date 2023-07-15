import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./graphql-schema";

const wapp = express()
  .all("/graphql", createHandler({ schema: schema }));

wapp.listen(4000, () => {
  console.log(`backend-graphql is listening on port 4000.`);
});
