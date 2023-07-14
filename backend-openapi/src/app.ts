require("dotenv").config();

import morgan from "morgan";
import bodyParser from "body-parser";
import express from "express";
import * as validator from "express-openapi-validator";
import {
  MySqlExecutionModel,
  MySqlModelInitializer,
  MySqlRecordModel
} from "./models/mysql-model";
import { Executor } from "./services/executor";
import { Controller } from "./services/controller";

(async function main() {

  await MySqlModelInitializer.init();

  const recModel = MySqlRecordModel.getInstance();
  const exeModel = MySqlExecutionModel.getInstance();
  const executor = await Executor.getInstance(recModel, exeModel);

  const wapp = express();
  wapp.disable("x-powered-by");

  const { OPENAPI_PORT, OPENAPI_SPEC } = process.env;

  wapp
    .use(morgan("dev"))
    .use(bodyParser.json())
    .use(validator.middleware({ apiSpec: OPENAPI_SPEC! }));

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

  wapp.listen(OPENAPI_PORT!, () => {
    console.log(`backend-openapi is listening on port ${OPENAPI_PORT!}.`);
  });
})();
