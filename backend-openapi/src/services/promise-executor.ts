import os from "os";
import {
  IExecutionModel,
  IExecutor,
  IRecordModel
} from "../domain/interfaces";
import { ArrayQueue } from "./queue";

export class PromiseExecutor implements IExecutor {

  /**
   * Time in milliseconds of how often is generated.
   */
  private static readonly TICK_INTERVAL: number = 3000;

  /**
   * Upper bound on number of crawler threads.
   */
  private static readonly MAX_THREADS: number = Math.max(2, os.cpus().length - 2);
  private threads: number = 0;

  private readonly model: IExecutionModel;
  private readonly queue: ArrayQueue<number>;

  private execute(): void {
    try {
      const exeId = this.queue.dequeue();

      if (exeId !== undefined) {
        console.log(` > exeId ${exeId} executed.`);
      }
    }
    catch (ex) {

    }
    finally {

    }
  }

  private constructor(model: IExecutionModel, records: number[]) {
    this.model = model;
    this.queue = new ArrayQueue<number>();
    setInterval(() => { this.execute(); }, PromiseExecutor.TICK_INTERVAL);
  }

  public static async getInstance(
    recModel: IRecordModel, exeModel: IExecutionModel): Promise<IExecutor> {

    // get all active records

    let records = (await recModel.getAllRecords())
      .filter((rec) => rec.active).map((rec) => rec.recId);

    /* For each record, create waiting execution. The database is assumed to be
     * in consistent state, or all executions are 'FINISHED'. This is a part of
     * the initial SQL file.
     */

    for (const recId of records) { await exeModel.createExecution(recId, "WAITING"); }

    return new PromiseExecutor(exeModel, records);
  }

  public prepend(exeId: number): void {
    this.queue.prepend(exeId);
    console.log(` > exeId ${exeId} prepended.`); 
  }
}
