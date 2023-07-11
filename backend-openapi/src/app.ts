require("dotenv").config();

import morgan from "morgan";
import bodyParser from "body-parser";
import express from "express";
import * as validator from "express-openapi-validator";
import { MySqlModel } from "./services/mysql-model";
import { PromiseExecutor } from "./services/promise-executor";
import { RecordController } from "./controllers/record-controller";
import { ExecutionController } from "./controllers/execution-controller";

(async function main() {

  const model = MySqlModel.getInstance();
  const executor = await PromiseExecutor.getInstance(model, model);

  const wapp = express();
  wapp.disable("x-powered-by");

  const { PORT, API_SPEC } = process.env;

  wapp
    .use(morgan("dev"))
    .use(bodyParser.json())
    .use(validator.middleware({ apiSpec: API_SPEC! }));

  wapp.get("/api/v1/records", async (req, res) => {
    await RecordController.getAllRecords(req, res, model);
  });

  wapp.post("/api/v1/records", async (req, res) => {
    await RecordController.createRecord(req, res, model, executor);
  });

  wapp.put("/api/v1/records/:recId", async (req, res) => {
    await RecordController.updateRecord(req, res, model, executor);
  });

  wapp.delete("/api/v1/records/:recId", async (req, res) => {
    await RecordController.deleteRecord(req, res, model);
  });

  wapp.get("/api/v1/executions/", async (req, res) => {
    await ExecutionController.getAllExecutions(req, res, model);
  });

  wapp.post("/api/v1/executions/", async (req, res) => {
    await ExecutionController.createExecution(req, res, model, executor);
  });

  wapp.use((err: any, req: any, res: any, nxt: any) => {
    res.status(err.status || 500).json({
      errors: err.errors,
      message: err.message
    });
  });

  wapp.listen(PORT, () => {
    console.log(`backend-openapi is listening on port ${PORT}.`);
  });
})();
