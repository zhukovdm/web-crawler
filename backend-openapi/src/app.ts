require("dotenv").config();

import morgan from "morgan";
import bodyParser from "body-parser";
import express from "express";
import * as validator from "express-openapi-validator";
import { MySqlModel } from "./models/model";
import { RecordController } from "./controllers/recordController";

const { PORT, API_SPEC } = process.env;

const model = MySqlModel.getInstance(process.env);

const wapp = express();
wapp.disable("x-powered-by");

wapp.use(morgan("dev"));
wapp.use(bodyParser.json());
wapp.use(validator.middleware({ apiSpec: API_SPEC }));

wapp.get("/api/v1/records", async (req, res) => {
  RecordController.getAllRecords(req, res, model);
});

wapp.post("/api/v1/records", async (req, res) => {
  RecordController.createRecord(req, res, model);
});

wapp.put("/api/v1/records/:recId", (req, res) => {
  RecordController.updateRecord(req, res, model);
});

wapp.delete("/api/v1/records/:recId", (req, res) => {
  RecordController.deleteRecord(req, res, model);
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
