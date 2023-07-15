import { parentPort } from "worker_threads";
import { getCurrentTime } from "../primitives/functions";
import { Crawler } from "../primitives/crawler";
import { ICrawlerModel } from "../domain/model-interfaces";
import { getUrlFetcher } from "../primitives/fetcher";
import { ModelFactory } from "../models";

function reportCrawling(exeId: number, wrkId: number): void {
  console.log(` > [Worker ${wrkId}] Crawling ${exeId}.`);
}

function reportUnexpectedError(exeId: number, wrkId: number, err: any): void {
  console.log(
    ` > [Worker ${wrkId}] Unexpected error ${err?.message}. Execution ${exeId} is in inconsistent state.`);
}

parentPort?.on("message", async (msg) => {
  const { exeId, wrkId } = msg;
  reportCrawling(exeId, wrkId);

  let model: ICrawlerModel | undefined = undefined;

  try {
    const fetcher = getUrlFetcher();
    model = ModelFactory.getCrawlerModel();

    await new Crawler(model, fetcher).crawl(exeId);
    await model.finishExecution(exeId, "SUCCESS", getCurrentTime())
  }
  catch (_) {
    try {
      await model?.finishExecution(exeId, "FAILURE", getCurrentTime());
    }
    catch (ex: any) {
      reportUnexpectedError(exeId, wrkId, ex);
    }
  }
  finally { model?.dispose(); }

  parentPort?.postMessage(msg);
});
