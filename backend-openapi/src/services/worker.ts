import { parentPort } from "worker_threads";
import { Crawler } from "../primitives/crawler";
import { MySqlCrawlerModel } from "../models/mysql-model";
import { ICrawlerModel } from "../domain/model-interfaces";
import { MockUrlFetcher } from "../primitives/fetcher";

function reportCrawling(exeId: number, wrkId: number): void {
  console.log(` > [Worker ${wrkId}] Crawling ${exeId}.`);
}

function reportUnexpectedError(exeId: number, wrkId: number, err: any): void {
  console.log(` > [Worker ${wrkId}] Unexpected error ${err?.message}. Execution ${exeId} is in inconsistent state.`)
}

parentPort?.on("message", async (msg) => {
  const { exeId, wrkId } = msg;
  reportCrawling(exeId, wrkId);

  let model: ICrawlerModel | undefined = undefined;
  
  try {
    model = MySqlCrawlerModel.getInstance();
    const fetcher = new MockUrlFetcher();

    await new Crawler(model, fetcher).crawl(exeId);
  }
  catch (ex: any) {
    reportUnexpectedError(exeId, wrkId, ex);
  }
  finally { model?.dispose(); }

  parentPort?.postMessage(msg);
});
