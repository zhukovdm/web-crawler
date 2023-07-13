import { JSDOM } from "jsdom";
import { parentPort } from "worker_threads";

class Crawler {

  private readonly links = new Map<string, Set<string>>();

  private extractUrls(baseUrl: string, txt: string): string[] {
    return [...new JSDOM(txt).window.document.getElementsByTagName("a")]
      .map((e) => {
        try {
          return new URL(e.href, baseUrl).href;
        } catch (_) { return undefined; }
      })
      .filter((u) => u !== undefined) as string[];
  }

  private matchLinks(urls: string[], regexp: string): string[] {
    return urls.filter((url) => new RegExp(regexp, "i").test(url));
  }

  constructor() { }

  public async crawl(exeId: number): Promise<void> {
    
  }
}

parentPort?.on("message", async (msg) => {
  const { exeId, wrkId } = msg;

  console.log(` > [Worker ${wrkId}] ${exeId} crawling.`);
  await new Crawler().crawl(exeId);

  parentPort?.postMessage(msg);
});
