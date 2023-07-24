require("dotenv").config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import * as validator from "express-openapi-validator";
import { Executor } from "./services/executor";
import { Controller } from "./services/controller";
import { ModelFactory } from "./models";

(async function main() {

  /* Wait 1m before starting the server. This is due to docker limitations.
   * Service migth start just after MySQL is healthy, but before tables are
   * initialized (init.sql). */

  await new Promise((res) => setTimeout(res, 60_000));

  await ModelFactory.init();

  const recModel = ModelFactory.getRecordModel();
  const exeModel = ModelFactory.getExecutionModel();
  const executor = await Executor.getInstance(recModel, exeModel);

  const wapp = express();
  wapp.disable("x-powered-by");

  const OPENAPI_PORT = parseInt(process.env.OPENAPI_PORT!);

  wapp
    .use(cors())
    .use(morgan("dev"))
    .use(bodyParser.json())
    .use(validator.middleware({ apiSpec: process.env.OPENAPI_SPEC! }));

  wapp.get("/healthcheck", (_, res) => {
    res.status(200).end();
  });

  wapp.get("/api/v1/records", async (req, res) => {
    await Controller.getAllRecords(req, res, recModel);
  });

  wapp.post("/api/v1/records", async (req, res) => {
    await Controller.createRecord(req, res, recModel, executor);
  });

  wapp.put("/api/v1/records/:recId", async (req, res) => {
    await Controller.updateRecord(req, res, recModel, executor);
  });

  wapp.delete("/api/v1/records/:recId", async (req, res) => {
    await Controller.deleteRecord(req, res, recModel);
  });

  wapp.get("/api/v1/executions/", async (req, res) => {
    await Controller.getAllExecutions(req, res, exeModel);
  });

  wapp.post("/api/v1/executions/", async (req, res) => {
    await Controller.createExecution(req, res, exeModel, executor);
  });

  wapp.use((err: any, req: any, res: any, nxt: any) => {
    res.status(err.status || 500).json({
      errors: err.errors,
      message: err.message
    });
  });

  wapp.listen(OPENAPI_PORT, () => {
    console.log(`backend-openapi is listening on port ${OPENAPI_PORT!}.`);
  });
})();
