import os from "os";
import { Worker } from "worker_threads";
import { IExecutor, IWorkerPool } from "../domain/interfaces";

export class ArrayWorkerPool implements IWorkerPool {

  /**
   * Upper bound on the number of threads.
   */
  private static readonly MAX_THREADS: number = Math.max(4, os.cpus().length - 2);

  private readonly workers: Array<number>;
  private readonly workerObjects: Worker[] = [];

  private constructor(executor: IExecutor) {

    console.log(` > CPU count ${os.cpus().length}`);

    this.workerObjects = Array(ArrayWorkerPool.MAX_THREADS)
      .fill(undefined)
      .map(() => new Worker("./dist/worker.js"));

    this.workerObjects.forEach((worker) => {
      const pool = this;

      worker.on("message", function ({ exeId, wrkId: wrkId }) {
        pool.release(wrkId);
        executor.reportCrawled(exeId);
      });
    });

    this.workers = [...Array(ArrayWorkerPool.MAX_THREADS).keys()];
  }

  public acquire(): number | undefined {
    return this.workers.shift();
  }

  public release(wrkId: number): void {
    this.workers.push(wrkId);
  }

  public crawl(exeId: number, wrkId: number): void {
    this.workerObjects[wrkId].postMessage({ exeId: exeId, wrkId: wrkId });
  }

  public static getInstance(executor: IExecutor): ArrayWorkerPool {
    return new ArrayWorkerPool(executor);
  }
}
