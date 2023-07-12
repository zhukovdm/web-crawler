import {
  IExecutionModel,
  IExecutor,
  IRecordModel
} from "../domain/interfaces";
import { ArrayQueue } from "./queue";

export class Executor implements IExecutor {

  /**
   * Time in milliseconds of how often is generated.
   */
  private static readonly TICK_INTERVAL: number = 3000;

  private readonly model: IExecutionModel;
  private readonly planned = new ArrayQueue<number>();
  private readonly crawled = new ArrayQueue<number>();

  /**
   * Plan executions with exceeded waiting time.
   */
  private async plan(): Promise<void> {

  }

  /**
   * Send planned executions for crawling.
   */
  private async crawl(): Promise<void> {
    try {
      const exeId = this.planned.dequeue();

      if (exeId !== undefined) {
        console.log(` > exeId ${exeId} executed.`);
      }
    }
    catch (ex) {

    }
    finally {

    }
  }

  private async finish(): Promise<void> {


  }

  private constructor(model: IExecutionModel, planned: number[]) {
    this.model = model;
    this.planned = new ArrayQueue<number>();
    this.crawled = new ArrayQueue<number>();

    planned.forEach((exeId) => this.planned.enqueue(exeId));
  }

  private withEvents(): IExecutor {
    setInterval(() => { this.plan();  }, Executor.TICK_INTERVAL);
    setInterval(() => { this.crawl(); }, Executor.TICK_INTERVAL);
    return this;
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
    const exes: number[] = [];

    for (const recId of records) {
      const { exeId } = await exeModel.createExecution(recId);
      if (exeId !== null) { exes.push(exeId); }
    }

    return new Executor(exeModel, exes).withEvents();
  }

  public prepend(exeId: number): void { this.planned.prepend(exeId); }
}
