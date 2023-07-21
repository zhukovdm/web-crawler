import { parentPort } from "worker_threads";
import { getCurrentTime } from "../primitives/functions";
import { Crawler } from "../primitives/crawler";
import { ICrawlerModel } from "../domain/model-interfaces";
import { FetcherFactory } from "../primitives/fetcher";
import { ModelFactory } from "../models";

function reportUnexpectedError(exeId: number, wrkId: number, err: any): void {
  console.log(
    ` > [Worker ${wrkId}] Unexpected error, execution ${exeId} is in inconsistent state.`);
  if (err?.message) { console.log(`   ${err?.message}`); }
}

parentPort?.on("message", async (msg) => {
  const { exeId, wrkId } = msg;
  let model: ICrawlerModel | undefined = undefined;

  try {
    model = ModelFactory.getCrawlerModel();
    const fetcher = FetcherFactory.getUrlFetcher();

    await new Crawler(exeId, model, fetcher).crawl();
    await model.finishExecution(exeId, "SUCCESS", getCurrentTime());
    await model.deleteNodes(exeId);
  }
  catch (ex: any) {
    try {
      reportUnexpectedError(exeId, wrkId, ex);
      await model?.finishExecution(exeId, "FAILURE", getCurrentTime());
    }
    catch (ex: any) {
      reportUnexpectedError(exeId, wrkId, ex);
    }
  }
  finally { model?.dispose(); }

  parentPort?.postMessage(msg);
});
