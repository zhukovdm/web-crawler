import { Request, Response } from "express";
import { IRecordModel } from "../domain/interfaces";
import { handleInternalServerError } from "./functions";

export class RecordController {

  public static async getAllRecords(_: Request, res: Response, model: IRecordModel): Promise<void> {
    try {
      const arr = await model.getAllRecords();
      res.status(200).json(arr);
    }
    catch (ex) { handleInternalServerError(res, ex); }
  }

  public static async createRecord(req: Request, res: Response, model: IRecordModel): Promise<void> {
    try {
      const obj = await model.createRecord(req.body);
      res.status(201).json(obj);
    }
    catch (ex) { handleInternalServerError(res, ex); }
  }

  public static async updateRecord(req: Request, res: Response, model: IRecordModel): Promise<void> {
    try {
      const num = await model.updateRecord(parseInt(req.params.id), req.body);
      res.status((num > 0) ? 204 : 404).end();
    }
    catch (ex) { handleInternalServerError(res, ex); }
  }

  public static async deleteRecord(req: Request, res: Response, model: IRecordModel): Promise<void> {
    try {
      const num = await model.deleteRecord(parseInt(req.params.id));
      res.status((num > 0) ? 204 : 404).end();
    }
    catch (ex) { handleInternalServerError(res, ex); }
  }
}
