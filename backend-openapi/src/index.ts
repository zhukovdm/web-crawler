require("dotenv").config();

import morgan from "morgan";
import bodyParser from "body-parser";
import express, { Response } from "express";
import * as validator from "express-openapi-validator";
import { MySqlModel } from "./model";
import { RecordBaseType } from "./domain/types";

const {
  PORT,
  API_SPEC
} = process.env;

const model = MySqlModel.getInstance(process.env);

const wapp = express();
wapp.disable("x-powered-by");

wapp.use(morgan("dev"));
wapp.use(bodyParser.json());
wapp.use(validator.middleware({ apiSpec: API_SPEC }));

function handleInternalServerError(res: Response, ex: any) {
  res.status(500).json(ex.message);
}

wapp.get("/api/v1/records", async (_, res: Response) => {
  try {
    const records = await model.getAllRecords();
    res.status(200).json(records);
  }
  catch (ex) { handleInternalServerError(res, ex); }
});

wapp.post("/api/v1/records", async (req, res) => {
  try {
    const obj = await model.createRecord(req.body as RecordBaseType);
    res.status(201).json(obj);
  }
  catch (ex) { handleInternalServerError(res, ex); }
});

wapp.put("/api/v1/records/:id", (req, res) => {
  try {

  }
  catch (ex) { handleInternalServerError(res, ex); }
});

wapp.delete("/api/v1/records/:id", (req, res) => {
  try {

  }
  catch (ex) { handleInternalServerError(res, ex); }
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