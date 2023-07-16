import os from "os";
import { Worker } from "worker_threads";
import {
  IExecutor,
  IWorkerPool
} from "../domain/common-interfaces";

export class ArrayWorkerPool implements IWorkerPool {

  /**
   * Upper bound on the number of threads.
   */
  private static readonly MAX_THREADS: number = Math.max(4, os.cpus().length - 2);

  private readonly workers: Array<number>;
  private readonly workerObjects: Worker[] = [];

  private constructor(executor: IExecutor) {

    this.workerObjects = Array(ArrayWorkerPool.MAX_THREADS)
      .fill(undefined)
      .map(() => new Worker("./dist/services/worker.js"));

    this.workerObjects.forEach((worker) => {

      worker.on("message", ({ exeId, wrkId: wrkId }) => {
        this.release(wrkId);
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
    this.workerObjects[wrkId]?.postMessage({ exeId: exeId, wrkId: wrkId });
  }

  public static getInstance(executor: IExecutor): ArrayWorkerPool {
    return new ArrayWorkerPool(executor);
  }
}
