import { Request, Response } from "express";
import { IExecutor } from "../domain/common-interfaces";
import { IExecutionModel, IRecordModel } from "../domain/model-interfaces";

export class Controller {

  private static handleInternalServerError(res: Response, ex: any): void {
    res.status(500).json(ex?.message ?? "unknown error");
  }

  public static async getAllRecords(
    _: Request, res: Response, model: IRecordModel): Promise<void> {
    try {
      const recs = await model.getAllRecords();
      res.status(200).json(recs);
    }
    catch (ex) { this.handleInternalServerError(res, ex); }
  }

  public static async createRecord(
    req: Request, res: Response, model: IRecordModel, executor: IExecutor): Promise<void> {
    try {
      const { recId, exeId } = await model.createRecord(req.body);
      if (exeId !== null) { executor.prioritize(exeId); } // active!
      res.status(201).json({ recId: recId });
    }
    catch (ex) { this.handleInternalServerError(res, ex); }
  }

  public static async updateRecord(
    req: Request, res: Response, model: IRecordModel, executor: IExecutor): Promise<void> {
    try {
      const { updated, exeId } = await model.updateRecord(parseInt(req.params.recId!), req.body);
      if (exeId !== null) { executor.prioritize(exeId); }
      res.status(updated ? 204 : 404).end();
    }
    catch (ex) { this.handleInternalServerError(res, ex); }
  }

  public static async deleteRecord(
    req: Request, res: Response, model: IRecordModel): Promise<void> {
    try {
      const { deleted } = await model.deleteRecord(parseInt(req.params.recId!));
      res.status(deleted ? 204 : 404).end();
    }
    catch (ex) { this.handleInternalServerError(res, ex); }
  }

  public static async getAllExecutions(
    _: Request, res: Response, model: IExecutionModel): Promise<void> {
    try {
      const exes = await model.getAllExecutions();
      res.status(200).json(exes);
    }
    catch (ex) { this.handleInternalServerError(res, ex); }
  }

  public static async createExecution(
    req: Request, res: Response, model: IExecutionModel, executor: IExecutor): Promise<void> {
    try {
      const { created, exeId } = await model.createExecution(req.body.recId);
      if (exeId !== null) { executor.prioritize(exeId); }
      res.status(created ? 204 : 404).end();
    }
    catch (ex) { this.handleInternalServerError(res, ex); }
  }
}
