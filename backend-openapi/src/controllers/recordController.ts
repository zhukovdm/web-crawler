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
      const { recId, exeId } = await model.createRecord(req.body);
      res.status(201).json({ recId: recId });
    }
    catch (ex) { handleInternalServerError(res, ex); }
  }

  public static async updateRecord(req: Request, res: Response, model: IRecordModel): Promise<void> {
    try {
      const updated = await model.updateRecord({ recId: parseInt(req.params.recId), ...req.body });
      res.status((updated > 0) ? 204 : 404).end();
    }
    catch (ex) { handleInternalServerError(res, ex); }
  }

  public static async deleteRecord(req: Request, res: Response, model: IRecordModel): Promise<void> {
    try {
      const deleted = await model.deleteRecord({ recId: parseInt(req.params.recId) });
      res.status((deleted > 0) ? 204 : 404).end();
    }
    catch (ex) { handleInternalServerError(res, ex); }
  }
}
