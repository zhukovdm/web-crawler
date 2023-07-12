import {
  IExecutionModel,
  IExecutor,
  IRecordModel
} from "../domain/interfaces";
import { ArrayQueue } from "./queue";
import { ArrayWorkerPool } from "./worker-pool";

export class Executor implements IExecutor {

  /**
   * Time in milliseconds of how often handling events are generated.
   */
  private static readonly TICK_INTERVAL = 1000;

  private readonly model: IExecutionModel;
  private readonly planned = new ArrayQueue<number>();
  private readonly crawled = new ArrayQueue<number>();
  private readonly wrkPool = ArrayWorkerPool.getInstance(this);

  /**
   * Plan executions with exceeded waiting time.
   */
  private async plan(): Promise<void> { }

  /**
   * Send planned executions for crawling.
   */
  private async crawl(): Promise<void> {
    const exeId = this.planned.dequeue();
    const wrkId = this.wrkPool.acquire();

    try {
      if (exeId === undefined || wrkId === undefined) {
        throw new Error();
      }
      const { updated } = await this.model.updateExecutionStatus(exeId, "CRAWLING");

      // corr. record has been removed
      if (!updated) { throw new Error(); }

      this.wrkPool.crawl(exeId, wrkId);
    }
    catch (ex) {
      if (exeId !== undefined) { this.planned.prepend(exeId); }
      if (wrkId !== undefined) { this.wrkPool.release(wrkId); }
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

  /**
   * Attach event generators to the instance.
   */
  private withEvents(): IExecutor {
    setInterval(() => { this.plan();  }, Executor.TICK_INTERVAL);
    setInterval(() => { this.crawl(); }, Executor.TICK_INTERVAL);
    return this;
  }

  public static async getInstance(
    recModel: IRecordModel, exeModel: IExecutionModel): Promise<IExecutor> {

    await exeModel.deleteIncompleteExecutions();

    let records = (await recModel.getAllRecords())
      .filter((rec) => rec.active).map((rec) => rec.recId);

    /* For each record, create waiting execution. The database is assumed to be
     * in consistent state, or all executions are 'FINISHED'. This is a part of
     * the initial SQL file. */

    const exes: number[] = [];

    for (const recId of records) {
      const { exeId } = await exeModel.createExecution(recId);
      if (exeId !== null) { exes.push(exeId); }
    }

    return new Executor(exeModel, exes).withEvents();
  }

  public prepend(exeId: number): void {
    this.planned.prepend(exeId);
  }

  public reportCrawled(exeId: number): void {
    this.crawled.enqueue(exeId);
    console.log(` > [Executor] ${exeId} crawled.`);
  }
}
