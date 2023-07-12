import { Request, Response } from "express";
import { IExecutionModel, IExecutor } from "../domain/interfaces";
import { handleInternalServerError } from "./functions";

export class ExecutionController {

  public static async getAllExecutions(
    _: Request, res: Response, model: IExecutionModel): Promise<void> {
    try {
      const exes = await model.getAllExecutions();
      res.status(200).json(exes);
    }
    catch (ex) { handleInternalServerError(res, ex); }
  }

  public static async createExecution(
    req: Request, res: Response, model: IExecutionModel, executor: IExecutor): Promise<void> {
    try {
      const { created, exeId } = await model.createExecution(req.body.recId);
      if (exeId !== null) { executor.prepend(exeId); }
      res.status(created ? 204 : 404).end();
    }
    catch (ex) { handleInternalServerError(res, ex); }
  }
}
