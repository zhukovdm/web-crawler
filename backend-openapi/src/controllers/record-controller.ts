import { Request, Response } from "express";
import { handleInternalServerError } from "./functions";
import { IRecordModel, IExecutor } from "../domain/interfaces";

export class RecordController {

  public static async getAllRecords(
    _: Request, res: Response, model: IRecordModel): Promise<void> {
    try {
      const recs = await model.getAllRecords();
      res.status(200).json(recs);
    }
    catch (ex) { handleInternalServerError(res, ex); }
  }

  public static async createRecord(
    req: Request, res: Response, model: IRecordModel, executor: IExecutor): Promise<void> {
    try {
      const { recId, exeId } = await model.createRecord(req.body);
      if (exeId !== null) { executor.prepend(exeId); } // active!
      res.status(201).json({ recId: recId });
    }
    catch (ex) { handleInternalServerError(res, ex); }
  }

  public static async updateRecord(
    req: Request, res: Response, model: IRecordModel, executor: IExecutor): Promise<void> {
    const recId = parseInt(req.params.recId);
    try {
      const { updated, exeId } = await model.updateRecord({ recId: recId, ...req.body });
      if (exeId !== null) { executor.prepend(exeId); }
      res.status(updated ? 204 : 404).end();
    }
    catch (ex) { handleInternalServerError(res, ex); }
  }

  public static async deleteRecord(
    req: Request, res: Response, model: IRecordModel): Promise<void> {
    const recId = parseInt(req.params.recId);
    try {
      const { deleted } = await model.deleteRecord({ recId: recId });
      res.status(deleted ? 204 : 404).end();
    }
    catch (ex) { handleInternalServerError(res, ex); }
  }
}
