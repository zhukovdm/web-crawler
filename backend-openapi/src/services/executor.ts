import { IExecutor } from "../domain/common-interfaces";
import { IExecutionModel, IRecordModel } from "../domain/model-interfaces";
import { LinkedListQueue } from "../primitives/queue";
import { ArrayWorkerPool } from "./worker-pool";

export class Executor implements IExecutor {

  /**
   * Time in milliseconds of how often handling events are generated.
   */
  private static readonly TICK_INTERVAL = 1000;

  private readonly model: IExecutionModel;
  private readonly planned = new LinkedListQueue<number>();
  private readonly crawled = new LinkedListQueue<number>();
  private readonly wrkPool = ArrayWorkerPool.getInstance(this);

  /**
   * Plan executions with exceeded waiting time.
   */
  private async resume(): Promise<void> {
    try {
      const { exeId } = await this.model.resumeExecution();
      if (exeId !== null) { this.planned.enqueue(exeId); }
    }
    catch (_) { /* do nothing */ }
  }

  /**
   * Send planned executions for crawling.
   */
  private async crawl(): Promise<void> {
    let exeId = this.planned.dequeue();
    const wrkId = this.wrkPool.acquire();

    try {
      if (exeId === undefined || wrkId === undefined) {
        throw new Error();
      }
      const { updated } = await this.model.updateExecutionStatus(exeId, "CRAWLING");

      // corr. record has been removed
      if (!updated) {
        exeId = undefined; throw new Error();
      }

      this.wrkPool.crawl(exeId, wrkId);
    }
    catch (_) {
      if (exeId !== undefined) { this.planned.prepend(exeId); }
      if (wrkId !== undefined) { this.wrkPool.release(wrkId); }
    }
  }

  /**
   * Generate waiting execution for a crawled one.
   */
  private async repeat(): Promise<void> {
    const exeId = this.crawled.dequeue();

    try {
      if (exeId === undefined) { return; }
      await this.model.repeatExecution(exeId);
    }
    catch (_) {
      if (exeId !== undefined) { this.crawled.prepend(exeId); }
    }
  }

  private constructor(model: IExecutionModel, planned: number[]) {
    this.model = model;
    this.planned = new LinkedListQueue<number>();
    this.crawled = new LinkedListQueue<number>();

    planned.forEach((exeId) => this.planned.enqueue(exeId));
  }

  /**
   * Attach event generators.
   */
  private withEvents(): IExecutor {
    setInterval(() => { this.resume(); }, Executor.TICK_INTERVAL);
    setInterval(() => { this.crawl();  }, Executor.TICK_INTERVAL);
    setInterval(() => { this.repeat(); }, Executor.TICK_INTERVAL);
    return this;
  }

  /**
   * Factory method.
   */
  public static async getInstance(
    recModel: IRecordModel, exeModel: IExecutionModel): Promise<IExecutor> {

    // for each record, create waiting execution.

    // const records = (await recModel.getAllRecords())
    //   .filter((rec) => rec.active).map((rec) => rec.recId);

    const exes: number[] = [];

    // for (const recId of records) {
    //   const { exeId } = await exeModel.createExecution(recId);
    //   if (exeId !== null) { exes.push(exeId); }
    // }

    return new Executor(exeModel, exes).withEvents();
  }

  public prioritize(exeId: number): void {
    this.planned.prepend(exeId);
  }

  public reportCrawled(exeId: number): void {
    this.crawled.enqueue(exeId);
  }
}
